const VerificationStore = require('../verificationStore');

const verificationStore = new VerificationStore();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const remainingTime = verificationStore.getRemainingTime(email);

    res.json({
      success: true,
      hasPendingVerification: remainingTime !== null,
      remainingMinutes: remainingTime
    });
  } catch (error) {
    console.error('Error in status check:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}