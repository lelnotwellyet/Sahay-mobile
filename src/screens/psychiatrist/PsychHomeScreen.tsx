import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Psychiatrist } from '@/types';

export default function PsychHomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [psych, setPsych] = useState<Psychiatrist | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('psychiatrists')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPsych({
        id: data.id,
        userId: data.user_id,
        fullName: data.full_name,
        licenseNumber: data.license_number,
        licenseImageUrl: data.license_image_url,
        specialization: data.specialization,
        experience: data.experience,
        bio: data.bio,
        isApproved: data.is_approved,
        isOnline: data.is_online,
        rating: data.rating,
        totalSessions: data.total_sessions,
        createdAt: data.created_at,
      });
    }
    setLoading(false);
  };

  const fetchPendingCount = async () => {
    if (!psych) return;
    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('psychiatrist_id', psych.id)
      .eq('status', 'pending');
    setPendingCount(count ?? 0);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [user])
  );

  useEffect(() => {
    if (psych) fetchPendingCount();
  }, [psych]);

  const toggleOnline = async () => {
    if (!psych || !psych.isApproved) return;
    setToggling(true);
    const newStatus = !psych.isOnline;
    const { error } = await supabase
      .from('psychiatrists')
      .update({ is_online: newStatus })
      .eq('id', psych.id);
    if (!error) {
      setPsych(p => p ? { ...p, isOnline: newStatus } : p);
    }
    setToggling(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {psych?.fullName?.split(' ')[0] ?? 'Doctor'} 👋</Text>
            <Text style={styles.sub}>
              {psych?.specialization ?? ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: logout, style: 'destructive' },
          ])}>
            <Ionicons name="log-out-outline" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Approval status */}
        {!psych?.isApproved && (
          <View style={styles.pendingBanner}>
            <Ionicons name="time-outline" size={20} color="#FF9800" />
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>Application Under Review</Text>
              <Text style={styles.pendingDesc}>
                Our admin team will verify your license within 24 hours. You'll be notified once approved.
              </Text>
            </View>
          </View>
        )}

        {/* Online toggle */}
        {psych?.isApproved && (
          <View style={styles.toggleCard}>
            <View style={styles.toggleLeft}>
              <View style={[styles.statusDot, { backgroundColor: psych.isOnline ? '#4CAF50' : '#ccc' }]} />
              <View>
                <Text style={styles.toggleLabel}>
                  {psych.isOnline ? 'You are Online' : 'You are Offline'}
                </Text>
                <Text style={styles.toggleSub}>
                  {psych.isOnline
                    ? 'Clients can request sessions'
                    : 'Toggle to start accepting sessions'}
                </Text>
              </View>
            </View>
            {toggling
              ? <ActivityIndicator color="#6C63FF" />
              : <Switch
                  value={psych.isOnline}
                  onValueChange={toggleOnline}
                  trackColor={{ false: '#ddd', true: '#C5C1FF' }}
                  thumbColor={psych.isOnline ? '#6C63FF' : '#fff'}
                />
            }
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#6C63FF' }]}>
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.statNum}>{psych?.rating?.toFixed(1) ?? '—'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.statNum}>{psych?.totalSessions ?? 0}</Text>
            <Text style={styles.statLabel}>Sessions Done</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="time" size={20} color="#fff" />
            <Text style={styles.statNum}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Queue')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#EEF0FF' }]}>
            <Ionicons name="list" size={24} color="#6C63FF" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Session Queue</Text>
            <Text style={styles.actionSub}>
              {pendingCount > 0 ? `${pendingCount} pending request${pendingCount > 1 ? 's' : ''}` : 'No pending requests'}
            </Text>
          </View>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="analytics" size={24} color="#4CAF50" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>My Stats</Text>
            <Text style={styles.actionSub}>{psych?.experience ?? 0} years of experience</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

      </ScrollView>
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
  greeting: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  sub: { fontSize: 14, color: '#6C63FF', marginTop: 4, fontWeight: '600' },
  pendingBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FFF8E1', marginHorizontal: 24,
    borderRadius: 16, padding: 16, gap: 12,
    marginBottom: 16, borderWidth: 1, borderColor: '#FFE082',
  },
  pendingTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 4 },
  pendingDesc: { fontSize: 13, color: '#795548', lineHeight: 18 },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#fff',
    marginHorizontal: 24, borderRadius: 20, padding: 20,
    marginBottom: 20, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 8, elevation: 3,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  toggleLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  toggleSub: { fontSize: 12, color: '#999', marginTop: 2 },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 24,
    gap: 10, marginBottom: 24,
  },
  statCard: {
    flex: 1, borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 4,
  },
  statNum: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: '#fff', opacity: 0.9, textAlign: 'center' },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: '#1A1A2E',
    marginHorizontal: 24, marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 24,
    borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 12,
  },
  actionIcon: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  actionSub: { fontSize: 13, color: '#999', marginTop: 2 },
  badge: {
    backgroundColor: '#FF4444', borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
