import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { GiftedChat, IMessage, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:3000';

type RouteParams = {
  Chat: { sessionId: string; clientAlias: string };
};

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'Chat'>>();
  const { user } = useAuth();
  const { sessionId, clientAlias } = route.params;
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(
        data.map((m: any) => ({
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.created_at),
          user: { _id: m.sender_id },
        }))
      );
    }
  };

  useEffect(() => {
    loadMessages();

    const socket = io(BACKEND_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.emit('join_session', { sessionId, userId: user?.id });

    socket.on('receive_message', (msg: any) => {
      setMessages(prev =>
        GiftedChat.append(prev, [{
          _id: msg._id,
          text: msg.text,
          createdAt: new Date(msg.createdAt),
          user: { _id: msg.user._id },
        }])
      );
    });

    socket.on('user_typing', ({ isTyping: typing }: { userId: string; isTyping: boolean }) => {
      setIsTyping(typing);
    });

    socket.on('session_ended', () => {
      Alert.alert('Session Ended', 'The session has ended.', [
        { text: 'OK', onPress: () => navigation.replace('PsychTabs') },
      ]);
    });

    return () => { socket.disconnect(); };
  }, []);

  const onSend = useCallback((newMessages: IMessage[]) => {
    socketRef.current?.emit('send_message', {
      sessionId,
      senderId: user?.id,
      text: newMessages[0].text,
    });
  }, []);

  const handleTyping = () => {
    socketRef.current?.emit('typing', { sessionId, userId: user?.id, isTyping: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', { sessionId, userId: user?.id, isTyping: false });
    }, 1500);
  };

  const endSession = () => {
    Alert.alert('End Session', 'Are you sure you want to end this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End', style: 'destructive', onPress: async () => {
          socketRef.current?.emit('end_session', { sessionId });
          await supabase
            .from('sessions')
            .update({ status: 'completed', ended_at: new Date().toISOString() })
            .eq('id', sessionId);
          navigation.replace('PsychTabs');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{clientAlias?.[0]?.toUpperCase() ?? 'C'}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{clientAlias}</Text>
            <Text style={styles.headerStatus}>Active session</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.endBtn} onPress={endSession}>
          <Ionicons name="close-circle" size={18} color="#FF4444" />
          <Text style={styles.endBtnText}>End</Text>
        </TouchableOpacity>
      </View>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user?.id ?? '', name: 'Doctor' }}
        isTyping={isTyping}
        isSendButtonAlwaysVisible
        textInputProps={{
          onChangeText: handleTyping,
          placeholder: 'Type a message...',
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: '#6C63FF' },
              left: { backgroundColor: '#fff' },
            }}
            textStyle={{
              right: { color: '#fff' },
              left: { color: '#1A1A2E' },
            }}
          />
        )}
        renderSend={(props) => (
          <Send {...props}>
            <View style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="#fff" />
            </View>
          </Send>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={[styles.inputToolbar, { paddingBottom: insets.bottom }]}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#6C63FF' },
  headerName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  headerStatus: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  endBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1.5, borderColor: '#FF4444',
  },
  endBtnText: { color: '#FF4444', fontSize: 13, fontWeight: '700' },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#6C63FF', alignItems: 'center',
    justifyContent: 'center', marginRight: 4, marginBottom: 4,
  },
  inputToolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 8,
  },
});
