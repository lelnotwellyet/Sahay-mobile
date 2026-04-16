import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useToast } from '@/context/ToastContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { isValidEmail } from '@/utils/validators';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';
import styles from '@/styles/screens/auth/LoginScreen.styles';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signInEmail } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    setLoading(true);
    try {
      await signInEmail(trimmedEmail, password);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        showToast('No account found with this email', 'error');
      } else if (e.code === 'auth/wrong-password') {
        showToast('Incorrect password', 'error');
      } else if (e.code === 'auth/too-many-requests') {
        showToast('Too many attempts. Please try again later.', 'error');
      } else if (e.code === 'auth/invalid-email') {
        showToast('Invalid email address', 'error');
      } else {
        showToast(e.message || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showToast('Enter your email above first', 'info');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showToast('Enter a valid email to reset password', 'error');
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      showToast('Password reset email sent! Check your inbox.', 'success');
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        showToast('No account found with this email', 'error');
      } else {
        showToast(e.message || 'Failed to send reset email', 'error');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPassword} disabled={resetLoading}>
          <Text style={styles.forgotText}>
            {resetLoading ? 'Sending...' : 'Forgot Password?'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register', { role: 'client' })}>
          <Text style={styles.registerLink}>
            Don't have an account? <Text style={styles.registerLinkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
