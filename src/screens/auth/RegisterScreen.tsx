import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useToast } from '@/context/ToastContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { isValidEmail, isValidPassword } from '@/utils/validators';
import styles from '@/styles/screens/auth/RegisterScreen.styles';

type Nav = StackNavigationProp<AuthStackParamList, 'Register'>;
type Route = RouteProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { registerEmail, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const role = route.params?.role ?? 'client';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPsych = role === 'psychiatrist';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!isValidEmail(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (!isValidPassword(password)) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerEmail(email, password, role);
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        showToast('This email is already registered', 'error');
      } else if (e.code === 'auth/invalid-email') {
        showToast('Invalid email address', 'error');
      } else {
        showToast(e.message || 'Registration failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      showToast(e.message || 'Google Sign In failed', 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </TouchableOpacity>

          <View style={styles.roleBadge}>
            <Ionicons name={isPsych ? 'medical' : 'person'} size={16} color="#6C63FF" />
            <Text style={styles.roleText}>
              {isPsych ? 'Psychiatrist Account' : 'Client Account'}
            </Text>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            {isPsych
              ? 'Submit your details for admin approval'
              : 'Start your mental wellness journey'}
          </Text>

          {/* Email */}
          <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={errors.email ? '#FF4444' : '#999'} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.length > 0 && isValidEmail(email) && (
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          {/* Password */}
          <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color={errors.password ? '#FF4444' : '#999'} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor="#999"
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: '' })); }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          {/* Password strength */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={[styles.strengthBar, { backgroundColor: password.length >= 6 ? '#4CAF50' : '#FF4444' }]} />
              <View style={[styles.strengthBar, { backgroundColor: password.length >= 8 ? '#4CAF50' : '#eee' }]} />
              <View style={[styles.strengthBar, { backgroundColor: password.length >= 10 ? '#4CAF50' : '#eee' }]} />
              <Text style={styles.strengthText}>
                {password.length < 6 ? 'Weak' : password.length < 8 ? 'Fair' : password.length < 10 ? 'Good' : 'Strong'}
              </Text>
            </View>
          )}

          {/* Confirm Password */}
          <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={20} color={errors.confirmPassword ? '#FF4444' : '#999'} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setErrors(e => ({ ...e, confirmPassword: '' })); }}
              secureTextEntry={!showPassword}
            />
            {confirmPassword.length > 0 && (
              <Ionicons
                name={password === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={password === confirmPassword ? '#4CAF50' : '#FF4444'}
              />
            )}
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          {isPsych && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#6C63FF" />
              <Text style={styles.infoText}>
                After registration, you'll need to upload your license for admin approval before accepting sessions.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {!isPsych && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
                onPress={handleGoogle}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#DB4437" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text style={styles.googleText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
