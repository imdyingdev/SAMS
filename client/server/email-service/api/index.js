export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests for the root endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts GET requests'
    });
  }

  // Return service status
  res.status(200).json({
    service: 'SAMS Email Service',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      'POST /api/email/send-verification': 'Send verification code to email',
      'POST /api/email/verify-code': 'Verify email verification code',
      'GET /api/email/status': 'Check verification status'
    },
    timestamp: new Date().toISOString()
  });
}