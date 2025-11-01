# SAMS Email Service

A Node.js microservice for handling email verification in the Student Attendance Management System (SAMS). Built with Express.js and Resend API for reliable email delivery.

## Features

- **Email Verification**: Send 5-digit verification codes via email
- **Code Validation**: Verify and consume one-time verification codes
- **Automatic Expiry**: Codes expire after 10 minutes for security
- **HTML Templates**: Professional email templates with SAMS branding
- **CORS Support**: Cross-origin requests for mobile app integration
- **Health Monitoring**: Built-in health check endpoint
- **Input Validation**: Comprehensive request validation and error handling

## Prerequisites

- Node.js (v16 or higher)
- Resend account and API key
- SAMS mobile/desktop clients for integration

## Installation

1. Navigate to the email service directory:
   ```bash
   cd SAMS/client/server/email-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Resend API key:
   ```env
   RESEND_API_KEY=your_actual_resend_api_key
   PORT=3001
   ```

## Usage

### Development Mode
```bash
npm run dev
```
Runs with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The service runs on port 3001 by default (configurable via `PORT` environment variable).

## API Endpoints

### POST /api/email/send-verification
Send a verification code to an email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

### POST /api/email/verify-code
Verify a verification code for an email address.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "12345"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### GET /api/email/status
Check if there's a pending verification for an email.

**Query Parameters:**
- `email`: Email address to check

**Response:**
```json
{
  "success": true,
  "hasPendingVerification": true,
  "remainingMinutes": 8
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "service": "Email Service",
  "timestamp": "2025-01-16T15:19:52.146Z"
}
```

## Project Structure

```
src/
├── index.js              # Main server file
├── emailService.js       # Email sending logic
└── verificationStore.js  # In-memory code storage

.env.example             # Environment template
package.json            # Dependencies and scripts
```

## Integration

This service is designed to work with:
- **SAMS Mobile App**: Email verification during registration
- **SAMS Desktop App**: Admin email notifications
- **Other SAMS Services**: Microservice architecture

### Example Integration

```javascript
// Send verification code
const response = await fetch('http://localhost:3001/api/email/send-verification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'student@example.com' })
});

// Verify code
const verifyResponse = await fetch('http://localhost:3001/api/email/verify-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'student@example.com', 
    code: '12345' 
  })
});
```

## Configuration

### Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Generate API key in dashboard
3. Add key to `.env` file
4. Configure sender domain (optional)

### Email Templates

Customize email templates in `emailService.js`:
- HTML styling
- Branding elements
- Message content
- Call-to-action buttons

## Security Considerations

- **Production Storage**: Replace in-memory store with Redis/database
- **Rate Limiting**: Implement request rate limiting
- **Authentication**: Add API key authentication
- **HTTPS**: Use SSL/TLS in production
- **Input Sanitization**: Validate all email inputs
- **Code Entropy**: Ensure sufficient randomness in codes

## Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
Monitor application logs for:
- Email delivery status
- Verification attempts
- Error conditions
- Performance metrics

## Troubleshooting

### Common Issues

1. **Email not received**: Check spam folder, verify Resend configuration
2. **Code expired**: Codes expire after 10 minutes
3. **Invalid code**: Codes are one-time use only
4. **CORS errors**: Ensure proper origin configuration

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
DEBUG=true
```

## License

ISC