import React from 'react';
import {
  View, Text, TouchableOpacity,
  SafeAreaView, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/screens/auth/WelcomeScreen.styles';

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

