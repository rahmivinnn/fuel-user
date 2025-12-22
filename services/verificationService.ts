import { whatsappService } from './whatsappService';

// Verification service that uses WhatsApp for OTP delivery
interface VerificationData {
  email: string;
  phone: string;
  name: string;
  code: string;
  timestamp: number;
  verified: boolean;
}

class VerificationService {
  private verificationCodes = new Map<string, VerificationData>();

  generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
  }

  async sendVerificationCode(email: string, phone: string, name: string, simulateSuccess: boolean = false): Promise<{ success: boolean; message: string }> {
    try {
      const code = this.generateCode();
      const timestamp = Date.now();

      // Store verification data
      this.verificationCodes.set(email, {
        email,
        phone,
        name,
        code,
        timestamp,
        verified: false
      });

      // Log the code for development/testing
      console.log(`🔐 OTP Code for ${phone}: ${code}`);

      // If simulating success, skip actual sending
      if (simulateSuccess) {
        return {
          success: true,
          message: `Verification code generated: ${code} (Simulation Mode)`
        };
      }

      // If phone is provided, use backend WhatsApp API instead of direct WhatsApp service
      if (phone) {
        try {
          const API_BASE_URL = 'https://apidecor.kelolahrd.life';
          const response = await fetch(`${API_BASE_URL}/api/otp/whatsapp/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber: phone })
          });
          
          const data = await response.json();
          
          if (data.success) {
            // Use the OTP from backend instead of our generated one
            if (data.developmentCode) {
              this.verificationCodes.set(email, {
                email,
                phone,
                name,
                code: data.developmentCode,
                timestamp,
                verified: false
              });
            }
            
            return {
              success: true,
              message: `Verification code sent to WhatsApp ${phone}`
            };
          } else {
            console.warn('Backend WhatsApp API failed:', data.error);
            return {
              success: true,
              message: `Code generated: ${code} (Backend WhatsApp API failed - check console)`
            };
          }
        } catch (backendError) {
          console.warn('Backend WhatsApp API error:', backendError);
          return {
            success: true,
            message: `Verification code: ${code} (Backend API unavailable)`
          };
        }
      }

      // Fallback to direct WhatsApp service for other cases
      try {
        const whatsappResult = await whatsappService.sendOTP(phone, code, name);
        
        if (whatsappResult.success) {
          return {
            success: true,
            message: `Verification code sent to WhatsApp ${phone}`
          };
        } else {
          console.warn('WhatsApp delivery failed, but code is available for testing:', code);
          return {
            success: true,
            message: `Code generated: ${code} (WhatsApp delivery failed - check console)`
          };
        }
      } catch (whatsappError) {
        console.warn('WhatsApp service error, using fallback:', whatsappError);
        return {
          success: true,
          message: `Verification code: ${code} (Development mode - WhatsApp unavailable)`
        };
      }
    } catch (error) {
      console.error('Verification service error:', error);
      return {
        success: false,
        message: 'Failed to generate verification code. Please try again.'
      };
    }
  }

  verifyCode(email: string, inputCode: string): { success: boolean; message: string } {
    const verificationData = this.verificationCodes.get(email);

    if (!verificationData) {
      return {
        success: false,
        message: 'No verification code found. Please request a new one.'
      };
    }

    // Check if code is expired (10 minutes)
    const isExpired = Date.now() - verificationData.timestamp > 10 * 60 * 1000;
    if (isExpired) {
      this.verificationCodes.delete(email);
      return {
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      };
    }

    if (verificationData.code !== inputCode) {
      return {
        success: false,
        message: 'Invalid verification code. Please try again.'
      };
    }

    // Mark as verified
    verificationData.verified = true;
    this.verificationCodes.set(email, verificationData);

    return {
      success: true,
      message: 'Phone verified successfully!'
    };
  }

  async completeRegistration(email: string): Promise<{ success: boolean; message: string }> {
    const verificationData = this.verificationCodes.get(email);

    if (!verificationData || !verificationData.verified) {
      return {
        success: false,
        message: 'Phone not verified. Please verify your phone first.'
      };
    }

    try {
      // Send welcome message via WhatsApp
      const welcomeMessage = `🎉 Welcome to FuelFriendly, ${verificationData.name}!\n\n` +
        `Your account has been successfully created. You can now:\n` +
        `• Order fuel delivery to your location\n` +
        `• Track your orders in real-time\n` +
        `• Manage multiple vehicles\n` +
        `• Get exclusive deals and offers\n\n` +
        `Start your first fuel delivery today! 🚛⛽`;

      const whatsappResult = await whatsappService.sendOrderNotification(
        verificationData.phone,
        {
          orderId: 'WELCOME',
          fuelType: 'Welcome Message',
          quantity: 0,
          totalAmount: 0,
          stationName: 'FuelFriendly Team',
          estimatedTime: 'Now'
        }
      );

      // Clean up verification data
      this.verificationCodes.delete(email);

      return {
        success: true,
        message: whatsappResult.success 
          ? 'Registration completed successfully! Welcome message sent to WhatsApp.'
          : 'Registration completed successfully!'
      };
    } catch (error) {
      console.error('Failed to complete registration:', error);
      // Clean up verification data even if welcome message fails
      this.verificationCodes.delete(email);
      
      return {
        success: true, // Still success since registration is complete
        message: 'Registration completed successfully!'
      };
    }
  }

  isVerified(email: string): boolean {
    const verificationData = this.verificationCodes.get(email);
    return verificationData?.verified || false;
  }

  // Method to send order notifications
  async sendOrderNotification(phone: string, orderDetails: {
    orderId: string;
    fuelType: string;
    quantity: number;
    totalAmount: number;
    stationName: string;
    estimatedTime: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const result = await whatsappService.sendOrderNotification(phone, orderDetails);
      return {
        success: result.success,
        message: result.success ? 'Order notification sent successfully' : result.error || 'Failed to send notification'
      };
    } catch (error) {
      console.error('Failed to send order notification:', error);
      return {
        success: false,
        message: 'Failed to send order notification'
      };
    }
  }

  // Method to send delivery updates
  async sendDeliveryUpdate(phone: string, updateDetails: {
    orderId: string;
    status: string;
    driverName: string;
    estimatedTime: string;
    message?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const result = await whatsappService.sendDeliveryUpdate(phone, updateDetails);
      return {
        success: result.success,
        message: result.success ? 'Delivery update sent successfully' : result.error || 'Failed to send update'
      };
    } catch (error) {
      console.error('Failed to send delivery update:', error);
      return {
        success: false,
        message: 'Failed to send delivery update'
      };
    }
  }

  // Method for tap-to-verify simulation
  tapToVerify(email: string): { success: boolean; message: string } {
    const verificationData = this.verificationCodes.get(email);

    if (!verificationData) {
      return {
        success: false,
        message: 'No verification data found. Please request a code first.'
      };
    }

    // Mark as verified without checking the code
    verificationData.verified = true;
    this.verificationCodes.set(email, verificationData);

    return {
      success: true,
      message: 'Email verified successfully! (Simulation Mode)'
    };
  }
}

export const verificationService = new VerificationService();