const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Email Service',
    timestamp: new Date().toISOString()
  });
});

// Return service status
app.get('/', (req, res) => {
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
});

module.exports = app;