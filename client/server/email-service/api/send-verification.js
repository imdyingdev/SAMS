const { Resend } = require('resend');
require('dotenv').config();

// In-memory storage for verification codes (for development)
// In production, this should be stored in a database with expiration
const verificationCodes = new Map();

function generateVerificationCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function getVerificationEmailTemplate(verificationCode) {
  return `
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
        <div class="code">${verificationCode}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this change, please ignore this email.</p>
        <div class="footer">
          <p>SAMS - Student Attendance Management System</p>
        </div>
      </body>
    </html>
  `;
}

async function sendVerificationEmail(toEmail, verificationCode) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@sams-app.com';

    if (!resendApiKey) {
      console.warn('Resend API key not found, skipping email send');
      return {
        success: true,
        message: 'Verification code generated (email service not configured)'
      };
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: `SAMS <${fromEmail}>`,
      to: [toEmail],
      subject: 'Email Verification Code - SAMS',
      html: getVerificationEmailTemplate(verificationCode),
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        message: 'Failed to send verification email'
      };
    }

    console.log('Email sent successfully:', data);
    return {
      success: true,
      message: 'Verification email sent successfully'
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'An error occurred while sending the email'
    };
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const verificationCode = generateVerificationCode();

    // Store code with expiration (10 minutes)
    const timestamp = Date.now();
    verificationCodes.set(email.toLowerCase(), { code: verificationCode, timestamp });

    // Send email
    const result = await sendVerificationEmail(email, verificationCode);

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
}