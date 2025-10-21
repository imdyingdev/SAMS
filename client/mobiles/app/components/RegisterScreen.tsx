import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  Animated,
  Modal,
  FlatList,
  Dimensions,
  Keyboard,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { loginStyles } from '../styles/login.styles';
import { useFonts } from '../hooks/useFonts';
import { createUserAccount, validateRegistrationInputs } from '../services/authService';

// Suffix options for dropdown
const SUFFIX_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Jr.', value: 'Jr.' },
  { label: 'Sr.', value: 'Sr.' },
  { label: 'II', value: 'II' },
  { label: 'III', value: 'III' },
  { label: 'IV', value: 'IV' },
  { label: 'V', value: 'V' },
];

export default function RegisterScreen() {
  // Store screen width as constant to avoid recalculation
  const screenWidth = Dimensions.get('window').width;
  
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showSuffixModal, setShowSuffixModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = Student Info, 2 = Account Info
  const [slideAnim] = useState(new Animated.Value(0)); // Animation value
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Keyboard animation values - simple position compression using transform
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  
  const fontsLoaded = useFonts();

  // Keyboard event listeners
  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      setKeyboardVisible(true);
      const duration = event?.duration || 300;
      
      // Animate content compression - smooth upward movement
      Animated.timing(contentTranslateY, {
        toValue: -80, // Move content up by 80px
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Same smooth easing as HTML test
        useNativeDriver: true, // transform can use native driver!
      }).start();
    };

    const keyboardWillHide = (event: any) => {
      setKeyboardVisible(false);
      const duration = event?.duration || 300;
      
      // Animate content expansion back to normal - smooth downward movement
      Animated.timing(contentTranslateY, {
        toValue: 0, // Move content back to original position
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Same smooth easing as HTML test
        useNativeDriver: true, // transform can use native driver!
      }).start();
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
    return null;
  }

  const handleSuffixSelect = (selectedSuffix: string) => {
    setSuffix(selectedSuffix);
    setShowSuffixModal(false);
  };

  const getSuffixDisplayText = () => {
    if (!suffix) return 'Select Suffix (Optional)';
    const option = SUFFIX_OPTIONS.find(opt => opt.value === suffix);
    return option ? option.label : suffix;
  };

  const validateStudentInfo = () => {
    const errors: string[] = [];
    
    if (!firstName.trim()) {
      errors.push('First name is required');
    }
    
    if (!lastName.trim()) {
      errors.push('Last name is required');
    }
    
    if (firstName.length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    
    if (lastName.length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    
    // Name format validation (letters, spaces, hyphens, apostrophes only)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (firstName && !nameRegex.test(firstName)) {
      errors.push('First name contains invalid characters');
    }
    
    if (middleName && middleName.trim() && !nameRegex.test(middleName)) {
      errors.push('Middle name contains invalid characters');
    }
    
    if (lastName && !nameRegex.test(lastName)) {
      errors.push('Last name contains invalid characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleNextStep = () => {
    const validation = validateStudentInfo();
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    // Animate slide using the same logic as test.html: translateX(-100%)
    setCurrentStep(2);
    Animated.timing(slideAnim, {
      toValue: -screenWidth, // Move by full screen width to the left
      duration: 500, // Same as CSS transition: 0.5s ease-in-out
      easing: Easing.bezier(0.4, 0, 0.2, 1), // CSS cubic-bezier equivalent
      useNativeDriver: true,
    }).start();
  };

  const handleBackStep = () => {
    // Animate slide back using the same logic as test.html: translateX(0%)
    setCurrentStep(1);
    Animated.timing(slideAnim, {
      toValue: 0, // Back to original position
      duration: 500, // Same as CSS transition: 0.5s ease-in-out
      easing: Easing.bezier(0.4, 0, 0.2, 1), // CSS cubic-bezier equivalent
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = async () => {
    // Validate inputs first
    const validation = validateRegistrationInputs(firstName, middleName, lastName, suffix, email, password, confirmPassword);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Create user account with student validation
      const result = await createUserAccount(firstName, middleName, lastName, suffix, email, password);
      
      if (result.success) {
        Alert.alert('Success', 'Account created successfully! You can now login.', [
          { text: 'OK', onPress: () => router.push('/login' as any) }
        ]);
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <StatusBar style="light" />
      <View style={loginStyles.keyboardView}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!keyboardVisible} // Disable scroll when keyboard is visible
        >
          <Animated.View style={{ 
            flex: 1, 
            width: '100%',
            margin: 0,
            padding: 0,
            transform: [{ translateY: contentTranslateY }], // Animated transform for smooth compression
          }}>

            {/* Back Arrow */}
            <View style={{
              position: 'absolute',
              top: 20,
              left: 24,
              zIndex: 10,
            }}>
              <TouchableOpacity 
                onPress={() => router.push('/login' as any)}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 20,
                }}
              >
                <Text style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>←</Text>
              </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 20,
              paddingHorizontal: 24,
              width: '100%',
              marginTop: 80,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: currentStep >= 1 ? '#2563eb' : '#e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: currentStep >= 1 ? '#fff' : '#9ca3af',
                    fontWeight: 'bold',
                  }}>1</Text>
                </View>
                <View style={{
                  width: 40,
                  height: 2,
                  backgroundColor: currentStep >= 2 ? '#2563eb' : '#e5e7eb',
                  marginHorizontal: 8,
                }} />
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: currentStep >= 2 ? '#2563eb' : '#e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: currentStep >= 2 ? '#fff' : '#9ca3af',
                    fontWeight: 'bold',
                  }}>2</Text>
                </View>
              </View>
            </View>

            {/* Form Container with Overflow Hidden - Animated */}
            <Animated.View style={{
              overflow: 'hidden',
              width: '100%',
              flex: 1, // Keep flex constant, let header compress instead
              position: 'relative',
            }}>
              <Animated.View style={{
                flexDirection: 'row',
                width: screenWidth * 2, // Total width for both steps
                height: '100%',
                transform: [{ translateX: slideAnim }],
              }}>
                {/* Step 1: Student Information */}
                <View style={{ 
                  width: screenWidth, // Exact screen width
                  backgroundColor: 'transparent', // Red background to see alignment
                  minHeight: '100%', // Full height
                  justifyContent: 'flex-start', // Keep content at top when compressed
                  paddingHorizontal: 24, // Horizontal padding for inputs
                  paddingVertical: 40, // Vertical padding
                  paddingTop: keyboardVisible ? 20 : 40, // Reduce top padding when keyboard shows
                }}>
                <Text style={[loginStyles.logoSubtext, { marginBottom: 16, textAlign: 'left' }]}>
                  Student Information (for validation)
                </Text>
                
                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'firstName' && loginStyles.inputFocused
                    ]}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    onFocus={() => setFocusedInput('firstName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'middleName' && loginStyles.inputFocused
                    ]}
                    value={middleName}
                    onChangeText={setMiddleName}
                    placeholder="Middle Name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    onFocus={() => setFocusedInput('middleName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'lastName' && loginStyles.inputFocused
                    ]}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    onFocus={() => setFocusedInput('lastName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View style={loginStyles.inputContainer}>
                  <TouchableOpacity
                    style={[
                      loginStyles.input,
                      { justifyContent: 'center' },
                      focusedInput === 'suffix' && loginStyles.inputFocused
                    ]}
                    onPress={() => {
                      setShowSuffixModal(true);
                      setFocusedInput('suffix');
                    }}
                  >
                    <Text style={[
                      { fontSize: 16 },
                      suffix ? { color: '#fff' } : { color: '#999' }
                    ]}>
                      {getSuffixDisplayText()}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Next Button with Arrow */}
                <TouchableOpacity 
                  style={[loginStyles.loginButton, { marginTop: 24 }]}
                  onPress={handleNextStep}
                >
                  <Text style={loginStyles.loginButtonText}>Next →</Text>
                </TouchableOpacity>
              </View>

                {/* Step 2: Account Information */}
                <View style={{ 
                  width: screenWidth, // Exact screen width
                  backgroundColor: 'transparent', // Light blue background to see alignment
                  minHeight: '100%', // Full height
                  justifyContent: 'flex-start', // Keep content at top when compressed
                  paddingHorizontal: 24, // Horizontal padding for inputs
                  paddingVertical: 40, // Vertical padding
                  paddingTop: keyboardVisible ? 20 : 40, // Reduce top padding when keyboard shows
                }}>
                <Text style={[loginStyles.logoSubtext, { marginBottom: 16, textAlign: 'left' }]}>
                  Account Information
                </Text>

                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'email' && loginStyles.inputFocused
                    ]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email Address *"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'password' && loginStyles.inputFocused
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password *"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View style={loginStyles.inputContainer}>
                  <TextInput
                    style={[
                      loginStyles.input,
                      focusedInput === 'confirmPassword' && loginStyles.inputFocused
                    ]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password *"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
                  <TouchableOpacity 
                    style={[
                      loginStyles.loginButton, 
                      { flex: 1, backgroundColor: '#6b7280' }
                    ]}
                    onPress={handleBackStep}
                  >
                    <Text style={loginStyles.loginButtonText}>← Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      loginStyles.loginButton, 
                      { flex: 2 },
                      isLoading && loginStyles.loginButtonDisabled
                    ]}
                    onPress={handleRegister}
                    disabled={isLoading}
                  >
                    <Text style={loginStyles.loginButtonText}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[loginStyles.forgotPasswordButton, { marginTop: 16 }]}
                  onPress={() => router.push('/login' as any)}
                >
                  <Text style={loginStyles.forgotPasswordText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
                </View>
              </Animated.View>
            </Animated.View>

            {/* Footer */}
            <View style={loginStyles.footer}>
              <Text style={loginStyles.footerText}>SAMS Mobile Registration</Text>
              <Text style={loginStyles.footerSubtext}>v1.15.0</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Suffix Selection Modal */}
      <Modal
        visible={showSuffixModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuffixModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '80%',
            maxHeight: '60%',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Select Suffix
            </Text>
            
            <FlatList
              data={SUFFIX_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    backgroundColor: suffix === item.value ? '#e3f2fd' : 'transparent',
                  }}
                  onPress={() => handleSuffixSelect(item.value)}
                >
                  <Text style={{
                    fontSize: 16,
                    color: suffix === item.value ? '#1976d2' : '#000',
                    fontWeight: suffix === item.value ? 'bold' : 'normal',
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowSuffixModal(false)}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
