import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from './colors';

const { width, height } = Dimensions.get('window');

export const getStartedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryDark,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },

  calendarAnimation: {
    width: 700,
    height: 700,
    marginLeft: 30,
    marginTop: -100
    // backgroundColor: 'orange'
  },

  checklistAnimation: {
    width: 460,
    height: 460,
    marginTop: -100
    // backgroundColor: 'orange'
  },

  mainText: {
    position: 'absolute',
    bottom: 160,
    left: 0,
    right: 0,
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.families.body,
    color: Colors.text.white,
    textAlign: 'center',
    textShadowColor: Colors.shadow.text,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
    opacity: 0.9,
  },

  bottomSection: {
    // backgroundColor: 'orange',
    flex: 0.3,
    justifyContent: 'flex-end',
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
  },

  getStartedButton: {
    backgroundColor: Colors.primary.pink,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing['2xl'],
    // borderRadius: BorderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: Colors.primary.pinkShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.glass.light,
  },

  getStartedButtonText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.families.bodySemiBold,
    color: Colors.text.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Slider Dots
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs + 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  activeDot: {
    backgroundColor: Colors.text.white,
    opacity: 1,
  },

  inactiveDot: {
    backgroundColor: Colors.text.white,
    opacity: 0.3,
  },

  // Skip Button
  skipContainer: {
    position: 'absolute',
    top: Spacing.lg + 30,
    right: Spacing.lg + 10,
    zIndex: 1,
  },

  skipText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.families.body,
    color: Colors.text.white,
    opacity: 0.7,
    letterSpacing: 0.3,
  },
});
