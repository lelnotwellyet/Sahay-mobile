import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, Image, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styles from '@/styles/screens/client/SelfCareScreen.styles';

type RouteParams = {
  SelfCare: { mood?: string };
};

const MOODS = [
  { label: 'All',   color: '#6C63FF', displayName: 'All' },
  { label: 'Great', color: '#4CAF50', displayName: '😊 Happy' },
  { label: 'Good',  color: '#8BC34A', displayName: '😌 Calm' },
  { label: 'Okay',  color: '#FFC107', displayName: '😐 Okay' },
  { label: 'Low',   color: '#FF9800', displayName: '😰 Anxious' },
  { label: 'Bad',   color: '#F44336', displayName: '😢 Sad' },
];

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  duration: string;
  category: string;
  moods: string[];
}

// ── To update videos: go to YouTube, copy the video ID from the URL
// ── e.g. youtube.com/watch?v=XXXXXXXXXXX  →  youtubeId: 'XXXXXXXXXXX'
const VIDEOS: Video[] = [
  // ── Great ──────────────────────────────────────────────────────
  { id: 'g1', youtubeId: 'inpok4MKVLM', title: '5-Minute Meditation You Can Do Anywhere', channel: 'Goodful', duration: '5:00', category: 'Meditation', moods: ['Great'] },
  { id: 'g2', youtubeId: 'sTANio_2E0Q', title: 'Morning Gratitude Meditation', channel: 'Goodful', duration: '10:03', category: 'Meditation', moods: ['Great'] },
  { id: 'g3', youtubeId: 'MIr3RsUWrdo', title: 'Positive Affirmations for a Great Day', channel: 'Great Meditation', duration: '8:45', category: 'Affirmations', moods: ['Great'] },

  // ── Good ───────────────────────────────────────────────────────
  { id: 'go1', youtubeId: 'ZToicYcHIOU', title: '10-Minute Mindfulness Meditation', channel: 'Goodful', duration: '10:00', category: 'Meditation', moods: ['Good'] },
  { id: 'go2', youtubeId: 'COp7BR_Dvps', title: 'Yoga for Beginners — Feel Good Flow', channel: 'Yoga With Adriene', duration: '20:00', category: 'Yoga', moods: ['Good'] },
  { id: 'go3', youtubeId: 'sTANio_2E0Q', title: 'Gentle Morning Meditation', channel: 'Goodful', duration: '10:03', category: 'Meditation', moods: ['Good'] },

  // ── Okay ───────────────────────────────────────────────────────
  { id: 'ok1', youtubeId: 'tybOi4hjZFQ', title: 'Wim Hof Guided Breathing Exercise', channel: 'Wim Hof', duration: '6:12', category: 'Breathing', moods: ['Okay'] },
  { id: 'ok2', youtubeId: 'SEfs5TJZ6Nk', title: 'Yoga for Stress & Anxiety', channel: 'Yoga With Adriene', duration: '19:55', category: 'Yoga', moods: ['Okay'] },
  { id: 'ok3', youtubeId: 'inpok4MKVLM', title: '5-Minute Meditation You Can Do Anywhere', channel: 'Goodful', duration: '5:00', category: 'Meditation', moods: ['Okay'] },

  // ── Low ────────────────────────────────────────────────────────
  { id: 'l1', youtubeId: 'O-6f5wQXSu8', title: 'Anxiety Relief — 10 Minute Meditation', channel: 'Great Meditation', duration: '10:00', category: 'Meditation', moods: ['Low'] },
  { id: 'l2', youtubeId: 'SEfs5TJZ6Nk', title: 'Yoga for Stress & Anxiety', channel: 'Yoga With Adriene', duration: '19:55', category: 'Yoga', moods: ['Low'] },
  { id: 'l3', youtubeId: 'tybOi4hjZFQ', title: 'Wim Hof Guided Breathing Exercise', channel: 'Wim Hof', duration: '6:12', category: 'Breathing', moods: ['Low'] },
  { id: 'l4', youtubeId: 'MIr3RsUWrdo', title: 'Positive Affirmations to Lift Your Mood', channel: 'Great Meditation', duration: '8:45', category: 'Affirmations', moods: ['Low'] },

  // ── Bad ────────────────────────────────────────────────────────
  { id: 'b1', youtubeId: 'RVA2N6tX2cg', title: '5-4-3-2-1 Grounding for Anxiety', channel: 'Therapy in a Nutshell', duration: '7:03', category: 'Grounding', moods: ['Bad'] },
  { id: 'b2', youtubeId: 'tybOi4hjZFQ', title: 'Wim Hof Guided Breathing Exercise', channel: 'Wim Hof', duration: '6:12', category: 'Breathing', moods: ['Bad'] },
  { id: 'b3', youtubeId: 'O-6f5wQXSu8', title: 'Anxiety Relief — 10 Minute Meditation', channel: 'Great Meditation', duration: '10:00', category: 'Meditation', moods: ['Bad'] },
  { id: 'b4', youtubeId: 'SEfs5TJZ6Nk', title: 'Yoga for Stress & Anxiety', channel: 'Yoga With Adriene', duration: '19:55', category: 'Yoga', moods: ['Bad'] },

  // ── All ────────────────────────────────────────────────────────
  { id: 'a1', youtubeId: 'inpok4MKVLM', title: '5-Minute Meditation You Can Do Anywhere', channel: 'Goodful', duration: '5:00', category: 'Meditation', moods: ['All'] },
  { id: 'a2', youtubeId: 'tybOi4hjZFQ', title: 'Wim Hof Guided Breathing Exercise', channel: 'Wim Hof', duration: '6:12', category: 'Breathing', moods: ['All'] },
  { id: 'a3', youtubeId: 'SEfs5TJZ6Nk', title: 'Yoga for Stress & Anxiety', channel: 'Yoga With Adriene', duration: '19:55', category: 'Yoga', moods: ['All'] },
  { id: 'a4', youtubeId: 'RVA2N6tX2cg', title: '5-4-3-2-1 Grounding for Anxiety', channel: 'Therapy in a Nutshell', duration: '7:03', category: 'Grounding', moods: ['All'] },
  { id: 'a5', youtubeId: 'MIr3RsUWrdo', title: 'Positive Morning Affirmations', channel: 'Great Meditation', duration: '8:45', category: 'Affirmations', moods: ['All'] },
];

const CATEGORY_COLORS: Record<string, string> = {
  Meditation:   '#6C63FF',
  Breathing:    '#4CAF50',
  Yoga:         '#FF9800',
  Affirmations: '#E91E63',
  Grounding:    '#00BCD4',
};

function getThumbnail(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export default function SelfCareScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'SelfCare'>>();
  const initialMood = route.params?.mood ?? 'All';
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const filtered = VIDEOS.filter(v => v.moods.includes(selectedMood));
  const moodConfig = MOODS.find(m => m.label === selectedMood) ?? MOODS[0];

  const renderVideo = ({ item }: { item: Video }) => (
    <TouchableOpacity style={styles.videoCard} onPress={() => setActiveVideo(item)} activeOpacity={0.85}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: getThumbnail(item.youtubeId) }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <View style={styles.playBtn}>
            <Ionicons name="play" size={20} color="#fff" />
          </View>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <View style={[styles.categoryBadge, { backgroundColor: (CATEGORY_COLORS[item.category] ?? '#6C63FF') + '20' }]}>
          <Text style={[styles.categoryText, { color: CATEGORY_COLORS[item.category] ?? '#6C63FF' }]}>
            {item.category}
          </Text>
        </View>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelName}>{item.channel}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.title}>Self Care</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Mood banner */}
      <View style={[styles.moodBanner, { backgroundColor: moodConfig.color + '15' }]}>
        <View style={[styles.moodDot, { backgroundColor: moodConfig.color }]} />
        <Text style={[styles.moodBannerText, { color: moodConfig.color }]}>
          {selectedMood === 'All'
            ? 'Showing all resources'
            : `Resources for when you're feeling ${moodConfig.displayName}`}
        </Text>
      </View>

      {/* Mood filter chips */}
      <View style={styles.moodFilters}>
        {MOODS.map(m => (
          <TouchableOpacity
            key={m.label}
            style={[
              styles.moodChip,
              selectedMood === m.label && { backgroundColor: m.color, borderColor: m.color },
            ]}
            onPress={() => setSelectedMood(m.label)}
          >
            <Text style={[styles.moodChipText, selectedMood === m.label && { color: '#fff' }]}>
              {m.displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* In-app YouTube player */}
      <Modal visible={!!activeVideo} animationType="slide" onRequestClose={() => setActiveVideo(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={styles.videoModalHeader}>
            <TouchableOpacity onPress={() => setActiveVideo(null)} style={styles.videoModalClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.videoModalTitle} numberOfLines={1}>{activeVideo?.title}</Text>
          </View>
          {activeVideo && (
            <WebView
              source={{ uri: `https://m.youtube.com/watch?v=${activeVideo.youtubeId}` }}
              style={{ flex: 1 }}
              userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              allowsFullscreenVideo
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Videos list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderVideo}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={56} color="#C5C1FF" />
            <Text style={styles.emptyTitle}>No videos for this mood yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
