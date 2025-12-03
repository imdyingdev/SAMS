/**
 * SAMS Color System - Converted from Desktop CSS Variables
 * Maintains consistency between desktop and mobile applications
 */

import { Platform } from 'react-native';

export const Colors = {
  // Primary Brand Colors
  primary: {
    pink: '#FF0569',
    pinkHover: '#e91e63',
    pinkLight: '#f06292',
    pinkShadow: 'rgba(255, 64, 129, 0.3)',
    pinkTextShadow: 'rgba(255, 64, 129, 0.2)',
  },

  // Secondary Brand Colors
  secondary: {
    orange: '#ff6b35',
    yellow: '#f7931e',
    lightYellow: '#ffd23f',
    pinkAccent: '#FF5E9F',
  },

  // Status Colors
  status: {
    green: '#4CAF50',
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  },

  // Background Colors
  background: {
    primaryDark: '#002D88',
    secondaryDark: 'rgb(6, 11, 78)',
    buttonDark: '#300400',
    light: '#f8f9fa',
    white: '#ffffff',
  },

  // Glass/Transparency Effects
  glass: {
    dark: 'rgba(0, 0, 0, 0.3)',
    light: 'rgba(255, 255, 255, 0.15)',
    overlay1: 'rgba(255, 255, 255, 0.2)',
    overlay2: 'rgba(255, 255, 255, 0.05)',
  },

  // Text Colors
  text: {
    white: '#ffffff',
    whitePrimary: 'rgba(255, 255, 255, 0.9)',
    whiteSecondary: 'rgba(255, 255, 255, 0.8)',
    whiteMuted: 'rgba(255, 255, 255, 0.6)',
    whiteSubtle: 'rgba(255, 255, 255, 0.4)',
    dark: '#1f2937',
    darkSecondary: '#374151',
    muted: '#6b7280',
    placeholder: '#9ca3af',
  },

  // Border Colors
  border: {
    light: 'rgba(255, 255, 255, 0.4)',
    focus: '#FF0569',
    default: '#d1d5db',
    dark: '#404040',
  },

  // Shadow Colors
  shadow: {
    primary: 'rgba(255, 107, 53, 0.3)',
    focus: 'rgba(255, 64, 129, 0.3)',
    text: 'rgba(255, 255, 255, 0.25)',
    default: 'rgba(0, 0, 0, 0.1)',
  },
};

// Gradient Definitions (for libraries like react-native-linear-gradient)
export const Gradients = {
  background: {
    colors: [Colors.background.primaryDark, Colors.background.secondaryDark],
    locations: [0, 0.4],
    type: 'radial',
  },
  logo: {
    colors: [Colors.secondary.orange, Colors.secondary.yellow, Colors.secondary.lightYellow],
    locations: [0, 0.5, 1],
    angle: 45,
  },
  title: {
    colors: [Colors.primary.pink, Colors.primary.pinkHover, Colors.primary.pinkLight],
    locations: [0, 0.5, 1],
    angle: 45,
  },
  button: {
    colors: [Colors.background.buttonDark, Colors.primary.pink],
    locations: [0, 1],
    angle: 45,
  },
};

// Typography
export const Typography = {
  families: {
    // Primary brand font - for logos and headers
    display: 'KronaOne_400Regular',
    // Body text font - for general content
    body: 'Krub_400Regular',
    bodyLight: 'Krub_300Light',
    bodyMedium: 'Krub_500Medium',
    bodySemiBold: 'Krub_600SemiBold',
    bodyBold: 'Krub_700Bold',
    // Alternative font - for special text
    accent: 'DarkerGrotesque_400Regular',
    accentLight: 'DarkerGrotesque_300Light',
    accentMedium: 'DarkerGrotesque_500Medium',
    accentSemiBold: 'DarkerGrotesque_600SemiBold',
    accentBold: 'DarkerGrotesque_700Bold',
    accentExtraBold: 'DarkerGrotesque_800ExtraBold',
    accentBlack: 'DarkerGrotesque_900Black',
    // Fallback system fonts
    system: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  weights: {
    light: '200' as const,
    normal: '300' as const,
    medium: '400' as const,
    semiBold: '500' as const,
    bold: '600' as const,
    extraBold: '700' as const,
    black: '900' as const,
  },
  sizes: {
    ss: 8,
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
};

// Spacing & Sizing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  oblong: 18,
  circle: 999,
};

// Animation Durations (in milliseconds)
export const Animation = {
  fast: 300,
  medium: 800,
  slow: 1200,
};

// Theme Variants
export const Theme = {
  light: {
    background: Colors.background.light,
    surface: Colors.background.white,
    text: Colors.text.dark,
    textSecondary: Colors.text.darkSecondary,
    border: Colors.border.default,
  },
  dark: {
    background: Colors.background.primaryDark,
    surface: Colors.background.secondaryDark,
    text: Colors.text.white,
    textSecondary: Colors.text.whiteSecondary,
    border: Colors.border.light,
  },
};
