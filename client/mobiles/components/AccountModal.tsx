import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, PanResponder, Animated, TextInput, Alert } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/colors';
import { changePassword } from '../services/authService';
import { supabase } from '../services/supabase';
import Snackbar from './Snackbar';
import LottieView from 'lottie-react-native';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  userId?: string;
  currentEmail?: string;
  onEmailUpdated?: (newEmail: string) => void;
  initialMode?: 'menu' | 'changeEmail';
}

export default function AccountModal({ visible, onClose, userId, currentEmail, onEmailUpdated, initialMode = 'menu' }: AccountModalProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [passwordVerificationCode, setPasswordVerificationCode] = useState('');
  const [successEmail, setSuccessEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordFocused, setCurrentPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [newEmailFocused, setNewEmailFocused] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const codeInputRefs = useRef<TextInput[]>([]);
  const [focusedInputs, setFocusedInputs] = useState<boolean[]>([false, false, false, false, false]);

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

  useEffect(() => {
    if (visible) {
      panY.setValue(0);
      setShowChangePassword(false);
      setShowChangeEmail(initialMode === 'changeEmail');
      setShowEmailSuccess(false);
      setSuccessEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNewEmail('');
      setCurrentPasswordFocused(false);
      setNewPasswordFocused(false);
      setConfirmPasswordFocused(false);
      setNewEmailFocused(false);
      setSnackbarVisible(false);
      setVerificationCode('');
      setShowVerification(false);
      setIsSendingCode(false);
      setIsVerifyingCode(false);
      setFocusedInputs([false, false, false, false, false]);
    }
  }, [visible, currentEmail, initialMode]);

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

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleChangeEmail = () => {
    setShowChangeEmail(true);
  };

  const handleActiveSessions = () => {
    setShowActiveSessions(true);
  };

  const handleSendVerificationCode = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    if (!newEmail.trim()) {
      Alert.alert('Error', 'Please enter a new email address');
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if new email is the same as current email
    if (newEmail.toLowerCase() === currentEmail?.toLowerCase()) {
      Alert.alert('Error', 'New email address cannot be the same as your current email');
      return;
    }

    setIsSendingCode(true);
    try {
      // First validate current password by checking against stored hash
      const { data: userAuth, error: authError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (authError || !userAuth) {
        Alert.alert('Error', 'User not found. Please try logging in again.');
        setIsSendingCode(false);
        return;
      }

      const currentHash = btoa(currentPassword);
      if (userAuth.password_hash !== currentHash) {
        Alert.alert('Error', 'Current password is incorrect');
        setIsSendingCode(false);
        return;
      }


      // Send verification code to new email
      const response = await fetch('https://sams-email-apiv2.vercel.app/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setShowVerification(true);
        setSnackbarMessage('Code sent to your new email');
        setSnackbarVisible(true);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyAndUpdateEmail = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsVerifyingCode(true);
    try {
      // First verify the code
      const verifyResponse = await fetch('https://sams-email-apiv2.vercel.app/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail, code: verificationCode }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success) {
        Alert.alert('Error', verifyResult.message);
        return;
      }

      // If verification successful, update email in database
      const { updateEmail } = await import('../services/authService');
      const updateResult = await updateEmail(userId, newEmail, currentPassword);

      if (updateResult.success) {
        setShowVerification(false);
        setShowEmailSuccess(true);
        setSuccessEmail(newEmail);
        setVerificationCode('');
        setCurrentPassword('');
        setNewEmail('');
        // onEmailUpdated will be called when user clicks "Go to Profile"
      } else {
        Alert.alert('Error', updateResult.message);
      }
    } catch (error) {
      console.error('Error verifying code and updating email:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSavePassword = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Please confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    try {
      const result = await changePassword(userId, currentPassword, newPassword);

      if (result.success) {
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPasswordFocused(false);
        setNewPasswordFocused(false);
        setConfirmPasswordFocused(false);
        setSnackbarMessage('Password changed successfully');
        setSnackbarVisible(true);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
              {showChangePassword ? 'Change Password' : showEmailSuccess ? 'Change Email' : showChangeEmail ? 'Change Email' : showActiveSessions ? 'Active Sessions' : 'Privacy & Security'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={
                showChangePassword ? () => setShowChangePassword(false) :
                showEmailSuccess ? () => setShowEmailSuccess(false) :
                showChangeEmail && initialMode === 'menu' ? () => setShowChangeEmail(false) :
                showActiveSessions ? () => setShowActiveSessions(false) :
                onClose
              }
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            {showChangePassword ? (
              <View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    onFocus={() => setCurrentPasswordFocused(true)}
                    onBlur={() => setCurrentPasswordFocused(false)}
                    placeholder=""
                  />
                  <Text style={[styles.floatingLabel, (currentPasswordFocused || currentPassword) ? styles.floatingLabelActive : null]}>
                    Current Password
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    onFocus={() => setNewPasswordFocused(true)}
                    onBlur={() => setNewPasswordFocused(false)}
                    placeholder=""
                  />
                  <Text style={[styles.floatingLabel, (newPasswordFocused || newPassword) ? styles.floatingLabelActive : null]}>
                    New Password
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    placeholder=""
                  />
                  <Text style={[styles.floatingLabel, (confirmPasswordFocused || confirmPassword) ? styles.floatingLabelActive : null]}>
                    Confirm New Password
                  </Text>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : showEmailSuccess ? (
              <View style={styles.successContainer}>
                <LottieView
                  source={require('../assets/animations/Success.json')}
                  autoPlay
                  loop={false}
                  style={styles.successAnimation}
                />
                <Text style={styles.successTitle}>Email updated successfully!</Text>
                <Text style={styles.successMessage}>Your new email has been verified.</Text>
                <TouchableOpacity style={styles.goToProfileButton} onPress={() => {
                  onEmailUpdated?.(successEmail);
                  setShowEmailSuccess(false);
                  setShowChangeEmail(false);
                  onClose();
                }}>
                  <Text style={styles.goToProfileButtonText}>Go to Profile</Text>
                </TouchableOpacity>
              </View>
            ) : showChangeEmail ? (
              <View>
                {!showVerification ? (
                  <>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={newEmail}
                        onChangeText={setNewEmail}
                        onFocus={() => setNewEmailFocused(true)}
                        onBlur={() => setNewEmailFocused(false)}
                        placeholder=""
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Text style={[styles.floatingLabel, (newEmailFocused || newEmail) ? styles.floatingLabelActive : null]}>
                        New Email Address
                      </Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        onFocus={() => setCurrentPasswordFocused(true)}
                        onBlur={() => setCurrentPasswordFocused(false)}
                        placeholder=""
                      />
                      <Text style={[styles.floatingLabel, (currentPasswordFocused || currentPassword) ? styles.floatingLabelActive : null]}>
                        Current Password
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.saveButton, isSendingCode && styles.saveButtonDisabled]}
                      onPress={handleSendVerificationCode}
                      disabled={isSendingCode}
                    >
                      <Text style={styles.saveButtonText}>
                        {isSendingCode ? 'Sending...' : 'Send Verification Code'}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.instructionText}>
                      We've sent a 5-digit verification code to:
                    </Text>
                    <Text style={styles.emailText}>{newEmail}</Text>
                    <Text style={styles.instructionText}>
                      Enter the code below to confirm your email change.
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
                        />
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[styles.saveButton, isVerifyingCode && styles.saveButtonDisabled]}
                      onPress={handleVerifyAndUpdateEmail}
                      disabled={isVerifyingCode}
                    >
                      <Text style={styles.saveButtonText}>
                        {isVerifyingCode ? 'Verifying...' : 'Verify & Update Email'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : showActiveSessions ? (
              <View>
                <Text style={styles.instructionText}>Devices where you're currently logged in</Text>
                <View style={styles.sessionItem}>
                  <View style={styles.sessionLeft}>
                    <Image source={require('../assets/icons/modal/session.png')} style={styles.sessionIcon} />
                    <View>
                      <Text style={styles.sessionDevice}>Mobile Device</Text>
                      <Text style={styles.sessionTime}>
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.sessionCurrent}>Current</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.accountOption} onPress={handleChangePassword}>
                  <View style={styles.accountOptionLeft}>
                    <Image source={require('../assets/icons/modal/padlock.png')} style={styles.accountOptionIcon} />
                    <View>
                      <Text style={styles.accountOptionText}>Change Password</Text>
                      <Text style={styles.accountOptionSubtext}>Update your account password</Text>
                    </View>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity style={styles.accountOption} onPress={handleActiveSessions}>
                  <View style={styles.accountOptionLeft}>
                    <Image source={require('../assets/icons/modal/session.png')} style={styles.accountOptionIcon} />
                    <View>
                      <Text style={styles.accountOptionText}>Active Sessions</Text>
                      <Text style={styles.accountOptionSubtext}>Manage your active sessions</Text>
                    </View>
                  </View>
                  <Text style={styles.accountOptionCount}>1</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

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
    flex: 0.99,
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
  },
  accountOption: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.light,
  },
  accountOptionLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  accountOptionIcon: {
    width: 20,
    height: 20,
    marginRight: Spacing.md + 4,
    tintColor: Colors.primary.pink,
  },
  accountOptionText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.dark,
  },
  accountOptionSubtext: {
    fontSize: Typography.sizes.sm - 1,
    fontFamily: Typography.families.body,
    color: Colors.text.muted,
  },
  accountOptionCount: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.primary.pink,
    fontWeight: '500' as const,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
    position: 'relative' as const,
  },
  inputLabel: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.dark,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.text.dark,
    backgroundColor: Colors.background.white,
  },
  saveButton: {
    backgroundColor: Colors.primary.pink,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center' as const,
    marginTop: Spacing.lg,
  },
  saveButtonText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  floatingLabel: {
    position: 'absolute' as const,
    left: Spacing.md,
    top: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.text.muted,
    backgroundColor: Colors.background.white,
    paddingHorizontal: Spacing.xs,
    transition: 'all 0.3s ease',
  },
  floatingLabelActive: {
    top: -10,
    fontSize: Typography.sizes.sm,
    color: Colors.primary.pink,
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
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.md,
    textAlign: 'center' as const,
    textAlignVertical: 'center' as const,
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.dark,
    backgroundColor: Colors.background.white,
  },
  codeInputActive: {
    borderColor: Colors.primary.pink,
  },
  successContainer: {
    alignItems: 'center' as const,
    paddingVertical: Spacing.xl,
  },
  successAnimation: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.sizes.xl,
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
    marginBottom: Spacing.md,
  },
  goToProfileButton: {
    backgroundColor: Colors.primary.pink,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
  },
  goToProfileButtonText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
  },
  sessionItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.light,
  },
  sessionLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  sessionIcon: {
    width: 24,
    height: 24,
    marginRight: Spacing.md,
    tintColor: Colors.primary.pink,
  },
  sessionDevice: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.dark,
  },
  sessionTime: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.body,
    color: Colors.text.muted,
    marginTop: Spacing.xs - 4,
  },
  sessionCurrent: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.primary.pink,
  },
};