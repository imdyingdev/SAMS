/**
 * Supabase-based store for email verification codes
 * Uses Supabase database for persistent storage across serverless functions
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://dieyszynhfhlplalfawk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjY5NzAsImV4cCI6MjA2NzgwMjk3MH0.076y4sLzMGMsf0ppjaIe31RQfStDcWyH6h5MR-5QMoA';

const supabase = createClient(supabaseUrl, supabaseKey);

class VerificationStore {
  constructor() {
    this.tableName = 'email_verifications';
    // Initialize cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Start the cleanup interval
   */
  startCleanupInterval() {
    // Clean up expired codes every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Stop the cleanup interval (useful for testing or shutdown)
   */
  stopCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }

  /**
   * Store verification code with expiration
   * @param {string} email - Email address
   * @param {string} code - Verification code
   * @param {number} expiresInMinutes - Expiration time in minutes (default: 10)
   */
  async set(email, code, expiresInMinutes = 10) {
    try {
      const expiresAt = new Date(Date.now() + (expiresInMinutes * 60 * 1000)).toISOString();

      const { error } = await supabase
        .from(this.tableName)
        .upsert({
          email: email.toLowerCase(),
          code,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (error) {
        console.error('Error storing verification code:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to store verification code:', error);
      throw error;
    }
  }

  /**
   * Get and verify code for email
   * @param {string} email - Email address
   * @param {string} code - Verification code to check
   * @returns {boolean} True if code is valid and not expired
   */
  async verify(email, code) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !data) {
        console.log('No verification code found for email:', email);
        return false;
      }

      // Check if expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);

      if (now > expiresAt) {
        console.log('Verification code expired for email:', email);
        await this.delete(email);
        return false;
      }

      // Check if code matches
      if (data.code !== code) {
        console.log('Verification code mismatch for email:', email);
        return false;
      }

      // Code is valid, remove it (one-time use)
      await this.delete(email);
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }

  /**
   * Delete verification code for email
   * @param {string} email - Email address
   */
  async delete(email) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('email', email.toLowerCase());

      if (error) {
        console.error('Error deleting verification code:', error);
      }
    } catch (error) {
      console.error('Failed to delete verification code:', error);
    }
  }

  /**
   * Clean up expired entries
   */
  async cleanup() {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .lt('expires_at', now);

      if (error) {
        console.error('Error cleaning up expired codes:', error);
      }
    } catch (error) {
      console.error('Failed to cleanup expired codes:', error);
    }
  }

  /**
   * Get remaining time for code (in minutes)
   * @param {string} email - Email address
   * @returns {number|null} Minutes remaining or null if not found
   */
  async getRemainingTime(email) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('expires_at')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !data) {
        return null;
      }

      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      const remaining = Math.ceil((expiresAt - now) / (60 * 1000));

      return remaining > 0 ? remaining : 0;
    } catch (error) {
      console.error('Error getting remaining time:', error);
      return null;
    }
  }
}

// Export a singleton instance
const verificationStore = new VerificationStore();
module.exports = verificationStore;

module.exports = VerificationStore;