// Evolution API Service for WhatsApp OTP
// Self-hosted WhatsApp API using Evolution API

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = import.meta.env.VITE_EVOLUTION_INSTANCE || 'fuelfriendly';

interface SendMessageResponse {
    key: {
        remoteJid: string;
        fromMe: boolean;
        id: string;
    };
    message: any;
    messageTimestamp: string;
    status: string;
}

interface InstanceInfo {
    instance: {
        instanceName: string;
        status: string;
    };
    qrcode?: {
        code: string;
        base64: string;
    };
}

// Generate random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format phone number for WhatsApp (remove + and spaces)
function formatWhatsAppNumber(phone: string): string {
    // Remove +, spaces, and dashes
    let cleaned = phone.replace(/[\s+-]/g, '');

    // Ensure it starts with country code
    if (!cleaned.startsWith('62') && cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }

    return cleaned;
}

// Send WhatsApp message via Evolution API
export async function sendWhatsAppMessage(
    toNumber: string,
    message: string
): Promise<SendMessageResponse> {
    try {
        const formattedNumber = formatWhatsAppNumber(toNumber);

        const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
            method: 'POST',
            headers: {
                'apikey': EVOLUTION_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: formattedNumber,
                text: message
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send WhatsApp message');
        }

        return await response.json();
    } catch (error) {
        console.error('Send WhatsApp message error:', error);
        throw error;
    }
}

// Send WhatsApp OTP
export async function sendWhatsAppOTP(phoneNumber: string): Promise<{ otp: string; messageId: string }> {
    try {
        const otp = generateOTP();
        const message = `🔐 *FuelFriendly OTP*\n\nKode verifikasi Anda: *${otp}*\n\nKode berlaku 5 menit.\nJangan bagikan kode ini kepada siapapun!`;

        const result = await sendWhatsAppMessage(phoneNumber, message);

        return {
            otp: otp,
            messageId: result.key.id
        };
    } catch (error) {
        console.error('Send WhatsApp OTP error:', error);
        throw error;
    }
}

// Check instance status
export async function checkInstanceStatus(): Promise<InstanceInfo> {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`, {
            method: 'GET',
            headers: {
                'apikey': EVOLUTION_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to check instance status');
        }

        return await response.json();
    } catch (error) {
        console.error('Check instance status error:', error);
        throw error;
    }
}

// Create new instance
export async function createInstance(instanceName: string = EVOLUTION_INSTANCE): Promise<any> {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
            method: 'POST',
            headers: {
                'apikey': EVOLUTION_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instanceName: instanceName,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create instance');
        }

        return await response.json();
    } catch (error) {
        console.error('Create instance error:', error);
        throw error;
    }
}

// Get QR Code for WhatsApp connection
export async function getQRCode(): Promise<{ base64: string; code: string }> {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${EVOLUTION_INSTANCE}`, {
            method: 'GET',
            headers: {
                'apikey': EVOLUTION_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get QR code');
        }

        const data = await response.json();
        return {
            base64: data.base64 || data.qrcode?.base64 || '',
            code: data.code || data.qrcode?.code || ''
        };
    } catch (error) {
        console.error('Get QR code error:', error);
        throw error;
    }
}

// Logout/disconnect instance
export async function logoutInstance(): Promise<any> {
    try {
        const response = await fetch(`${EVOLUTION_API_URL}/instance/logout/${EVOLUTION_INSTANCE}`, {
            method: 'DELETE',
            headers: {
                'apikey': EVOLUTION_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to logout instance');
        }

        return await response.json();
    } catch (error) {
        console.error('Logout instance error:', error);
        throw error;
    }
}

// In-memory OTP storage (for demo - use Redis/DB in production)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Store OTP
export function storeOTP(phoneNumber: string, otp: string, expiryMinutes: number = 5): void {
    const expires = Date.now() + (expiryMinutes * 60 * 1000);
    otpStore.set(phoneNumber, { otp, expires });

    // Auto cleanup after expiry
    setTimeout(() => {
        otpStore.delete(phoneNumber);
    }, expiryMinutes * 60 * 1000);
}

// Verify OTP
export function verifyOTP(phoneNumber: string, inputOtp: string): boolean {
    const stored = otpStore.get(phoneNumber);

    if (!stored) {
        return false; // OTP not found
    }

    if (Date.now() > stored.expires) {
        otpStore.delete(phoneNumber);
        return false; // OTP expired
    }

    if (stored.otp !== inputOtp) {
        return false; // OTP mismatch
    }

    // OTP verified, remove from store
    otpStore.delete(phoneNumber);
    return true;
}
