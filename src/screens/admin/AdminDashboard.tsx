import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '@/styles/screens/admin/AdminDashboard.styles';

interface Stats {
  pendingApplications: number;
  totalPsychiatrists: number;
  totalClients: number;
  activeSessions: number;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<Stats>({
    pendingApplications: 0,
    totalPsychiatrists: 0,
    totalClients: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const [pending, psychs, clients, sessions] = await Promise.all([
      supabase
        .from('psychiatrists')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false),
      supabase
        .from('psychiatrists')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true),
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client'),
      supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
    ]);

    setStats({
      pendingApplications: pending.count ?? 0,
      totalPsychiatrists: psychs.count ?? 0,
      totalClients: clients.count ?? 0,
      activeSessions: sessions.count ?? 0,
    });
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchStats(); }, []));

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
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>Sahay Management</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: logout, style: 'destructive' },
          ])}>
            <Ionicons name="log-out-outline" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Pending alert */}
        {stats.pendingApplications > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation.navigate('Applications')}
          >
            <View style={styles.alertDot} />
            <Text style={styles.alertText}>
              <Text style={styles.alertBold}>{stats.pendingApplications} pending</Text> psychiatrist application{stats.pendingApplications > 1 ? 's' : ''} need review
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#E65100" />
          </TouchableOpacity>
        )}

        {/* Stats grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="time" size={24} color="#fff" />
            <Text style={styles.statNum}>{stats.pendingApplications}</Text>
            <Text style={styles.statLabel}>Pending{'\n'}Applications</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#6C63FF' }]}>
            <Ionicons name="medical" size={24} color="#fff" />
            <Text style={styles.statNum}>{stats.totalPsychiatrists}</Text>
            <Text style={styles.statLabel}>Approved{'\n'}Psychiatrists</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="people" size={24} color="#fff" />
            <Text style={styles.statNum}>{stats.totalClients}</Text>
            <Text style={styles.statLabel}>Registered{'\n'}Clients</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E91E63' }]}>
            <Ionicons name="radio" size={24} color="#fff" />
            <Text style={styles.statNum}>{stats.activeSessions}</Text>
            <Text style={styles.statLabel}>Active{'\n'}Sessions</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Applications')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="document-text" size={24} color="#FF9800" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Review Applications</Text>
            <Text style={styles.actionSub}>
              {stats.pendingApplications > 0
                ? `${stats.pendingApplications} waiting for review`
                : 'No pending applications'}
            </Text>
          </View>
          {stats.pendingApplications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{stats.pendingApplications}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.actionIcon, { backgroundColor: '#EEF0FF' }]}>
            <Ionicons name="people" size={24} color="#6C63FF" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>All Users</Text>
            <Text style={styles.actionSub}>{stats.totalClients + stats.totalPsychiatrists} registered users</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
