// Exotel API Service for SMS and Email
// Documentation: https://developer.exotel.com/

const EXOTEL_API_KEY = import.meta.env.VITE_EXOTEL_API_KEY || '';
const EXOTEL_API_TOKEN = import.meta.env.VITE_EXOTEL_API_TOKEN || '';
const EXOTEL_SUBDOMAIN = import.meta.env.VITE_EXOTEL_SUBDOMAIN || '';

// Base URL for Exotel API
const EXOTEL_BASE_URL = `https://${EXOTEL_SUBDOMAIN}.exotel.com/v1`;

interface ExotelSMSResponse {
    SmsSid: string;
    Status: string;
    To: string;
    From: string;
    Body: string;
    DateCreated: string;
    DateUpdated: string;
}

interface ExotelEmailResponse {
    EmailId: string;
    Status: string;
    To: string;
    From: string;
    Subject: string;
    Body: string;
    DateCreated: string;
}

interface SendOTPResponse {
    success: boolean;
    verificationId?: string;
    message?: string;
    error?: string;
}

// Generate random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send SMS via Exotel API
export async function sendExotelSMS(
    toNumber: string,
    message: string,
    fromNumber?: string
): Promise<{ success: boolean; response?: ExotelSMSResponse; error?: string }> {
    try {
        // Format the phone number (ensure it starts with country code)
        const formattedTo = toNumber.startsWith('+') ? toNumber : `+${toNumber}`;
        
        const formData = new FormData();
        formData.append('From', fromNumber || 'FuelFriend'); // Sender ID
        formData.append('To', formattedTo);
        formData.append('Body', message);

        const response = await fetch(`${EXOTEL_BASE_URL}/Accounts/${EXOTEL_API_KEY}/Sms/send.json`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`)
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send SMS: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return {
            success: true,
            response: data.SmsMessage
        };
    } catch (error) {
        console.error('Send SMS error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send SMS'
        };
    }
}

// Send Email via Exotel API
export async function sendExotelEmail(
    toEmail: string,
    subject: string,
    body: string,
    fromEmail?: string
): Promise<{ success: boolean; response?: ExotelEmailResponse; error?: string }> {
    try {
        const formData = new FormData();
        formData.append('From', fromEmail || `noreply@${EXOTEL_SUBDOMAIN}.com`);
        formData.append('To', toEmail);
        formData.append('Subject', subject);
        formData.append('Body', body);

        const response = await fetch(`${EXOTEL_BASE_URL}/Accounts/${EXOTEL_API_KEY}/Email/send.json`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`)
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send email: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return {
            success: true,
            response: data.Email
        };
    } catch (error) {
        console.error('Send email error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email'
        };
    }
}

// Send OTP via SMS
export async function sendSMSOTP(phoneNumber: string): Promise<SendOTPResponse> {
    try {
        const otp = generateOTP();
        const message = `🔐 FuelFriendly OTP: ${otp}\n\nKode ini berlaku selama 5 menit. Jangan bagikan kepada siapa pun!`;

        const result = await sendExotelSMS(phoneNumber, message);

        if (result.success) {
            // In a real implementation, you would store the OTP with an expiration time
            // and associate it with the phone number for verification later
            return {
                success: true,
                verificationId: result.response?.SmsSid,
                message: 'OTP sent via SMS successfully'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    } catch (error) {
        console.error('Send SMS OTP error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send SMS OTP'
        };
    }
}

// Send OTP via Email
export async function sendEmailOTP(email: string): Promise<SendOTPResponse> {
    try {
        const otp = generateOTP();
        const subject = 'FuelFriendly - Kode Verifikasi OTP';
        const body = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FuelFriendly OTP</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">🔐 Kode Verifikasi FuelFriendly</h2>
        <p>Halo,</p>
        <p>Kode OTP Anda adalah:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">${otp}</span>
        </div>
        <p>Kode ini berlaku selama <strong>5 menit</strong>. Jangan bagikan kode ini kepada siapa pun.</p>
        <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
            Email ini dikirim oleh FuelFriendly. Jangan balas email ini.
        </p>
    </div>
</body>
</html>
        `.trim();

        const result = await sendExotelEmail(email, subject, body);

        if (result.success) {
            // In a real implementation, you would store the OTP with an expiration time
            // and associate it with the email for verification later
            return {
                success: true,
                verificationId: result.response?.EmailId,
                message: 'OTP sent via email successfully'
            };
        } else {
            return {
                success: false,
                error: result.error
            };
        }
    } catch (error) {
        console.error('Send Email OTP error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email OTP'
        };
    }
}

// Verify OTP (this would typically be implemented on the server-side)
export async function verifyOTP(verificationId: string, otpCode: string): Promise<{ success: boolean; message?: string; error?: string }> {
    // In a real implementation, you would check the stored OTP against the provided code
    // This is a placeholder implementation
    console.warn('OTP verification should be implemented on the server-side for security');
    return {
        success: true,
        message: 'OTP verification would happen on server-side'
    };
}