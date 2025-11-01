/**
 * Registration Email Service
 * Uses the server-side email service for registration verification emails
 */

interface SendVerificationResult {
  success: boolean;
  message: string;
  code?: string; // For development/testing
}

interface VerifyCodeResult {
  success: boolean;
  message: string;
}

// Server endpoint
// Use your machine's local IP address instead of localhost for mobile devices
// Update this IP address to match your development machine's IP
const EMAIL_SERVICE_URL = 'http://192.168.1.6:3001/api/email';

/**
 * Send verification email using the server-side email service
 * @param email Email address to send verification code
 * @param userName User's name for personalization (not used in server implementation but kept for API compatibility)
 * @returns Promise<SendVerificationResult>
 */
export const sendVerificationEmail = async (
  email: string,
  userName: string
): Promise<SendVerificationResult> => {
  try {
    console.log(`Sending verification email to ${email} via server`);
    
    // Call server endpoint
    const response = await fetch(`${EMAIL_SERVICE_URL}/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('Verification email sent successfully via server');
      return {
        success: true,
        message: 'Verification code sent to your email'
      };
    } else {
      console.error('Failed to send email via server:', result);
      return {
        success: false,
        message: result.message || 'Failed to send verification email'
      };
    }
    
  } catch (error: any) {
    console.error('Error sending verification email via server:', error);
    return {
      success: false,
      message: 'Unable to connect to email service'
    };
  }
};

/**
 * Verify the code entered by user
 * @param email Email address
 * @param code Verification code entered by user
 * @returns Promise<VerifyCodeResult>
 */
export const verifyCode = async (
  email: string,
  code: string
): Promise<VerifyCodeResult> => {
  try {
    console.log(`Verifying code for ${email} via server`);
    
    // Call server endpoint
    const response = await fetch(`${EMAIL_SERVICE_URL}/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('Code verified successfully via server');
      return {
        success: true,
        message: 'Email verified successfully'
      };
    } else {
      console.error('Failed to verify code via server:', result);
      return {
        success: false,
        message: result.message || 'Invalid verification code'
      };
    }
    
  } catch (error: any) {
    console.error('Error verifying code via server:', error);
    return {
      success: false,
      message: 'Unable to connect to email service'
    };
  }
};

/**
 * Check if there's a pending verification for an email
 * @param email Email address
 * @returns Promise<{hasPendingVerification: boolean, remainingMinutes: number | null}>
 */
export const checkVerificationStatus = async (
  email: string
): Promise<{hasPendingVerification: boolean, remainingMinutes: number | null}> => {
  try {
    const response = await fetch(`${EMAIL_SERVICE_URL}/status?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      return {
        hasPendingVerification: result.hasPendingVerification,
        remainingMinutes: result.remainingMinutes
      };
    } else {
      return {
        hasPendingVerification: false,
        remainingMinutes: null
      };
    }
    
  } catch (error) {
    console.error('Error checking verification status:', error);
    return {
      hasPendingVerification: false,
      remainingMinutes: null
    };
  }
};

/**
 * Resend verification code
 * @param email Email address
 * @param userName User's name
 * @returns Promise<SendVerificationResult>
 */
export const resendVerificationCode = async (
  email: string,
  userName: string
): Promise<SendVerificationResult> => {
  // Simply call sendVerificationEmail again
  return sendVerificationEmail(email, userName);
};
