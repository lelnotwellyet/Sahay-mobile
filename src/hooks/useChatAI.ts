import { useState, useCallback } from 'react';
import { IMessage } from 'react-native-gifted-chat';

const OPENROUTER_API_KEY = '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';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

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

async function callAI(history: IMessage[]): Promise<string> {
  const chronological = [...history]
    .reverse()
    .filter(m => m._id !== 'welcome');

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chronological.map(msg => ({
      role: msg.user._id === 'sahay-ai' ? 'assistant' : 'user',
      content: msg.text as string,
    }))
  ];

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://sahay.app', 
      'X-Title': 'Sahay',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenRouter Error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "I'm here for you. Could you tell me more?";
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
      const reply = await callAI(historyWithNew);

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
