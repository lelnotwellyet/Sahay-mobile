import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/context/AuthContext';
import { useWebRTC } from '@/hooks/useWebRTC';
import styles from '@/styles/screens/psychiatrist/VideoCallScreen.styles';

type RouteParams = {
  VideoCall: { sessionId: string; clientAlias: string };
};

export default function VideoCallScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const { sessionId, clientAlias } = route.params;
  const { user } = useAuth();

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
  } = useWebRTC(sessionId, user?.id ?? 'psych');

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
          navigation.replace('PsychTabs');
        },
      },
    ]);
  };

  const remoteStreamUrl = remoteStream?.toURL?.();
  const localStreamUrl = localStream?.toURL?.();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header overlay */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{clientAlias?.[0]?.toUpperCase() ?? 'C'}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{clientAlias}</Text>
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
            {localStream ? 'Waiting for client to join...' : 'Starting camera...'}
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
    </SafeAreaView>
  );
}
