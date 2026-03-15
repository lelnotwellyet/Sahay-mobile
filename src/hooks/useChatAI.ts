import { useState, useCallback } from 'react';
import { IMessage } from 'react-native-gifted-chat';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Sahay, a compassionate AI mental health support assistant.
You provide emotional support, coping strategies, and a safe space to talk.
You are NOT a replacement for a licensed psychiatrist — always remind users to seek professional help for serious concerns.
Keep responses warm, concise, and supportive. If the user expresses suicidal thoughts or self-harm,
always provide the iCall helpline number: 9152987821.`;

export const AI_USER = { _id: 'sahay-ai', name: 'Sahay AI' };

export const WELCOME_MSG: IMessage = {
  _id: 'welcome',
  text: "Hi, I'm Sahay — your AI mental health companion 💙 I'm here to listen and support you. How are you feeling today?",
  createdAt: new Date(),
  user: AI_USER,
};

async function callGemini(history: IMessage[]): Promise<string> {
  // Gemini needs oldest-first and must start with a 'user' turn
  const chronological = [...history]
    .reverse()
    .filter(m => m._id !== 'welcome');

  const firstUserIdx = chronological.findIndex(m => m.user._id !== 'sahay-ai');
  if (firstUserIdx === -1) return "I'm here for you. Could you tell me more?";

  const contents = chronological.slice(firstUserIdx).map(msg => ({
    role: msg.user._id === 'sahay-ai' ? 'model' : 'user',
    parts: [{ text: msg.text as string }],
  }));

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm here for you. Could you tell me more?";
}

export function useChatAI(userId: string) {
  const [messages, setMessages] = useState<IMessage[]>([WELCOME_MSG]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: IMessage = {
      _id: `user-${Date.now()}`,
      text: text.trim(),
      createdAt: new Date(),
      user: { _id: userId },
    };

    setMessages(prev => [userMsg, ...prev]);
    setIsTyping(true);

    try {
      const historyWithNew = [userMsg, ...messages];
      const reply = await callGemini(historyWithNew);

      setMessages(prev => [{
        _id: `ai-${Date.now()}`,
        text: reply,
        createdAt: new Date(),
        user: AI_USER,
      }, ...prev]);
    } catch (e: any) {
      setMessages(prev => [{
        _id: `err-${Date.now()}`,
        text: `Error: ${e?.message ?? 'Unknown error'}`,
        createdAt: new Date(),
        user: AI_USER,
      }, ...prev]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, userId]);

  return { messages, isTyping, sendMessage };
}
