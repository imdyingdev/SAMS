import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { loginStyles } from './styles/login.styles';
import { Colors } from './styles/colors';
import { useFonts } from './hooks/useFonts';
import { authenticateUser, validateLoginInputs } from './services/authService';
import { storeUserSession } from './utils/auth';

interface LoginScreenProps {
  onLogin?: (username: string, password: string) => Promise<boolean>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Keyboard animation values - dual animation: entire screen + form section
  const contentTranslateY = useRef(new Animated.Value(0)).current; // Entire screen movement
  const formTranslateY = useRef(new Animated.Value(0)).current; // Additional form movement
  
  const fontsLoaded = useFonts();

  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      setIsKeyboardVisible(true);
      const duration = event?.duration || 300;
      
      // Animate dual compression - entire screen + additional form movement
      Animated.parallel([
        // Move entire screen up
        Animated.timing(contentTranslateY, {
          toValue: -100, // Move entire content up by 100px
          duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        // Move form section up even more
        Animated.timing(formTranslateY, {
          toValue: -60, // Additional 60px for form (total 160px up)
          duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const keyboardWillHide = (event: any) => {
      setIsKeyboardVisible(false);
      const duration = event?.duration || 300;
      
      // Animate dual expansion back to normal - smooth downward movement
      Animated.parallel([
        // Move entire screen back
        Animated.timing(contentTranslateY, {
          toValue: 0, // Move entire content back to original position
          duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        // Move form section back
        Animated.timing(formTranslateY, {
          toValue: 0, // Move form back to original position
          duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const showListener = Keyboard.addListener(showEvent, keyboardWillShow);
    const hideListener = Keyboard.addListener(hideEvent, keyboardWillHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const handleLogin = async () => {
    // Validate inputs first
    const validation = validateLoginInputs(identifier, password);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Use custom login function if provided, otherwise use database authentication
      let authResult = null;
      
      if (onLogin) {
        const loginSuccess = await onLogin(identifier, password);
        if (loginSuccess) {
          // Create a mock auth result for custom login
          authResult = {
            success: true,
            message: 'Login successful',
            user: {
              id: 'custom-user',
              email: identifier,
              studentId: 'custom',
              firstName: 'Custom',
              lastName: 'User',
              lrn: '000000000000',
              gradeLevel: 'Admin',
              gender: 'Male'
            }
          };
        }
      } else {
        // Use real database authentication
        authResult = await authenticateUser(identifier, password);
      }

      if (authResult && authResult.success && authResult.user) {
        // Store user session
        await storeUserSession(authResult.user);
        
        Alert.alert('Success', `Welcome back, ${authResult.user.firstName}!`, [
          { text: 'OK', onPress: () => router.push('/dashboard' as any) }
        ]);
      } else {
        Alert.alert('Error', authResult?.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <StatusBar style="light" />
      <View style={loginStyles.keyboardView}>
        <ScrollView 
          contentContainerStyle={loginStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isKeyboardVisible} // Disable scroll when keyboard is visible
        >
          <Animated.View style={[
            loginStyles.content,
            { transform: [{ translateY: contentTranslateY }] } // Entire screen animation
          ]}>
            <View style={loginStyles.centerContent}>
              {/* Header Section */}
              <View style={loginStyles.headerSection}>
                <View style={loginStyles.logoContainer}>
                  <Animated.Image 
                    source={require('../assets/images/icon.png')} 
                    style={loginStyles.logoIcon}
                    resizeMode="contain"
                  />
                  <Text style={loginStyles.logoText}>SAMS</Text>
                  <Text style={loginStyles.logoSubtext}>Student Attendance Management System</Text>
                </View>
              </View>
              
              {/* Form Section - Animated */}
              <Animated.View style={[
                loginStyles.formContainer,
                {
                  flex: 1, // Take remaining space
                  justifyContent: 'flex-start', // Keep content at top
                  transform: [{ translateY: formTranslateY }], // Animate only the form
                }
              ]}>
                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'identifier' && loginStyles.inputFocused
                    ]}
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Email or LRN"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedInput('identifier')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
                
                <View style={loginStyles.passwordInputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'password' && loginStyles.inputFocused
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {/* Forgot Password - positioned at bottom right of password input */}
                  <TouchableOpacity style={loginStyles.forgotPasswordButtonRight}>
                    <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[loginStyles.loginButton, isLoading && loginStyles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={loginStyles.loginButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </TouchableOpacity>

                {/* Register link - positioned at bottom left of sign in button */}
                <View style={loginStyles.registerButtonLeft}>
                  <Text style={loginStyles.forgotPasswordText}>
                    Don't have an account?{' '}
                    <Text 
                      style={loginStyles.registerLinkText}
                      onPress={() => router.push('/register' as any)}
                    >
                      Register
                    </Text>
                  </Text>
                </View>
              </Animated.View>
            </View>
            
            {/* Footer Section */}
            <View style={loginStyles.footer}>
              <Text style={loginStyles.footerText}>SAMS Mobile</Text>
              <Text style={loginStyles.footerSubtext}>v1.15.0</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
