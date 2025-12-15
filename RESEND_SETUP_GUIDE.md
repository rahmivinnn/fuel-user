# Resend Setup Guide for FuelFriendly App

This guide explains how to properly set up Resend email service for OTP (One-Time Password) functionality in the FuelFriendly application.

## Prerequisites

1. A Resend account - [Sign up here](https://resend.com/)
2. Access to Resend Dashboard
3. Valid email address for testing

## Step-by-Step Setup

### 1. Create Resend Account

1. Visit [Resend website](https://resend.com/) and sign up for an account
2. Complete the registration process
3. Verify your email address

### 2. Obtain API Key

1. Log in to your Resend Dashboard
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Give your API key a descriptive name (e.g., "FuelFriendly App")
5. Select the appropriate permissions (Sending access is sufficient for this use case)
6. Click **Create**
7. Copy the generated API key and save it securely

### 3. Configure Environment Variables

Update your [.env.local](.env.local) file with your Resend API key:

```bash
# Replace this with your actual Resend API key
RESEND_API_KEY=your_actual_resend_api_key_here
```

Example with a real API key:
```bash
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuv
```

### 4. Configure Sender Domain (Optional but Recommended)

For production use, it's recommended to configure a custom sender domain:

1. In your Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow the DNS verification instructions
5. Once verified, you can send emails from your custom domain

### 5. Test the Integration

After configuring your API key:

1. Run the test script:
   ```bash
   node test-resend-email.js
   ```

2. Or test through the application API:
   ```bash
   curl -X POST http://localhost:4000/api/otp/email/send \
     -H "Content-Type: application/json" \
     -d '{"email": "your-test-email@example.com"}'
   ```

## Troubleshooting Common Issues

### 1. "Unauthorized" Error
- Double-check your API key
- Ensure there are no extra spaces in the API key
- Confirm the API key is active in your Resend dashboard

### 2. "Invalid API Key" Error
- Verify the API key format (should start with "re_" followed by alphanumeric characters)
- Regenerate the API key if needed

### 3. Emails Not Received
- Check spam/junk folders
- Verify the recipient email address is correct
- Check Resend dashboard for delivery status
- Ensure you're not hitting rate limits

### 4. "Domain Not Verified" Error
- If using a custom domain, ensure it's properly verified in the Resend dashboard
- Use the default domain (resend.dev) for testing

## Integration Details

### File Structure

The Resend integration is organized in the following files:

1. [server/utils/otp.js](server/utils/otp.js)
   - OTP generation and management
   - In-memory storage for OTPs
   - Verification logic

2. [server/services/email.service.js](server/services/email.service.js)
   - Resend email service implementation
   - HTML email template
   - Error handling

3. [server/routes/otp.routes.js](server/routes/otp.routes.js)
   - API endpoints for sending and verifying OTPs
   - Request validation
   - Response formatting

4. [server/index.js](server/index.js)
   - Route registration
   - Express middleware setup

### API Endpoints

#### Send Email OTP
```
POST /api/otp/email/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

Response (error):
```json
{
  "success": false,
  "error": "Error message"
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

Response (success):
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

Response (error):
```json
{
  "success": false,
  "error": "Invalid or expired code"
}
```

## Security Best Practices

1. Never commit actual API keys to version control
2. Use environment variables for all sensitive data
3. Rotate API keys periodically
4. Restrict API key permissions to only necessary functions
5. Use HTTPS in production environments
6. Implement rate limiting to prevent abuse
7. Validate all input parameters
8. Sanitize user input to prevent injection attacks

## Rate Limits

Resend has the following rate limits:
- 10,000 emails per day (Free tier)
- 100 emails per hour (Free tier)
- Higher limits available on paid plans

Implement exponential backoff if you encounter rate limiting.

## Email Deliverability

To ensure good email deliverability:
1. Use verified sender domains
2. Maintain a good sender reputation
3. Include proper unsubscribe options
4. Monitor bounce rates
5. Handle complaints appropriately

## Production Considerations

For production deployment:

1. Replace in-memory OTP storage with a persistent database (Redis, PostgreSQL, etc.)
2. Implement proper logging and monitoring
3. Set up error reporting and alerting
4. Add metrics collection
5. Implement circuit breaker pattern for external service calls
6. Use connection pooling for database connections
7. Set up proper backup and recovery procedures

## Cost Considerations

Resend offers:
- Free tier: 10,000 emails per month
- Paid plans for higher volumes
- Pay-as-you-go pricing for enterprise needs

Check Resend's pricing page for current rates.

## Support

For issues with the Resend integration:
1. Check Resend API documentation
2. Review application logs
3. Contact Resend support for API-related issues
4. Check the application's GitHub issues for similar problems

## References

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Best Practices for Email Deliverability](https://resend.com/guides/email-deliverability-best-practices)