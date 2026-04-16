import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useToast } from '@/context/ToastContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import styles from '@/styles/screens/psychiatrist/EditProfileScreen.styles';

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

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [psychId, setPsychId] = useState<string | null>(null);
  const [form, setForm] = useState({ specialization: '', experience: '', bio: '', price: '199' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('psychiatrists')
        .select('id, specialization, experience, bio, price')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setPsychId(data.id);
        setForm({
          specialization: data.specialization ?? '',
          experience: String(data.experience ?? ''),
          bio: data.bio ?? '',
          price: String(data.price ?? '199'),
        });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.specialization) newErrors.specialization = 'Please select a specialization';
    if (!form.experience) newErrors.experience = 'Years of experience is required';
    if (isNaN(Number(form.experience))) newErrors.experience = 'Must be a number';
    if (Number(form.experience) < 0) newErrors.experience = 'Must be a positive number';
    if (Number(form.experience) > 50) newErrors.experience = 'Cannot exceed 50 years';
    if (!form.bio) newErrors.bio = 'Bio is required';
    if (form.bio.length < 20) newErrors.bio = 'Bio must be at least 20 characters';
    const priceNum = Number(form.price);
    if (!form.price || isNaN(priceNum) || priceNum < 99 || priceNum > 499) newErrors.price = 'Price must be between ₹99 and ₹499';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate() || !psychId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('psychiatrists')
        .update({
          specialization: form.specialization,
          experience: parseInt(form.experience),
          bio: form.bio,
          price: parseInt(form.price),
        })
        .eq('id', psychId);
      if (error) throw error;
      showToast('Your profile has been updated', 'success');
      navigation.goBack();
    } catch (e: any) {
      showToast(e.message || 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4FF' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Specialization</Text>
        <View style={styles.specializationGrid}>
          {SPECIALIZATIONS.map(spec => (
            <TouchableOpacity
              key={spec}
              style={[styles.specBtn, form.specialization === spec && styles.specBtnActive]}
              onPress={() => { setForm(f => ({ ...f, specialization: spec })); setErrors(e => ({ ...e, specialization: '' })); }}
            >
              <Text style={[styles.specText, form.specialization === spec && styles.specTextActive]}>{spec}</Text>
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
            onChangeText={t => { setForm(f => ({ ...f, experience: t })); setErrors(e => ({ ...e, experience: '' })); }}
            keyboardType="numeric"
          />
        </View>
        {errors.experience ? <Text style={styles.errorText}>{errors.experience}</Text> : null}

        <Text style={styles.label}>Bio</Text>
        <View style={[styles.inputContainer, styles.textArea, errors.bio && styles.inputError]}>
          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            placeholder="Tell clients about yourself and your approach..."
            placeholderTextColor="#999"
            value={form.bio}
            onChangeText={t => { setForm(f => ({ ...f, bio: t })); setErrors(e => ({ ...e, bio: '' })); }}
            multiline
          />
        </View>
        {errors.bio ? <Text style={styles.errorText}>{errors.bio}</Text> : null}
        <Text style={styles.charCount}>{form.bio.length} characters</Text>

        <Text style={styles.label}>Session Price (₹99 – ₹499)</Text>
        <View style={[styles.inputContainer, errors.price && styles.inputError]}>
          <Text style={[styles.inputIcon, { fontSize: 16, color: '#999' }]}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 199"
            placeholderTextColor="#999"
            value={form.price}
            onChangeText={t => { setForm(f => ({ ...f, price: t })); setErrors(e => ({ ...e, price: '' })); }}
            keyboardType="numeric"
          />
        </View>
        {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}

        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={save} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
