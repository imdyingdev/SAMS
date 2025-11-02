# Notifications Setup for SAMS Mobile App

## Overview
The mobile app now supports local push notifications with vibration when new activity logs are detected in real-time.

## Features
- ✅ **Local Push Notifications**: Displays notifications when new time-in/time-out logs are recorded
- ✅ **Vibration Feedback**: Device vibrates with a custom pattern when new logs arrive
- ✅ **Real-time Updates**: Uses Supabase real-time subscriptions to detect new logs instantly
- ✅ **Foreground & Background**: Notifications work when app is in foreground or background

## How It Works

### 1. Notification Permissions
The app requests notification permissions when the ActivityList component mounts. Users will see a permission dialog on first launch.

### 2. Real-time Detection
- The app listens to the `rfid_logs` table for changes specific to the logged-in student's RFID
- When a new log is inserted, the app detects the change immediately
- A notification is triggered with vibration

### 3. Notification Content
- **Time In**: Shows "🎓 Time In Recorded" with student name and time
- **Time Out**: Shows "👋 Time Out Recorded" with student name and time

### 4. Vibration Pattern
The device vibrates with the pattern: `[0, 250, 250, 250]`
- Wait 0ms
- Vibrate 250ms
- Wait 250ms
- Vibrate 250ms

## Files Modified/Created

### New Files
- `app/utils/notifications.ts` - Notification utility functions

### Modified Files
- `app/components/ActivityList.tsx` - Added notification triggers
- `app.json` - Added expo-notifications plugin configuration
- `package.json` - Added expo-notifications and expo-device dependencies

## Testing

### On Physical Device (Recommended)
1. Run the app on a physical Android/iOS device
2. Grant notification permissions when prompted
3. Have someone tap their RFID card to create a new log
4. You should receive a notification with vibration

### On Emulator
- Notifications work on emulators but vibration may not be supported
- Android emulator: Notifications should appear
- iOS simulator: Limited notification support

## Rebuilding the App

After adding the notification plugin, you need to rebuild the native code:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

Or use EAS Build for production:
```bash
npx eas build --platform android
npx eas build --platform ios
```

## Configuration

### Android Notification Channel
The app creates a default notification channel with:
- **Importance**: MAX (shows as heads-up notification)
- **Vibration Pattern**: [0, 250, 250, 250]
- **Light Color**: Pink (#FF231F7C)

### iOS Notification Settings
- Sound: Enabled
- Badge: Disabled
- Banner: Enabled
- List: Enabled

## Troubleshooting

### Notifications Not Showing
1. Check if permissions are granted in device settings
2. Ensure the app is running (foreground or background)
3. Verify real-time subscription is active (check console logs)
4. Make sure you're testing with the correct student RFID

### Vibration Not Working
1. Check device vibration settings
2. Ensure device is not in silent/do-not-disturb mode
3. Test on a physical device (emulators may not support vibration)

### Permission Denied
1. Uninstall and reinstall the app
2. Manually enable notifications in device settings
3. Check if the device supports notifications

## Future Enhancements
- [ ] Custom notification sounds
- [ ] Notification action buttons (e.g., "View Details")
- [ ] Notification history/inbox
- [ ] Push notifications from server (for announcements)
- [ ] Customizable vibration patterns
- [ ] Notification preferences in settings
