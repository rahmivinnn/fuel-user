# Resend Email Integration Guide

This document explains how to integrate Resend email service for OTP (One-Time Password) functionality in the FuelFriendly application.

## Overview

Resend is a modern email API service that makes it easy to send transactional emails. In FuelFriendly, we use Resend to send email verification codes during the authentication process.

## Prerequisites

1. A Resend account - [Sign up here](https://resend.com/)
2. Resend API Key
3. Valid email address for testing

## Configuration

### Environment Variables

Add the following environment variable to your [.env.local](.env.local) file:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### Obtaining Credentials

1. Log in to your Resend dashboard
2. Navigate to the API Keys section
3. Generate a new API key if one doesn't exist
4. Copy the API key and add it to your [.env.local](.env.local) file

## Implementation Details

### File Structure

The Resend integration is implemented in the following files:

1. [server/utils/otp.js](server/utils/otp.js) - OTP generation and management utilities
2. [server/services/email.service.js](server/services/email.service.js) - Resend email service
3. [server/routes/otp.routes.js](server/routes/otp.routes.js) - API endpoints for email OTP
4. [server/index.js](server/index.js) - Main server file with route registration

### API Endpoints

The following endpoints are available for Resend email integration:

#### Send Email OTP
```
POST /api/otp/email/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify Email OTP
```
POST /api/otp/email/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

## Usage Examples

### Sending Email OTP
```bash
curl -X POST http://localhost:4000/api/otp/email/send \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Verifying Email OTP
```bash
curl -X POST http://localhost:4000/api/otp/email/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

## Testing

### Automated Testing

Run the test script to verify the integration:
```bash
node test-resend-email.js
```

### Manual Testing

1. Start the server:
   ```bash
   npm run server
   ```

2. Send a test email:
   ```bash
   curl -X POST http://localhost:4000/api/otp/email/send \
     -H "Content-Type: application/json" \
     -d '{"email": "your-test-email@example.com"}'
   ```

3. Check your email inbox for the verification code

4. Verify the code:
   ```bash
   curl -X POST http://localhost:4000/api/otp/email/verify \
     -H "Content-Type: application/json" \
     -d '{"email": "your-test-email@example.com", "otp": "CODE_YOU_RECEIVED"}'
   ```

## Error Handling

The Resend integration includes proper error handling for:
- Network errors
- Authentication failures
- Invalid parameters
- Rate limiting
- Service outages

All errors are logged to the console and returned in a consistent format.

## Security Considerations

1. API keys should never be exposed in client-side code
2. OTP verification should always be done server-side
3. Use HTTPS in production environments
4. Validate all input parameters
5. OTPs should have a short expiration time (5 minutes)
6. OTPs should be invalidated after successful verification

## OTP Management

The OTP system includes:
- 6-digit numeric codes
- 5-minute expiration
- Automatic cleanup of expired codes
- Single-use codes (invalidated after verification)

## Customization

### Email Template

The email template can be customized in [server/services/email.service.js](server/services/email.service.js). The current template includes:
- Company branding
- Clear OTP display
- Expiration information
- Security warnings

### OTP Settings

OTP settings can be adjusted in [server/utils/otp.js](server/utils/otp.js):
- Code length
- Expiration time
- Storage mechanism

## Production Considerations

For production deployment:

1. Replace in-memory OTP storage with a persistent database
2. Implement rate limiting for OTP requests
3. Add logging and monitoring
4. Set up proper error reporting
5. Configure domain verification in Resend dashboard
6. Use a custom sender domain instead of the default

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your API key is correct and active
2. **Sending Failures**: Check email address format
3. **Rate Limiting**: Implement exponential backoff for retries
4. **Delivery Issues**: Check spam/junk folders

### Debugging

Enable debug logging by setting environment variables:
```bash
DEBUG=resend:* node server/index.js
```

## Support

For issues with the Resend integration:
1. Check Resend API documentation
2. Review application logs
3. Contact Resend support for API-related issues
4. Check the application's GitHub issues for similar problems

## References

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)