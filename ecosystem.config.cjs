module.exports = {
  apps: [{
    name: 'fuel-user-api',
    script: 'server/index.js',
    cwd: '/root/fuel-user',
    env: {
      NODE_ENV: 'development',
      PORT: 4000,
      RESEND_API_KEY: 're_dqtrUVUR_7F6Q46KKxviBmf1YFRgeUPep',
      TWILIO_ACCOUNT_SID: 'SK9ffb759f2f6aaac4f065ae673e7b0ffc',
      TWILIO_AUTH_TOKEN: '40e356431aadcc5eae075e9c80cde595',
      TWILIO_PHONE_NUMBER: '+6282261402001'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000,
      RESEND_API_KEY: 're_dqtrUVUR_7F6Q46KKxviBmf1YFRgeUPep',
      TWILIO_ACCOUNT_SID: 'SK9ffb759f2f6aaac4f065ae673e7b0ffc',
      TWILIO_AUTH_TOKEN: '40e356431aadcc5eae075e9c80cde595',
      TWILIO_PHONE_NUMBER: '+6282261402001'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true
  }]
};