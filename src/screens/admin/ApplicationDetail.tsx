import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '@/config/supabase';

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

type RouteParams = {
  ApplicationDetail: { application: Application };
};

export default function ApplicationDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'ApplicationDetail'>>();
  const { application } = route.params;

  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleApprove = () => {
    Alert.alert(
      'Approve Application',
      `Approve Dr. ${application.fullName} as a verified psychiatrist on Sahay?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve', onPress: async () => {
            setLoading('approve');
            const { error } = await supabase
              .from('psychiatrists')
              .update({ is_approved: true })
              .eq('id', application.id);

            if (error) {
              Alert.alert('Error', error.message);
            } else {
              // Also update user role to ensure it's set
              await supabase
                .from('users')
                .update({ role: 'psychiatrist' })
                .eq('id', application.userId);

              Alert.alert(
                'Approved! ✅',
                `Dr. ${application.fullName} can now accept sessions.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }
            setLoading(null);
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Application',
      `Reject Dr. ${application.fullName}'s application? This will remove their record.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject', style: 'destructive', onPress: async () => {
            setLoading('reject');
            const { error } = await supabase
              .from('psychiatrists')
              .delete()
              .eq('id', application.id);

            if (error) {
              Alert.alert('Error', error.message);
            } else {
              // Reset user role back to client
              await supabase
                .from('users')
                .update({ role: 'client' })
                .eq('id', application.userId);

              Alert.alert(
                'Rejected',
                `Dr. ${application.fullName}'s application has been rejected.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }
            setLoading(null);
          },
        },
      ]
    );
  };

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon as any} size={18} color="#6C63FF" />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Review</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile section */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{application.fullName[0]?.toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>Dr. {application.fullName}</Text>
          <Text style={styles.spec}>{application.specialization}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: application.isApproved ? '#E8F5E9' : '#FFF8E1' }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: application.isApproved ? '#4CAF50' : '#FF9800' }
            ]} />
            <Text style={[
              styles.statusText,
              { color: application.isApproved ? '#4CAF50' : '#E65100' }
            ]}>
              {application.isApproved ? 'Approved' : 'Pending Review'}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <InfoRow icon="card-outline" label="License Number" value={application.licenseNumber} />
          <InfoRow icon="briefcase-outline" label="Experience" value={`${application.experience} years`} />
          <InfoRow icon="medical-outline" label="Specialization" value={application.specialization} />
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>{application.bio}</Text>
        </View>

        {/* License image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License Document</Text>
          {application.licenseImageUrl && !imageError ? (
            <Image
              source={{ uri: application.licenseImageUrl }}
              style={styles.licenseImage}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={40} color="#ccc" />
              <Text style={styles.noImageText}>
                {imageError ? 'Could not load image' : 'No image uploaded'}
              </Text>
            </View>
          )}
        </View>

        {/* Actions — only show if not yet approved */}
        {!application.isApproved && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.rejectBtn, loading === 'reject' && { opacity: 0.7 }]}
              onPress={handleReject}
              disabled={!!loading}
            >
              {loading === 'reject'
                ? <ActivityIndicator color="#FF4444" />
                : <>
                    <Ionicons name="close-circle" size={20} color="#FF4444" />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.approveBtn, loading === 'approve' && { opacity: 0.7 }]}
              onPress={handleApprove}
              disabled={!!loading}
            >
              {loading === 'approve'
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
        )}

        {application.isApproved && (
          <View style={styles.approvedBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.approvedBannerText}>This psychiatrist is approved and active.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 24,
    paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  profileCard: {
    alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 24, borderRadius: 20,
    padding: 24, marginTop: 8, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#6C63FF', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  spec: { fontSize: 14, color: '#6C63FF', fontWeight: '600', marginBottom: 12 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, gap: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },
  section: {
    backgroundColor: '#fff', marginHorizontal: 24,
    borderRadius: 20, padding: 20, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  infoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  bioText: { fontSize: 14, color: '#555', lineHeight: 22 },
  licenseImage: {
    width: '100%', height: 220,
    borderRadius: 12, backgroundColor: '#f5f5f5',
  },
  noImage: {
    height: 140, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f9f9f9', borderRadius: 12, gap: 8,
  },
  noImageText: { fontSize: 13, color: '#ccc' },
  actions: {
    flexDirection: 'row', marginHorizontal: 24,
    gap: 12, marginTop: 8,
  },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 16,
    borderRadius: 16, borderWidth: 2, borderColor: '#FF4444', gap: 8,
  },
  rejectBtnText: { color: '#FF4444', fontSize: 15, fontWeight: '700' },
  approveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 16,
    borderRadius: 16, backgroundColor: '#6C63FF', gap: 8,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  approveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  approvedBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', marginHorizontal: 24,
    borderRadius: 14, padding: 14, gap: 10, marginTop: 8,
  },
  approvedBannerText: { color: '#4CAF50', fontWeight: '600', fontSize: 14 },
});
