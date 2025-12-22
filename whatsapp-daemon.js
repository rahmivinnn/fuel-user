import whatsappService from './server/whatsapp-service.js';
import express from 'express';

const app = express();
app.use(express.json());

console.log('🚀 Starting WhatsApp service for FuelFriendly...');

// HTTP endpoint for sending OTP
app.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP required' });
    }
    
    await whatsappService.sendOTP(phoneNumber, otp);
    res.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start HTTP server
app.listen(3001, () => {
  console.log('📡 WhatsApp HTTP server running on port 3001');
});

// Initialize WhatsApp
await whatsappService.initialize();

// Keep the service alive and monitor connection
const keepAlive = setInterval(async () => {
  if (!whatsappService.isConnected) {
    console.log('⚠️ WhatsApp disconnected, attempting to reconnect...');
    try {
      await whatsappService.initialize();
    } catch (error) {
      console.error('❌ Failed to reconnect:', error.message);
    }
  } else {
    console.log('✅ WhatsApp service is running');
  }
}, 60000); // Check every minute

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down WhatsApp service...');
  clearInterval(keepAlive);
  await whatsappService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  clearInterval(keepAlive);
  await whatsappService.disconnect();
  process.exit(0);
});

// Keep process alive
process.stdin.resume();