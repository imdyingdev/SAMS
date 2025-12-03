import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if running in Expo Go (push notifications not supported in SDK 53+)
const isExpoGo = Constants.appOwnership === 'expo';

// Configure how notifications should be handled when the app is in foreground
// Only set handler if not in Expo Go to avoid errors
if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Request notification permissions from the user
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Skip push notification registration in Expo Go (not supported in SDK 53+)
  if (isExpoGo) {
    console.log('Push notifications are not supported in Expo Go. Use a development build.');
    return null;
  }

  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

/**
 * Schedule a local notification for new activity log
 */
export async function scheduleActivityNotification(
  studentName: string,
  tapType: 'time_in' | 'time_out',
  time: string
) {
  // Skip notifications in Expo Go
  if (isExpoGo) {
    console.log(`[Expo Go] Notification skipped: ${studentName} - ${tapType} at ${time}`);
    return;
  }

  const title = tapType === 'time_in' ? '🎓 Time In Recorded' : '👋 Time Out Recorded';
  const body = `${studentName} - ${time}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      vibrate: [0, 250, 250, 250], // Vibration pattern: wait 0ms, vibrate 250ms, wait 250ms, vibrate 250ms
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Show immediately
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  // Skip in Expo Go
  if (isExpoGo) return;
  
  await Notifications.cancelAllScheduledNotificationsAsync();
}
