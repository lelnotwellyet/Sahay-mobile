import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/config/firebase';
import { sendEmailVerification, reload } from 'firebase/auth';
import { useToast } from '@/context/ToastContext';
import styles from '@/styles/screens/auth/EmailVerificationScreen.styles';

export default function EmailVerificationScreen() {
  const { logout, checkEmailVerified, user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-check every 5 seconds if email was verified
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        try {
          await reload(auth.currentUser);
          if (auth.currentUser.emailVerified) {
            await checkEmailVerified();
          }
        } catch (_) {}
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown timer to prevent spamming resend
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const handleResend = async () => {
    if (!auth.currentUser || cooldown > 0) return;
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      showToast('Verification email sent! Check your inbox & spam.', 'success');
      setCooldown(60); // 60 second cooldown
    } catch (e: any) {
      console.error('Email verification error:', e);
      if (e.code === 'auth/too-many-requests') {
        showToast('Too many attempts. Please wait a few minutes.', 'error');
        setCooldown(120);
      } else {
        showToast(e.message || 'Failed to send email. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setRefreshing(true);
    try {
      if (auth.currentUser) {
        await reload(auth.currentUser);
        if (auth.currentUser.emailVerified) {
          await checkEmailVerified();
          showToast('Email verified! Welcome! 🎉', 'success');
        } else {
          showToast('Not verified yet. Check your inbox & spam folder.', 'info');
        }
      }
    } catch (e: any) {
      console.error('Check verification error:', e);
      showToast('Could not check status. Try again.', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSkip = async () => {
    // Allow the user to skip for now and proceed
    // We mark them as verified in state only (not in Firebase)
    await checkEmailVerified();
    showToast('You can verify later from settings.', 'info');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="mail-open-outline" size={40} color="#6C63FF" />
      </View>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification link to{'\n'}
        <Text style={{ fontWeight: '700', color: '#1A1A2E' }}>{user?.email || 'your email'}</Text>
        {'\n\n'}Check your inbox and spam folder, then tap the link to verify.
      </Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleCheck} disabled={refreshing}>
        {refreshing ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>I've Verified — Let Me In</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryBtn, cooldown > 0 && { opacity: 0.5 }]}
        onPress={handleResend}
        disabled={loading || cooldown > 0}
      >
        {loading ? (
          <ActivityIndicator color="#1A1A2E" />
        ) : (
          <Text style={styles.secondaryBtnText}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.logoutText}>Skip for now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={{ marginTop: 8 }}>
        <Text style={[styles.logoutText, { color: '#F44336' }]}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
