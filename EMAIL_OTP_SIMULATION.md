# Email OTP Simulation Mode

## Overview

This document explains how to use the email OTP simulation mode for development and testing purposes. This feature allows you to test the OTP flow with any email address without being restricted by the Resend free tier limitations.

## Why This Feature Exists

The Resend free account only allows sending emails to the verified email address ([shafiradev62@gmail.com](mailto:shafiradev62@gmail.com)). For development and testing with different email addresses, we've implemented a simulation mode that mimics the email sending process without actually sending emails.

## How It Works

When simulation mode is enabled:
1. The system generates an OTP code
2. Instead of sending a real email, it logs the OTP to the console
3. The OTP is returned in the API response for testing purposes
4. The frontend displays the OTP code to the user for testing

## Enabling Simulation Mode

### Method 1: Environment Variables

Set these environment variables in your [.env.local](file:///c:/FuelFriendlyApp/.env.local) file:

```bash
# Development settings
SIMULATE_EMAIL_SENDING=true
```

Or set them temporarily in your terminal:

**Windows PowerShell:**
```powershell
$env:NODE_ENV="development"
$env:SIMULATE_EMAIL_SENDING="true"
npm run server
```

**Windows Command Prompt:**
```cmd
set NODE_ENV=development
set SIMULATE_EMAIL_SENDING=true
npm run server
```

**macOS/Linux:**
```bash
NODE_ENV=development SIMULATE_EMAIL_SENDING=true npm run server
```

### Method 2: Direct Configuration

In your [.env.local](file:///c:/FuelFriendlyApp/.env.local) file, set:
```bash
SIMULATE_EMAIL_SENDING=true
```

Then restart your development server.

## Testing with Simulation Mode

### Using the Test Script

Run the dedicated simulation test script:
```powershell
$env:NODE_ENV="development"
$env:SIMULATE_EMAIL_SENDING="true"
node test-simulated-email.js
```

### Using the Application

1. Start the development server with simulation enabled
2. Open the application in your browser
3. Navigate to the login page
4. Select "Email OTP" authentication method
5. Enter any email address (e.g., fuelfriendly@gmail.com)
6. Click "Send OTP"
7. The OTP code will be displayed in the success message for testing

## Production Deployment

For production deployment:
1. Set `SIMULATE_EMAIL_SENDING=false` in your environment
2. Ensure your Resend account is upgraded and domain is verified
3. Test with real email addresses

## Benefits

1. **Unlimited Testing**: Test with any email address during development
2. **Cost Effective**: No emails are actually sent during simulation
3. **Fast Feedback**: Immediate access to OTP codes for testing
4. **Easy Setup**: Simple environment variable toggle

## Limitations

1. Only for development/testing purposes
2. Does not send real emails
3. Should be disabled in production

## Troubleshooting

### Simulation Not Working

1. Check that `SIMULATE_EMAIL_SENDING=true` is set
2. Verify that `NODE_ENV=development` is set
3. Restart your development server after changing environment variables

### Want to Send Real Emails Again

1. Set `SIMULATE_EMAIL_SENDING=false`
2. Restart your development server
3. Ensure your Resend API key is properly configured