import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

interface QueueSession {
  id: string;
  clientId: string;
  clientAlias: string;
  type: 'chat' | 'video';
  status: 'pending' | 'active';
  createdAt: string;
}

export default function SessionQueueScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [psychId, setPsychId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<QueueSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPsychId = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('psychiatrists')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (data) setPsychId(data.id);
  };

  const fetchSessions = async () => {
    if (!psychId) return;
    const { data } = await supabase
      .from('sessions')
      .select(`
        id, client_id, type, status, created_at,
        users!client_id(alias, display_name, email)
      `)
      .eq('psychiatrist_id', psychId)
      .in('status', ['pending', 'active'])
      .order('created_at', { ascending: true });

    if (data) {
      setSessions(data.map((s: any) => ({
        id: s.id,
        clientId: s.client_id,
        clientAlias: s.users?.alias ?? s.users?.display_name ?? s.users?.email?.split('@')[0] ?? 'Anonymous',
        type: s.type,
        status: s.status,
        createdAt: s.created_at,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchPsychId(); }, [user]);
  useEffect(() => { if (psychId) fetchSessions(); }, [psychId]);

  useFocusEffect(
    useCallback(() => {
      if (psychId) fetchSessions();
    }, [psychId])
  );

  const acceptSession = async (session: QueueSession) => {
    setActionLoading(session.id);
    const { error } = await supabase
      .from('sessions')
      .update({ status: 'active', started_at: new Date().toISOString() })
      .eq('id', session.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      const screen = session.type === 'video' ? 'VideoCall' : 'Chat';
      navigation.navigate(screen, { sessionId: session.id, clientAlias: session.clientAlias });
    }
    setActionLoading(null);
  };

  const declineSession = async (sessionId: string) => {
    Alert.alert('Decline Session', 'Are you sure you want to decline this request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline', style: 'destructive', onPress: async () => {
          setActionLoading(sessionId);
          await supabase.from('sessions').update({ status: 'cancelled' }).eq('id', sessionId);
          setSessions(prev => prev.filter(s => s.id !== sessionId));
          setActionLoading(null);
        },
      },
    ]);
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const renderItem = ({ item }: { item: QueueSession }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.clientAlias[0]?.toUpperCase()}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.clientName}>{item.clientAlias}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.typeBadge, item.type === 'video' ? styles.videoBadge : styles.chatBadge]}>
              <Ionicons
                name={item.type === 'video' ? 'videocam' : 'chatbubble'}
                size={12} color={item.type === 'video' ? '#6C63FF' : '#4CAF50'}
              />
              <Text style={[styles.typeText, item.type === 'video' ? styles.videoText : styles.chatText]}>
                {item.type === 'video' ? 'Video Call' : 'Chat'}
              </Text>
            </View>
            <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
        {item.status === 'active' && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        )}
      </View>

      {item.status === 'pending' && (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.declineBtn}
            onPress={() => declineSession(item.id)}
            disabled={actionLoading === item.id}
          >
            <Ionicons name="close" size={16} color="#FF4444" />
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => acceptSession(item)}
            disabled={actionLoading === item.id}
          >
            {actionLoading === item.id
              ? <ActivityIndicator color="#fff" size="small" />
              : <>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </>
            }
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'active' && (
        <TouchableOpacity
          style={styles.rejoinBtn}
          onPress={() => {
            const screen = item.type === 'video' ? 'VideoCall' : 'Chat';
            navigation.navigate(screen, { sessionId: item.id, clientAlias: item.clientAlias });
          }}
        >
          <Ionicons name={item.type === 'video' ? 'videocam' : 'chatbubble'} size={16} color="#fff" />
          <Text style={styles.rejoinBtnText}>Rejoin Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Queue</Text>
        <TouchableOpacity onPress={() => fetchSessions()}>
          <Ionicons name="refresh" size={22} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="hourglass-outline" size={64} color="#C5C1FF" />
          <Text style={styles.emptyTitle}>No Requests Yet</Text>
          <Text style={styles.emptyDesc}>
            Make sure you're online to receive session requests from clients.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4FF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24,
    paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#EEF0FF', alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#6C63FF' },
  cardInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, gap: 4,
  },
  chatBadge: { backgroundColor: '#E8F5E9' },
  videoBadge: { backgroundColor: '#EEF0FF' },
  typeText: { fontSize: 12, fontWeight: '600' },
  chatText: { color: '#4CAF50' },
  videoText: { color: '#6C63FF' },
  timeAgo: { fontSize: 12, color: '#999' },
  activeBadge: {
    backgroundColor: '#E8F5E9', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  activeBadgeText: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10 },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12,
    borderRadius: 12, borderWidth: 1.5,
    borderColor: '#FF4444', gap: 6,
  },
  declineBtnText: { color: '#FF4444', fontWeight: '700', fontSize: 14 },
  acceptBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12,
    borderRadius: 12, backgroundColor: '#6C63FF', gap: 6,
  },
  acceptBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  rejoinBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12,
    borderRadius: 12, backgroundColor: '#4CAF50', gap: 6,
  },
  rejoinBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 22 },
});
