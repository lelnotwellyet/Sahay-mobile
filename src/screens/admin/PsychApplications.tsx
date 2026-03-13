import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/config/supabase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '@/styles/screens/admin/PsychApplications.styles';

interface Application {
  id: string;
  userId: string;
  fullName: string;
  specialization: string;
  experience: number;
  licenseNumber: string;
  licenseImageUrl: string;
  bio: string;
  isApproved: boolean;
  createdAt: string;
}

export default function PsychApplications() {
  const navigation = useNavigation<any>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('psychiatrists')
      .select('*')
      .eq('is_approved', filter === 'approved')
      .order('created_at', { ascending: false });

    if (data) {
      setApplications(data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        fullName: d.full_name,
        specialization: d.specialization,
        experience: d.experience,
        licenseNumber: d.license_number,
        licenseImageUrl: d.license_image_url,
        bio: d.bio,
        isApproved: d.is_approved,
        createdAt: d.created_at,
      })));
    }
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchApplications(); }, [filter]));

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const renderItem = ({ item }: { item: Application }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ApplicationDetail', { application: item })}
    >
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.fullName[0]?.toUpperCase()}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>Dr. {item.fullName}</Text>
          <Text style={styles.spec}>{item.specialization}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="briefcase-outline" size={12} color="#999" />
            <Text style={styles.metaText}>{item.experience} yrs exp</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>{getTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>

      <View style={styles.licenseRow}>
        <Ionicons name="card-outline" size={14} color="#999" />
        <Text style={styles.licenseText}>License: {item.licenseNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications</Text>
        <TouchableOpacity onPress={fetchApplications}>
          <Ionicons name="refresh" size={22} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'pending' && styles.filterTabActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterTabText, filter === 'pending' && styles.filterTabTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'approved' && styles.filterTabActive]}
          onPress={() => setFilter('approved')}
        >
          <Text style={[styles.filterTabText, filter === 'approved' && styles.filterTabTextActive]}>
            Approved
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : applications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color="#C5C1FF" />
          <Text style={styles.emptyTitle}>
            {filter === 'pending' ? 'No Pending Applications' : 'No Approved Psychiatrists'}
          </Text>
          <Text style={styles.emptyDesc}>
            {filter === 'pending'
              ? 'All caught up! New applications will appear here.'
              : 'Approved psychiatrists will appear here.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
