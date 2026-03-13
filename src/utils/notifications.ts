import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/config/supabase';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(userId: string): Promise<void> {
  try {
    if (!Device.isDevice) return; // doesn't work on emulator

    // Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6C63FF',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    // Save token to Supabase
    await supabase
      .from('users')
      .update({ push_token: token })
      .eq('id', userId);

  } catch (err) {
    // Non-critical — app works fine without push notifications
    console.log('Push notification setup skipped:', err);
  }
}

export async function sendSessionRequestNotification(
  psychiatristUserId: string,
  clientName: string,
  sessionType: 'chat' | 'video',
  sessionId: string,
): Promise<void> {
  try {
    // Get psychiatrist's push token
    const { data } = await supabase
      .from('users')
      .select('push_token')
      .eq('id', psychiatristUserId)
      .single();

    const token = data?.push_token;
    if (!token) return;

    // Send via Expo Push API
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: `New ${sessionType === 'video' ? 'Video Call' : 'Chat'} Request`,
        body: `${clientName} is requesting a ${sessionType === 'video' ? 'video call' : 'chat'} session`,
        data: { sessionId },
        sound: 'default',
        priority: 'high',
        channelId: 'default',
      }),
    });
  } catch (err) {
    console.log('Failed to send push notification:', err);
  }
}
