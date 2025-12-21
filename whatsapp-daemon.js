import whatsappService from './server/whatsapp-service.js';

console.log('🚀 Starting WhatsApp service for FuelFriendly...');

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