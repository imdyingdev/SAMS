const express = require('express');
const cors = require('cors');
const EmailService = require('./emailService');
const VerificationStore = require('./verificationStore');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const emailService = new EmailService();
const verificationStore = require('./verificationStore');

// Routes

/**
 * POST /api/email/send-verification
 * Send verification code to email
 */
app.post('/api/email/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate verification code
    const verificationCode = emailService.generateVerificationCode();

    // Store code with expiration (10 minutes)
    verificationStore.set(email, verificationCode, 10);

    // Send email
    const result = await emailService.sendVerificationEmail(email, verificationCode);

    if (result.success) {
      res.json({
        success: true,
        message: 'Verification code sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error in send-verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/email/verify-code
 * Verify the email verification code
 */
app.post('/api/email/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }

    // Verify code
    const isValid = verificationStore.verify(email, code);

    if (isValid) {
      res.json({
        success: true,
        message: 'Email verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
  } catch (error) {
    console.error('Error in verify-code:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/email/status
 * Check verification status for an email
 */
app.get('/api/email/status', (req, res) => {
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
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Email Service',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;