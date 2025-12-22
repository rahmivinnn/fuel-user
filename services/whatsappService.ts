interface WhatsAppConfig {
  apiUrl: string;
  sessionId: string;
  apiKey: string;
}

interface SendMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      apiUrl: 'https://apidecor.kelolahrd.life',
      sessionId: 'fuelfriendly-session',
      apiKey: 'fuelfriendly-api-key-2024'
    };
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    try {
      const url = `${this.config.apiUrl}${endpoint}`;
      
      // Check if we're in development mode and API is not available
      if (this.config.apiUrl.includes('localhost')) {
        console.log('WhatsApp API running on localhost - checking availability...');
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WhatsApp API request failed:', error);
      
      // If it's a network error (API not available), provide helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('WhatsApp API server not available. Make sure the backend is running on ' + this.config.apiUrl);
      }
      
      throw error;
    }
  }

  async sendOTP(phoneNumber: string, otpCode: string, userName?: string): Promise<SendMessageResponse> {
    try {
      const requestBody = {
        phoneNumber: phoneNumber,
        code: otpCode,
        name: userName || 'User'
      };

      const response = await this.makeRequest('/send-otp', 'POST', requestBody);
      
      return {
        success: response.success,
        message: response.message || 'OTP sent successfully via WhatsApp',
        data: response.data
      };
    } catch (error) {
      console.error('Failed to send WhatsApp OTP:', error);
      return {
        success: false,
        error: 'Failed to send OTP via WhatsApp'
      };
    }
  }

  async sendWelcomeMessage(phoneNumber: string, userName: string): Promise<SendMessageResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = {
        text: this.generateWelcomeMessage(userName)
      };

      const requestBody = {
        jid: formattedPhone,
        type: "number",
        message: message,
        options: {}
      };

      const response = await this.makeRequest('/messages/send', 'POST', requestBody);
      
      return {
        success: true,
        message: 'Welcome message sent successfully',
        data: response
      };
    } catch (error) {
      console.error('Failed to send welcome message:', error);
      return {
        success: false,
        error: 'Failed to send welcome message'
      };
    }
  }

  async sendOrderNotification(phoneNumber: string, orderDetails: any): Promise<SendMessageResponse> {
    try {
      const requestBody = {
        phoneNumber: phoneNumber,
        orderDetails: orderDetails
      };

      const response = await this.makeRequest('/send-order-notification', 'POST', requestBody);
      
      return {
        success: response.success,
        message: response.message || 'Order notification sent successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Failed to send order notification:', error);
      return {
        success: false,
        error: 'Failed to send order notification'
      };
    }
  }

  async sendDeliveryUpdate(phoneNumber: string, updateDetails: any): Promise<SendMessageResponse> {
    try {
      const requestBody = {
        phoneNumber: phoneNumber,
        updateDetails: updateDetails
      };

      const response = await this.makeRequest('/send-delivery-update', 'POST', requestBody);
      
      return {
        success: response.success,
        message: response.message || 'Delivery update sent successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Failed to send delivery update:', error);
      return {
        success: false,
        error: 'Failed to send delivery update'
      };
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 0, replace with country code (assuming Indonesia +62)
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    
    // If it doesn't start with country code, add Indonesia code
    if (!cleaned.startsWith('62') && !cleaned.startsWith('1') && !cleaned.startsWith('44')) {
      cleaned = '62' + cleaned;
    }
    
    return cleaned + '@s.whatsapp.net';
  }

  private generateOTPMessage(otpCode: string, userName?: string): string {
    const greeting = userName ? `Hi ${userName}!` : 'Hi!';
    
    return `${greeting}\n\n🔐 Your verification code is: *${otpCode}*\n\nThis code will expire in 10 minutes. Please don't share this code with anyone.\n\nIf you didn't request this code, please ignore this message.\n\nVisit us at: gofuelfriendly.com`;
  }

  private generateWelcomeMessage(userName: string): string {
    return `🎉 Welcome, ${userName}!\n\nYour account has been successfully created. You can now:\n\n🚗 Order fuel delivery to your location\n⛽ Find nearby fuel stations\n📱 Track your orders in real-time\n💳 Manage your payment methods\n\nDownload our app and start your convenient fuel delivery experience today!\n\nNeed help? Just reply to this message.\n\nHappy fueling! 🚗⛽`;
  }

  private generateOrderNotificationMessage(orderDetails: any): string {
    return `📋 Order Update\n\nOrder ID: *${orderDetails.orderId}*\nStatus: *${orderDetails.status}*\n\n${orderDetails.fuelType} - ${orderDetails.quantity}L\nTotal: £${orderDetails.totalAmount}\n\n${orderDetails.status === 'confirmed' ? '✅ Your order has been confirmed!' : ''}\n${orderDetails.status === 'preparing' ? '🔄 Your fuel is being prepared...' : ''}\n${orderDetails.status === 'on_way' ? '🚚 Driver is on the way to your location!' : ''}\n${orderDetails.status === 'delivered' ? '✅ Order delivered successfully!' : ''}\n\n${orderDetails.estimatedTime ? `ETA: ${orderDetails.estimatedTime}` : ''}\n\nTrack your order: ${window.location.origin}/tracking/${orderDetails.orderId}\n\nThank you for choosing our service! 🚗⛽`;
  }

  private generateDeliveryUpdateMessage(updateDetails: any): string {
    return `🚚 Delivery Update\n\nOrder ID: *${updateDetails.orderId}*\nStatus: *${updateDetails.status}*\n\nDriver: ${updateDetails.driverName}\n${updateDetails.estimatedTime ? `ETA: ${updateDetails.estimatedTime}` : ''}\n\n${updateDetails.message || ''}\n\n${updateDetails.status === 'on_way' ? '🚗 Your driver is on the way!' : ''}\n${updateDetails.status === 'arrived' ? '📍 Driver has arrived at your location!' : ''}\n${updateDetails.status === 'delivered' ? '✅ Order delivered successfully!' : ''}\n\nTrack live: ${window.location.origin}/tracking/${updateDetails.orderId}\n\nThank you for choosing our service! 🚗⛽`;
  }

  // Check if WhatsApp session is active
  async checkSessionStatus(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/status', 'GET');
      return response.connected || false;
    } catch (error) {
      console.error('Failed to check WhatsApp session status:', error);
      return false;
    }
  }

  // Get QR code for WhatsApp session setup
  async getQRCode(): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/sessions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          sessionId: this.config.sessionId,
          readIncomingMessages: false
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.qr || null;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get QR code:', error);
      return null;
    }
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;