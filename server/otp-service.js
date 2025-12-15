import { promises as fs } from 'fs'
import path from 'path'
import whatsappService from './whatsapp-service.js'

class OTPService {
  constructor() {
    this.otpStorage = new Map() // In production, use Redis or database
    this.otpFile = path.join(process.cwd(), 'server', 'data', 'otps.json')
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async saveOTP(identifier, otp, type = 'whatsapp') {
    const otpData = {
      otp,
      type,
      createdAt: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
      verified: false
    }
    
    this.otpStorage.set(identifier, otpData)
    
    // Also save to file for persistence
    try {
      await fs.mkdir(path.dirname(this.otpFile), { recursive: true })
      const allOtps = Object.fromEntries(this.otpStorage)
      await fs.writeFile(this.otpFile, JSON.stringify(allOtps, null, 2))
    } catch (error) {
      console.error('Failed to save OTP to file:', error)
    }
  }

  async getOTP(identifier) {
    return this.otpStorage.get(identifier)
  }

  async verifyOTP(identifier, inputOtp) {
    const otpData = this.otpStorage.get(identifier)
    
    if (!otpData) {
      return { success: false, error: 'OTP not found' }
    }
    
    if (otpData.verified) {
      return { success: false, error: 'OTP already used' }
    }
    
    if (Date.now() > otpData.expiresAt) {
      this.otpStorage.delete(identifier)
      return { success: false, error: 'OTP expired' }
    }
    
    if (otpData.otp !== inputOtp) {
      return { success: false, error: 'Invalid OTP' }
    }
    
    // Mark as verified
    otpData.verified = true
    this.otpStorage.set(identifier, otpData)
    
    return { success: true, message: 'OTP verified successfully' }
  }

  async sendWhatsAppOTP(phoneNumber) {
    try {
      const otp = this.generateOTP()
      await this.saveOTP(phoneNumber, otp, 'whatsapp')
      
      const result = await whatsappService.sendOTP(phoneNumber, otp)
      
      return {
        success: true,
        message: 'OTP sent via WhatsApp',
        expiresIn: 300 // 5 minutes
      }
    } catch (error) {
      console.error('WhatsApp OTP error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send WhatsApp OTP'
      }
    }
  }

  // Send OTP via Email using SendGrid
  async sendEmailOTP(email) {
    try {
      // Check if SendGrid API key is configured
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API credentials not configured');
      }

      console.log('📧 Using SendGrid for email OTP');
      const otp = this.generateOTP();
      await this.saveOTP(email, otp, 'email');
      
      // Import and use SendGrid service
      const { sendEmailOTP: sendGridSendEmailOTP } = await import('./services/sendgrid.service.js');
      const result = await sendGridSendEmailOTP(email, otp);
      
      if (result.success) {
        return {
          success: true,
          message: 'OTP sent via Email',
          expiresIn: 300 // 5 minutes
        };
      } else {
        // If SendGrid fails, return the error
        console.error('SendGrid email failed:', result.error);
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Email OTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send Email OTP'
      };
    }
  }

  // Cleanup expired OTPs
  cleanupExpiredOTPs() {
    const now = Date.now()
    for (const [identifier, otpData] of this.otpStorage.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStorage.delete(identifier)
      }
    }
  }
}

export default new OTPService()