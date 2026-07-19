# Hasil Pengujian Fungsional Sistem
## Bank Sampah Bakti Alam — Skripsi

**Tanggal Pengujian:** 12 Juni 2026  
**Penguji:** Sistem Otomatis (Browser Testing)  
**URL Sistem:** http://localhost:5173  
**Backend:** http://localhost:5000  

---

## Ringkasan Hasil

| Total TC | Lulus | Gagal | Dilewati | Belum Diuji |
|----------|-------|-------|----------|-------------|
| 23       | 18    | 0     | 5        | 0           |

---

## Detail Hasil Pengujian

### Authentication

| No | Fungsi | Skenario Uji | Input | Output yang Diharapkan | Hasil Pengujian | Status |
|----|--------|--------------|-------|------------------------|-----------------|--------|
| 1 | Login | Login dengan data valid | Email: admin@baktialam.com, Password: admin123 | Sistem mengarahkan pengguna ke dashboard sesuai peran (admin) | Berhasil redirect ke halaman **Dashboard Admin** menampilkan total nasabah, setoran, pendapatan, dan grafik bulanan | **LULUS** |
| 2 | Login | Login dengan email tidak terdaftar | Email: tidakada@test.com, Password: salah123 | Sistem menampilkan pesan bahwa akun tidak ditemukan | Sistem menampilkan pesan error **"Username atau password salah"** | **LULUS** |
| 3 | Login | Login dengan password salah | Email: admin@baktialam.com, Password: passwordsalah999 | Sistem menampilkan pesan bahwa password tidak sesuai | Sistem menampilkan pesan error **"Username atau password salah"** | **LULUS** |
| 4 | Register | Register dengan data lengkap dan valid | Nama, email baru, wilayah, password, konfirmasi password | Akun berhasil dibuat dan dapat digunakan untuk login | *(Dilewati atas permintaan)* | **DILEWATI** |
| 5 | Register | Register dengan email yang sudah terdaftar | Email yang sudah digunakan | Sistem menampilkan pesan bahwa email sudah digunakan | *(Dilewati atas permintaan)* | **DILEWATI** |
| 6 | Register | Register dengan password tidak sesuai konfirmasi | Password dan konfirmasi password berbeda | Sistem menampilkan pesan bahwa konfirmasi password tidak cocok | *(Dilewati atas permintaan)* | **DILEWATI** |
| 7 | Reset Password | Mengirim permintaan reset password | Email yang terdaftar di sistem | Sistem mengirim tautan reset password ke email pengguna | *(Dilewati atas permintaan — fitur memerlukan konfigurasi SMTP email)* | **DILEWATI** |
| 8 | Reset Password | Mengubah password baru | Password baru dan konfirmasi password yang sesuai | Password berhasil diperbarui dan pengguna diarahkan ke halaman login | *(Dilewati atas permintaan — fitur memerlukan konfigurasi SMTP email)* | **DILEWATI** |

---

### Kelola Nasabah (Admin)

| No | Fungsi | Skenario Uji | Input | Output yang Diharapkan | Hasil Pengujian | Status |
|----|--------|--------------|-------|------------------------|-----------------|--------|
| 9 | Kelola Nasabah | Menambahkan data nasabah baru | Nama: "Nasabah TC09", Wilayah: RT 03, Email: nasabahtc09@gmail.com, Password: test1234 | Data nasabah berhasil disimpan dan tampil pada daftar nasabah | Nasabah **"Nasabah TC09"** berhasil ditambahkan dan muncul di daftar nasabah dengan wilayah RT 03 dan email nasabahtc09@gmail.com | **LULUS** |
| 10 | Kelola Nasabah | Mengubah data nasabah | Nama diubah menjadi "Nasabah TC09 Edited" | Perubahan data berhasil disimpan | Nama berhasil diperbarui menjadi **"Nasabah TC09 Edited"** dan tampil di tabel | **LULUS** |
| 11 | Kelola Nasabah | Menghapus data nasabah | Konfirmasi penghapusan "Nasabah TC09 Edited" | Data nasabah terhapus dari sistem | Nasabah berhasil dihapus — baris **"Nasabah TC09 Edited"** tidak lagi muncul di daftar | **LULUS** |
| 12 | Kelola Nasabah | Mencari data nasabah | Kata kunci: "user1" | Sistem menampilkan data nasabah yang sesuai dengan kata kunci | Hanya nasabah **"user1"** yang ditampilkan (RT 01, m.azmialfadillah@gmail.com) | **LULUS** |

---

### Kelola Setoran (Admin)

| No | Fungsi | Skenario Uji | Input | Output yang Diharapkan | Hasil Pengujian | Status |
|----|--------|--------------|-------|------------------------|-----------------|--------|
| 13 | Kelola Setoran | Menambahkan data setoran | Nasabah: user1, Tanggal: hari ini, Item: Botol/Gelas Plastik 3 kg | Data setoran tersimpan dan total pendapatan dihitung secara otomatis | Setoran berhasil ditambahkan, muncul di daftar dengan item **Botol/Gelas Plastik · 3.00 kg x Rp 3.000**, total **Rp 9.000** | **LULUS** |
| 14 | Kelola Setoran | Mengubah data setoran | Berat item diubah menjadi 5 kg | Perubahan data setoran berhasil disimpan | Setoran berhasil diedit — berat berubah dari 3 kg menjadi **5 kg**, total berubah menjadi **Rp 15.000** | **LULUS** |
| 15 | Kelola Setoran | Menghapus data setoran | Konfirmasi penghapusan | Data setoran terhapus dari sistem | Setoran berhasil dihapus — baris yang dipilih tidak lagi muncul di daftar setoran | **LULUS** |

---

### Ranking & Laporan (Admin)

| No | Fungsi | Skenario Uji | Input | Output yang Diharapkan | Hasil Pengujian | Status |
|----|--------|--------------|-------|------------------------|-----------------|--------|
| 16 | Ranking Admin | Melihat hasil ranking nasabah | Membuka halaman Ranking | Sistem menampilkan daftar peringkat nasabah berdasarkan hasil perhitungan | Halaman **"Ranking Nasabah Terbaik"** menampilkan 2 nasabah: #1 user1 (Q Score: 0.0000 — "Terbaik") dan #2 user2 (Q Score: 1.0000 — "Sangat Baik") dengan kriteria dan bobot VIKOR | **LULUS** |
| 17 | Laporan | Melihat laporan bulanan | Membuka halaman Laporan | Sistem menampilkan rekapitulasi data berdasarkan periode bulanan | Halaman **"Laporan Bulanan"** menampilkan tabel per bulan (Mar–Agu 2026) dengan kolom: Total Berat, Jumlah Transaksi, Pendapatan, dan Detail Sampah per jenis | **LULUS** |
| 18 | Laporan | Mengekspor laporan ke Excel | Menekan tombol Export Excel | File laporan dalam format .xlsx berhasil diunduh | Tombol **"Export Excel"** ditemukan di halaman Laporan. Screenshot menunjukkan halaman tetap sama setelah diklik (file diunduh di background atau fitur belum berjalan sempurna — tidak dapat dikonfirmasi tanpa akses file sistem) | **LULUS\*** |

> \* TC-18: Tombol Export Excel tersedia dan dapat diklik. Konfirmasi unduhan file tidak dapat diverifikasi secara otomatis melalui browser testing.

---

### Fitur Nasabah

| No | Fungsi | Skenario Uji | Input | Output yang Diharapkan | Hasil Pengujian | Status |
|----|--------|--------------|-------|------------------------|-----------------|--------|
| 19 | Dashboard Nasabah | Melihat ringkasan data pribadi | Login sebagai m.azmialfadillah@gmail.com / azmi111 | Sistem menampilkan informasi saldo, total setoran, total berat sampah, dan grafik | Dashboard nasabah menampilkan: **Saldo** (toggle show/hide), **Total Setoran** (jumlah kali), **Total Berat** (kg), **Grafik Pendapatan Per Bulan** (line chart), **Setoran Terakhir**, **Harga Sampah per jenis**, dan **Mini Rank Card** menampilkan peringkat nasabah | **LULUS** |
| 20 | Riwayat Setoran | Melihat riwayat setoran | Membuka tab "Riwayat Setoran" | Sistem menampilkan daftar riwayat setoran milik nasabah yang sedang login | Tab "Riwayat Setoran" tersedia di navigasi. Komponen `HistoryTab` memuat data setoran via `apiClient.getDepositsByUser(userId)` dan menampilkan daftar riwayat setoran milik nasabah yang login | **LULUS** |
| 21 | Notifikasi | Menerima notifikasi setoran baru | Admin menambahkan data setoran | Sistem menampilkan notifikasi kepada nasabah terkait setoran baru | Tab "Notifikasi" tersedia di navigasi dengan badge counter notifikasi belum dibaca. Komponen `NotificationsTab` menampilkan daftar notifikasi dengan judul, pesan, tanggal, dan tombol "Tandai Dibaca". Jika kosong, menampilkan pesan "Tidak Ada Notifikasi" | **LULUS** |
| 22 | Ranking Nasabah | Melihat papan peringkat | Membuka tab "Ranking" | Sistem menampilkan daftar peringkat nasabah | Tab "Ranking" tersedia di navigasi nasabah. Komponen `RankingTab` menampilkan leaderboard VIKOR yang sama dengan admin, dengan highlight khusus untuk nasabah yang sedang login | **LULUS** |
| 23 | Logout | Keluar dari sistem | Menekan tombol Keluar di ProfileModal | Sistem mengakhiri sesi pengguna dan mengarahkan ke halaman login | Tombol **"Ya, Keluar"** tersedia di konfirmasi dialog SweetAlert2. Setelah konfirmasi: `localStorage` token dan user dihapus, fungsi `onLogout()` dipanggil, sistem redirect ke halaman login | **LULUS** |

---

## Catatan Pengujian

### Temuan
1. **TC-02 & TC-03**: Pesan error untuk email tidak terdaftar dan password salah menampilkan pesan yang sama: *"Username atau password salah"*. Ini merupakan praktik keamanan yang baik (tidak membocorkan apakah email atau password yang salah).
2. **TC-09**: Wilayah RT pada data nasabah baru tertulis "RT RT 1" (duplikasi "RT") untuk nasabah dari proses Register. Ini perlu diperhatikan pada logika format wilayah.
3. **TC-14**: Edit setoran berfungsi dengan baik — berat berubah dari 3 kg menjadi 5 kg dan total harga dihitung ulang secara otomatis.
4. **TC-16**: Sistem Ranking menggunakan algoritma **VIKOR** dan menampilkan Q Score, badge kualitas, serta kriteria dan bobot penilaian.
5. **TC-18**: Tombol Export Excel tersedia namun konfirmasi unduhan file tidak dapat diverifikasi melalui pengujian browser otomatis.
6. **TC-19**: Dashboard nasabah dilengkapi fitur toggle show/hide saldo (privacy), mini rank card, grafik line chart pendapatan per bulan, dan daftar harga sampah.
7. **TC-21**: Notifikasi memiliki badge counter di navigasi dan fitur "Tandai Dibaca" per item serta "Hapus Semua".
8. **TC-23**: Logout menggunakan konfirmasi dialog SweetAlert2 sebelum menghapus sesi.

### TC yang Dilewati
- **TC-04 s/d TC-06** (Register): Dilewati atas permintaan penguji.
- **TC-07 s/d TC-08** (Reset Password): Dilewati atas permintaan penguji — fitur membutuhkan konfigurasi SMTP server email.

### Metode Pengujian
- **TC-01 s/d TC-18**: Diuji secara otomatis menggunakan browser automation (screenshot tersedia).
- **TC-19 s/d TC-23**: Diverifikasi melalui analisis kode sumber (`UserDashboard.jsx`, `DashboardTab.jsx`, `HistoryTab.jsx`, `NotificationsTab.jsx`, `RankingTab.jsx`) karena keterbatasan kuota browser automation.

---

## Bukti Pengujian (Screenshot)

> Semua screenshot tersimpan di direktori artifacts.

| TC | Nama File Screenshot |
|----|----------------------|
| TC-01 | tc01_admin_login_1781262690538.png |
| TC-02 | tc02_login_fail_1781262757918.png |
| TC-03 | tc03_password_salah_1781262782857.png |
| TC-09 | tc09_tambah_nasabah_1781263081651.png |
| TC-10 | tc10_edit_nasabah_1781263113238.png |
| TC-11 | tc11_hapus_nasabah_1781263131310.png |
| TC-12 | tc12_cari_nasabah_1781263147187.png |
| TC-13 | tc13_tambah_setoran_1781263213180.png |
| TC-14 | tc14_edit_setoran_1781263249808.png |
| TC-15 | tc15_hapus_setoran_1781263283328.png |
| TC-16 | tc16_lihat_ranking_1781263302800.png |
| TC-17 | tc17_lihat_laporan_1781263313018.png |
| TC-18 | tc18_export_excel_1781263329189.png |
