import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ClientHomeScreen from '@/screens/client/ClientHomeScreen';
import FindPsychScreen from '@/screens/client/FindPsychScreen';
import SessionRequestScreen from '@/screens/client/SessionRequestScreen';
import ChatScreen from '@/screens/client/ChatScreen';
import VideoCallScreen from '@/screens/client/VideoCallScreen';
import MySessionsScreen from '@/screens/client/MySessionsScreen';
import SelfCareScreen from '@/screens/client/SelfCareScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ClientTabs() {
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
          else if (route.name === 'Find') iconName = focused ? 'search' : 'search-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ClientHomeScreen} />
      <Tab.Screen name="Find" component={FindPsychScreen} />
    </Tab.Navigator>
  );
}

export default function ClientNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="SessionRequest" component={SessionRequestScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} />
      <Stack.Screen name="MySessions" component={MySessionsScreen} />
      <Stack.Screen name="SelfCare" component={SelfCareScreen} />
    </Stack.Navigator>
  );
}