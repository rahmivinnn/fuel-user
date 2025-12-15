# Evolution API Setup - WhatsApp OTP

## 🚀 Quick Setup (5 Menit!)

Evolution API adalah self-hosted WhatsApp API yang lo kontrol sendiri. Gampang banget setupnya!

### **Step 1: Install Docker** (kalau belum punya)

Download dan install Docker Desktop:
- Windows: https://www.docker.com/products/docker-desktop/
- Mac: https://www.docker.com/products/docker-desktop/
- Linux: `sudo apt install docker.io`

### **Step 2: Jalankan Evolution API**

Buka terminal/PowerShell dan jalankan:

```bash
docker run -d \
  --name evolution_api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=rahasialobanget123 \
  atendai/evolution-api:latest
```

**Windows PowerShell:**
```powershell
docker run -d --name evolution_api -p 8080:8080 -e AUTHENTICATION_API_KEY=rahasialobanget123 atendai/evolution-api:latest
```

**Ganti `rahasialobanget123` dengan API key lo sendiri** (panjang & random biar aman!)

### **Step 3: Cek Evolution API Running**

Buka browser: **http://localhost:8080**

Kalau muncul welcome message, berarti udah jalan! ✅

### **Step 4: Setup .env.local**

Buat/edit file `.env.local`:

```env
# Evolution API
VITE_EVOLUTION_API_URL=http://localhost:8080
VITE_EVOLUTION_API_KEY=rahasialobanget123
VITE_EVOLUTION_INSTANCE=fuelfriendly
```

### **Step 5: Create WhatsApp Instance**

Jalankan command ini (ganti API key sesuai yang lo set):

```bash
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: rahasialobanget123" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "fuelfriendly",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/instance/create" -Headers @{"apikey"="rahasialobanget123"; "Content-Type"="application/json"} -Body '{"instanceName":"fuelfriendly","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'
```

### **Step 6: Scan QR Code**

1. Get QR Code:
```bash
curl -X GET http://localhost:8080/instance/connect/fuelfriendly \
  -H "apikey: rahasialobanget123"
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/instance/connect/fuelfriendly" -Headers @{"apikey"="rahasialobanget123"}
```

2. Response akan ada `base64` QR code
3. Buka WhatsApp di HP
4. Settings > Linked Devices > Link a Device
5. Scan QR code

### **Step 7: Test Kirim Pesan**

```bash
curl -X POST http://localhost:8080/message/sendText/fuelfriendly \
  -H "apikey: rahasialobanget123" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "628123456789",
    "text": "Test dari FuelFriendly!"
  }'
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:8080/message/sendText/fuelfriendly" -Headers @{"apikey"="rahasialobanget123"; "Content-Type"="application/json"} -Body '{"number":"628123456789","text":"Test dari FuelFriendly!"}'
```

---

## 🎯 Cara Pakai di FuelFriendly

Setelah setup selesai:

1. **Restart dev server:**
```bash
# Ctrl+C lalu
npm run dev
```

2. **Buka app:** http://localhost:3000

3. **Test WhatsApp OTP:**
   - Klik "Sign In"
   - Pilih tab "WhatsApp OTP"
   - Masukkan nomor WhatsApp: `+628123456789`
   - Klik "Send OTP via WhatsApp"
   - Cek WhatsApp lo
   - Masukkan kode 6 digit
   - Klik "Verify OTP"

---

## 📋 Docker Commands

### Cek Status
```bash
docker ps
```

### Stop Evolution API
```bash
docker stop evolution_api
```

### Start Evolution API
```bash
docker start evolution_api
```

### Restart Evolution API
```bash
docker restart evolution_api
```

### Lihat Logs
```bash
docker logs evolution_api
```

### Hapus Container
```bash
docker rm -f evolution_api
```

---

## 🔧 Troubleshooting

### Error: "Port 8080 already in use"

Port 8080 udah dipake aplikasi lain. Ganti port:

```bash
docker run -d --name evolution_api -p 8081:8080 -e AUTHENTICATION_API_KEY=rahasialobanget123 atendai/evolution-api:latest
```

Lalu update `.env.local`:
```env
VITE_EVOLUTION_API_URL=http://localhost:8081
```

### Error: "Failed to send WhatsApp OTP"

1. **Cek Evolution API running:**
   ```bash
   docker ps
   ```

2. **Cek instance status:**
   ```bash
   curl -H "apikey: rahasialobanget123" http://localhost:8080/instance/connectionState/fuelfriendly
   ```

3. **Pastikan WhatsApp connected** (scan QR lagi kalau perlu)

### QR Code Expired

QR code expired setelah 60 detik. Get QR baru:

```bash
curl -H "apikey: rahasialobanget123" http://localhost:8080/instance/connect/fuelfriendly
```

### WhatsApp Disconnected

Kalau WhatsApp disconnect, scan QR lagi atau restart instance:

```bash
docker restart evolution_api
```

---

## 🌐 Production Deployment

### Deploy ke Cloud (Render/Railway/Vercel)

1. **Push ke GitHub** (jangan commit API key!)

2. **Set Environment Variables:**
   ```
   AUTHENTICATION_API_KEY=your-secret-key-here
   PORT=8080
   ```

3. **Deploy** menggunakan Docker image:
   ```
   atendai/evolution-api:latest
   ```

4. **Update .env.local** dengan production URL:
   ```env
   VITE_EVOLUTION_API_URL=https://your-evolution-api.onrender.com
   VITE_EVOLUTION_API_KEY=your-secret-key-here
   ```

---

## 🔐 Security Best Practices

1. **Jangan share API key** di public repo
2. **Gunakan strong API key** (panjang & random)
3. **Enable HTTPS** di production
4. **Set rate limiting** untuk prevent spam
5. **Monitor usage** untuk detect abuse

---

## 📚 Evolution API Endpoints

### Instance Management
- `POST /instance/create` - Create instance
- `GET /instance/connect/{instance}` - Get QR code
- `GET /instance/connectionState/{instance}` - Check status
- `DELETE /instance/logout/{instance}` - Logout

### Messaging
- `POST /message/sendText/{instance}` - Send text message
- `POST /message/sendMedia/{instance}` - Send media
- `POST /message/sendAudio/{instance}` - Send audio

### Full Documentation
https://github.com/EvolutionAPI/evolution-api

---

## ✨ Features

- ✅ Self-hosted (lo kontrol sendiri)
- ✅ Gratis (no monthly fee)
- ✅ Unlimited messages
- ✅ Fast setup (5 menit)
- ✅ Docker support
- ✅ Multi-instance support
- ✅ Webhook support
- ✅ Media support (image, video, audio, document)

---

**Selamat! WhatsApp OTP lo sekarang udah jalan! 🎉**
