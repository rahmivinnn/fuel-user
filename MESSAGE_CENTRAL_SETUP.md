# Message Central OTP Integration Guide

## Overview

FuelFriendly sekarang menggunakan **Message Central** untuk OTP authentication dengan support untuk:
- ✅ **SMS OTP** - Kode verifikasi via SMS
- ✅ **Email OTP** - Kode verifikasi via Email  
- ✅ **WhatsApp OTP** - Kode verifikasi via WhatsApp

## Setup Message Central Account

### 1. Daftar di Message Central

1. Buka [Message Central](https://cpaas.messagecentral.com/)
2. Klik **Sign Up** atau **Get Started**
3. Lengkapi form registrasi
4. Verifikasi email Anda
5. Login ke dashboard

### 2. Dapatkan API Credentials

1. Login ke [Message Central Dashboard](https://cpaas.messagecentral.com/)
2. Buka **Settings** atau **API Credentials**
3. Catat informasi berikut:
   - **Customer ID** - ID unik untuk akun Anda
   - **API Key** - Key untuk autentikasi API

### 3. Konfigurasi Environment Variables

1. Copy file `.env.local.example` menjadi `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` dan isi dengan credentials Anda:
   ```env
   VITE_MESSAGE_CENTRAL_CUSTOMER_ID=your_customer_id_here
   VITE_MESSAGE_CENTRAL_API_KEY=your_api_key_here
   ```

### 4. Enable OTP Services

Di Message Central Dashboard:

1. **Untuk SMS OTP:**
   - Buka **SMS** > **Settings**
   - Enable **OTP Service**
   - Konfigurasi sender ID (jika diperlukan)

2. **Untuk Email OTP:**
   - Buka **Email** > **Settings**
   - Enable **OTP Service**
   - Konfigurasi sender email (jika diperlukan)

3. **Untuk WhatsApp OTP:**
   - Buka **WhatsApp** > **Settings**
   - Enable **WhatsApp Business API**
   - Hubungkan nomor WhatsApp Business Anda
   - Enable **OTP Service**

## Cara Menggunakan

### 1. SMS OTP Login

1. Pilih tab **SMS OTP** di halaman login
2. Masukkan nomor telepon dengan format internasional
   - Contoh: `+628123456789` (Indonesia)
   - Contoh: `+60123456789` (Malaysia)
3. Klik **Send OTP via SMS**
4. Cek SMS di ponsel Anda
5. Masukkan kode 6 digit yang diterima
6. Klik **Verify OTP**

### 2. Email OTP Login

1. Pilih tab **Email OTP** di halaman login
2. Masukkan alamat email Anda
3. Klik **Send OTP via Email**
4. Cek inbox email Anda
5. Masukkan kode 6 digit yang diterima
6. Klik **Verify OTP**

### 3. WhatsApp OTP Login

1. Pilih tab **WhatsApp OTP** di halaman login
2. Masukkan nomor WhatsApp dengan format internasional
   - Contoh: `+628123456789`
3. Klik **Send OTP via WhatsApp**
4. Buka WhatsApp dan cek pesan dari Message Central
5. Masukkan kode 6 digit yang diterima
6. Klik **Verify OTP**

## Fitur OTP

### OTP Expiry
- Kode OTP berlaku selama **5 menit** (300 detik)
- Setelah expired, harus request OTP baru

### Resend OTP
- Tombol **Resend OTP** tersedia setelah 60 detik
- Countdown timer menunjukkan waktu tunggu
- Klik **Resend OTP** untuk mengirim ulang kode

### OTP Length
- Semua OTP menggunakan **6 digit** angka
- Format: `123456`

## API Endpoints

Message Central menggunakan base URL:
```
https://cpaas.messagecentral.com
```

### Authentication
```
GET /auth/v1/authentication/token
```

### Send OTP
```
POST /verification/v3/send
```

### Verify OTP
```
GET /verification/v3/validateOtp
```

### Resend OTP
```
GET /verification/v3/retry
```

## Testing

### Development Testing

1. **Test dengan nomor/email sendiri:**
   ```
   Phone: +62812XXXXXXX (nomor Anda)
   Email: your.email@example.com
   ```

2. **Cek OTP di:**
   - SMS: Inbox ponsel Anda
   - Email: Inbox email Anda
   - WhatsApp: Chat WhatsApp Anda

### Sandbox Mode

Message Central menyediakan sandbox untuk testing:
- Tidak mengirim SMS/Email/WhatsApp real
- Menggunakan test credentials
- Lihat dokumentasi Message Central untuk detail

## Troubleshooting

### Error: "Failed to get auth token"

**Penyebab:**
- Customer ID atau API Key salah
- Credentials tidak valid

**Solusi:**
1. Cek `.env.local` file
2. Pastikan `VITE_MESSAGE_CENTRAL_CUSTOMER_ID` dan `VITE_MESSAGE_CENTRAL_API_KEY` benar
3. Login ke Message Central dashboard dan verifikasi credentials
4. Restart development server setelah update `.env.local`

### Error: "Failed to send OTP"

**Penyebab:**
- Format nomor telepon salah
- Email tidak valid
- Service belum diaktifkan di Message Central

**Solusi:**
1. **Untuk SMS/WhatsApp:**
   - Gunakan format internasional: `+[country_code][number]`
   - Contoh: `+628123456789` bukan `08123456789`
2. **Untuk Email:**
   - Pastikan format email valid
   - Cek spam folder
3. **Cek Message Central Dashboard:**
   - Pastikan service sudah enabled
   - Cek balance/credits

### Error: "Invalid OTP code"

**Penyebab:**
- Kode OTP salah
- OTP sudah expired (>5 menit)
- OTP sudah digunakan

**Solusi:**
1. Pastikan memasukkan kode yang benar
2. Request OTP baru jika sudah expired
3. Gunakan kode terbaru jika sudah resend

### OTP tidak diterima

**Solusi:**
1. **SMS:**
   - Cek sinyal ponsel
   - Cek inbox dan blocked messages
   - Tunggu beberapa menit (delay network)

2. **Email:**
   - Cek spam/junk folder
   - Cek email address benar
   - Whitelist sender email

3. **WhatsApp:**
   - Pastikan nomor WhatsApp aktif
   - Cek koneksi internet
   - Pastikan tidak memblokir nomor business

## Security Best Practices

1. **Jangan commit credentials:**
   - `.env.local` sudah ada di `.gitignore`
   - Jangan share API key di public

2. **Rate Limiting:**
   - Message Central otomatis limit request
   - Jangan spam send OTP

3. **OTP Validation:**
   - OTP hanya valid 1x pakai
   - Expired setelah 5 menit
   - Tidak bisa reuse

4. **Production:**
   - Gunakan environment variables
   - Enable monitoring di Message Central
   - Set up alerts untuk usage

## Pricing

Message Central menggunakan pay-per-use model:
- **SMS OTP:** ~$0.05 per SMS (tergantung negara)
- **Email OTP:** Gratis atau sangat murah
- **WhatsApp OTP:** ~$0.01-0.05 per message

Cek [Message Central Pricing](https://cpaas.messagecentral.com/pricing) untuk detail.

## Support

- **Documentation:** https://cpaas.messagecentral.com/docs
- **API Reference:** https://cpaas.messagecentral.com/api
- **Support:** support@messagecentral.com
- **Dashboard:** https://cpaas.messagecentral.com/

## Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local dengan credentials Anda

# Run development server
npm run dev

# Run backend server (terminal terpisah)
npm run server
```

## Production Deployment

1. **Set environment variables** di hosting platform
2. **Update CORS** di backend untuk production domain
3. **Monitor usage** di Message Central dashboard
4. **Set up alerts** untuk low balance
5. **Enable logging** untuk debugging

---

**Note:** Message Central adalah solusi enterprise-grade untuk OTP. Pastikan Anda memiliki credits/balance yang cukup sebelum production deployment.
