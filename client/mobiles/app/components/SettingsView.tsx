import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/colors';
import { clearUserSession, getUserSession, getUserCompleteName, storeUserSession, User } from '../utils/auth';
import AccountModal from './AccountModal';

export default function SettingsView() {
  const [user, setUser] = useState<User | null>(null);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);

  const handleEmailUpdated = async (newEmail: string) => {
    if (user) {
      // Update local user data
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      await storeUserSession(updatedUser);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserSession();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearUserSession();
            console.log('Session cleared, redirecting to login');
            router.push('/login' as any);
          }
        }
      ]
    );
  };


  return (
    <View style={styles.content}>
      <View style={styles.profileSection}>
        <LinearGradient
          colors={[Colors.primary.pink, Colors.secondary.orange]}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'U'}
          </Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          {user ? (
            <>
              <Text style={styles.name}>{getUserCompleteName(user)}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </>
          ) : (
            <>
              {/* Skeleton for name */}
              <View style={styles.nameSkeleton} />
              {/* Skeleton for email */}
              <View style={styles.emailSkeleton} />
            </>
          )}
        </View>
      </View>

      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem}>
          <Image source={require('../../assets/icons/navigation/notification.png')} style={styles.iconImage} />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setIsAccountModalVisible(true)}>
          <Image source={require('../../assets/icons/settings/user.png')} style={styles.iconImage} />
          <Text style={styles.menuText}>Privacy & Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Image source={require('../../assets/icons/settings/question.png')} style={styles.iconImage} />
          <Text style={styles.menuText}>Help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.menuList}>
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutTextBold]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <AccountModal
        visible={isAccountModalVisible}
        onClose={() => setIsAccountModalVisible(false)}
        userId={user?.id}
        currentEmail={user?.email}
        onEmailUpdated={handleEmailUpdated}
        initialMode="menu"
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryDark,
  },
  content: {
    flex: 1,
    padding: Spacing.lg
  },
  profileSection: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: Spacing.md,
    backgroundColor: Colors.glass.overlay2,
    borderWidth: 1,
    borderColor: Colors.glass.overlay1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold' as const,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.whiteMuted,
  },
  nameSkeleton: {
    width: '70%' as const,
    height: Typography.sizes.base,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  emailSkeleton: {
    width: '85%' as const,
    height: Typography.sizes.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
  menuList: {
    marginBottom: Spacing.xs - 10,
    gap: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  icon: {
    fontSize: Typography.sizes.lg,
    marginRight: Spacing.md,
  },
  menuText: {
    fontSize: Typography.sizes.base,
    fontFamily: 'System',
    color: Colors.text.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xl,
  },
  logout: {
    color: Colors.status.error,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: Spacing.md + 4,
    tintColor: Colors.text.white,
  },
  flippedIcon: {
    transform: [{ scaleX: -1 }],
  },
  logoutButton: {
    backgroundColor: '#F75270',
    borderRadius: BorderRadius.md,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  logoutTextBold: {
    fontWeight: 'bold' as const,
  },
};