# Email Service for SAMS

A serverless email verification service for the Student Attendance Management System (SAMS) deployed on Vercel.

## Features

- **Email Verification**: Send verification codes via email using Resend API
- **Code Verification**: Verify submitted verification codes
- **Status Checking**: Check verification status and remaining time
- **Serverless**: Deployed as Vercel serverless functions
- **CORS Support**: Configured for cross-origin requests

## API Endpoints

### POST `/api/send-verification`
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

### POST `/api/verify-code`
Verify a verification code.

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

### GET `/api/status`
Check verification status for an email.

**Query Parameters:**
- `email`: The email address to check

**Response:**
```json
{
  "success": true,
  "hasPendingVerification": true,
  "remainingMinutes": 8
}
```

## Setup

1. **Clone and navigate to the directory:**
   ```bash
   cd client/server/email-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Resend API key:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   FROM_EMAIL=noreply@sams-app.com
   ```

## Deployment to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: Your sender email address

## Local Development

```bash
# Install dependencies
npm install

# Run locally with Vercel dev
npx vercel dev
```

The service will be available at `http://localhost:3000`

## Testing

Test the endpoints using curl or a REST client:

```bash
# Send verification code
curl -X POST http://localhost:3000/api/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify code
curl -X POST http://localhost:3000/api/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"12345"}'

# Check status
curl "http://localhost:3000/api/status?email=test@example.com"
```

## Integration with Mobile App

Update your mobile app's email service to use these endpoints:

```typescript
const EMAIL_SERVICE_URL = 'https://your-vercel-app.vercel.app';

// Send verification
const response = await fetch(`${EMAIL_SERVICE_URL}/api/send-verification`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});

// Verify code
const response = await fetch(`${EMAIL_SERVICE_URL}/api/verify-code`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, code })
});
```

## Architecture

- **Serverless Functions**: Each API endpoint is a separate Vercel serverless function
- **In-Memory Storage**: Verification codes stored in memory (resets on function cold starts)
- **Resend API**: Email delivery handled by Resend service
- **CORS Enabled**: Supports cross-origin requests from mobile apps

## Limitations

- Verification codes are stored in memory and will be lost on function cold starts
- For production use, consider implementing persistent storage (Redis, database)
- Rate limiting should be implemented for production deployments

## License

ISC