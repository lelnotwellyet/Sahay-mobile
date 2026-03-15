import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';
import styles from '@/styles/screens/client/VideoCallScreen.styles';

type RouteParams = {
  VideoCall: { sessionId: string; psychName: string; psychiatristId?: string };
};

export default function VideoCallScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const { sessionId, psychName, psychiatristId } = route.params;
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const webviewRef = useRef<WebView>(null);

  const roomName = `sahay-${sessionId.replace(/-/g, '').slice(0, 20)}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.MOBILE_APP_PROMO=false`;

  const endCall = () => {
    Alert.alert('End Call', 'Are you sure you want to end this video call?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End', style: 'destructive', onPress: async () => {
          await supabase
            .from('sessions')
            .update({ status: 'completed', ended_at: new Date().toISOString() })
            .eq('id', sessionId);
          setShowRating(true);
        },
      },
    ]);
  };

  const submitRating = async (rating: number) => {
    if (psychiatristId && rating > 0) {
      const { data: psych } = await supabase
        .from('psychiatrists')
        .select('rating, total_sessions')
        .eq('id', psychiatristId)
        .single();

      if (psych) {
        const newTotal = psych.total_sessions + 1;
        const newRating = ((psych.rating * psych.total_sessions) + rating) / newTotal;
        await supabase
          .from('psychiatrists')
          .update({ rating: Math.round(newRating * 10) / 10, total_sessions: newTotal })
          .eq('id', psychiatristId);
      }
    }
    navigation.replace('ClientTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{psychName?.[0]?.toUpperCase() ?? 'D'}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{psychName}</Text>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.endBtn} onPress={endCall}>
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.endBtnText}>End</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Connecting to video call...</Text>
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: jitsiUrl }}
        style={[styles.webview, loading && { opacity: 0 }]}
        onLoad={() => setLoading(false)}
        userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        allowsFullscreenVideo
        onError={() => {
          setLoading(false);
          Alert.alert('Connection Error', 'Unable to connect to video call. Check your internet connection.');
        }}
      />

      {/* Rating Modal */}
      <Modal visible={showRating} transparent animationType="fade">
        <View style={styles.ratingOverlay}>
          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>Session Complete</Text>
            <Text style={styles.ratingSubtitle}>How was your session with {psychName}?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                  <Ionicons
                    name={star <= selectedRating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= selectedRating ? '#FFC107' : '#ddd'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {selectedRating > 0 && (
              <TouchableOpacity style={styles.submitRatingBtn} onPress={() => submitRating(selectedRating)}>
                <Text style={styles.submitRatingText}>Submit Rating</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.skipBtn} onPress={() => submitRating(0)}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
