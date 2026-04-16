import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
      price: number;
    };
  };
};

export default function SessionRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'SessionRequest'>>();
  const { psychiatrist } = route.params;

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

        {/* Video only */}
        <View style={[styles.typeCard, styles.typeCardActive]}>
          <View style={[styles.typeIconBox, { backgroundColor: '#6C63FF' }]}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.typeTitle, styles.typeTitleActive]}>Video Call</Text>
            <Text style={styles.typeDesc}>Face-to-face session with a licensed psychiatrist.</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="pricetag-outline" size={18} color="#6C63FF" />
          <Text style={styles.infoText}>
            Session fee: <Text style={{ fontWeight: '800' }}>₹{psychiatrist.price ?? 199}</Text> for a 30-min video call.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#6C63FF" />
          <Text style={styles.infoText}>All sessions are completely confidential and secure.</Text>
        </View>

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => navigation.navigate('Payment', { psychiatrist })}
        >
          <Ionicons name="card-outline" size={20} color="#fff" />
          <Text style={styles.sendBtnText}>Proceed to Pay ₹{psychiatrist.price ?? 199}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
