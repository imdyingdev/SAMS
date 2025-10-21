/**
 * Authentication utilities for SAMS Mobile App
 * Now uses real database authentication like the desktop app
 */

import { authenticateUser, User } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Re-export User interface from authService for consistency
export { User } from '../services/authService';

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Validates login credentials using database authentication
 * @param credentials - Username and password
 * @returns Promise<User | null> - User object if valid, null if invalid
 */
export const validateLogin = async (credentials: LoginCredentials): Promise<User | null> => {
  const { username, password } = credentials;
  
  try {
    // Use the database authentication service
    const authResult = await authenticateUser(username, password);
    
    if (authResult.success && authResult.user) {
      return authResult.user;
    }
    
    return null;
  } catch (error) {
    console.error('Login validation error:', error);
    return null;
  }
};

/**
 * Stores user session data using AsyncStorage
 * @param user - User object to store
 */
export const storeUserSession = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem('userSession', JSON.stringify(user));
    console.log('User session stored:', user.email);
  } catch (error) {
    console.error('Error storing user session:', error);
  }
};

/**
 * Retrieves stored user session from AsyncStorage
 * @returns Promise<User | null> - Stored user or null if not found
 */
export const getUserSession = async (): Promise<User | null> => {
  try {
    const userSession = await AsyncStorage.getItem('userSession');
    if (userSession) {
      return JSON.parse(userSession) as User;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user session:', error);
    return null;
  }
};

/**
 * Clears user session (logout) from AsyncStorage
 */
export const clearUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userSession');
    console.log('User session cleared');
  } catch (error) {
    console.error('Error clearing user session:', error);
  }
};

/**
 * Validates input fields
 * @param username - Username string
 * @param password - Password string
 * @returns Object with validation results
 */
export const validateInputs = (username: string, password: string) => {
  const errors: string[] = [];
  
  if (!username.trim()) {
    errors.push('Username is required');
  }
  
  if (!password.trim()) {
    errors.push('Password is required');
  }
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  if (password.length < 4) {
    errors.push('Password must be at least 4 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Checks if user is a student (all mobile users are students)
 * @param user - User object
 * @returns boolean - Always true for mobile app users
 */
export const isStudent = (user: User): boolean => {
  return true; // All mobile app users are students
};

/**
 * Gets user's display name (first part of first name and surname only)
 * @param user - User object
 * @returns string - First part of first name and last name
 */
export const getUserDisplayName = (user: User): string => {
  const firstNamePart = user.firstName.split(' ')[0];
  return `${firstNamePart} ${user.lastName}`;
};

/**
 * Gets user's complete full name (first, middle, last)
 * @param user - User object
 * @returns string - Complete full name
 */
export const getUserCompleteName = (user: User): string => {
  const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean);
  return parts.join(' ');
};

/**
 * Gets user's full name (first name and surname only)
 * @param user - User object
 * @returns string - Full name
 */
export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};
