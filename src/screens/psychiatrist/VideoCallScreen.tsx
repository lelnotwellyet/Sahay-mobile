import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';

type RouteParams = {
  VideoCall: { sessionId: string; clientAlias: string };
};

export default function VideoCallScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const { sessionId, clientAlias } = route.params;
  const [loading, setLoading] = useState(true);
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
          navigation.replace('PsychTabs');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{clientAlias?.[0]?.toUpperCase() ?? 'C'}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{clientAlias}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#1A1A2E',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#6C63FF' },
  headerName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4CAF50' },
  liveText: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  endBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F44336', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 20,
  },
  endBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  webview: { flex: 1 },
  loadingOverlay: {
    position: 'absolute', top: 80, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1A1A2E', gap: 14, zIndex: 10,
  },
  loadingText: { color: '#fff', fontSize: 15, opacity: 0.7 },
});
