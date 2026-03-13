import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, TextInput, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/config/supabase';
import { Psychiatrist } from '@/types';
import styles from '@/styles/screens/client/FindPsychScreen.styles';

export default function FindPsychScreen() {
  const navigation = useNavigation<any>();
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [filtered, setFiltered] = useState<Psychiatrist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'online'>('all');

  useEffect(() => {
    fetchPsychiatrists();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [search, filter, psychiatrists]);

  const fetchPsychiatrists = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('psychiatrists')
      .select('*')
      .eq('is_approved', true)
      .order('is_online', { ascending: false });
    setPsychiatrists(data ?? []);
    setLoading(false);
  };

  const applyFilter = () => {
    let result = psychiatrists;
    if (filter === 'online') result = result.filter((p: any) => p.is_online);
    if (search) result = result.filter((p: any) =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.specialization?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  };

  const renderPsych = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SessionRequest', { psychiatrist: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.full_name?.charAt(0) ?? 'D'}
          </Text>
          <View style={[styles.onlineDot, { backgroundColor: item.is_online ? '#4CAF50' : '#ccc' }]} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>Dr. {item.full_name}</Text>
          <Text style={styles.specialization}>{item.specialization ?? 'General Psychiatry'}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="briefcase-outline" size={12} color="#999" />
            <Text style={styles.metaText}>{item.experience ?? 0} years exp.</Text>
            <Ionicons name="star" size={12} color="#FFC107" style={{ marginLeft: 8 }} />
            <Text style={styles.metaText}>{item.rating ?? '5.0'}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.is_online ? '#E8F5E9' : '#F5F5F5' }]}>
          <Text style={[styles.statusText, { color: item.is_online ? '#4CAF50' : '#999' }]}>
            {item.is_online ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {item.bio && (
        <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
      )}

      <TouchableOpacity
        style={[styles.requestBtn, !item.is_online && styles.requestBtnDisabled]}
        onPress={() => item.is_online && navigation.navigate('SessionRequest', { psychiatrist: item })}
        disabled={!item.is_online}
      >
        <Ionicons name="calendar" size={16} color={item.is_online ? '#fff' : '#999'} />
        <Text style={[styles.requestBtnText, !item.is_online && { color: '#999' }]}>
          {item.is_online ? 'Request Session' : 'Currently Unavailable'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Support</Text>
        <Text style={styles.subtitle}>Connect with a professional</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or specialization..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'online' && styles.filterBtnActive]}
          onPress={() => setFilter('online')}
        >
          <View style={styles.onlineDotSmall} />
          <Text style={[styles.filterText, filter === 'online' && styles.filterTextActive]}>Online Now</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Finding professionals...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>No psychiatrists found</Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'online' ? 'No one is online right now. Try again later.' : 'Check back soon!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderPsych}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchPsychiatrists}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}
