import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';

type RouteParams = {
  SessionWaiting: {
    sessionId: string;
    psychiatrist: { id: string; full_name: string };
  };
};

export default function SessionWaitingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'SessionWaiting'>>();
  const { sessionId, psychiatrist } = route.params;
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`session-status-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          const status = (payload.new as any).status;
          if (status === 'active') {
            channel.unsubscribe();
            navigation.replace('VideoCall', { sessionId, psychName: `Dr. ${psychiatrist.full_name}` });
          } else if (status === 'cancelled') {
            channel.unsubscribe();
            setCancelled(true);
            Alert.alert(
              'Request Declined',
              'The psychiatrist is unable to take your session right now.',
              [{ text: 'OK', onPress: () => navigation.replace('ClientTabs') }]
            );
          }
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, []);

  const cancelRequest = () => {
    Alert.alert('Cancel Request', 'Are you sure? Your payment will be refunded.', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes', style: 'destructive', onPress: async () => {
          await supabase.from('sessions').update({ status: 'cancelled' }).eq('id', sessionId);
          navigation.replace('ClientTabs');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pulseCircle}>
          <View style={styles.pulseInner}>
            <Text style={styles.pulseInitial}>
              {psychiatrist.full_name?.[0]?.toUpperCase() ?? 'D'}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Waiting for Response</Text>
        <Text style={styles.desc}>
          Dr. {psychiatrist.full_name} is being notified of your{' '}
          <Text style={styles.highlight}>video call</Text> request.
        </Text>

        <View style={styles.statusCard}>
          <ActivityIndicator color="#6C63FF" style={{ marginBottom: 8 }} />
          <Text style={styles.statusText}>Waiting for psychiatrist to accept...</Text>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={cancelRequest} disabled={cancelled}>
          <Text style={styles.cancelText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  pulseCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: 32,
  },
  pulseInner: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center',
  },
  pulseInitial: { fontSize: 36, fontWeight: '800', color: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 12, textAlign: 'center' },
  desc: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  highlight: { color: '#6C63FF', fontWeight: '700' },
  statusCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    alignItems: 'center', width: '100%', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statusText: { fontSize: 14, color: '#666', fontWeight: '600' },
  cancelBtn: {
    paddingVertical: 14, paddingHorizontal: 32,
    borderRadius: 14, borderWidth: 2, borderColor: '#FF4444',
  },
  cancelText: { color: '#FF4444', fontSize: 15, fontWeight: '700' },
});
