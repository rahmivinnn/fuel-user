# FuelFriendly - Quick Start Guide

## 🚀 Metode Login Tersedia

FuelFriendly mendukung **5 metode autentikasi**:

1. **Email/Password** - Login tradisional
2. **SMS OTP** - Kode verifikasi via SMS
3. **Email OTP** - Kode verifikasi via Email
4. **WhatsApp OTP** - Kode verifikasi via WhatsApp
5. **Google Sign-In** - Login dengan akun Google

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local
```

Edit `.env.local` dan isi dengan credentials Anda:

```env
# Message Central OTP (REQUIRED untuk OTP features)
VITE_MESSAGE_CENTRAL_CUSTOMER_ID=your_customer_id
VITE_MESSAGE_CENTRAL_API_KEY=your_api_key

# Firebase (REQUIRED untuk Email/Password & Google login)
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... (lihat .env.local.example untuk lengkapnya)
```

### 3. Run Application

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server
```

Buka browser: **http://localhost:3000**

## 📋 Setup Credentials

### Message Central (untuk OTP)

1. Daftar di [Message Central](https://cpaas.messagecentral.com/)
2. Dapatkan **Customer ID** dan **API Key**
3. Masukkan ke `.env.local`

**Detail:** Lihat [MESSAGE_CENTRAL_SETUP.md](./MESSAGE_CENTRAL_SETUP.md)

### Firebase (untuk Email/Password & Google)

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** > **Email/Password** dan **Google**
3. Copy config ke `.env.local`

**Detail:** Lihat [AUTHENTICATION.md](./AUTHENTICATION.md)

## 🎯 Testing OTP

### SMS OTP
```
Format: +[country_code][number]
Example: +628123456789
```

### Email OTP
```
Format: valid email
Example: user@example.com
```

### WhatsApp OTP
```
Format: +[country_code][number]
Example: +628123456789
```

## 🔧 Troubleshooting

### OTP tidak terkirim?

1. **Cek credentials** di `.env.local`
2. **Restart server** setelah update env
3. **Cek format** nomor/email
4. **Lihat console** untuk error details

### Error "Failed to get auth token"?

- Credentials Message Central salah
- Cek `VITE_MESSAGE_CENTRAL_CUSTOMER_ID` dan `VITE_MESSAGE_CENTRAL_API_KEY`

### OTP expired?

- OTP berlaku **5 menit**
- Klik **Resend OTP** untuk kode baru

## 📚 Documentation

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Setup autentikasi
- [README.md](./README.md) - Project overview

## 🎨 Features

- ✅ Multi-channel OTP (SMS, Email, WhatsApp)
- ✅ OTP resend dengan countdown timer
- ✅ Auto-expire OTP (5 menit)
- ✅ Google Sign-In integration
- ✅ Email/Password authentication
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Real-time validation

## 🔐 Security

- OTP hanya valid 1x pakai
- Auto-expire setelah 5 menit
- Rate limiting otomatis
- Secure token management

## 📞 Support

Jika ada masalah:
1. Cek dokumentasi di folder ini
2. Lihat console browser untuk errors
3. Verify credentials di `.env.local`

---

**Happy Coding! 🚀**
