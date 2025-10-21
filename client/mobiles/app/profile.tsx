import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { loginStyles } from './styles/login.styles';
import { useFonts } from './hooks/useFonts';
import { getUserSession, getUserDisplayName, getUserCompleteName, User, storeUserSession } from './utils/auth';
import AccountModal from './components/AccountModal';
import { Colors, Typography, Spacing, BorderRadius } from './styles/colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  const translateY1 = useRef(new Animated.Value(20)).current;
  const translateY2 = useRef(new Animated.Value(20)).current;
  const translateY3 = useRef(new Animated.Value(20)).current;
  const translateY4 = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const fontsLoaded = useFonts();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserSession();
      console.log('Profile loaded user data:', userData);
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
      // Start animation after loading
      Animated.parallel([
        Animated.timing(translateY1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY3, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY4, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleEditEmail = () => {
    setAccountModalVisible(true);
  };

  const handleEmailUpdated = async (newEmail: string) => {
    if (user) {
      // Update local user data
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      await storeUserSession(updatedUser);
    }
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <Image
              source={require('../assets/images/avatars/pink-alien-with-horns.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIcon}>
              <FontAwesome name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{getUserDisplayName(user)}</Text>
        </View>

        {/* Line Separator */}
        <View style={styles.separator} />

        {/* Student Information */}
        {/* Full Name */}
        <Animated.View style={[styles.formGroup, { opacity, transform: [{ translateY: translateY1 }] }]}>
          <View style={styles.formInput}>
            <Text style={styles.formLabel}>Full name</Text>
            <Text style={styles.inputText}>{getUserCompleteName(user)}</Text>
          </View>
        </Animated.View>

        {/* Gender & Grade Level Row */}
        <Animated.View style={[styles.formRow, { opacity, transform: [{ translateY: translateY2 }] }]}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 6 }]}>
            <View style={styles.formInput}>
              <Text style={styles.formLabel}>Gender</Text>
              <Text style={styles.inputText}>{user.gender}</Text>
            </View>
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 6 }]}>
            <View style={styles.formInput}>
              <Text style={styles.formLabel}>Grade Level</Text>
              <Text style={styles.inputText}>{user.gradeLevel.replace('Grade ', '').replace('K', 'Kindergarten')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* LRN */}
        <Animated.View style={[styles.formGroup, { opacity, transform: [{ translateY: translateY3 }] }]}>
          <View style={styles.formInput}>
            <Text style={styles.formLabel}>LRN</Text>
            <Text style={styles.inputText}>{user.lrn}</Text>
          </View>
        </Animated.View>

        {/* Email */}
        <Animated.View style={[styles.formGroup, { opacity, transform: [{ translateY: translateY4 }] }]}>
          <View style={styles.formInput}>
            <View style={styles.inputRow}>
              <View style={styles.inputContent}>
                <Text style={styles.formLabel}>Email</Text>
                <Text style={styles.inputText}>{user.email}</Text>
              </View>
              <TouchableOpacity onPress={handleEditEmail}>
                <Image source={require('../assets/icons/general/edit.png')} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <AccountModal
        visible={accountModalVisible}
        onClose={() => setAccountModalVisible(false)}
        userId={user?.id}
        currentEmail={user?.email}
        onEmailUpdated={handleEmailUpdated}
        initialMode="changeEmail"
      />
    </SafeAreaView>
  );
}

// Profile screen styles using SAMS color palette
const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing['2xl'],
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backBtnText: {
    fontSize: Typography.sizes.xl,
    color: Colors.text.white,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.white,
  },
  headerSpacer: {
    width: 40,
  },
  profileSection: {
    alignItems: 'center' as const,
    marginBottom: Spacing.xs,
  },
  profileImageWrapper: {
    position: 'relative' as const,
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.border.light,
  },
  cameraIcon: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: Colors.primary.pink,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  profileName: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.white,
    marginBottom: 5,
    textShadowColor: Colors.shadow.text,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xl,
    opacity: 0.8,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  formLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.families.body,
    color: Colors.text.whiteMuted,
    marginBottom: 4,
    textTransform: 'capitalize' as const,
  },
  formInput: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.glass.overlay1,
  },
  inputText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.white,
  },
  formRow: {
    flexDirection: 'row' as const,
    gap: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  inputContent: {
    flex: 1,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.text.white,
    marginLeft: Spacing.sm,
  },
};
