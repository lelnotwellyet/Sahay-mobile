import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import styles from '@/styles/screens/client/ClientHomeScreen.styles';

const MOODS = [
  { emoji: '😊', label: 'Great', color: '#4CAF50' },
  { emoji: '🙂', label: 'Good', color: '#8BC34A' },
  { emoji: '😐', label: 'Okay', color: '#FFC107' },
  { emoji: '😔', label: 'Low', color: '#FF9800' },
  { emoji: '😢', label: 'Bad', color: '#F44336' },
];

export default function ClientHomeScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [availableCount, setAvailableCount] = useState(0);

  useEffect(() => {
    fetchAvailablePsychiatrists();
  }, []);

  const fetchAvailablePsychiatrists = async () => {
    const { count } = await supabase
      .from('psychiatrists')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true)
      .eq('is_online', true);
    setAvailableCount(count ?? 0);
  };

  const displayName = user?.isAnonymous
    ? user?.alias
    : user?.displayName || user?.email?.split('@')[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {displayName} 👋</Text>
            <Text style={styles.subGreeting}>How are you feeling today?</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: logout, style: 'destructive' }
          ])}>
            <Ionicons name="log-out-outline" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Anonymous badge */}
        {user?.isAnonymous && (
          <View style={styles.anonBadge}>
            <Ionicons name="eye-off-outline" size={16} color="#6C63FF" />
            <Text style={styles.anonText}>You're browsing anonymously as <Text style={styles.anonAlias}>{user.alias}</Text></Text>
          </View>
        )}

        {/* Mood selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodBtn,
                  selectedMood === mood.label && { backgroundColor: mood.color + '20', borderColor: mood.color, borderWidth: 2 }
                ]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === mood.label && { color: mood.color }]}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available psychiatrists */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#6C63FF' }]}>
            <Ionicons name="person" size={24} color="#fff" />
            <Text style={styles.statNumber}>{availableCount}</Text>
            <Text style={styles.statLabel}>Available Now</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#fff" />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Confidential</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Find')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#EEF0FF' }]}>
            <Ionicons name="search" size={24} color="#6C63FF" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Find a Psychiatrist</Text>
            <Text style={styles.actionSubtitle}>{availableCount} professionals available now</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MySessions')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="chatbubbles" size={24} color="#4CAF50" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>My Sessions</Text>
            <Text style={styles.actionSubtitle}>View past and upcoming sessions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('SelfCare', { mood: selectedMood ?? 'All' })}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="heart" size={24} color="#FF9800" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Self Care Resources</Text>
            <Text style={styles.actionSubtitle}>
              {selectedMood ? `Videos for when you feel ${selectedMood.toLowerCase()}` : 'Videos and exercises for mental wellness'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Crisis help */}
        <View style={styles.crisisCard}>
          <Ionicons name="warning" size={20} color="#F44336" />
          <Text style={styles.crisisText}>In crisis? Call <Text style={styles.crisisNumber}>iCall: 9152987821</Text></Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
