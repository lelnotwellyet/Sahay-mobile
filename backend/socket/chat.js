const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = (io) => {
  io.on('connection', (socket) => {
    // ── Join a session room ──────────────────────────────────────
    socket.on('join_session', ({ sessionId, userId }) => {
      socket.join(sessionId);
      socket.data.sessionId = sessionId;
      socket.data.userId = userId;
    });

    // ── Send a message ───────────────────────────────────────────
    socket.on('send_message', async ({ sessionId, senderId, text }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert({ session_id: sessionId, sender_id: senderId, text })
        .select()
        .single();

      if (error) {
        socket.emit('message_error', { error: error.message });
        return;
      }

      const msg = {
        _id: data.id,
        text: data.text,
        createdAt: data.created_at,
        user: { _id: senderId },
      };

      io.to(sessionId).emit('receive_message', msg);
    });

    // ── Typing indicator ─────────────────────────────────────────
    socket.on('typing', ({ sessionId, userId, isTyping }) => {
      socket.to(sessionId).emit('user_typing', { userId, isTyping });
    });

    // ── End session ──────────────────────────────────────────────
    socket.on('end_session', async ({ sessionId }) => {
      await supabase
        .from('sessions')
        .update({ status: 'completed', ended_at: new Date().toISOString() })
        .eq('id', sessionId);

      io.to(sessionId).emit('session_ended');
    });
  });
};
