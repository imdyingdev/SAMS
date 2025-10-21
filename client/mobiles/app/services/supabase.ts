/**
 * Supabase client configuration for SAMS Mobile App
 */

import { createClient } from '@supabase/supabase-js';

// Extract Supabase URL and key from environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable auth for now since we're using custom authentication
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Database types (based on your schema)
export interface Student {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  lrn: string;
  grade_level: string;
  rfid?: string;
  gender: string;
  created_at: string;
}

export interface User {
  id: number;
  student_id: number;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface StudentUser {
  user_id: number;
  email: string;
  is_active: boolean;
  user_created_at: string;
  last_login?: string;
  student_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  lrn: string;
  grade_level: string;
  rfid?: string;
  gender: string;
  student_created_at: string;
}
