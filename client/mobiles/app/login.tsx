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
  Modal,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { loginStyles } from '../styles/login.styles';
import { Colors } from '../styles/colors';
import { useFonts } from '../hooks/useFonts';
import { authenticateUser, validateLoginInputs } from '../services/authService';
import { supabase } from '../services/supabase';
import { storeUserSession } from '../utils/auth';

interface LoginScreenProps {
  onLogin?: (username: string, password: string) => Promise<boolean>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'code' | 'password'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const modalPanY = useRef(new Animated.Value(0)).current;
  
  // Keyboard animation values - dual animation: entire screen + form section
  const contentTranslateY = useRef(new Animated.Value(0)).current; // Entire screen movement
  const formTranslateY = useRef(new Animated.Value(0)).current; // Additional form movement
  
  const fontsLoaded = useFonts();

  useEffect(() => {
    let interval: any;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

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

  const modalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: modalPanY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 100) {
          Animated.timing(modalPanY, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowForgotPasswordModal(false);
            setForgotPasswordStep('email');
            setForgotPasswordEmail('');
            setVerificationCode('');
            setNewPassword('');
            setConfirmPassword('');
            setResendCooldown(0);
          });
        } else {
          Animated.timing(modalPanY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSendForgotPasswordCode = async () => {
    if (!forgotPasswordEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await fetch('https://sams-email-apiv2.vercel.app/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setForgotPasswordStep('code');
        setResendCooldown(60); // Set 60 second cooldown
        Alert.alert('Success', 'Verification code sent to your email');
      } else {
        Alert.alert('Error', result.message || 'Failed to send code');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert(
        'Email Service Unavailable', 
        'The email service is currently not accessible. Please ensure:\n\n1. The email server is running\n2. The device is connected to the same network\n3. The server IP address is correct (192.168.1.6:3001)\n\nFor now, proceeding to next step for testing.'
      );
      // For testing purposes, allow proceeding to next step
      setForgotPasswordStep('code');
      setResendCooldown(60); // Set 60 second cooldown even on error for testing
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyForgotPasswordCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsVerifyingCode(true);
    try {
      const response = await fetch('https://sams-email-apiv2.vercel.app/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail, code: verificationCode }),
      });

      const result = await response.json();

      if (result.success) {
        setForgotPasswordStep('password');
      } else {
        Alert.alert('Error', result.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert(
        'Email Service Unavailable',
        'Cannot verify code - email service not accessible.\n\nFor testing, proceeding to password reset.'
      );
      // For testing purposes, allow proceeding to password step
      setForgotPasswordStep('password');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', forgotPasswordEmail)
        .single();

      if (userError || !user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Update password
      const newPasswordHash = btoa(newPassword);
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('email', forgotPasswordEmail);

      if (updateError) {
        console.error('Error updating password:', updateError);
        Alert.alert('Error', 'Failed to reset password. Please try again.');
        return;
      }

      Alert.alert('Success', 'Password reset successfully! You can now login with your new password.', [
        {
          text: 'OK',
          onPress: () => {
            setShowForgotPasswordModal(false);
            setForgotPasswordStep('email');
            setForgotPasswordEmail('');
            setVerificationCode('');
            setNewPassword('');
            setConfirmPassword('');
            setResendCooldown(0);
          }
        }
      ]);
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

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
                  <TouchableOpacity 
                    style={loginStyles.forgotPasswordButtonRight}
                    onPress={() => setShowForgotPasswordModal(true)}
                  >
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

      {/* Forgot Password Bottom Sheet Modal */}
      <Modal
        visible={showForgotPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowForgotPasswordModal(false);
          setForgotPasswordStep('email');
          setForgotPasswordEmail('');
          setVerificationCode('');
          setNewPassword('');
          setConfirmPassword('');
          setResendCooldown(0);
        }}
      >
        <View style={loginStyles.bottomSheetOverlay}>
          <Animated.View
            style={[
              loginStyles.bottomSheetContent,
              { transform: [{ translateY: modalPanY }] }
            ]}
          >
            <View style={loginStyles.bottomSheetHandle} {...modalPanResponder.panHandlers}>
              <View style={loginStyles.handleBar} />
            </View>

            <View style={loginStyles.bottomSheetHeader}>
              <Text style={loginStyles.bottomSheetTitle}>Forgot Password</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowForgotPasswordModal(false);
                  setForgotPasswordStep('email');
                  setForgotPasswordEmail('');
                  setVerificationCode('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setResendCooldown(0);
                }}
              >
                <Text style={loginStyles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={loginStyles.bottomSheetBody} showsVerticalScrollIndicator={false}>
              {forgotPasswordStep === 'email' && (
                <View>
                  <Text style={loginStyles.modalLabel}>Email Address</Text>
                  <TextInput
                    style={loginStyles.modalInput}
                    value={forgotPasswordEmail}
                    onChangeText={setForgotPasswordEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={[loginStyles.modalButton, isSendingCode && loginStyles.modalButtonDisabled]}
                    onPress={handleSendForgotPasswordCode}
                    disabled={isSendingCode}
                  >
                    <Text style={loginStyles.modalButtonText}>
                      {isSendingCode ? 'Sending...' : 'Send Code'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {forgotPasswordStep === 'code' && (
                <View>
                  <Text style={loginStyles.modalLabel}>Verification Code</Text>
                  <Text style={loginStyles.modalSubtext}>
                    We've sent a code to {forgotPasswordEmail}
                  </Text>
                  <TextInput
                    style={loginStyles.modalInput}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="Enter code"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <TouchableOpacity
                    style={[loginStyles.resendButton, resendCooldown > 0 && loginStyles.modalButtonDisabled]}
                    onPress={handleSendForgotPasswordCode}
                    disabled={resendCooldown > 0}
                  >
                    <Text style={loginStyles.resendButtonText}>
                      {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[loginStyles.modalButton, isVerifyingCode && loginStyles.modalButtonDisabled]}
                    onPress={handleVerifyForgotPasswordCode}
                    disabled={isVerifyingCode}
                  >
                    <Text style={loginStyles.modalButtonText}>
                      {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {forgotPasswordStep === 'password' && (
                <View>
                  <Text style={loginStyles.modalLabel}>New Password</Text>
                  <TextInput
                    style={loginStyles.modalInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  <Text style={loginStyles.modalLabel}>Confirm Password</Text>
                  <TextInput
                    style={loginStyles.modalInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={loginStyles.modalButton}
                    onPress={handleResetPassword}
                  >
                    <Text style={loginStyles.modalButtonText}>Reset Password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
