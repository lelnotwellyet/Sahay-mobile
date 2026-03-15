import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { sendSessionRequestNotification } from '@/utils/notifications';
import styles from '@/styles/screens/client/SessionRequestScreen.styles';

type RouteParams = {
  SessionRequest: {
    psychiatrist: {
      id: string;
      user_id: string;
      full_name: string;
      specialization: string;
      experience: number;
      rating: number;
      bio: string;
      is_online: boolean;
    };
  };
};

export default function SessionRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'SessionRequest'>>();
  const { user } = useAuth();
  const { psychiatrist } = route.params;

  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (!sessionId || !waiting) return;

    const channel = supabase
      .channel(`session-status-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          const status = (payload.new as any).status;
          if (status === 'active') {
            channel.unsubscribe();
            setWaiting(false);
            navigation.replace('VideoCall', { sessionId, psychName: `Dr. ${psychiatrist.full_name}` });
          } else if (status === 'cancelled') {
            channel.unsubscribe();
            setWaiting(false);
            setSessionId(null);
            Alert.alert(
              'Request Declined',
              'The psychiatrist is unable to take your session right now. Please try again or choose another professional.',
              [{ text: 'OK' }]
            );
          }
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [sessionId, waiting]);

  const sendRequest = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          client_id: user.id,
          psychiatrist_id: psychiatrist.id,
          type: 'video',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      setWaiting(true);

      const clientName = user.isAnonymous
        ? (user.alias ?? 'Anonymous')
        : (user.displayName || user.email?.split('@')[0] || 'A client');
      sendSessionRequestNotification(psychiatrist.user_id, clientName, 'video', data.id);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async () => {
    if (!sessionId) {
      navigation.goBack();
      return;
    }
    Alert.alert('Cancel Request', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes', style: 'destructive', onPress: async () => {
          await supabase.from('sessions').update({ status: 'cancelled' }).eq('id', sessionId);
          setWaiting(false);
          setSessionId(null);
          navigation.goBack();
        },
      },
    ]);
  };

  // ── Waiting screen ──────────────────────────────────────────────
  if (waiting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.waitingContainer}>
          <View style={styles.pulseCircle}>
            <View style={styles.pulseInner}>
              <Text style={styles.pulseInitial}>
                {psychiatrist.full_name?.[0]?.toUpperCase() ?? 'D'}
              </Text>
            </View>
          </View>

          <Text style={styles.waitingTitle}>Waiting for Response</Text>
          <Text style={styles.waitingDesc}>
            Dr. {psychiatrist.full_name} is being notified of your{' '}
            <Text style={styles.waitingType}>video call</Text> request.
          </Text>

          <View style={styles.waitingCard}>
            <ActivityIndicator color="#6C63FF" style={{ marginBottom: 8 }} />
            <Text style={styles.waitingCardText}>Checking for response...</Text>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={cancelRequest}>
            <Text style={styles.cancelBtnText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Request screen ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
      </TouchableOpacity>

      <View style={styles.inner}>
        {/* Psychiatrist card */}
        <View style={styles.psychCard}>
          <View style={styles.psychAvatar}>
            <Text style={styles.psychAvatarText}>
              {psychiatrist.full_name?.[0]?.toUpperCase() ?? 'D'}
            </Text>
            <View style={[styles.onlineDot, { backgroundColor: psychiatrist.is_online ? '#4CAF50' : '#ccc' }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.psychName}>Dr. {psychiatrist.full_name}</Text>
            <Text style={styles.psychSpec}>{psychiatrist.specialization}</Text>
            <View style={styles.psychMeta}>
              <Ionicons name="briefcase-outline" size={12} color="#999" />
              <Text style={styles.psychMetaText}>{psychiatrist.experience} yrs exp</Text>
              <Ionicons name="star" size={12} color="#FFC107" style={{ marginLeft: 8 }} />
              <Text style={styles.psychMetaText}>{psychiatrist.rating?.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Video only info */}
        <View style={[styles.typeCard, styles.typeCardActive]}>
          <View style={[styles.typeIconBox, { backgroundColor: '#6C63FF' }]}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, styles.typeTitleActive]}>Video Call</Text>
            <Text style={styles.typeDesc}>
              Face-to-face session with a licensed psychiatrist.
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#6C63FF" />
          <Text style={styles.infoText}>
            All sessions are completely confidential and secure.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.7 }]}
          onPress={sendRequest}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="videocam" size={20} color="#fff" />
                <Text style={styles.sendBtnText}>Request Video Call</Text>
              </>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
