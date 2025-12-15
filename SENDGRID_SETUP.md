# SendGrid Email Integration Guide

## Overview

This document explains how to set up SendGrid for sending OTP emails in the FuelFriendly application. SendGrid has a more generous free tier compared to Resend, allowing you to send emails to any email address without domain verification requirements.

## Prerequisites

1. A SendGrid account - [Sign up here](https://sendgrid.com/)
2. SendGrid API Key
3. Valid email address for testing

## Setup Instructions

### 1. Create a SendGrid Account

1. Go to [SendGrid website](https://sendgrid.com/)
2. Click "Start for Free"
3. Complete the registration process
4. Verify your email address

### 2. Obtain SendGrid API Key

1. Log in to your SendGrid dashboard
2. Navigate to "Settings" > "API Keys"
3. Click "Create API Key"
4. Give your API key a name (e.g., "FuelFriendly OTP")
5. Select "Restricted Access" and grant the following permissions:
   - Mail Send: Full Access
6. Click "Create & View"
7. Copy the API key (you won't be able to see it again)

### 3. Configure Environment Variables

Add the following environment variables to your [.env.local](file:///c:/FuelFriendlyApp/.env.local) file:

```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@fuelfriendly.com
```

### 4. Verify Sender Identity (Optional but Recommended)

To avoid emails going to spam:

1. In your SendGrid dashboard, go to "Settings" > "Sender Authentication"
2. Click "Verify an Address"
3. Add and verify your sender email address or domain

## Testing

### Automated Testing

Run the test script to verify the integration:
```bash
node test-sendgrid-email.js
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

## SendGrid Free Tier Limits

- 100 emails per day
- 100 emails per month
- No credit card required
- No domain verification required for sending to any email address

## Troubleshooting

### Common Issues

1. **Emails going to spam**: 
   - Verify your sender identity in SendGrid
   - Use a recognizable sender email address
   - Ensure your email content doesn't trigger spam filters

2. **API Key errors**:
   - Double-check your API key
   - Ensure the API key has the correct permissions
   - Make sure the API key is properly added to your [.env.local](file:///c:/FuelFriendlyApp/.env.local) file

3. **Delivery issues**:
   - Check SendGrid activity feed for delivery status
   - Verify the recipient email address is correct
   - Check if the recipient's email server is blocking the email

### Checking Email Activity

1. In your SendGrid dashboard, go to "Activity" > "Email Activity"
2. Search for emails by recipient address
3. Check the delivery status and any error messages

## Security Best Practices

1. Never commit actual API keys to version control
2. Use environment variables for all sensitive data
3. Rotate API keys periodically
4. Restrict API key permissions to only necessary functions
5. Use HTTPS in production environments
6. Implement rate limiting to prevent abuse
7. Validate all input parameters
8. Sanitize user input to prevent injection attacks

## Production Considerations

For production deployment:

1. Upgrade to a paid SendGrid plan if you need to send more than 100 emails per day
2. Set up proper sender authentication (domain verification)
3. Monitor your email sending reputation
4. Implement proper error handling and logging
5. Set up email delivery monitoring and alerts