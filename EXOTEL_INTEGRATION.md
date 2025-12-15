# Exotel API Integration Guide

This document explains how to integrate Exotel API for SMS and Email functionality in the FuelFriendly application.

## Overview

Exotel provides APIs for sending SMS and emails, which are used in FuelFriendly for OTP (One-Time Password) verification during user authentication.

## Prerequisites

1. An Exotel account - [Sign up here](https://exotel.com/)
2. Exotel API Key and Token
3. Exotel Subdomain

## Configuration

### Environment Variables

Add the following environment variables to your [.env.local](.env.local) file:

```bash
VITE_EXOTEL_API_KEY=your_exotel_api_key
VITE_EXOTEL_API_TOKEN=your_exotel_api_token
VITE_EXOTEL_SUBDOMAIN=your_exotel_subdomain
```

### Obtaining Credentials

1. Log in to your Exotel dashboard
2. Navigate to the Developer section
3. Find your API Key and Token
4. Note your Exotel subdomain (part of the dashboard URL)

## Implementation Details

### Frontend Services

The Exotel integration is implemented in two files:

1. [services/messageCentral.ts](services/messageCentral.ts) - Client-side service with Exotel functions
2. [services/exotelApi.ts](services/exotelApi.ts) - Dedicated Exotel API service

### Backend Services

The Exotel integration is also implemented in the backend:

1. [server/otp-service.js](server/otp-service.js) - Server-side OTP service with Exotel support
2. [server/index.js](server/index.js) - API endpoints for SMS and Email OTP

## API Endpoints

The following endpoints are available for Exotel integration:

### Send SMS OTP
```
POST /api/otp/sms/send
Content-Type: application/json

{
  "phoneNumber": "+6281234567890"
}
```

### Send Email OTP
```
POST /api/otp/email/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## Usage Examples

### Sending SMS OTP (Frontend)
```typescript
import { sendExotelSMSOTP } from '../services/messageCentral';

// Send OTP via SMS
const result = await sendExotelSMSOTP('+6281234567890');
if (result.success) {
  console.log('OTP sent successfully');
} else {
  console.error('Failed to send OTP:', result.error);
}
```

### Sending Email OTP (Frontend)
```typescript
import { sendExotelEmailOTP } from '../services/messageCentral';

// Send OTP via Email
const result = await sendExotelEmailOTP('user@example.com');
if (result.success) {
  console.log('OTP sent successfully');
} else {
  console.error('Failed to send OTP:', result.error);
}
```

## Error Handling

The Exotel integration includes proper error handling for:
- Network errors
- Authentication failures
- Invalid parameters
- Rate limiting
- Service outages

All errors are logged to the console and returned in a consistent format.

## Security Considerations

1. API credentials should never be exposed in client-side code
2. OTP verification should always be done server-side
3. Use HTTPS in production environments
4. Validate all input parameters

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your API Key and Token are correct
2. **Sending Failures**: Check phone number/email format
3. **Rate Limiting**: Implement exponential backoff for retries

### Testing

You can test the Exotel integration using the test scripts:

```bash
# Test Exotel API directly
node test-exotel-api.js
```

## Support

For issues with the Exotel integration, please check:
1. Exotel API documentation
2. Application logs
3. Network connectivity