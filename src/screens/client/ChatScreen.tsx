import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useChatAI } from '@/hooks/useChatAI';
import styles from '@/styles/screens/client/ChatScreen.styles';

export default function ChatScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const userId = user?.id ?? 'guest';
  const { messages, isTyping, sendMessage } = useChatAI(userId);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={22} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerName}>Sahay AI</Text>
          <Text style={styles.headerStatus}>Always here for you</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={() => {}}
          user={{ _id: userId }}
          isTyping={isTyping}
          renderInputToolbar={() => null}
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
        />

        {/* Custom input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Share how you feel..."
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
