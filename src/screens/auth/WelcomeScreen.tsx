import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
type Nav = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const { signInAnon } = useAuth();

  const handleAnonymous = async () => {
    try {
      await signInAnon();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={60} color="#6C63FF" />
        </View>
        <Text style={styles.appName}>Sahay</Text>
        <Text style={styles.tagline}>
          A safe space to talk.{'\n'}Professional help, when you need it.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Register', { role: 'client' })}
        >
          <Text style={styles.secondaryText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.anonBtn}
          onPress={handleAnonymous}
        >
          <Ionicons name="eye-off-outline" size={18} color="#6C63FF" />
          <Text style={styles.anonText}>Continue Anonymously</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register', { role: 'psychiatrist' })}
        >
          <Text style={styles.psychLink}>
            Are you a psychiatrist? <Text style={styles.psychLinkBold}>Join here</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  buttons: {
    paddingHorizontal: 30,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  secondaryText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '700',
  },
  anonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#EEF0FF',
  },
  anonText: {
    color: '#6C63FF',
    fontSize: 15,
    fontWeight: '600',
  },
  psychLink: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  psychLinkBold: {
    color: '#6C63FF',
    fontWeight: '700',
  },
});