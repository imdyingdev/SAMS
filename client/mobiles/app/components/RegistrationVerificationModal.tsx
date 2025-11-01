import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  Animated,
  PanResponder,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/colors';
import { verifyCode, resendVerificationCode } from '../services/regEmailService';
import LottieView from 'lottie-react-native';
import Snackbar from './Snackbar';

interface RegistrationVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  userName: string;
  onVerificationSuccess: () => void;
}

export default function RegistrationVerificationModal({ 
  visible, 
  onClose, 
  email, 
  userName,
  onVerificationSuccess 
}: RegistrationVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInputs, setFocusedInputs] = useState<boolean[]>([false, false, false, false, false]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const codeInputRefs = useRef<TextInput[]>([]);

  const panY = useRef(new Animated.Value(0)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: 300,
    duration: 300,
    useNativeDriver: true,
  });

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      panY.setValue(0);
      setVerificationCode('');
      setIsVerifying(false);
      setIsResending(false);
      setShowSuccess(false);
      setFocusedInputs([false, false, false, false, false]);
      setSnackbarVisible(false);
      setResendTimer(30); // Start with 30 second cooldown
    }
  }, [visible]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 100) {
          return closeAnim.start(() => onClose());
        }
        return resetPositionAnim.start();
      },
    })
  ).current;

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 5) {
      Alert.alert('Invalid Code', 'Please enter the complete 5-digit verification code');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyCode(email, verificationCode);

      if (result.success) {
        setShowSuccess(true);
        // Call success callback after showing animation
        setTimeout(() => {
          onVerificationSuccess();
        }, 2000);
      } else {
        Alert.alert('Verification Failed', result.message);
        setVerificationCode('');
        // Reset focus to first input
        codeInputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) {
      Alert.alert('Please Wait', `You can request a new code in ${resendTimer} seconds`);
      return;
    }

    setIsResending(true);
    try {
      const result = await resendVerificationCode(email, userName);

      if (result.success) {
        setSnackbarMessage('New verification code sent!');
        setSnackbarVisible(true);
        setResendTimer(30); // Reset timer
        setVerificationCode('');
        
        // Show code in console for development
        if (result.code) {
          console.log(`[DEV] New verification code: ${result.code}`);
        }
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error resending code:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
        >
          <View style={styles.modalHandleContainer} {...panResponders.panHandlers}>
            <View style={styles.modalHandle} />
          </View>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {showSuccess ? 'Registration Complete' : 'Verify Your Email'}
            </Text>
            {!showSuccess && (
              <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {showSuccess ? (
              <View style={styles.successContainer}>
                <LottieView
                  source={require('../../assets/animations/Success.json')}
                  autoPlay
                  loop={false}
                  style={styles.successAnimation}
                />
                <Text style={styles.successTitle}>Email Verified!</Text>
                <Text style={styles.successMessage}>
                  Your account has been created successfully. You can now login with your credentials.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.instructionText}>
                  We've sent a 5-digit verification code to:
                </Text>
                <Text style={styles.emailText}>{email}</Text>
                <Text style={styles.instructionText}>
                  Enter the code below to complete your registration.
                </Text>

                <View style={styles.codeContainer}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) codeInputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.codeInput,
                        (focusedInputs[index] || verificationCode[index]) && styles.codeInputActive,
                      ]}
                      value={verificationCode[index] || ''}
                      onChangeText={(value) => {
                        if (value.length <= 1 && /^\d*$/.test(value)) {
                          const newCode = verificationCode.split('');
                          newCode[index] = value;
                          setVerificationCode(newCode.join(''));

                          // Auto-focus next input
                          if (value && index < 4) {
                            codeInputRefs.current[index + 1]?.focus();
                          }
                        }
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
                          codeInputRefs.current[index - 1]?.focus();
                        }
                      }}
                      onFocus={() => {
                        const newFocused = [...focusedInputs];
                        newFocused[index] = true;
                        setFocusedInputs(newFocused);
                      }}
                      onBlur={() => {
                        const newFocused = [...focusedInputs];
                        newFocused[index] = false;
                        setFocusedInputs(newFocused);
                      }}
                      keyboardType="numeric"
                      maxLength={1}
                      selectTextOnFocus
                      editable={!isVerifying}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
                  onPress={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 5}
                >
                  {isVerifying ? (
                    <ActivityIndicator color={Colors.text.white} />
                  ) : (
                    <Text style={styles.verifyButtonText}>Verify Email</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive the code?</Text>
                  <TouchableOpacity
                    onPress={handleResendCode}
                    disabled={isResending || resendTimer > 0}
                    style={styles.resendButton}
                  >
                    <Text style={[
                      styles.resendButtonText,
                      (isResending || resendTimer > 0) && styles.resendButtonTextDisabled
                    ]}>
                      {isResending 
                        ? 'Sending...' 
                        : resendTimer > 0 
                          ? `Resend (${resendTimer}s)` 
                          : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.noteText}>
                  Note: The verification code will expire in 10 minutes.
                </Text>
              </>
            )}
          </ScrollView>

          <Snackbar
            visible={snackbarVisible}
            message={snackbarMessage}
            onDismiss={() => setSnackbarVisible(false)}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    flex: 0.99,  // Changed from minHeight: 500 to flex: 0.99 like AccountModal
  },
  modalHandleContainer: {
    width: 60,
    height: 20,
    alignSelf: 'center' as const,
    marginBottom: Spacing.lg,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border.default,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.dark,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.light,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalCloseText: {
    fontSize: Typography.sizes.xl,
    color: Colors.text.darkSecondary,
  },
  modalBody: {
    paddingTop: Spacing.md,
    flex: 1,
    paddingBottom: Spacing.xl,  // Add padding bottom for better spacing
  },
  instructionText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.dark,
    textAlign: 'center' as const,
    marginBottom: Spacing.sm,
  },
  emailText: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.primary.pink,
    textAlign: 'center' as const,
    marginBottom: Spacing.lg,
  },
  codeContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.md,
    textAlign: 'center' as const,
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.dark,
    backgroundColor: Colors.background.white,
  },
  codeInputActive: {
    borderColor: Colors.primary.pink,
    backgroundColor: '#fdf2f8',
  },
  verifyButton: {
    backgroundColor: Colors.primary.pink,
    borderRadius: BorderRadius.md,
    padding: Spacing.md + 4,
    alignItems: 'center' as const,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  verifyButtonText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  resendContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.lg,
  },
  resendText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.body,
    color: Colors.text.muted,
    marginRight: Spacing.xs,
  },
  resendButton: {
    padding: Spacing.xs,
  },
  resendButtonText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.primary.pink,
  },
  resendButtonTextDisabled: {
    color: Colors.text.muted,
  },
  noteText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.families.body,
    color: Colors.text.muted,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
  successContainer: {
    alignItems: 'center' as const,
    paddingVertical: Spacing.xl * 2,
  },
  successAnimation: {
    width: 150,
    height: 150,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.dark,
    textAlign: 'center' as const,
    marginBottom: Spacing.sm,
  },
  successMessage: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.muted,
    textAlign: 'center' as const,
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
  },
};
