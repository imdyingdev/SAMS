/**
 * Email Service using Resend API
 * Handles sending verification emails for registration
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

// In-memory storage for verification codes (for development)
// In production, this should be stored in a database with expiration
const verificationCodes = new Map<string, { code: string; timestamp: number }>();

/**
 * Generate a 5-digit verification code
 */
const generateVerificationCode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

/**
 * Send verification email using Resend API
 * @param email Email address to send verification code
 * @param userName User's name for personalization
 * @returns Promise<SendVerificationResult>
 */
export const sendVerificationEmail = async (
  email: string,
  userName: string
): Promise<SendVerificationResult> => {
  try {
    const code = generateVerificationCode();
    const timestamp = Date.now();
    
    // Store code with timestamp (expires in 10 minutes)
    verificationCodes.set(email.toLowerCase(), { code, timestamp });
    
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    
    // Get Resend API key from environment
    const resendApiKey = process.env.EXPO_PUBLIC_RESEND_API_KEY;
    const fromEmail = process.env.EXPO_PUBLIC_RESEND_FROM_EMAIL || 'noreply@sams-app.com';
    
    if (!resendApiKey) {
      console.warn('Resend API key not found, skipping email send');
      return {
        success: true,
        message: 'Verification code generated (email service not configured)',
        code // Return code for development
      };
    }
    
    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: 'Verify your SAMS account',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
                h1 { margin-bottom: 20px; }
                .code { font-size: 32px; font-weight: bold; color: #FF69B4; letter-spacing: 4px; margin: 20px 0; }
                .footer { margin-top: 30px; font-size: 14px; color: #666; }
              </style>
            </head>
            <body>
              <h1>Email Verification</h1>
              <p>Please use the following verification code to complete your registration:</p>
              <div class="code">${code}</div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this change, please ignore this email.</p>
              <div class="footer">
                <p>SAMS - Student Attendance Management System</p>
              </div>
            </body>
          </html>
        `,
      }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Verification email sent successfully:', result);
      return {
        success: true,
        message: 'Verification code sent to your email',
        code // Include code for development/testing
      };
    } else {
      console.error('Failed to send email via Resend:', result);
      // Even if email fails, we still have the code for verification
      return {
        success: true,
        message: 'Verification code generated (email delivery may be delayed)',
        code
      };
    }
    
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    // Don't block registration if email service fails
    return {
      success: true,
      message: 'Verification code generated (email service unavailable)',
      code: verificationCodes.get(email.toLowerCase())?.code
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
    const stored = verificationCodes.get(email.toLowerCase());
    
    if (!stored) {
      return {
        success: false,
        message: 'Verification code not found or expired'
      };
    }
    
    // Check if code is expired (10 minutes)
    const now = Date.now();
    const expirationTime = 10 * 60 * 1000; // 10 minutes
    
    if (now - stored.timestamp > expirationTime) {
      verificationCodes.delete(email.toLowerCase());
      return {
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      };
    }
    
    // Verify code
    if (stored.code === code.trim()) {
      // Remove code after successful verification
      verificationCodes.delete(email.toLowerCase());
      return {
        success: true,
        message: 'Email verified successfully'
      };
    } else {
      return {
        success: false,
        message: 'Invalid verification code. Please try again.'
      };
    }
    
  } catch (error: any) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.'
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
  // Check if there's a recent code (prevent spam)
  const stored = verificationCodes.get(email.toLowerCase());
  if (stored) {
    const now = Date.now();
    const timeSinceLastCode = now - stored.timestamp;
    
    // Require at least 30 seconds between resends
    if (timeSinceLastCode < 30000) {
      const remainingSeconds = Math.ceil((30000 - timeSinceLastCode) / 1000);
      return {
        success: false,
        message: `Please wait ${remainingSeconds} seconds before requesting a new code`
      };
    }
  }
  
  // Generate and send new code
  return sendVerificationEmail(email, userName);
};
