# 🚀 FUELFRIENDLY - QUICK REFERENCE

## ⚡ Quick Start (1-2-3-4!)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
.\install.ps1

# 3. Run dev server
npm run dev

# 4. Open browser
http://localhost:3000
```

---

## 🔐 Authentication Methods

| Method | Service | Status |
|--------|---------|--------|
| **Email/Password** | Firebase | ✅ Ready |
| **Google Sign-In** | Firebase | ✅ Ready |
| **SMS OTP** | Message Central | ⚠️ Need credentials |
| **Email OTP** | Message Central | ⚠️ Need credentials |
| **WhatsApp OTP** | Evolution API | ⚠️ Need Docker |

---

## 🐳 Evolution API (WhatsApp)

### Start Evolution API
```powershell
docker run -d --name evolution_api -p 8080:8080 -e AUTHENTICATION_API_KEY=rahasialobanget123 atendai/evolution-api:latest
```

### Create Instance
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/instance/create" -Headers @{"apikey"="rahasialobanget123"; "Content-Type"="application/json"} -Body '{"instanceName":"fuelfriendly","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'
```

### Get QR Code
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/instance/connect/fuelfriendly" -Headers @{"apikey"="rahasialobanget123"}
```

### Check Status
```powershell
docker ps
```

---

## 📱 Message Central (SMS/Email)

### Get Credentials
1. Daftar: https://cpaas.messagecentral.com/
2. Login ke dashboard
3. Settings → API Credentials
4. Copy Customer ID & API Key

### Update .env.local
```env
VITE_MESSAGE_CENTRAL_CUSTOMER_ID=your_customer_id
VITE_MESSAGE_CENTRAL_API_KEY=your_api_key
```

---

## 🔧 Environment Variables

File: `.env.local`

```env
# Evolution API (WhatsApp)
VITE_EVOLUTION_API_URL=http://localhost:8080
VITE_EVOLUTION_API_KEY=rahasialobanget123
VITE_EVOLUTION_INSTANCE=fuelfriendly

# Message Central (SMS/Email)
VITE_MESSAGE_CENTRAL_CUSTOMER_ID=
VITE_MESSAGE_CENTRAL_API_KEY=

# API
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🧪 Testing

### Test WhatsApp OTP
1. Login screen → WhatsApp OTP tab
2. Enter: `+628123456789`
3. Click "Send OTP via WhatsApp"
4. Check WhatsApp
5. Enter 6-digit code
6. Click "Verify OTP"

### Test SMS OTP
1. Login screen → SMS OTP tab
2. Enter: `+628123456789`
3. Click "Send OTP via SMS"
4. Check SMS
5. Enter 6-digit code
6. Click "Verify OTP"

### Test Email OTP
1. Login screen → Email OTP tab
2. Enter: `your@email.com`
3. Click "Send OTP via Email"
4. Check email inbox
5. Enter 6-digit code
6. Click "Verify OTP"

---

## 🐛 Troubleshooting

### Docker not found
```powershell
# Install Docker Desktop
https://www.docker.com/products/docker-desktop/
```

### Evolution API not running
```powershell
# Check status
docker ps

# Start if stopped
docker start evolution_api

# Restart
docker restart evolution_api

# View logs
docker logs evolution_api
```

### Port 8080 in use
```powershell
# Use different port
docker run -d --name evolution_api -p 8081:8080 -e AUTHENTICATION_API_KEY=rahasialobanget123 atendai/evolution-api:latest

# Update .env.local
VITE_EVOLUTION_API_URL=http://localhost:8081
```

### OTP not received
- Check phone number format: `+[country][number]`
- Check Evolution API connected (scan QR)
- Check Message Central balance
- Check spam folder (email)

### Dev server not updating
```powershell
# Restart dev server
Ctrl+C
npm run dev
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| `EVOLUTION_API_SETUP.md` | Evolution API setup guide |
| `QUICKSTART.md` | Quick start guide |
| `AUTHENTICATION.md` | Authentication overview |

---

## 🎯 Commands Cheat Sheet

```powershell
# Development
npm run dev              # Start dev server
npm run server           # Start backend server
npm run build            # Build for production

# Docker
docker ps                # List running containers
docker ps -a             # List all containers
docker start evolution_api    # Start container
docker stop evolution_api     # Stop container
docker restart evolution_api  # Restart container
docker logs evolution_api     # View logs
docker rm -f evolution_api    # Remove container

# Setup
.\install.ps1            # Run auto installer
.\setup.ps1              # Run setup wizard
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| **App** | http://localhost:3000 |
| **Backend** | http://localhost:4000 |
| **Evolution API** | http://localhost:8080 |
| **Firebase Console** | https://console.firebase.google.com |

---

## 📞 Support

Jika ada masalah:
1. Cek dokumentasi di folder project
2. Lihat console browser (F12)
3. Cek terminal logs
4. Verify credentials di `.env.local`

---

**Happy Coding! 🚀**
