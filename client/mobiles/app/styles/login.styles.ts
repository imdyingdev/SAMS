import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Animation } from './colors';

const { height } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'flex-start', // Remove space-between to eliminate gap
    paddingBottom: 0, // Remove bottom padding that might cause gap
  },
  centerContent: {
    flex: 10, // Takes 10fr out of 11fr total (4fr A + 6fr B, leaving 1fr for footer)
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0, // Remove vertical padding that might create gaps
  },
  // Animated container for smooth keyboard transitions
  animatedContainer: {
    flex: 1,
  },
  headerSection: {
    flex: 5, // A section - logo/SAMS/subtext takes 4fr
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  // Animated header section for keyboard transitions
  headerSectionAnimated: {
    alignItems: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  // Animated logo container for smooth scaling
  logoContainerAnimated: {
    alignItems: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  logoIcon: {
    width: 100,
    height: 100,
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.families.display,
    color: Colors.primary.pink,
    letterSpacing: 2,
    textShadowColor: Colors.primary.pinkTextShadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoSubtext: {
    fontSize: Typography.sizes.ss,
    fontFamily: Typography.families.display,
    color: Colors.text.whiteSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 6, // B section - form takes 6fr
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center', // Pull content up instead of centering
    paddingTop: 0, // Increased padding to pull content down a bit more
    marginBottom: 0,
    paddingBottom: 50, // Ensure no bottom padding
  },
  // Animated form container for smooth transitions
  formContainerAnimated: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 0,
    overflow: 'hidden',
  },
  welcomeText: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.families.accentBold,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textShadowColor: Colors.shadow.text,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.whiteSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  inputContainer: {
    marginBottom: Spacing.md,
    position: 'relative',
  },
  passwordInputContainer: {
    marginBottom: Spacing['2xl'], // Extra spacing for password input to show forgot password link
    position: 'relative',
  },
  inputLabel: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodyBold,
    color: Colors.text.white,
    marginBottom: Spacing.sm,
    textShadowColor: Colors.shadow.text,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.white,
  },
  inputFocused: {
    borderColor: Colors.primary.pink,
    borderWidth: 1,
  },
  // Animated input for smooth focus transitions
  inputAnimated: {
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.body,
    color: Colors.text.white,
  },
  logoGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonContainer: {
    shadowColor: Colors.primary.pinkShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButton: {
    backgroundColor: Colors.primary.pink,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: Colors.primary.pinkShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.text.placeholder,
    shadowOpacity: 0.1,
    borderColor: Colors.border.default,
  },
  loginButtonText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.families.accentBold,
    textShadowColor: Colors.shadow.text,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  forgotPasswordButton: {
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
  },
  forgotPasswordButtonRight: {
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
    position: 'absolute',
    right: 0,
    bottom: -30, // Increased spacing from password input
  },
  registerButtonLeft: {
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
  },
  forgotPasswordText: {
    color: Colors.text.white,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.body,
  },
  registerLinkText: {
    color: Colors.primary.pink, // Same pink color as SAMS text
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.body,
  },
  footer: {
    flex: 1, // C section - footer takes 1fr
    alignItems: 'center',
    justifyContent: 'center', // Center instead of flex-end
    paddingBottom: 0, // Remove padding that creates gap
  },
  // Animated footer for keyboard transitions
  footerAnimated: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.body,
    color: Colors.text.whiteSecondary,
  },
  footerSubtext: {
    fontSize: 10,
    fontFamily: Typography.families.bodyLight,
    color: Colors.text.whiteMuted,
  },
});

// Animation configurations for keyboard interactions
export const keyboardAnimationConfig = {
  // Timing configuration for smooth transitions
  timing: {
    duration: Animation.fast, // 300ms
    useNativeDriver: true,
  },
  
  // Spring configuration for natural feel
  spring: {
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },
  
  // Layout animation configuration
  layout: {
    duration: Animation.fast,
    update: {
      type: 'spring',
      springDamping: 0.7,
    },
    delete: {
      type: 'spring',
      springDamping: 0.7,
    },
  },
  
  // Keyboard show/hide animation values
  keyboardShow: {
    logoScale: 0.7,        // Scale logo to 70% when keyboard shows
    headerOpacity: 0.8,    // Fade header slightly
    footerOpacity: 0.6,    // Fade footer more
    contentPadding: 8,     // Reduce content padding
  },
  
  keyboardHide: {
    logoScale: 1,          // Return logo to full size
    headerOpacity: 1,      // Full header opacity
    footerOpacity: 1,      // Full footer opacity
    contentPadding: 16,    // Restore content padding
  },
};
