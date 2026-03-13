import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import PsychNavigator from './PsychNavigator';
import AdminNavigator from './AdminNavigator';

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4FF' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!user) return <AuthNavigator />;
  if (user.role === 'client') return <ClientNavigator />;
  if (user.role === 'psychiatrist') return <PsychNavigator />;
  return <AdminNavigator />;
}