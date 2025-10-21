/**
 * Authentication service for SAMS Mobile App
 * Uses Supabase client for database operations
 */

import { supabase, Student, User as DbUser } from './supabase';

export interface User {
  id: string;
  email: string;
  studentId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  lrn: string;
  gradeLevel: string;
  gender: string;
  rfid?: string; // Add RFID field
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

export interface LoginCredentials {
  identifier: string; // Can be email, LRN, or student ID
  password: string;
}

/**
 * Authenticate user using student_users view (correct approach)
 * @param identifier Email, LRN, or student ID
 * @param password Password
 * @returns Promise<AuthResult> Authentication result
 */
export const authenticateUser = async (identifier: string, password: string): Promise<AuthResult> => {
  try {
    console.log(`Authenticating student user: ${identifier}`);
    
    // Step 1: Determine identifier type and build appropriate query
    let query = supabase
      .from('student_users')
      .select('*')
      .eq('is_active', true)
      .limit(1);
    
    // Check if identifier is an email (contains @ symbol)
    if (identifier.includes('@')) {
      query = query.eq('email', identifier);
    }
    // Check if identifier is numeric (LRN or student ID)
    else if (/^\d+$/.test(identifier)) {
      // For numeric identifiers, search both LRN and student_id
      query = query.or(`lrn.eq.${identifier},student_id.eq.${identifier}`);
    }
    // If it's neither email nor numeric, treat as student_id (string)
    else {
      query = query.eq('student_id', identifier);
    }
    
    const { data: users, error: userError } = await query;
    
    if (userError) {
      console.error('Error searching for user:', userError);
      return {
        success: false,
        message: 'Error during login. Please try again.'
      };
    }
    
    console.log('Query result:', { users, userError, queryType: identifier.includes('@') ? 'email' : 'other' });
    
    if (!users || users.length === 0) {
      console.log('No users found for identifier:', identifier);
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    const userData = users[0];
    console.log('Found user data:', { 
      email: userData.email, 
      user_id: userData.user_id,
      hasPasswordHash: !!userData.password_hash,
      passwordHashLength: userData.password_hash?.length 
    });
    
    // Step 2: Get password hash from users table (since view doesn't include it)
    const { data: userAuth, error: authError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userData.user_id)
      .single();
    
    if (authError || !userAuth) {
      console.error('Error getting user auth:', authError);
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    // Step 3: Verify password (simple base64 comparison for now)
    const expectedHash = btoa(password);
    console.log('Password verification:', { 
      expectedHash, 
      storedHash: userAuth.password_hash,
      match: userAuth.password_hash === expectedHash 
    });
    
    if (userAuth.password_hash !== expectedHash) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    // Step 4: Update last login timestamp
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userData.user_id);
    
    // Step 5: Return user data from student_users view
    const userResult = {
      id: userData.user_id.toString(),
      email: userData.email,
      studentId: userData.student_id.toString(),
      firstName: userData.first_name,
      middleName: userData.middle_name,
      lastName: userData.last_name,
      lrn: userData.lrn?.toString(),
      gradeLevel: userData.grade_level,
      gender: userData.gender,
      rfid: userData.rfid?.toString() // Include RFID from student_users view
    };
    
    console.log('Returning user data:', userResult);
    
    return {
      success: true,
      message: 'Login successful',
      user: userResult
    };
    
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
    };
  }
};

/**
 * Create new user account (development version)
 * @param firstName Student's first name
 * @param middleName Student's middle name (optional)
 * @param lastName Student's last name
 * @param suffix Student's suffix (optional)
 * @param email Email for the account
 * @param password Plain text password
 * @returns Promise<AuthResult> Creation result
 */
export const createUserAccount = async (
  firstName: string, 
  middleName: string, 
  lastName: string, 
  suffix: string, 
  email: string, 
  password: string
): Promise<AuthResult> => {
  try {
    console.log('Creating account for:', firstName, lastName, email);
    
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      return {
        success: false,
        message: 'All required fields must be filled'
      };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }
    
    // Step 1: Find student by name using Supabase (simplified search)
    console.log('Searching for student:', { firstName, lastName, middleName, suffix });
    
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    console.log('Supabase config:', { 
      url: supabaseUrl, 
      hasKey: !!supabaseKey,
      keyLength: supabaseKey?.length 
    });
    
    // Test basic connection first
    const { data: testData, error: testError } = await supabase
      .from('students')
      .select('count')
      .limit(1);
    
    console.log('Basic connection test:', { testData, testError });
    
    // Try to get any students at all
    const { data: anyStudents, error: anyError } = await supabase
      .from('students')
      .select('id, first_name, last_name, middle_name, suffix')
      .limit(5);
    
    console.log('Any students query:', { anyStudents, anyError });
    
    // First, let's see what students exist with similar names
    const { data: allStudents, error: allError } = await supabase
      .from('students')
      .select('id, first_name, last_name, middle_name, suffix')
      .or(`first_name.ilike.%${firstName.trim()}%,last_name.ilike.%${lastName.trim()}%`)
      .limit(20);
    
    console.log('All students query error:', allError);
    console.log('All students with similar names:', allStudents);
    
    // Use EXACT match only for registration validation
    const { data: students, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('first_name', firstName.trim())
      .eq('last_name', lastName.trim())
      .limit(10);
    
    if (studentError) {
      console.error('Error searching for student:', studentError);
      return {
        success: false,
        message: 'Error searching for student. Please try again.'
      };
    }
    
    if (!students || students.length === 0) {
      console.log('No students found with first/last name match');
      return {
        success: false,
        message: 'No student found with the provided name information. Please check your spelling and try again.'
      };
    }
    
    console.log('Found students:', students.map((s: any) => ({
      id: s.id,
      first_name: s.first_name,
      last_name: s.last_name,
      middle_name: s.middle_name,
      suffix: s.suffix
    })));
    
    // Step 1.5: Filter students by middle name and suffix with EXACT matching
    let matchedStudent = null;
    
    for (const student of students) {
      const studentMiddleName = (student.middle_name || '').trim();
      const studentSuffix = (student.suffix || '').trim();
      const inputMiddleName = (middleName || '').trim();
      const inputSuffix = (suffix || '').trim();
      
      // EXACT match required for middle name
      const middleNameMatches = 
        (!inputMiddleName && !studentMiddleName) || // Both empty
        (inputMiddleName && studentMiddleName === inputMiddleName); // Exact match (case sensitive)
      
      // EXACT match required for suffix  
      const suffixMatches = 
        (!inputSuffix && !studentSuffix) || // Both empty
        (inputSuffix && studentSuffix === inputSuffix); // Exact match (case sensitive)
      
      console.log('Checking student:', {
        studentName: `${student.first_name} ${student.middle_name || ''} ${student.last_name} ${student.suffix || ''}`.trim(),
        inputName: `${firstName} ${middleName || ''} ${lastName} ${suffix || ''}`.trim(),
        middleNameMatch: middleNameMatches,
        suffixMatch: suffixMatches
      });
      
      if (middleNameMatches && suffixMatches) {
        matchedStudent = student;
        break;
      }
    }
    
    if (!matchedStudent) {
      console.log('No exact match found for middle name/suffix');
      return {
        success: false,
        message: `Found students with name ${firstName} ${lastName}, but middle name or suffix doesn't match exactly. Please check your spelling.`
      };
    }
    
    console.log('Matched student:', matchedStudent);
    const student = matchedStudent as Student;
    
    // Step 2: Check if user already exists
    const { data: existingUsers, error: existingError } = await supabase
      .from('users')
      .select('id')
      .or(`student_id.eq.${student.id},email.eq.${email}`);
    
    if (existingError) {
      console.error('Error checking existing users:', existingError);
      return {
        success: false,
        message: 'Error checking existing accounts. Please try again.'
      };
    }
    
    if (existingUsers && existingUsers.length > 0) {
      return {
        success: false,
        message: 'An account already exists for this student or email address.'
      };
    }
    
    // Step 3: Create password hash (simple base64 for now)
    const passwordHash = btoa(password);
    
    // Step 4: Create user account
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          student_id: student.id,
          email: email,
          password_hash: passwordHash
        }
      ])
      .select();
    
    if (createError) {
      console.error('Error creating user account:', createError);
      return {
        success: false,
        message: 'Failed to create user account. Please try again.'
      };
    }
    
    return {
      success: true,
      message: `Account created successfully for ${student.first_name} ${student.last_name} (${student.grade_level}). You can now login with your email and password.`
    };
    
  } catch (error: any) {
    console.error('Error creating user account:', error.message);
    return {
      success: false,
      message: 'Failed to create user account. Please try again.'
    };
  }
};

/**
 * Validate login input fields
 * @param identifier Email, LRN, or student ID
 * @param password Password string
 * @returns Object with validation results
 */
export const validateLoginInputs = (identifier: string, password: string) => {
  const errors: string[] = [];
  
  if (!identifier.trim()) {
    errors.push('Email, LRN, or Student ID is required');
  }
  
  if (!password.trim()) {
    errors.push('Password is required');
  }
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Change user password
 * @param userId User ID
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns Promise<AuthResult> Change password result
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> => {
  try {
    console.log(`Changing password for user: ${userId}`);

    // Step 1: Get current password hash
    const { data: userAuth, error: authError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (authError || !userAuth) {
      console.error('Error getting user auth:', authError);
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Step 2: Verify current password
    const currentHash = btoa(currentPassword);
    if (userAuth.password_hash !== currentHash) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Step 3: Validate new password
    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters'
      };
    }

    // Step 4: Hash new password and update
    const newPasswordHash = btoa(newPassword);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return {
        success: false,
        message: 'Failed to update password. Please try again.'
      };
    }

    return {
      success: true,
      message: 'Password changed successfully'
    };

  } catch (error: any) {
    console.error('Change password error:', error.message);
    return {
      success: false,
      message: 'An error occurred while changing password. Please try again.'
    };
  }
};

/**
 * Update user email
 * @param userId User ID
 * @param newEmail New email address
 * @param password Current password for verification
 * @returns Promise<AuthResult> Update email result
 */
export const updateEmail = async (
  userId: string,
  newEmail: string,
  password: string
): Promise<AuthResult> => {
  try {
    console.log(`Updating email for user: ${userId} to ${newEmail}`);

    // Step 1: Validate new email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }

    // Step 2: Get current password hash for verification
    const { data: userAuth, error: authError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (authError || !userAuth) {
      console.error('Error getting user auth:', authError);
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Step 3: Verify current password
    const currentHash = btoa(password);
    if (userAuth.password_hash !== currentHash) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Step 4: Check if new email is already in use
    const { data: existingUsers, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', newEmail)
      .neq('id', userId);

    if (existingError) {
      console.error('Error checking existing emails:', existingError);
      return {
        success: false,
        message: 'Error checking email availability. Please try again.'
      };
    }

    if (existingUsers && existingUsers.length > 0) {
      return {
        success: false,
        message: 'This email address is already in use by another account.'
      };
    }

    // Step 5: Update email
    const { error: updateError } = await supabase
      .from('users')
      .update({ email: newEmail })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating email:', updateError);
      return {
        success: false,
        message: 'Failed to update email. Please try again.'
      };
    }

    return {
      success: true,
      message: 'Email updated successfully'
    };

  } catch (error: any) {
    console.error('Update email error:', error.message);
    return {
      success: false,
      message: 'An error occurred while updating email. Please try again.'
    };
  }
};

/**
 * Validate user registration input fields
 * @param firstName First name
 * @param middleName Middle name (optional)
 * @param lastName Last name
 * @param suffix Suffix (optional)
 * @param email Email address
 * @param password Password string
 * @param confirmPassword Confirm password string
 * @returns Object with validation results
 */
export const validateRegistrationInputs = (
  firstName: string,
  middleName: string,
  lastName: string,
  suffix: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const errors: string[] = [];

  // Required fields
  if (!firstName.trim()) {
    errors.push('First name is required');
  }

  if (!lastName.trim()) {
    errors.push('Last name is required');
  }

  if (!email.trim()) {
    errors.push('Email is required');
  }

  if (!password.trim()) {
    errors.push('Password is required');
  }

  if (!confirmPassword.trim()) {
    errors.push('Confirm password is required');
  }

  // Name validation
  if (firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  if (lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
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

  if (suffix && suffix.trim() && !nameRegex.test(suffix)) {
    errors.push('Suffix contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
