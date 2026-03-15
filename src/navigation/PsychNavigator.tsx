import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';
import PsychHomeScreen from '@/screens/psychiatrist/PsychHomeScreen';
import SessionQueueScreen from '@/screens/psychiatrist/SessionQueueScreen';
import VideoCallScreen from '@/screens/psychiatrist/VideoCallScreen';
import OnboardingScreen from '@/screens/psychiatrist/OnboardingScreen';
import EditProfileScreen from '@/screens/psychiatrist/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PsychTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#eee' },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Queue') iconName = focused ? 'list' : 'list-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={PsychHomeScreen} />
      <Tab.Screen name="Queue" component={SessionQueueScreen} />
    </Tab.Navigator>
  );
}

export default function PsychNavigator() {
  const { user } = useAuth();
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'PsychTabs' | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('psychiatrists')
        .select('id')
        .eq('user_id', user.id)
        .single();
      setInitialRoute(data ? 'PsychTabs' : 'Onboarding');
    };
    checkProfile();
  }, [user]);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4FF' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PsychTabs" component={PsychTabs} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
