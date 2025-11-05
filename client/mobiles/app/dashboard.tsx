import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles } from './styles/login.styles';
import { useFonts } from './hooks/useFonts';
import { getUserSession, clearUserSession, getUserFullName, User } from './utils/auth';
import { Colors, Typography, Spacing, BorderRadius} from './styles/colors';
import CalendarScreen from './components/CalendarScreen';
import FloatingActionButton from './components/FloatingActionButton';
import ActivityList from './components/ActivityList';
import FixedHeader from './components/FixedHeader';
import SettingsView from './components/SettingsView';

interface CalendarEvent {
  date: string; // Format: 'YYYY-MM-DD'
  title: string;
  color?: string;
}

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [fabSelectedTab, setFabSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [lastViewedActivityCount, setLastViewedActivityCount] = useState(0);
  const [totalActivityCount, setTotalActivityCount] = useState(0);

  const fontsLoaded = useFonts();


  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserSession();
      console.log('Dashboard loaded user data:', userData);
      if (userData) {
        setUser(userData);
      } else {
        // No user session, redirect to login
        router.push('/login' as any);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
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

  const handleHomePress = () => {
    setSelectedTab(0);
    setFabSelectedTab(0);
    setShowSettings(false);
    setSelectedDate(null); // Reset date filter when returning to home
    // Don't reset notification count when going to home - keep unread count
  };

  // Function to update notification count based on activity data
  const updateNotificationCount = (activityCount: number) => {
    setTotalActivityCount(activityCount);

    // Only show notifications when in dashboard view (not activity log view)
    if (selectedTab === 0) {
      // Calculate unread count: current activities minus last viewed activities
      const unreadCount = Math.max(0, activityCount - lastViewedActivityCount);
      setUnreadNotificationCount(unreadCount);
    }
  };

  const handleListPress = () => {
    setSelectedTab(1);
    setFabSelectedTab(1);
    setShowSettings(false);
    setSelectedDate(null); // Reset date filter when going to Activity Log
    // Mark current activities as viewed - store the current count
    setLastViewedActivityCount(unreadNotificationCount);
    setUnreadNotificationCount(0); // Clear notification count when viewing activity log
  };

  const handleSettingsPress = () => {
    setShowSettings(!showSettings);
    setFabSelectedTab(showSettings ? 0 : 2);
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear cached data and force fresh login',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearUserSession();
            console.log('Cache cleared, redirecting to login');
            router.replace('/login' as any);
          }
        }
      ]
    );
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={loginStyles.container}>
        <View style={[loginStyles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={loginStyles.logoText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Fixed Header */}
      <FixedHeader
        title={showSettings ? 'Settings' : selectedTab === 0 ? 'Dashboard' : 'Activity Log'}
        onNotificationPress={handleListPress}
        notificationCount={unreadNotificationCount}
      />

      {showSettings ? (
        <SettingsView />
      ) : (
        <>
          {/* Calendar - shown only on home tab */}
          {selectedTab === 0 && (
            <View style={{width: '100%', alignSelf: 'center', paddingHorizontal: Spacing.lg}}>
              <CalendarScreen 
                onDateSelect={(date) => setSelectedDate(date)}
                selectedDate={selectedDate || undefined}
              />
            </View>
          )}

          {/* Fixed Activity Title - only for home tab */}
          {selectedTab === 0 && (
            <View style={[styles.activityHeader, {paddingHorizontal: Spacing.lg}]}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
            </View>
          )}

          {/* Scrollable Activity List */}
          <ActivityList
            key={selectedTab === 1 ? 'activity' : 'home'}
            refreshing={refreshing}
            onRefresh={onRefresh}
            loading={false}
            studentRfid={user?.rfid} // Pass user's RFID for filtering
            selectedDate={selectedTab === 0 ? selectedDate : null} // Only filter by date on home tab
            showAllRecords={selectedTab === 1} // Show all records on Activity Log tab
            onActivityCountChange={updateNotificationCount} // Pass callback to update notification count
          />
        </>
      )}

      {/* Bottom Fade Overlay */}
      <View style={styles.bottomFade}>
        <LinearGradient
          colors={['transparent', Colors.background.primaryDark, Colors.background.primaryDark]}
          style={styles.fadeGradient}
        />
      </View>

      {/* Floating Action Button */}
      <FloatingActionButton
        selectedTab={fabSelectedTab}
        onHomePress={handleHomePress}
        onListPress={handleListPress}
        onSettingsPress={handleSettingsPress}
      />
    </SafeAreaView>
  );
}

// Simple dashboard styles using SAMS color palette
const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xs
  },
  logoutBtn: {
    backgroundColor: Colors.status.error,
    padding: Spacing.lg,
    alignItems: 'center' as const,
    marginTop: Spacing.lg,
  },
  logoutBtnText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  activityScroll: {
    flex: 1,
  },
  activityContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  bottomFade: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  fadeGradient: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingBottom: 10
  },
  activityTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: 'System',
    fontWeight: 'bold' as const,
    color: Colors.text.white,
    letterSpacing: 0,
  },
};
