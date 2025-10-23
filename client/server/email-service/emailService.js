const { Resend } = require('resend');
require('dotenv').config();

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@sams.com';
    this.fromName = process.env.FROM_NAME || 'SAMS';
  }

  /**
   * Generate a random 5-digit verification code
   * @returns {string} 5-digit verification code
   */
  generateVerificationCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  /**
   * Send verification email with code
   * @param {string} toEmail - Recipient email address
   * @param {string} verificationCode - 5-digit verification code
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendVerificationEmail(toEmail, verificationCode) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [toEmail],
        subject: 'Email Verification Code - SAMS',
        html: this.getVerificationEmailTemplate(verificationCode),
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

  /**
   * Get HTML template for verification email
   * @param {string} verificationCode - 5-digit verification code
   * @returns {string} HTML email template
   */
  getVerificationEmailTemplate(verificationCode) {
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
}

module.exports = EmailService;