// Message Central OTP Service
// Documentation: https://cpaas.messagecentral.com/

interface ImportMetaEnv {
    readonly VITE_MESSAGE_CENTRAL_CUSTOMER_ID?: string;
    readonly VITE_MESSAGE_CENTRAL_API_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

const MESSAGE_CENTRAL_BASE_URL = 'https://cpaas.messagecentral.com/verification/v3';
const MESSAGE_CENTRAL_AUTH_URL = 'https://cpaas.messagecentral.com/auth/v1';

// Environment variables - Add these to your .env.local file
const CUSTOMER_ID = import.meta.env.VITE_MESSAGE_CENTRAL_CUSTOMER_ID || '';
const API_KEY = import.meta.env.VITE_MESSAGE_CENTRAL_API_KEY || '';

interface SendOTPResponse {
    responseCode: number;
    message: string;
    data: {
        verificationId: string;
        mobileNumber?: string;
        responseCode: string;
        errorMessage: string | null;
        timeout: string;
        smsCLI: string | null;
        transactionId: string | null;
    };
}

interface VerifyOTPResponse {
    responseCode: number;
    message: string;
    data: {
        verificationId: string;
        mobileNumber: string;
        verificationStatus: string;
        responseCode: string;
        errorMessage: string | null;
    };
}

// Get authentication token for Message Central
async function getAuthToken(): Promise<string> {
    try {
        const response = await fetch(`${MESSAGE_CENTRAL_AUTH_URL}/authentication/token?customerId=${CUSTOMER_ID}&key=${API_KEY}&scope=NEW`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get auth token: ${response.status} - ${errorText}`);
        }

        const text = await response.text();
        if (!text) {
            throw new Error('Empty response from auth token endpoint');
        }

        const data = JSON.parse(text);
        return data.token;
    } catch (error) {
        console.error('Auth token error:', error);
        throw error;
    }
}

// Send OTP via Email (Message Central) - Keeping for backward compatibility
export async function sendEmailOTP(email: string): Promise<SendOTPResponse> {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${MESSAGE_CENTRAL_BASE_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            },
            body: JSON.stringify({
                customerId: CUSTOMER_ID,
                flowType: 'EMAIL',
                email: email,
                otpLength: 6,
                otpExpiry: 300 // 5 minutes
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send Email OTP: ${response.status} - ${errorText}`);
        }

        const text = await response.text();
        if (!text) {
            throw new Error('Empty response from Email OTP endpoint');
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Send Email OTP error:', error);
        throw error;
    }
}

// Verify OTP (Message Central) - Keeping for backward compatibility
export async function verifyOTP(verificationId: string, otpCode: string, customerId?: string): Promise<VerifyOTPResponse> {
    try {
        const token = await getAuthToken();

        // Build query params
        const params = new URLSearchParams({
            customerId: customerId || CUSTOMER_ID,
            verificationId: verificationId,
            code: otpCode
        });

        const verifyResponse = await fetch(`${MESSAGE_CENTRAL_BASE_URL}/validateOtp?${params}`, {
            method: 'GET',
            headers: {
                'authToken': token
            }
        });

        if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            throw new Error(`Failed to verify OTP: ${verifyResponse.status} - ${errorText}`);
        }

        const text = await verifyResponse.text();
        if (!text) {
            throw new Error('Empty response from verify OTP endpoint');
        }

        return JSON.parse(text);
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
}
