import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/context/AuthContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import styles from '@/styles/screens/client/VideoCallScreen.styles';

type RouteParams = {
  VideoCall: { sessionId: string; psychName: string; psychiatristId?: string };
};

export default function VideoCallScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const { sessionId, psychName, psychiatristId } = route.params;
  const { user } = useAuth();
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const {
    localStream,
    remoteStream,
    connected,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    switchCamera,
    cleanup,
  } = useWebRTC(sessionId, user?.id ?? 'client');

  const endCall = () => {
    Alert.alert('End Call', 'Are you sure you want to end this video call?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End', style: 'destructive', onPress: async () => {
          cleanup();
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
    if (rating > 0) {
      await supabase
        .from('sessions')
        .update({ rating })
        .eq('id', sessionId);

      let psychId = psychiatristId;
      if (!psychId) {
        const { data: session } = await supabase
          .from('sessions')
          .select('psychiatrist_id')
          .eq('id', sessionId)
          .single();
        psychId = session?.psychiatrist_id;
      }

      if (psychId) {
        const { data: psych } = await supabase
          .from('psychiatrists')
          .select('rating, total_sessions')
          .eq('id', psychId)
          .single();

        if (psych) {
          const newTotal = psych.total_sessions + 1;
          const newRating = ((psych.rating * psych.total_sessions) + rating) / newTotal;
          await supabase
            .from('psychiatrists')
            .update({ rating: Math.round(newRating * 10) / 10, total_sessions: newTotal })
            .eq('id', psychId);
        }
      }
    }
    navigation.replace('ClientTabs');
  };

  const remoteStreamUrl = remoteStream?.toURL?.();
  const localStreamUrl = localStream?.toURL?.();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header overlay */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{psychName?.[0]?.toUpperCase() ?? 'D'}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{psychName}</Text>
            <View style={styles.liveRow}>
              <View style={[styles.liveDot, !connected && { backgroundColor: '#FF9800' }]} />
              <Text style={[styles.liveText, !connected && { color: '#FF9800' }]}>
                {connected ? 'Connected' : 'Connecting...'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Remote video (fullscreen) */}
      {remoteStreamUrl ? (
        <RTCView
          streamURL={remoteStreamUrl}
          style={styles.remoteVideo}
          objectFit="cover"
          zOrder={0}
        />
      ) : (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>
            {localStream ? 'Waiting for doctor to join...' : 'Starting camera...'}
          </Text>
        </View>
      )}

      {/* Local video (small overlay) */}
      {localStreamUrl && !isCameraOff && (
        <TouchableOpacity style={styles.localVideoWrap} onPress={switchCamera} activeOpacity={0.8}>
          <RTCView
            streamURL={localStreamUrl}
            style={styles.localVideo}
            objectFit="cover"
            mirror
            zOrder={1}
          />
        </TouchableOpacity>
      )}

      {/* Controls bar */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={toggleMute}
        >
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
          onPress={toggleCamera}
        >
          <Ionicons name={isCameraOff ? 'videocam-off' : 'videocam'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endBtn} onPress={endCall}>
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={switchCamera}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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
