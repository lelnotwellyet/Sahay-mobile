import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';
import styles from '@/styles/screens/client/VideoCallScreen.styles';

type RouteParams = {
  VideoCall: { sessionId: string; psychName: string };
};

export default function VideoCallScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const { sessionId, psychName } = route.params;
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef<WebView>(null);

  // Use sessionId as the Jitsi room — both sides join the same room
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
          navigation.replace('ClientTabs');
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

      {/* Jitsi WebView */}
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
