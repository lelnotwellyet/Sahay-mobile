import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { sendSessionRequestNotification } from '@/utils/notifications';

type SessionType = 'chat' | 'video';

type RouteParams = {
  SessionRequest: {
    psychiatrist: {
      id: string;
      user_id: string;
      full_name: string;
      specialization: string;
      experience: number;
      rating: number;
      bio: string;
      is_online: boolean;
    };
  };
};

export default function SessionRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'SessionRequest'>>();
  const { user } = useAuth();
  const { psychiatrist } = route.params;

  const [selectedType, setSelectedType] = useState<SessionType>('chat');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  // Listen for session status changes via Supabase Realtime
  useEffect(() => {
    if (!sessionId || !waiting) return;

    const channel = supabase
      .channel(`session-status-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          const status = (payload.new as any).status;
          if (status === 'active') {
            channel.unsubscribe();
            setWaiting(false);
            const screen = selectedType === 'video' ? 'VideoCall' : 'Chat';
            navigation.replace(screen, { sessionId, psychName: `Dr. ${psychiatrist.full_name}` });
          } else if (status === 'cancelled') {
            channel.unsubscribe();
            setWaiting(false);
            setSessionId(null);
            Alert.alert(
              'Request Declined',
              'The psychiatrist is unable to take your session right now. Please try again or choose another professional.',
              [{ text: 'OK' }]
            );
          }
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [sessionId, waiting]);

  const sendRequest = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          client_id: user.id,
          psychiatrist_id: psychiatrist.id,
          type: selectedType,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      setWaiting(true);

      // Notify the psychiatrist
      const clientName = user.isAnonymous ? (user.alias ?? 'Anonymous') : (user.displayName || user.email?.split('@')[0] || 'A client');
      sendSessionRequestNotification(psychiatrist.user_id, clientName, selectedType, data.id);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async () => {
    if (!sessionId) {
      navigation.goBack();
      return;
    }
    Alert.alert('Cancel Request', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes', style: 'destructive', onPress: async () => {
          await supabase.from('sessions').update({ status: 'cancelled' }).eq('id', sessionId);
          setWaiting(false);
          setSessionId(null);
          navigation.goBack();
        },
      },
    ]);
  };

  // ── Waiting screen ──────────────────────────────────────────────
  if (waiting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.waitingContainer}>
          <View style={styles.pulseCircle}>
            <View style={styles.pulseInner}>
              <Text style={styles.pulseInitial}>
                {psychiatrist.full_name?.[0]?.toUpperCase() ?? 'D'}
              </Text>
            </View>
          </View>

          <Text style={styles.waitingTitle}>Waiting for Response</Text>
          <Text style={styles.waitingDesc}>
            Dr. {psychiatrist.full_name} is being notified of your{' '}
            <Text style={styles.waitingType}>
              {selectedType === 'video' ? 'video call' : 'chat'}
            </Text>{' '}
            request.
          </Text>

          <View style={styles.waitingCard}>
            <ActivityIndicator color="#6C63FF" style={{ marginBottom: 8 }} />
            <Text style={styles.waitingCardText}>Checking for response...</Text>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={cancelRequest}>
            <Text style={styles.cancelBtnText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Request screen ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      <View style={styles.inner}>
        {/* Psychiatrist card */}
        <View style={styles.psychCard}>
          <View style={styles.psychAvatar}>
            <Text style={styles.psychAvatarText}>
              {psychiatrist.full_name?.[0]?.toUpperCase() ?? 'D'}
            </Text>
            <View style={[styles.onlineDot, { backgroundColor: psychiatrist.is_online ? '#4CAF50' : '#ccc' }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.psychName}>Dr. {psychiatrist.full_name}</Text>
            <Text style={styles.psychSpec}>{psychiatrist.specialization}</Text>
            <View style={styles.psychMeta}>
              <Ionicons name="briefcase-outline" size={12} color="#999" />
              <Text style={styles.psychMetaText}>{psychiatrist.experience} yrs exp</Text>
              <Ionicons name="star" size={12} color="#FFC107" style={{ marginLeft: 8 }} />
              <Text style={styles.psychMetaText}>{psychiatrist.rating?.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Session type selector */}
        <Text style={styles.sectionLabel}>Choose Session Type</Text>

        <TouchableOpacity
          style={[styles.typeCard, selectedType === 'chat' && styles.typeCardActive]}
          onPress={() => setSelectedType('chat')}
        >
          <View style={[styles.typeIconBox, { backgroundColor: selectedType === 'chat' ? '#6C63FF' : '#EEF0FF' }]}>
            <Ionicons name="chatbubbles" size={24} color={selectedType === 'chat' ? '#fff' : '#6C63FF'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, selectedType === 'chat' && styles.typeTitleActive]}>
              Text Chat
            </Text>
            <Text style={styles.typeDesc}>
              Message in real-time. Comfortable and discreet.
            </Text>
          </View>
          <View style={[styles.radioOuter, selectedType === 'chat' && styles.radioOuterActive]}>
            {selectedType === 'chat' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeCard, selectedType === 'video' && styles.typeCardActive]}
          onPress={() => setSelectedType('video')}
        >
          <View style={[styles.typeIconBox, { backgroundColor: selectedType === 'video' ? '#6C63FF' : '#EEF0FF' }]}>
            <Ionicons name="videocam" size={24} color={selectedType === 'video' ? '#fff' : '#6C63FF'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, selectedType === 'video' && styles.typeTitleActive]}>
              Video Call
            </Text>
            <Text style={styles.typeDesc}>
              Face-to-face session for a more personal connection.
            </Text>
          </View>
          <View style={[styles.radioOuter, selectedType === 'video' && styles.radioOuterActive]}>
            {selectedType === 'video' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Confidentiality note */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#6C63FF" />
          <Text style={styles.infoText}>
            All sessions are completely confidential and secure.
          </Text>
        </View>

        {/* Send button */}
        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.7 }]}
          onPress={sendRequest}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name={selectedType === 'video' ? 'videocam' : 'chatbubbles'} size={20} color="#fff" />
                <Text style={styles.sendBtnText}>Send Request</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  back: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  inner: { paddingHorizontal: 24, paddingBottom: 40 },

  // Psychiatrist card
  psychCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 20,
    padding: 16, marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, gap: 14,
  },
  psychAvatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center',
  },
  psychAvatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  onlineDot: {
    width: 14, height: 14, borderRadius: 7,
    position: 'absolute', bottom: 0, right: 0,
    borderWidth: 2, borderColor: '#fff',
  },
  psychName: { fontSize: 17, fontWeight: '800', color: '#1A1A2E' },
  psychSpec: { fontSize: 13, color: '#6C63FF', fontWeight: '600', marginTop: 2 },
  psychMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  psychMetaText: { fontSize: 12, color: '#999' },

  // Session type
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  typeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 18,
    padding: 16, marginBottom: 12, gap: 14,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  typeCardActive: { borderColor: '#6C63FF', backgroundColor: '#FAFAFE' },
  typeIconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  typeTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 3 },
  typeTitleActive: { color: '#6C63FF' },
  typeDesc: { fontSize: 13, color: '#999', lineHeight: 18 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#6C63FF' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#6C63FF' },

  // Info + send
  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EEF0FF', borderRadius: 12,
    padding: 12, gap: 8, marginTop: 4, marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: '#6C63FF', lineHeight: 18 },
  sendBtn: {
    flexDirection: 'row', backgroundColor: '#6C63FF',
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Waiting state
  waitingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  pulseCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#EEF0FF', alignItems: 'center',
    justifyContent: 'center', marginBottom: 32,
  },
  pulseInner: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center',
  },
  pulseInitial: { fontSize: 36, fontWeight: '800', color: '#fff' },
  waitingTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 10 },
  waitingDesc: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  waitingType: { color: '#6C63FF', fontWeight: '700' },
  waitingCard: {
    backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 20, paddingHorizontal: 32,
    alignItems: 'center', marginBottom: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  waitingCardText: { color: '#999', fontSize: 14 },
  cancelBtn: {
    paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 16, borderWidth: 2, borderColor: '#FF4444',
  },
  cancelBtnText: { color: '#FF4444', fontSize: 15, fontWeight: '700' },
});
