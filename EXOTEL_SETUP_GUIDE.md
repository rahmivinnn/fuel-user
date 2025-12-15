# Exotel Setup Guide for FuelFriendly App

This guide explains how to properly set up Exotel API integration for SMS and Email functionality in the FuelFriendly application.

## Prerequisites

1. An Exotel account - [Sign up here](https://exotel.com/)
2. Access to Exotel Dashboard
3. Valid phone number for testing SMS
4. Valid email address for testing Email

## Step-by-Step Setup

### 1. Create Exotel Account

1. Visit [Exotel website](https://exotel.com/) and sign up for an account
2. Complete the registration process
3. Verify your email address and phone number

### 2. Obtain API Credentials

1. Log in to your Exotel Dashboard
2. Navigate to **Settings** → **API Keys**
3. Generate a new API Key and Token if one doesn't exist
4. Note down the following information:
   - API Key
   - API Token
   - Your Exotel Subdomain (visible in the dashboard URL)

### 3. Configure Environment Variables

Update your [.env.local](.env.local) file with your actual Exotel credentials:

```bash
# Replace these with your actual Exotel credentials
VITE_EXOTEL_API_KEY=your_actual_api_key_here
VITE_EXOTEL_API_TOKEN=your_actual_api_token_here
VITE_EXOTEL_SUBDOMAIN=your_actual_subdomain_here
```

Example with real values:
```bash
VITE_EXOTEL_API_KEY=1234567890abcdef1234567890abcdef12345678
VITE_EXOTEL_API_TOKEN=0987654321fedcba0987654321fedcba09876543
VITE_EXOTEL_SUBDOMAIN=mycompany
```

Your Exotel subdomain is the part of your dashboard URL before `.exotel.com`. For example, if your dashboard URL is `https://mycompany.exotel.com`, then your subdomain is `mycompany`.

### 4. Configure Sender IDs (Optional but Recommended)

1. In your Exotel Dashboard, go to **Settings** → **Sender IDs**
2. Add a sender ID for SMS (e.g., "FuelFriend")
3. Verify the sender ID as per Exotel's verification process

### 5. Test the Integration

After configuring your credentials:

1. Run the test script:
   ```bash
   node test-exotel-api.js
   ```

2. Or test through the application UI:
   - Start both frontend and backend servers
   - Access the app at http://localhost:3000
   - Look for SMS/Email OTP options in the authentication flow

## Troubleshooting Common Issues

### 1. "fetch failed" Error
- Check your internet connection
- Verify API credentials are correct
- Ensure the subdomain is correct

### 2. "401 Unauthorized" Error
- Double-check your API Key and Token
- Ensure there are no extra spaces in the credentials
- Confirm the credentials are active in your Exotel dashboard

### 3. "400 Bad Request" Error
- Verify phone number format (+countrycodeXXXXXXXXX)
- Check email address format
- Ensure sender ID is properly configured

### 4. Messages Not Received
- Check if the phone number/email is valid
- Verify the number/email is not blocked
- Check Exotel dashboard for message status

## Integration Details

### Frontend Integration

The Exotel integration is available through:
- [services/messageCentral.ts](services/messageCentral.ts) - Contains `sendExotelSMSOTP()` and `sendExotelEmailOTP()` functions
- [services/exotelApi.ts](services/exotelApi.ts) - Dedicated Exotel API service

### Backend Integration

Server-side functions are implemented in:
- [server/otp-service.js](server/otp-service.js) - Contains server-side Exotel functions
- [server/index.js](server/index.js) - Exposes API endpoints:
  - POST `/api/otp/sms/send`
  - POST `/api/otp/email/send`

## Security Best Practices

1. Never commit actual API credentials to version control
2. Use environment variables for all sensitive data
3. Rotate API keys periodically
4. Restrict API key permissions to only necessary functions
5. Use HTTPS in production environments

## Cost Considerations

Exotel charges for:
- SMS messages sent
- Email messages sent
- Phone numbers (if using inbound features)

Check Exotel's pricing page for current rates.

## Support

For issues with the Exotel integration:
1. Check Exotel API documentation
2. Review application logs
3. Contact Exotel support for API-related issues
4. Check the application's GitHub issues for similar problems