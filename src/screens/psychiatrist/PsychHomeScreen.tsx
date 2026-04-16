import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, ScrollView, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Psychiatrist } from '@/types';
import styles from '@/styles/screens/psychiatrist/PsychHomeScreen.styles';

export default function PsychHomeScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [psych, setPsych] = useState<Psychiatrist | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [recentRatings, setRecentRatings] = useState<{ rating: number; ended_at: string }[]>([]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('psychiatrists')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      // Fetch recent ratings
      const { data: ratings } = await supabase
        .from('psychiatrist_ratings')
        .select('rating, ended_at')
        .eq('psychiatrist_id', data.id)
        .order('ended_at', { ascending: false })
        .limit(10);
      if (ratings) setRecentRatings(ratings);

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

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('EditProfile')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionSub}>Update bio, specialization & experience</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Recent Ratings */}
        {recentRatings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Ratings</Text>
            {recentRatings.map((r, i) => (
              <View key={i} style={styles.ratingRow}>
                <View style={styles.ratingStars}>
                  {[1,2,3,4,5].map(star => (
                    <Ionicons
                      key={star}
                      name={star <= r.rating ? 'star' : 'star-outline'}
                      size={18}
                      color={star <= r.rating ? '#FFC107' : '#ddd'}
                    />
                  ))}
                </View>
                <Text style={styles.ratingDate}>
                  {new Date(r.ended_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
