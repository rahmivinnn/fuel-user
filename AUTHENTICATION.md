# FuelFriendly Authentication

## Metode Login yang Tersedia

Aplikasi FuelFriendly saat ini mendukung 2 metode autentikasi:

### 1. Email/Password Login
- Login tradisional menggunakan email dan password
- User harus mendaftar terlebih dahulu melalui halaman registrasi
- Password tersimpan dengan aman menggunakan Firebase Authentication

### 2. Google Sign-In
- Login cepat menggunakan akun Google
- Tidak perlu membuat password baru
- Otomatis membuat akun jika belum terdaftar

## Cara Menggunakan

### Login dengan Email/Password
1. Buka halaman login
2. Masukkan email dan password Anda
3. Klik tombol "Log In"

### Login dengan Google
1. Buka halaman login
2. Klik tombol "Continue with Google"
3. Pilih akun Google yang ingin digunakan
4. Berikan izin akses yang diperlukan

## Konfigurasi Firebase

Pastikan Firebase sudah dikonfigurasi dengan benar di file `firebase.config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Enable Authentication Methods di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Buka **Authentication** > **Sign-in method**
4. Enable:
   - **Email/Password**
   - **Google**

## Keamanan

- Semua password di-hash oleh Firebase Authentication
- Token autentikasi dikelola secara otomatis
- Session management ditangani oleh Firebase
- Logout akan menghapus semua token lokal

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run backend server (terminal terpisah)
npm run server
```

## Troubleshooting

### Error: "Invalid email or password"
- Pastikan email dan password yang dimasukkan benar
- Cek apakah akun sudah terdaftar

### Error: "Google login failed"
- Pastikan Google Sign-In sudah diaktifkan di Firebase Console
- Cek koneksi internet
- Pastikan popup tidak diblokir oleh browser

### Error: "Network error"
- Cek koneksi internet
- Pastikan Firebase configuration sudah benar
- Pastikan backend server berjalan (port 4000)

## Notes

- Metode OTP (SMS dan Email) telah dihapus karena memerlukan konfigurasi billing Firebase yang kompleks
- Aplikasi sekarang lebih sederhana dan stabil dengan hanya 2 metode autentikasi
- Untuk production, pertimbangkan menambahkan fitur "Forgot Password"
