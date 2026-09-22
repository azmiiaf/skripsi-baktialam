# 🌱 Bank Sampah - Waste Bank Management System

Sistem manajemen Bank Sampah berbasis web dengan React JS dan LocalStorage. Aplikasi ini memiliki 2 role (Admin & User) dengan fitur lengkap termasuk CRUD, grafik, laporan, notifikasi, dan algoritma VIKOR untuk ranking nasabah terbaik.

## ✨ Fitur Utama

### 👨‍💼 **Admin**
- ✅ **Dashboard Analytics** - Lihat statistik lengkap (total nasabah, setoran, pendapatan, berat)
- ✅ **CRUD Nasabah** - Tambah, edit, hapus data nasabah
- ✅ **CRUD Setoran** - Tambah setoran dengan multiple items dalam satu transaksi
- ✅ **Grafik Interaktif** - Visualisasi pendapatan dan berat sampah per bulan
- ✅ **Laporan Cetak** - Print laporan setoran nasabah
- ✅ **Ranking VIKOR** - Sistem ranking nasabah terbaik menggunakan algoritma VIKOR
- ✅ **Notifikasi Otomatis** - Kirim notifikasi ke user saat setoran ditambahkan

### 👤 **User/Nasabah**
- ✅ **Dashboard Saldo** - Lihat total saldo dan statistik pribadi
- ✅ **Riwayat Setoran** - Detail lengkap semua setoran
- ✅ **Grafik Pendapatan** - Visualisasi pendapatan bulanan
- ✅ **Notifikasi Real-time** - Terima notifikasi saat admin menambahkan setoran
- ✅ **Harga Sampah** - Informasi harga per jenis sampah

## 🗑️ Jenis Sampah & Harga

| Jenis Sampah | Satuan | Harga |
|---|---|---|
| Botol/Gelas Plastik | kg | Rp 3.000 |
| Kardus | kg | Rp 2.000 |
| Buku | kg | Rp 1.500 |
| Logam/Besi | kg | Rp 5.000 |
| Emberan/Campuran | kg | Rp 1.000 |
| Elektronik | kg | Rp 8.000 |
| Oli | liter | Rp 2.500 |
| Minyak Jelantah | liter | Rp 3.500 |

## 📊 Algoritma VIKOR

### Apa itu VIKOR?

VIKOR (VIseKriterijumska Optimizacija I Kompromisno Resenje) adalah metode **Multi-Criteria Decision Making (MCDM)** yang digunakan untuk menentukan ranking/peringkat berdasarkan berbagai kriteria.

### Kriteria Penilaian Nasabah

Aplikasi ini menggunakan 5 kriteria untuk menilai nasabah terbaik:

1. **Total Berat Sampah** (25%) - Total kg/liter sampah yang disetor
2. **Frekuensi Setoran** (20%) - Jumlah kali melakukan setoran
3. **Konsistensi** (20%) - Jumlah setoran dalam 30 hari terakhir
4. **Total Pendapatan** (25%) - Total nilai rupiah dari setoran
5. **Variasi Jenis Sampah** (10%) - Keberagaman jenis sampah yang disetor

### Langkah-langkah Algoritma VIKOR

#### **STEP 1: Normalisasi Matriks Keputusan**
Tentukan nilai terbaik (f*) dan terburuk (f-) untuk setiap kriteria:
- Untuk kriteria BENEFIT: f* = max, f- = min
- Semua kriteria dalam aplikasi ini adalah BENEFIT

#### **STEP 2: Hitung Nilai S dan R**
```
S (Utility Measure) = Σ[w_j * (f*_j - f_ij) / (f*_j - f-_j)]
R (Regret Measure) = max[w_j * (f*_j - f_ij) / (f*_j - f-_j)]
```

Dimana:
- `w_j` = bobot kriteria j
- `f*_j` = nilai terbaik kriteria j
- `f-_j` = nilai terburuk kriteria j
- `f_ij` = nilai alternatif i pada kriteria j

#### **STEP 3: Hitung Nilai Q**
```
Q = v * (S - S*) / (S- - S*) + (1-v) * (R - R*) / (R- - R*)
```

Dimana:
- `v` = weight untuk strategi maksimum grup utility (default 0.5)
- `S*` = min(S), `S-` = max(S)
- `R*` = min(R), `R-` = max(R)

#### **STEP 4: Ranking**
Urutkan alternatif berdasarkan nilai Q (ascending).
**Nilai Q terkecil = Nasabah TERBAIK** 🏆

### 💻 Cara Melihat Algoritma VIKOR

1. Login sebagai **Admin**
2. Buka tab **"Ranking VIKOR"**
3. Klik tombol **"Lihat Algoritma"**
4. Buka **Console Browser** (tekan F12)
5. Lihat detail perhitungan step-by-step!

### Command Line Demo
Anda juga bisa menjalankan algoritma VIKOR dari browser console:

```javascript
// Buka Console Browser (F12), lalu jalankan:
import { calculateVikorRanking } from './src/utils/vikorAlgorithm.js';
const ranking = calculateVikorRanking();
console.table(ranking);
```

Output akan menampilkan:
- ✅ Data kriteria setiap nasabah
- ✅ Bobot setiap kriteria
- ✅ Nilai terbaik (f*) dan terburuk (f-)
- ✅ Perhitungan S, R, dan Q untuk setiap nasabah
- ✅ Ranking akhir

## 🎨 Tech Stack

- **Frontend**: React 19.2 + Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: LocalStorage (Browser)
- **Build Tool**: Vite

## 📱 Responsive Design

Aplikasi ini fully responsive dan dapat diakses di:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile Phone

## 🏗️ Struktur Folder

```
banksampah/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── UserDashboard.jsx
│   ├── utils/
│   │   ├── localStorage.js      # Storage operations
│   │   └── vikorAlgorithm.js    # VIKOR implementation
│   ├── App.jsx                  # Main app router
│   ├── main.jsx                 # Entry point
│   └── index.css                # Design system
├── package.json
├── vite.config.js
└── README.md
```

## 🔄 Flow Aplikasi

### Admin Flow
1. Login sebagai admin
2. Lihat dashboard dengan statistik lengkap
3. Tambah/Edit/Hapus nasabah
4. Tambah setoran (bisa multiple items sekaligus)
5. Lihat grafik pendapatan & berat sampah
6. Lihat ranking nasabah terbaik (VIKOR)
7. Cetak laporan

### User Flow
1. Login sebagai user
2. Lihat saldo total
3. Lihat grafik pendapatan bulanan
4. Cek riwayat setoran
5. Terima notifikasi saat ada setoran baru
6. Lihat harga sampah per jenis

## 🎯 Fitur Unggulan

### 1. Multiple Items per Deposit
Admin bisa menambahkan lebih dari 1 jenis sampah dalam sekali input setoran.

### 2. Real-time Notifications
User mendapat notifikasi otomatis saat admin menambahkan setoran (polling setiap 5 detik).

### 3. Interactive Charts
Grafik interaktif untuk visualisasi:
- Pendapatan per bulan (Line Chart)
- Berat sampah per bulan (Bar Chart)

### 4. Print Report
Fitur cetak laporan dengan CSS optimized untuk print.

### 5. VIKOR Algorithm Console Demo
Lihat detail perhitungan algoritma step-by-step di console browser.

## 📝 Notes

- Data disimpan di **LocalStorage browser** (tidak hilang saat refresh)
- Clear browser data akan menghapus semua data
- Aplikasi akan auto-initialize dengan data demo saat pertama kali dijalankan

## 🤝 Kontributor

Developed with ♻️ by **Antigravity AI**

## 📄 License

MIT License - Feel free to use for educational purposes!

---

**SELAMAT MENGGUNAKAN! 🌱♻️🌍**

Untuk pertanyaan atau kendala, silakan hubungi administrator.
