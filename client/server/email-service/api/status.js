const verificationCodes = new Map();

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const stored = verificationCodes.get(email.toLowerCase());

    if (!stored) {
      return res.json({
        success: true,
        hasPendingVerification: false,
        remainingMinutes: null
      });
    }

    // Check if code is expired (10 minutes)
    const now = Date.now();
    const expirationTime = 10 * 60 * 1000; // 10 minutes
    const timeElapsed = now - stored.timestamp;
    const remainingTime = Math.max(0, expirationTime - timeElapsed);
    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

    if (remainingTime <= 0) {
      verificationCodes.delete(email.toLowerCase());
      return res.json({
        success: true,
        hasPendingVerification: false,
        remainingMinutes: null
      });
    }

    res.json({
      success: true,
      hasPendingVerification: true,
      remainingMinutes: remainingMinutes
    });

  } catch (error) {
    console.error('Error in status check:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}