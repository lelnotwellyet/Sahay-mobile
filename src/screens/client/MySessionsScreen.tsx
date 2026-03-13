import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import styles from '@/styles/screens/client/MySessionsScreen.styles';

type SessionStatus = 'pending' | 'active' | 'completed' | 'cancelled';

interface MySession {
  id: string;
  type: 'chat' | 'video';
  status: SessionStatus;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  psychName: string;
  specialization: string;
}

const STATUS_CONFIG: Record<SessionStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending:   { label: 'Pending',   color: '#FF9800', bg: '#FFF3E0', icon: 'time-outline' },
  active:    { label: 'Active',    color: '#4CAF50', bg: '#E8F5E9', icon: 'radio-button-on' },
  completed: { label: 'Completed', color: '#6C63FF', bg: '#EEF0FF', icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Cancelled', color: '#F44336', bg: '#FFF3F3', icon: 'close-circle-outline' },
};

function getDuration(startedAt: string | null, endedAt: string | null): string {
  if (!startedAt || !endedAt) return '—';
  const mins = Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MySessionsScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | SessionStatus>('all');

  const fetchSessions = async () => {
    if (!user) return;
    setLoading(true);

    const { data } = await supabase
      .from('sessions')
      .select(`
        id, type, status, started_at, ended_at, created_at,
        psychiatrists!psychiatrist_id(full_name, specialization)
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setSessions(data.map((s: any) => ({
        id: s.id,
        type: s.type,
        status: s.status,
        startedAt: s.started_at,
        endedAt: s.ended_at,
        createdAt: s.created_at,
        psychName: s.psychiatrists?.full_name ?? 'Unknown',
        specialization: s.psychiatrists?.specialization ?? '',
      })));
    }
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchSessions(); }, [user]));

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);

  const renderItem = ({ item }: { item: MySession }) => {
    const cfg = STATUS_CONFIG[item.status];
    return (
      <View style={styles.card}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <View style={styles.psychAvatar}>
            <Text style={styles.psychAvatarText}>{item.psychName[0]?.toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.psychName}>Dr. {item.psychName}</Text>
            <Text style={styles.specialization}>{item.specialization}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={12} color={cfg.color} />
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Details row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name={item.type === 'video' ? 'videocam-outline' : 'chatbubble-outline'} size={14} color="#999" />
            <Text style={styles.detailText}>{item.type === 'video' ? 'Video Call' : 'Text Chat'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color="#999" />
            <Text style={styles.detailText}>{formatDate(item.createdAt)}</Text>
          </View>
          {item.status === 'completed' && (
            <View style={styles.detailItem}>
              <Ionicons name="timer-outline" size={14} color="#999" />
              <Text style={styles.detailText}>{getDuration(item.startedAt, item.endedAt)}</Text>
            </View>
          )}
        </View>

        {/* Rejoin if active */}
        {item.status === 'active' && (
          <TouchableOpacity
            style={styles.rejoinBtn}
            onPress={() => navigation.navigate(
              item.type === 'video' ? 'VideoCall' : 'Chat',
              { sessionId: item.id, psychName: `Dr. ${item.psychName}` }
            )}
          >
            <Ionicons name={item.type === 'video' ? 'videocam' : 'chatbubble'} size={16} color="#fff" />
            <Text style={styles.rejoinBtnText}>Rejoin Session</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const FILTERS: Array<{ key: 'all' | SessionStatus; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.title}>My Sessions</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#C5C1FF" />
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyDesc}>
            {filter === 'all'
              ? "You haven't had any sessions yet. Find a psychiatrist to get started."
              : `No ${filter} sessions found.`}
          </Text>
          {filter === 'all' && (
            <TouchableOpacity style={styles.findBtn} onPress={() => navigation.navigate('Find')}>
              <Text style={styles.findBtnText}>Find a Psychiatrist</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
