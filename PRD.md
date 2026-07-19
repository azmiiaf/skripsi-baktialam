# Product Requirements Document (PRD)
# Sistem Informasi Bank Sampah Bakti Alam Digital

---

## 1. Gambaran Umum

| Atribut | Detail |
|---|---|
| **Nama Sistem** | Bank Sampah Bakti Alam Digital |
| **Versi** | 1.0.0 |
| **Tipe** | Web Application (Responsive) |
| **Tech Stack** | React.js (Frontend) · Node.js/Express (Backend) · MySQL (Database) · JWT (Authentication) |
| **Metode Khusus** | Algoritma VIKOR (Multi-Criteria Decision Making) |

### 1.1 Latar Belakang

Bank Sampah Bakti Alam adalah program pengelolaan sampah berbasis komunitas di mana warga (nasabah) dapat menyetorkan sampah terpilah dan mendapatkan kompensasi berupa saldo tabungan. Sistem konvensional masih menggunakan catatan manual sehingga rentan terhadap kehilangan data dan tidak efisien.

Sistem ini hadir untuk mendigitalisasi seluruh proses operasional bank sampah, mulai dari pendaftaran nasabah, pencatatan setoran, pelaporan, hingga perankingan nasabah terbaik menggunakan metode ilmiah VIKOR.

### 1.2 Tujuan Sistem

1. Mendigitalisasi pencatatan setoran sampah menggantikan buku manual.
2. Memberikan transparansi saldo dan riwayat setoran kepada nasabah.
3. Mengotomatisasi perhitungan nilai sampah berdasarkan harga terkini.
4. Menghasilkan laporan bulanan yang dapat diekspor ke Excel.
5. Menerapkan algoritma VIKOR untuk perankingan nasabah terbaik secara objektif.

---

## 2. Aktor Sistem

```
┌─────────────────────────────────────────────────────┐
│                    AKTOR SISTEM                       │
├──────────────────┬──────────────────────────────────┤
│  👤 Nasabah       │  👨‍💼 Admin                          │
│  (User)          │  (Administrator)                  │
├──────────────────┼──────────────────────────────────┤
│ - Mendaftar akun │ - Mengelola data nasabah          │
│ - Login sistem   │ - Mencatat & mengelola setoran    │
│ - Lihat saldo    │ - Mengatur harga sampah           │
│ - Lihat riwayat  │ - Melihat semua laporan           │
│ - Lihat notif    │ - Melihat ranking VIKOR           │
│ - Lihat ranking  │ - Mengekspor laporan Excel        │
│   & posisi saya  │ - Mengirim notifikasi ke nasabah  │
│ - Reset password │ - Toggle dark mode                │
│ - Toggle dark    │                                   │
│   mode           │                                   │
└──────────────────┴──────────────────────────────────┘
```

---

## 3. Fitur & Kebutuhan Fungsional

### 3.1 Modul Autentikasi

| ID | Fitur | Prioritas |
|---|---|---|
| F-01 | Login dengan email/username & password | 🔴 Must |
| F-02 | Registrasi akun nasabah baru | 🔴 Must |
| F-03 | Lupa password → kirim link reset via email | 🟡 Should |
| F-04 | Reset password via token | 🟡 Should |
| F-05 | Session management dengan JWT Token | 🔴 Must |
| F-06 | Auto-redirect berdasarkan peran (admin/user) | 🔴 Must |
| F-07 | Logout dengan konfirmasi | 🔴 Must |

### 3.2 Modul Admin — Manajemen Nasabah

| ID | Fitur | Prioritas |
|---|---|---|
| F-08 | Lihat daftar semua nasabah | 🔴 Must |
| F-09 | Cari nasabah berdasarkan nama/email/RT | 🔴 Must |
| F-10 | Tambah nasabah baru | 🔴 Must |
| F-11 | Edit data nasabah | 🔴 Must |
| F-12 | Hapus nasabah (beserta data setoran) | 🔴 Must |
| F-13 | Expand row detail nasabah di mobile & desktop | 🟡 Should |
| F-13b| Lihat & edit password nasabah langsung di form/detail (mengatasi lupa password) | 🔴 Must |

### 3.3 Modul Admin — Manajemen Setoran

| ID | Fitur | Prioritas |
|---|---|---|
| F-14 | Lihat seluruh data setoran | 🔴 Must |
| F-15 | Tambah setoran baru (pilih nasabah, tanggal, item sampah) | 🔴 Must |
| F-16 | Edit data setoran yang sudah ada | 🔴 Must |
| F-17 | Hapus data setoran | 🔴 Must |
| F-18 | Multi-item input (berbagai jenis sampah dalam 1 setoran) | 🔴 Must |
| F-19 | Kalkulasi otomatis total berat & nilai rupiah | 🔴 Must |
| F-20 | Cari setoran berdasarkan nama/tanggal | 🔴 Must |
| F-21 | Kirim notifikasi ke nasabah saat setoran ditambah/diubah | 🟡 Should |

### 3.4 Modul Admin — Harga Sampah

| ID | Fitur | Prioritas |
|---|---|---|
| F-22 | Lihat daftar harga sampah per jenis | 🔴 Must |
| F-23 | Update harga sampah (real-time di modal) | 🔴 Must |
| F-24 | Harga yang diperbarui langsung mempengaruhi kalkulasi setoran | 🔴 Must |

**Jenis Sampah yang Didukung:**
| Kode | Nama | Satuan |
|---|---|---|
| `bottlePlastic` | Botol/Gelas Plastik | kg |
| `cardboard` | Kardus | kg |
| `paper` | Buku | kg |
| `metal` | Logam/Besi | kg |
| `mixed` | Emberan/Campuran | kg |
| `electronic` | Elektronik | kg |
| `oilWaste` | Oli | liter |
| `cookingOil` | Minyak Jelantah | liter |

### 3.5 Modul Admin — Ranking VIKOR

| ID | Fitur | Prioritas |
|---|---|---|
| F-25 | Tampilkan ranking nasabah menggunakan algoritma VIKOR | 🔴 Must |
| F-26 | Kriteria: Total Berat (30%), Frekuensi (30%), Pendapatan (30%), Variasi (10%) | 🔴 Must |
| F-27 | Minimum 3x setoran untuk masuk perankingan | 🔴 Must |
| F-28 | Tampilkan skor Q, badge terbaik/sangat baik/baik | 🟡 Should |

### 3.6 Modul Admin — Laporan

| ID | Fitur | Prioritas |
|---|---|---|
| F-29 | Laporan bulanan (total berat, transaksi, pendapatan) | 🔴 Must |
| F-30 | Breakdown per jenis sampah per bulan | 🔴 Must |
| F-31 | Export laporan ke Excel (.xlsx) | 🔴 Must |
| F-32 | Expand row detail di tampilan mobile | 🟢 Nice |

### 3.7 Modul Admin — Dashboard Overview

| ID | Fitur | Prioritas |
|---|---|---|
| F-33 | Kartu statistik: total nasabah, setoran, pendapatan, berat | 🔴 Must |
| F-34 | Grafik pendapatan per bulan (Line Chart) | 🔴 Must |
| F-35 | Grafik berat sampah per bulan (Bar Chart) | 🔴 Must |
| F-36 | Tabel setoran terbaru dengan pencarian | 🔴 Must |

### 3.8 Modul Nasabah — Dashboard

| ID | Fitur | Prioritas |
|---|---|---|
| F-37 | Kartu saldo bergaya m-banking (toggle show/hide) | 🔴 Must |
| F-38 | Statistik: total setoran & total berat | 🔴 Must |
| F-39 | Grafik pendapatan per bulan (Line Chart) | 🟡 Should |
| F-40 | Tampilan setoran terakhir | 🔴 Must |
| F-41 | Panduan harga sampah terkini | 🟡 Should |
| F-42 | Tips & informasi untuk nasabah | 🟢 Nice |
| F-43 | Mini-card peringkat nasabah di halaman dashboard utama | 🔴 Must |

### 3.9 Modul Nasabah — Peringkat (VIKOR)

| ID | Fitur | Prioritas |
|---|---|---|
| F-44 | Tab/halaman peringkat nasabah (menggunakan algoritma VIKOR yang sama) | 🔴 Must |
| F-45 | Card peringkat personal (rank, berat, frekuensi, pendapatan) | 🔴 Must |
| F-46 | Papan peringkat lengkap dengan highlight posisi sendiri | 🔴 Must |
| F-47 | Badge medali 🥇🥈🥉 dan label Terbaik/Sangat Baik/Baik | 🟡 Should |
| F-48 | Penjelasan kriteria dan cara meningkatkan peringkat | 🟢 Nice |
| F-49 | Status "Belum masuk peringkat" jika < 3 setoran | 🔴 Must |

### 3.11 Modul Nasabah — Riwayat Setoran

| ID | Fitur | Prioritas |
|---|---|---|
| F-50 | Daftar seluruh riwayat setoran dalam bentuk card | 🔴 Must |
| F-51 | Detail per setoran: tanggal, item, berat, nilai | 🔴 Must |

### 3.12 Modul Nasabah — Notifikasi

| ID | Fitur | Prioritas |
|---|---|---|
| F-52 | Lihat daftar notifikasi (diurutkan terbaru) | 🔴 Must |
| F-53 | Tandai satu notifikasi sebagai sudah dibaca | 🔴 Must |
| F-54 | Hapus semua notifikasi | 🟡 Should |
| F-55 | Badge unread count di tab & bottom nav | 🟡 Should |

### 3.13 Kebutuhan Non-Fungsional

| ID | Kebutuhan | Keterangan |
|---|---|---|
| NF-01 | **Responsif** | Mobile, tablet, desktop — Bottom nav mobile 5-item untuk Admin (Home, Nasabah, Setoran, Ranking, Profil) & 5-item untuk Nasabah (Home, Riwayat, Ranking, Notif, Profil) |
| NF-02 | **Dark Mode** | Toggle per-session |
| NF-03 | **Autentikasi JWT** | Token di localStorage |
| NF-04 | **Auto-refresh data** | Polling data setoran secara terjadwal/ketika ada perubahan |
| NF-05 | **Konfirmasi aksi** | Menggunakan SweetAlert2 untuk konfirmasi hapus/aksi sensitif |
| NF-06 | **Keamanan Data** | Selain hash password untuk autentikasi, disediakan kolom plain text terbatas untuk admin demi memulihkan password nasabah secara cepat |

---

## 4. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│   React.js + Vite · Atomic Design · React Router DOM    │
│   Recharts · Lucide React · SweetAlert2 · xlsx          │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP REST (Bearer Token)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js / Express)              │
│   Routes: /auth · /users · /deposits · /prices          │
│           /notifications                                 │
│   Middleware: JWT Verify · CORS · Error Handler          │
└──────────────────────────┬──────────────────────────────┘
                           │ Query
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                       │
│   Tabel: users · deposits · deposit_items               │
│          waste_prices · notifications                    │
│   + Reset Password Tokens                               │
└─────────────────────────────────────────────────────────┘
                           │
                     [Email SMTP]
                  (Reset Password Link)
```

---

## 5. Algoritma VIKOR

Algoritma VIKOR digunakan untuk perankingan nasabah terbaik berdasarkan 4 kriteria:

| Kriteria | Bobot | Tipe |
|---|---|---|
| Total Berat Sampah (kg) | 30% | Benefit |
| Frekuensi Setoran | 30% | Benefit |
| Total Pendapatan (Rp) | 30% | Benefit |
| Variasi Jenis Sampah | 10% | Benefit |

**Langkah Perhitungan:**
1. Kumpulkan data setiap nasabah (min. 3 setoran).
2. Normalisasi matriks keputusan.
3. Hitung nilai **S** (Utility Measure) dan **R** (Regret Measure).
4. Hitung nilai **Q** (VIKOR Index) dengan parameter v = 0.5.
5. Urutkan berdasarkan nilai Q terkecil (nilai terkecil = ranking terbaik).
