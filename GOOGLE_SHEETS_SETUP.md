# Menjalankan Game dengan Node.js dan Google Sheets

Game sekarang mengirim permintaan ke API Node.js di `/api/game`. Browser tidak lagi memanggil Google Apps Script secara langsung. Kunci service account hanya disimpan di server lokal atau Vercel, bukan di HTML/JavaScript frontend.

## 1. Siapkan Google Sheet

1. Gunakan spreadsheet yang sudah ada atau buat Google Sheet baru.
2. Salin ID dari URL. ID adalah bagian di antara `/d/` dan `/edit`:
   `https://docs.google.com/spreadsheets/d/ID_SPREADSHEET/edit`
3. Biarkan spreadsheet tetap privat.

API akan membuat tab yang belum ada: `Players`, `Answers`, `Settings`, `Sessions`, dan `LoginAttempts`, termasuk baris judulnya.

## 2. Buat kredensial service account

1. Buka Google Cloud Console, lalu buat atau pilih project.
2. Aktifkan **Google Sheets API** untuk project itu.
3. Buat **Service Account**, lalu buat dan unduh key JSON.
4. Dari file JSON, salin nilai `client_email` dan `private_key`. Jaga file JSON tetap rahasia—jangan commit ke GitHub dan jangan tempel ke JavaScript frontend.
5. Bagikan spreadsheet ke alamat `client_email` service account dan beri akses **Editor**. Sheet tidak perlu dijadikan publik.

## 3. Jalankan di komputer lokal

1. Instal Node.js versi 20 atau lebih baru.
2. Di folder project, salin `.env.example` menjadi `.env`.
3. Isi nilai di `.env`:
   - `GOOGLE_SHEET_ID`: ID spreadsheet dari langkah 1.
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: nilai `client_email`.
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: nilai `private_key`, termasuk baris BEGIN/END. Pertahankan tanda kutip dan format `\n`.
   - `ADMIN_PASSWORD`: password admin yang kuat dan unik.
4. Buka terminal VS Code di folder project dan jalankan:

   ```powershell
   npm start
   ```

5. Buka `http://localhost:3000`. Coba login admin, mulai sesi, lalu tes pendaftaran peserta dan penyimpanan jawaban.

Server lokal menggunakan modul bawaan Node.js, jadi tidak perlu `npm install`. Jangan kirim atau commit file `.env`.

## 4. Deploy ke Vercel

1. Push project ke repository GitHub yang terhubung dengan Vercel. Pastikan `api/game.js`, folder `lib/`, `server.js`, `package.json`, dan file frontend ikut ter-push.
2. Di Vercel, buka **Project > Settings > Environment Variables**.
3. Tambahkan empat variabel yang sama dengan `.env` untuk environment **Production**. Tambahkan juga untuk Preview/Development jika diperlukan.
4. Redeploy project setelah menambah atau mengubah environment variable.
5. Buka situs Vercel, tekan **Ctrl+F5**, lalu pastikan status berubah menjadi **TERHUBUNG KE GOOGLE SHEETS**.
6. Login admin dengan username `admin` dan password dari `ADMIN_PASSWORD`.

Vercel menjalankan `api/game.js` sebagai Node.js serverless function. Frontend memanggil `/api/game` pada domain yang sama. URL Web App `/exec`, Apps Script, dan file bridge tidak lagi dipakai.
Pembaruan status sesi peserta diperiksa setiap 30 detik untuk mengurangi pemakaian kuota Google Sheets.

## Jika terjadi error

- **Konfigurasi Vercel belum lengkap**: periksa nama keempat environment variable, lalu redeploy.
- **Google Sheets API: ... permission denied**: pastikan spreadsheet dibagikan ke `client_email` service account sebagai Editor dan Sheets API sudah aktif.
- **Requested entity was not found**: periksa `GOOGLE_SHEET_ID`; isinya ID saja, bukan seluruh URL.
- **ADMIN_PASSWORD belum diatur**: tambahkan variabel tersebut di Vercel lalu redeploy.
- Setelah mengubah `.env` lokal, hentikan dan jalankan kembali `npm start`.
- Properti `SHEET_ID` dan `ADMIN_PASSWORD` lama di Apps Script tidak dipakai Node.js. Atur `GOOGLE_SHEET_ID` dan `ADMIN_PASSWORD` di `.env` atau Vercel Environment Variables.

## Data yang disimpan

- `Players`: profil peserta dan hash password bersalt.
- `Answers`: jawaban, skor, dan waktu pengiriman.
- `Settings`: status sesi aktif/berakhir.
- `Sessions`: hash token login, masa berlaku, dan status logout.
- `LoginAttempts`: penghitung percobaan login gagal dan masa cooldown.

File di `apps-script/` adalah versi lama dan tidak digunakan oleh deployment Node.js.
