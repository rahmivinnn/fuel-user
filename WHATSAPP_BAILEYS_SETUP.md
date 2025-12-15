# WhatsApp OTP dengan Baileys - Setup Guide

## 🎉 Fitur Baru: WhatsApp OTP 100% Gratis!

FuelFriendly sekarang menggunakan **Baileys Library** untuk WhatsApp OTP yang:
- ✅ **100% Gratis Forever** - Tidak ada biaya bulanan
- ✅ **Tanpa Batas** - Kirim OTP sebanyak yang dibutuhkan
- ✅ **Pure JavaScript** - Tidak perlu third-party service
- ✅ **Langsung dari Backend** - Terintegrasi dengan server Node.js

## Setup WhatsApp Baileys

### 1. Install Dependencies ✅ (Sudah Selesai)
```bash
npm install @whiskeysockets/baileys @hapi/boom qrcode-terminal --legacy-peer-deps
```

### 2. Jalankan Server
```bash
npm run server
```

### 3. Scan QR Code
Saat pertama kali menjalankan server, akan muncul QR code di terminal seperti ini:

```
📱 Scan QR code dengan WhatsApp untuk login:
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▀▄  ▄ █▀▀██▄▀██ ▄▄█▄█ ▄▄█▀▀▀▀█▀ ▄▄▄▄▄▄▄ ██ ▄▄▄▄▄ █
█ █   █ █▀▀▄ ▀ █▄▄  ▄█▄▄▀ ▀██▄▀█▀▄▀█▀ ▀▄▄▄ █ █ ▄ ██ █   █ █
...
```

**Cara scan:**
1. Buka WhatsApp di ponsel
2. Tap menu (3 titik) > **Linked Devices**
3. Tap **Link a Device**
4. Scan QR code yang muncul di terminal
5. Tunggu pesan "✅ WhatsApp connected successfully!"

### 4. Session Tersimpan Otomatis
Setelah scan QR sekali, session akan tersimpan di folder `server/wa-session/`.
Tidak perlu scan ulang kecuali logout manual.

### 5. Test API (Opsional)
```bash
node test-whatsapp-api.js
```

## Cara Menggunakan

### 1. Login dengan WhatsApp OTP

1. Buka aplikasi FuelFriendly
2. Di halaman login, pilih **WhatsApp OTP**
3. Masukkan nomor WhatsApp (format: +628123456789 atau 08123456789)
4. Klik **Send OTP via WhatsApp**
5. Buka WhatsApp, cek pesan OTP dari bot
6. Masukkan kode 6 digit
7. Klik **Verify OTP**

### 2. Format Nomor WhatsApp
- **Indonesia**: +628123456789 atau 08123456789
- **Malaysia**: +60123456789
- **Singapura**: +6591234567

## Status Connection

Cek status koneksi WhatsApp:
```
GET /api/whatsapp/status
```

Response:
```json
{
  "connected": true,
  "message": "WhatsApp connected"
}
```

## API Endpoints

### Send WhatsApp OTP
```
POST /api/otp/whatsapp/send
Content-Type: application/json

{
  "phoneNumber": "+628123456789"
}
```

### Verify WhatsApp OTP
```
POST /api/otp/whatsapp/verify
Content-Type: application/json

{
  "phoneNumber": "+628123456789",
  "otp": "123456"
}
```

## Troubleshooting

### ❌ "Tidak dapat menautkan perangkat" / "Can't link device"

**Penyebab umum:**
- QR code expired (lebih dari 20 detik)
- Session lama masih tersimpan
- WhatsApp Web sudah terbuka di browser lain
- Koneksi internet tidak stabil

**Solusi step-by-step:**

#### 1. Reset Session (Paling Efektif)
```bash
# Matikan server dulu (Ctrl+C)
# Hapus session lama
rmdir /s /q server\wa-session
# Atau di PowerShell:
Remove-Item -Recurse -Force server\wa-session

# Jalankan server lagi
npm run server
```

#### 2. Gunakan API Reset (Alternatif)
Buka browser dan akses:
```
POST http://localhost:4000/api/whatsapp/reset
```

#### 3. Pastikan WhatsApp Bersih
- Tutup WhatsApp Web di semua browser
- Buka WhatsApp di ponsel > Menu > Perangkat Tertaut
- Logout semua perangkat yang tidak dikenal
- Restart WhatsApp di ponsel

#### 4. Scan QR dengan Cepat
- QR code berubah setiap 20 detik
- Scan segera setelah QR muncul
- Jangan tunggu terlalu lama

### Error: "WhatsApp not connected"
**Solusi:**
1. Cek status: `GET http://localhost:4000/api/whatsapp/status`
2. Reset session: `POST http://localhost:4000/api/whatsapp/reset`
3. Restart server: `npm run server`

### Error: "Failed to send WhatsApp OTP"
**Solusi:**
1. Cek nomor WhatsApp valid dan aktif
2. Pastikan nomor terdaftar di WhatsApp
3. Cek koneksi WhatsApp: `GET http://localhost:4000/api/whatsapp/status`

### QR Code tidak muncul
**Solusi:**
1. Hapus folder `server/wa-session/`
2. Restart server
3. QR code akan muncul untuk scan ulang

### Session sering terputus
**Solusi:**
1. Pastikan koneksi internet stabil
2. Jangan logout dari WhatsApp di ponsel
3. Jangan hapus chat dengan "FuelFriendly" di WhatsApp

## Keunggulan vs Message Central/Evolution API

| Fitur | Baileys | Message Central | Evolution API |
|-------|---------|-----------------|---------------|
| **Biaya** | 🟢 Gratis Forever | 🔴 Berbayar | 🟡 Setup Kompleks |
| **Limit** | 🟢 Tanpa Batas | 🔴 Ada Limit | 🟡 Tergantung Setup |
| **Setup** | 🟢 Scan QR Sekali | 🔴 Perlu API Key | 🔴 Perlu Docker/VPS |
| **Maintenance** | 🟢 Minimal | 🔴 Perlu Top Up | 🔴 Perlu Maintain Server |
| **Reliability** | 🟢 Tinggi | 🟡 Tergantung Provider | 🟡 Tergantung Setup |

## File Structure

```
server/
├── whatsapp-service.js     # Baileys WhatsApp service
├── otp-service.js          # OTP management
├── wa-session/             # WhatsApp session data (auto-generated)
└── data/
    └── otps.json          # OTP storage (temporary)
```

## Security Notes

- Session data disimpan lokal di `server/wa-session/`
- OTP berlaku 5 menit
- OTP otomatis expired dan dihapus
- Nomor WhatsApp divalidasi sebelum kirim OTP

## Production Deployment

Untuk production:
1. Gunakan Redis untuk OTP storage (ganti Map di `otp-service.js`)
2. Setup monitoring untuk WhatsApp connection
3. Backup session data secara berkala
4. Setup auto-restart jika connection terputus

---

🎉 **Selamat! WhatsApp OTP Baileys sudah siap digunakan!**

Tidak perlu lagi bayar Message Central atau setup Evolution API yang ribet.
Cukup scan QR sekali, langsung bisa kirim OTP WhatsApp gratis selamanya! 🚀