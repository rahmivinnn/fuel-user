import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { promises as fs } from 'fs'
import path from 'path'
import qrcode from 'qrcode-terminal'

class WhatsAppService {
  constructor() {
    this.sock = null
    this.isConnected = false
    this.sessionPath = path.join(process.cwd(), 'server', 'wa-session')
    this.retryCount = 0
    this.maxRetries = 3
  }

  async clearSession() {
    try {
      console.log('🧹 Clearing WhatsApp session...')
      await fs.rm(this.sessionPath, { recursive: true, force: true })
      console.log('✅ Session cleared successfully')
    } catch (error) {
      console.log('⚠️ Session already clear or error clearing:', error.message)
    }
  }

  async initialize() {
    try {
      // Ensure session directory exists
      await fs.mkdir(this.sessionPath, { recursive: true })
      
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath)
      
      // Create a simple logger that Baileys expects
      const logger = {
        level: 'silent',
        child: () => logger,
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
        trace: () => {}
      }

      this.sock = makeWASocket({
        auth: state,
        logger: logger,
        browser: ['FuelFriendly', 'Chrome', '1.0.0'], // Add browser info
        syncFullHistory: false, // Don't sync full history
        generateHighQualityLinkPreview: false, // Disable link previews
        markOnlineOnConnect: false, // Don't mark as online
        defaultQueryTimeoutMs: 60000, // Increase timeout
      })

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr) {
          console.log('\n📱 SCAN QR CODE INI DENGAN WHATSAPP:')
          console.log('=' .repeat(60))
          qrcode.generate(qr, { small: true })
          console.log('=' .repeat(60))
          console.log('📱 Langkah-langkah:')
          console.log('1. Buka WhatsApp di ponsel')
          console.log('2. Tap menu (3 titik) > Perangkat Tertaut')
          console.log('3. Tap "Tautkan Perangkat"')
          console.log('4. Scan QR code di atas')
          console.log('5. Tunggu pesan "WhatsApp connected successfully!"')
          console.log('=' .repeat(60))
        }
        
        if (connection === 'connecting') {
          console.log('🔄 Connecting to WhatsApp...')
        }
        
        if (connection === 'close') {
          this.isConnected = false
          const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
            ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            : true
          
          console.log('❌ WhatsApp connection closed:', lastDisconnect?.error?.message || 'Unknown error')
          
          if (shouldReconnect) {
            console.log('🔄 Attempting to reconnect in 5 seconds...')
            setTimeout(() => {
              this.initialize()
            }, 5000)
          } else {
            console.log('🚫 Not reconnecting (logged out)')
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp connected successfully!')
          console.log('🎉 Ready to send OTP messages!')
          this.isConnected = true
        }
      })

      this.sock.ev.on('creds.update', saveCreds)
      
    } catch (error) {
      console.error('❌ WhatsApp initialization error:', error)
      // Retry after 10 seconds
      setTimeout(() => {
        console.log('🔄 Retrying WhatsApp initialization...')
        this.initialize()
      }, 10000)
    }
  }

  async sendOTP(phoneNumber, otp) {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp not connected')
    }

    try {
      // Format phone number (remove + and ensure it's valid)
      const formattedNumber = phoneNumber.replace(/[^\d]/g, '')
      const jid = `${formattedNumber}@s.whatsapp.net`
      
      const message = `🔐 *FuelFriendly OTP*\n\nKode verifikasi Anda: *${otp}*\n\nKode berlaku selama 5 menit.\nJangan bagikan kode ini kepada siapapun.`
      
      await this.sock.sendMessage(jid, { text: message })
      
      console.log(`✅ OTP sent to ${phoneNumber}`)
      return { success: true, message: 'OTP sent successfully' }
      
    } catch (error) {
      console.error('❌ Failed to send OTP:', error)
      throw new Error('Failed to send WhatsApp OTP')
    }
  }

  async disconnect() {
    if (this.sock) {
      await this.sock.logout()
      this.isConnected = false
    }
  }
}

export default new WhatsAppService()