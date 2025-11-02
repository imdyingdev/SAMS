const verificationCodes = new Map();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Verify code
    const stored = verificationCodes.get(email.toLowerCase());

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'Verification code not found or expired'
      });
    }

    // Check if code is expired (10 minutes)
    const now = Date.now();
    const expirationTime = 10 * 60 * 1000; // 10 minutes

    if (now - stored.timestamp > expirationTime) {
      verificationCodes.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }

    // Verify code
    if (stored.code === code.trim()) {
      // Remove code after successful verification
      verificationCodes.delete(email.toLowerCase());
      return res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error in verify-code:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}