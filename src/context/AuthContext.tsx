import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { supabase } from '@/config/supabase';
import { generateAlias } from '@/utils/anonymousName';
import { registerForPushNotifications } from '@/utils/notifications';
import { User, UserRole } from '@/types';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnon: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string, role: UserRole) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pendingRoleRef = useRef<UserRole>('client');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadOrCreateUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loadOrCreateUser = async (firebaseUser: any) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          role: data.role,
          isAnonymous: data.is_anonymous,
          alias: data.alias,
          createdAt: data.created_at,
        });
        registerForPushNotifications(data.id);
      } else {
        const alias = firebaseUser.isAnonymous ? generateAlias() : undefined;
        const role = pendingRoleRef.current;
        pendingRoleRef.current = 'client';
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName,
            role,
            is_anonymous: firebaseUser.isAnonymous,
            alias,
          })
          .select()
          .single();

        if (newUser) {
          setUser({
            id: newUser.id,
            email: newUser.email,
            displayName: newUser.display_name,
            role: newUser.role,
            isAnonymous: newUser.is_anonymous,
            alias: newUser.alias,
            createdAt: newUser.created_at,
          });
          registerForPushNotifications(newUser.id);
        }
      }
    } catch (err: any) {
      console.error('Error loading user:', err);
      Alert.alert('Login Error', err?.message ?? 'Could not load your account. Please try again.');
    }
  };

  const signInAnon = async () => {
    await signInAnonymously(auth);
  };

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerEmail = async (
    email: string,
    password: string,
    role: UserRole
  ) => {
    pendingRoleRef.current = role;
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      if (!idToken) throw new Error('No ID token found');
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled Google sign in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google sign in in progress');
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInAnon,
        signInEmail,
        registerEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);