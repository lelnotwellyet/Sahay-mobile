import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, TextInput, Alert, ActivityIndicator,
  ScrollView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import { useNavigation } from '@react-navigation/native';

const SPECIALIZATIONS = [
  'General Psychiatry',
  'Child & Adolescent',
  'Addiction Psychiatry',
  'Geriatric Psychiatry',
  'Forensic Psychiatry',
  'Anxiety & Depression',
  'Trauma & PTSD',
  'Couples Therapy',
];

export default function OnboardingScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    licenseNumber: '',
    specialization: '',
    experience: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (form.licenseNumber.length < 5) newErrors.licenseNumber = 'Enter a valid license number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.specialization) newErrors.specialization = 'Please select a specialization';
    if (!form.experience) newErrors.experience = 'Years of experience is required';
    if (isNaN(Number(form.experience))) newErrors.experience = 'Must be a number';
    if (Number(form.experience) < 0) newErrors.experience = 'Must be a positive number';
    if (Number(form.experience) > 50) newErrors.experience = 'Experience cannot exceed 50 years';
    if (!form.bio) newErrors.bio = 'Please write a short bio';
    if (form.bio.length < 20) newErrors.bio = 'Bio must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickLicenseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setLicenseImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!licenseImage) {
      Alert.alert('Required', 'Please upload your license image');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('psychiatrists')
        .insert({
          user_id: user?.id,
          full_name: form.fullName,
          license_number: form.licenseNumber,
          license_image_url: licenseImage,
          specialization: form.specialization,
          experience: parseInt(form.experience),
          bio: form.bio,
          is_approved: false,
          is_online: false,
          rating: 5.0,
          total_sessions: 0,
        });

      if (error) throw error;

      // Update user role
      await supabase
        .from('users')
        .update({ role: 'psychiatrist' })
        .eq('id', user?.id);

      Alert.alert(
        'Application Submitted! 🎉',
        'Your application is under review. You will be notified once approved by admin.',
        [{ text: 'OK', onPress: () => navigation.navigate('PsychTabs') }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="medical" size={32} color="#6C63FF" />
          </View>
          <Text style={styles.title}>Professional Setup</Text>
          <Text style={styles.subtitle}>Complete your profile to start helping clients</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={styles.progressItem}>
              <View style={[styles.progressDot, step >= s && styles.progressDotActive]}>
                {step > s ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text style={[styles.progressNum, step >= s && styles.progressNumActive]}>{s}</Text>
                )}
              </View>
              {s < 3 && <View style={[styles.progressLine, step > s && styles.progressLineActive]} />}
            </View>
          ))}
        </View>

        <View style={styles.stepLabels}>
          <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>Credentials</Text>
          <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>Profile</Text>
          <Text style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>License</Text>
        </View>

        {/* Step 1 - Credentials */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Credentials</Text>

            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Dr. Full Name"
                placeholderTextColor="#999"
                value={form.fullName}
                onChangeText={(t) => { setForm(f => ({ ...f, fullName: t })); setErrors(e => ({ ...e, fullName: '' })); }}
              />
            </View>
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            <Text style={styles.label}>License Number</Text>
            <View style={[styles.inputContainer, errors.licenseNumber && styles.inputError]}>
              <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. MCI-12345"
                placeholderTextColor="#999"
                value={form.licenseNumber}
                onChangeText={(t) => { setForm(f => ({ ...f, licenseNumber: t })); setErrors(e => ({ ...e, licenseNumber: '' })); }}
                autoCapitalize="characters"
              />
            </View>
            {errors.licenseNumber ? <Text style={styles.errorText}>{errors.licenseNumber}</Text> : null}

            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => validateStep1() && setStep(2)}
            >
              <Text style={styles.nextBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2 - Profile */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Profile</Text>

            <Text style={styles.label}>Specialization</Text>
            <View style={styles.specializationGrid}>
              {SPECIALIZATIONS.map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={[styles.specBtn, form.specialization === spec && styles.specBtnActive]}
                  onPress={() => { setForm(f => ({ ...f, specialization: spec })); setErrors(e => ({ ...e, specialization: '' })); }}
                >
                  <Text style={[styles.specText, form.specialization === spec && styles.specTextActive]}>
                    {spec}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.specialization ? <Text style={styles.errorText}>{errors.specialization}</Text> : null}

            <Text style={styles.label}>Years of Experience</Text>
            <View style={[styles.inputContainer, errors.experience && styles.inputError]}>
              <Ionicons name="briefcase-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 5"
                placeholderTextColor="#999"
                value={form.experience}
                onChangeText={(t) => { setForm(f => ({ ...f, experience: t })); setErrors(e => ({ ...e, experience: '' })); }}
                keyboardType="numeric"
              />
            </View>
            {errors.experience ? <Text style={styles.errorText}>{errors.experience}</Text> : null}

            <Text style={styles.label}>Short Bio</Text>
            <View style={[styles.inputContainer, styles.textArea, errors.bio && styles.inputError]}>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Tell clients about yourself and your approach..."
                placeholderTextColor="#999"
                value={form.bio}
                onChangeText={(t) => { setForm(f => ({ ...f, bio: t })); setErrors(e => ({ ...e, bio: '' })); }}
                multiline
              />
            </View>
            {errors.bio ? <Text style={styles.errorText}>{errors.bio}</Text> : null}

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={20} color="#6C63FF" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => validateStep2() && setStep(3)}
              >
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3 - License Upload */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Upload License</Text>
            <Text style={styles.stepDesc}>
              Upload a clear photo of your medical license for verification
            </Text>

            <TouchableOpacity style={styles.uploadArea} onPress={pickLicenseImage}>
              {licenseImage ? (
                <Image source={{ uri: licenseImage }} style={styles.licenseImage} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={48} color="#6C63FF" />
                  <Text style={styles.uploadText}>Tap to upload license</Text>
                  <Text style={styles.uploadSubtext}>JPG, PNG supported</Text>
                </>
              )}
            </TouchableOpacity>

            {licenseImage && (
              <TouchableOpacity style={styles.reuploadBtn} onPress={pickLicenseImage}>
                <Ionicons name="refresh" size={16} color="#6C63FF" />
                <Text style={styles.reuploadText}>Change image</Text>
              </TouchableOpacity>
            )}

            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#6C63FF" />
              <Text style={styles.infoText}>
                Your license will be reviewed by our admin team within 24 hours. You'll be notified once approved.
              </Text>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                <Ionicons name="arrow-back" size={20} color="#6C63FF" />
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nextBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.nextBtnText}>Submit</Text>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { alignItems: 'center', paddingTop: 30, paddingBottom: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#EEF0FF', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginTop: 20, paddingHorizontal: 60,
  },
  progressItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  progressDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#eee', alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: '#eee',
  },
  progressDotActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  progressNum: { fontSize: 14, fontWeight: '700', color: '#999' },
  progressNumActive: { color: '#fff' },
  progressLine: { flex: 1, height: 2, backgroundColor: '#eee', marginHorizontal: 4 },
  progressLineActive: { backgroundColor: '#6C63FF' },
  stepLabels: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: 40, marginTop: 8, marginBottom: 8,
  },
  stepLabel: { fontSize: 12, color: '#999', fontWeight: '600' },
  stepLabelActive: { color: '#6C63FF' },
  stepContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', marginBottom: 24 },
  stepDesc: { fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 4, borderWidth: 1, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  textArea: { alignItems: 'flex-start', paddingTop: 14 },
  inputError: { borderColor: '#FF4444' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#1A1A2E' },
  errorText: { color: '#FF4444', fontSize: 12, marginBottom: 12, marginLeft: 4 },
  specializationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  specBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#eee',
  },
  specBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  specText: { fontSize: 13, color: '#666', fontWeight: '600' },
  specTextActive: { color: '#fff' },
  uploadArea: {
    backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 2, borderColor: '#6C63FF',
    borderStyle: 'dashed', alignItems: 'center',
    justifyContent: 'center', padding: 40, marginBottom: 16,
    minHeight: 200,
  },
  licenseImage: { width: '100%', height: 200, borderRadius: 12 },
  uploadText: { fontSize: 16, fontWeight: '700', color: '#6C63FF', marginTop: 12 },
  uploadSubtext: { fontSize: 13, color: '#999', marginTop: 4 },
  reuploadBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginBottom: 16,
  },
  reuploadText: { color: '#6C63FF', fontSize: 14, fontWeight: '600' },
  infoBox: {
    flexDirection: 'row', backgroundColor: '#EEF0FF',
    borderRadius: 12, padding: 14, gap: 10,
    marginBottom: 24, alignItems: 'flex-start',
  },
  infoText: { flex: 1, color: '#6C63FF', fontSize: 13, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 12 },
  nextBtn: {
    flex: 1, flexDirection: 'row', backgroundColor: '#6C63FF',
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 16,
    paddingHorizontal: 20, borderRadius: 16,
    borderWidth: 2, borderColor: '#6C63FF', gap: 8,
  },
  backBtnText: { color: '#6C63FF', fontSize: 16, fontWeight: '700' },
});