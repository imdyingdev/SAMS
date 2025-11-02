/**
 * Simple in-memory store for email verification codes
 * In production, this should be replaced with Redis or a database
 */
class VerificationStore {
  constructor() {
    this.store = new Map();
<<<<<<< HEAD
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
=======
>>>>>>> origin/main
  }

  /**
   * Store verification code with expiration
   * @param {string} email - Email address
   * @param {string} code - Verification code
   * @param {number} expiresInMinutes - Expiration time in minutes (default: 10)
   */
  set(email, code, expiresInMinutes = 10) {
    const expiresAt = Date.now() + (expiresInMinutes * 60 * 1000);
    this.store.set(email.toLowerCase(), {
      code,
      expiresAt
    });
  }

  /**
   * Get and verify code for email
   * @param {string} email - Email address
   * @param {string} code - Verification code to check
   * @returns {boolean} True if code is valid and not expired
   */
  verify(email, code) {
    const entry = this.store.get(email.toLowerCase());

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(email.toLowerCase());
      return false;
    }

    // Check if code matches
    if (entry.code !== code) {
      return false;
    }

    // Code is valid, remove it (one-time use)
    this.store.delete(email.toLowerCase());
    return true;
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [email, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(email);
      }
    }
  }

  /**
   * Get remaining time for code (in minutes)
   * @param {string} email - Email address
   * @returns {number|null} Minutes remaining or null if not found
   */
  getRemainingTime(email) {
    const entry = this.store.get(email.toLowerCase());

    if (!entry) {
      return null;
    }

    const remaining = Math.ceil((entry.expiresAt - Date.now()) / (60 * 1000));
    return remaining > 0 ? remaining : 0;
  }
}

<<<<<<< HEAD
// Export a singleton instance
const verificationStore = new VerificationStore();
module.exports = verificationStore;
=======
// Clean up expired codes every 5 minutes
setInterval(() => {
  const store = new VerificationStore();
  store.cleanup();
}, 5 * 60 * 1000);
>>>>>>> origin/main

module.exports = VerificationStore;