# Google Sheets Setup

## 1. Buat backend

1. Buat Google Sheet baru untuk data game.
2. Dari Sheet, buka **Extensions > Apps Script**.
3. Ganti isi `Code.gs` dengan `apps-script/Code.gs`.
4. Tambahkan file HTML bernama `Bridge`, lalu isi dengan `apps-script/Bridge.html`.
5. Simpan, pilih fungsi `setupCrimsonSheets`, lalu tekan **Run** dan berikan izin akses spreadsheet. Fungsi ini membuat tab `Players`, `Answers`, dan `Settings` serta menyimpan ID Sheet.

## 2. Atur password admin

Di Apps Script, buka **Project Settings > Script Properties** dan tambahkan:

- Property: `ADMIN_PASSWORD`
- Value: password admin yang kuat dan tidak dipakai di tempat lain

Username admin tetap `admin`. Password ini hanya berada di backend Apps Script, bukan di JavaScript halaman.

## 3. Deploy backend

1. Pilih **Deploy > New deployment > Web app**.
2. Pilih **Execute as: Me**.
3. Pilih akses **Anyone** agar halaman game dapat memanggil bridge.
4. Deploy dan salin URL yang berakhiran `/exec`.
5. Di `script.js`, ganti nilai `SHEETS_WEB_APP_URL` dengan URL tersebut.
6. Setelah perubahan backend, pilih **Deploy > Manage deployments > Edit**, buat versi baru, lalu deploy ulang.

Jangan ubah Google Sheet menjadi publik. Endpoint hanya mengembalikan profil peserta yang login dan data admin setelah admin berhasil login. Peserta harus memakai password minimal 8 karakter; server menyimpan hash bersalt, bukan password asli.

## 4. Data yang disimpan

- `Players`: nama, kelas, hash password, avatar, dan pelanggaran.
- `Answers`: jawaban, status benar, poin, dan waktu. XP serta progres misi dihitung ulang dari tab ini.
- `Settings`: status sesi aktif/berakhir.

Data versi lama yang tersimpan di `localStorage` browser tidak diimpor otomatis. Peserta perlu membuat/memasuki akun di backend baru; jangan menyalin password lama ke spreadsheet.

## Catatan

Apps Script menjadi perantara yang mengeksekusi akses sebagai pemilik Sheet. Batasi akses editor Apps Script dan Sheet hanya kepada admin tepercaya. Endpoint publik tetap dapat menerima pendaftaran peserta, jadi gunakan password kuat dan bagikan tautan game hanya kepada kelas yang dituju.

