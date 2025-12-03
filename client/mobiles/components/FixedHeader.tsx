import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/colors';
import CalendarScreen from './CalendarScreen';

interface FixedHeaderProps {
  title?: string;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

const FixedHeader: React.FC<FixedHeaderProps> = ({ title = 'Attendance Log', onNotificationPress, notificationCount = 0 }) => {
  const [selectedAvatarColor, setSelectedAvatarColor] = useState('#FF5C8D');
  const [showAvatarImage, setShowAvatarImage] = useState(true);

  useEffect(() => {
    loadAvatarSettings();
  }, []);

  // Reload avatar settings when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAvatarSettings();
    }, [])
  );

  const loadAvatarSettings = async () => {
    try {
      const savedColor = await AsyncStorage.getItem('avatarColor');
      const savedShowImage = await AsyncStorage.getItem('showAvatarImage');
      if (savedColor) {
        setSelectedAvatarColor(savedColor);
      }
      if (savedShowImage !== null) {
        setShowAvatarImage(savedShowImage === 'true');
      }
    } catch (error) {
      console.error('Error loading avatar settings:', error);
    }
  };
  return (
    <View style={styles.fixedHeader}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationContainer} onPress={onNotificationPress || (() => {
            // Default behavior: Navigate back to dashboard and switch to activity log tab
            router.push('/dashboard' as any);
            // Note: We can't directly set the tab state from here, but the dashboard will handle it
          })}>
            <Image source={require('../assets/icons/navigation/notification.png')} style={{ width: 24, height: 24, tintColor: 'white' }} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{notificationCount > 99 ? '99+' : notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile' as any)} style={styles.profileAvatar}>
            {showAvatarImage ? (
              <Image source={require('../assets/images/avatars/pink-alien-with-horns.png')} style={{ width: 45, height: 45, borderRadius: 22.5 }} />
            ) : (
              <View style={[styles.colorAvatar, { backgroundColor: selectedAvatarColor }]} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  fixedHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'System',
    fontWeight: 'bold' as const,
    color: Colors.text.white,
    flex: 1,
    letterSpacing: 0,
  },
  headerRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.md,
  },
  notificationContainer: {
    position: 'relative' as const,
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: -5,
    right: -5,
    backgroundColor: Colors.primary.pink,
    width: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 10,
  },
  notificationText: {
    margin: -4,
    color: Colors.text.white,
    fontSize: 11,
    fontFamily: Typography.families.bodySemiBold,
  },
  profileAvatar: {
    width: 45,
    height: 45,
    backgroundColor: '#9B59B6',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: BorderRadius.circle
  },
  colorAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
};

export default FixedHeader;