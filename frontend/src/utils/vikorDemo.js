/**
 * VIKOR ALGORITHM - COMMAND LINE DEMONSTRATION
 * 
 * File ini berisi command-line interface untuk mendemonstrasikan
 * cara kerja algoritma VIKOR step-by-step.
 * 
 * CARA MENJALANKAN:
 * 
 * 1. Buka Browser Console (F12)
 * 2. Pastikan aplikasi sudah running di browser
 * 3. Di console, jalankan:
 *    - Klik tombol "Lihat Algoritma" di halaman Ranking VIKOR (RECOMMENDED)
 *    - Atau buka file ini dan copy-paste kode demo di bawah
 * 
 * ATAU dari Node.js:
 * 
 * 1. Pastikan sudah ada data di localStorage
 * 2. Jalankan fungsi calculateVikorRanking() dari vikorAlgorithm.js
 */

// ============================================================
// DEMO 1: Menjalankan VIKOR dengan Logging Detail
// ============================================================

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   VIKOR ALGORITHM DEMO                        ║
║        Multi-Criteria Decision Making for Ranking            ║
╚═══════════════════════════════════════════════════════════════╝
`);

// Import fungsi (di browser, sudah available melalui modules)
// import { calculateVikorRanking } from './vikorAlgorithm.js';

// Jalankan algoritma dengan v = 0.5 (default)
console.log('🚀 Memulai perhitungan VIKOR...\n');

const ranking = calculateVikorRanking(0.5);

console.log('\n✅ HASIL AKHIR RANKING:\n');
console.table(ranking.map(r => ({
  'Peringkat': `#${r.rank}`,
  'Nama': r.name,
  'Q Score': r.qScore.toFixed(4),
  'S Score': r.sScore.toFixed(4),
  'R Score': r.rScore.toFixed(4),
  'Total Berat (kg)': r.stats.totalWeight.toFixed(2),
  'Frekuensi': r.stats.frequency,
  'Total Pendapatan': `Rp ${r.stats.totalRevenue.toLocaleString('id-ID')}`
})));

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    PENJELASAN HASIL                           ║
╚═══════════════════════════════════════════════════════════════╝

📊 INTERPRETASI SCORES:

1. Q Score (VIKOR Index)
   - Range: 0 - 1
   - Nilai TERKECIL = TERBAIK
   - Menggabungkan aspek utility (S) dan regret (R)
   
2. S Score (Utility Measure)
   - Mengukur seberapa dekat dengan solusi ideal
   - Nilai TERKECIL = LEBIH BAIK
   
3. R Score (Regret Measure)
   - Mengukur penyesalan dari kriteria terburuk
   - Nilai TERKECIL = LEBIH BAIK

🏆 KRITERIA PENILAIAN:

1. Total Berat Sampah (25%)
   → Semakin banyak kg yang disetor, semakin baik

2. Frekuensi Setoran (20%)
   → Semakin sering setor, semakin baik

3. Konsistensi - 30 Hari (20%)
   → Semakin konsisten, semakin baik

4. Total Pendapatan (25%)
   → Semakin tinggi nilai rupiah, semakin baik

5. Variasi Jenis Sampah (10%)
   → Semakin beragam, semakin baik

💡 TIPS UNTUK NASABAH:

Untuk mendapatkan ranking terbaik:
✓ Setor sampah secara rutin
✓ Tingkatkan berat total sampah
✓ Setor berbagai jenis sampah
✓ Fokus pada sampah bernilai tinggi (elektronik, logam)
✓ Jaga konsistensi setoran bulanan

`);

// ============================================================
// DEMO 2: Membandingkan Hasil dengan v yang Berbeda
// ============================================================

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║              PERBANDINGAN DENGAN v BERBEDA                    ║
╚═══════════════════════════════════════════════════════════════╝

Parameter 'v' menentukan strategi:
- v = 0   → Fokus pada minimizing regret (R)
- v = 0.5 → Balanced (default)
- v = 1   → Fokus pada maximizing utility (S)

`);

const vValues = [0, 0.25, 0.5, 0.75, 1.0];

vValues.forEach(v => {
  console.log(`\n--- HASIL DENGAN v = ${v} ---`);
  const result = calculateVikorRanking(v);
  console.table(result.slice(0, 3).map(r => ({
    'Peringkat': `#${r.rank}`,
    'Nama': r.name,
    'Q Score': r.qScore.toFixed(4)
  })));
});

// ============================================================
// DEMO 3: Formula Lengkap
// ============================================================

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    FORMULA LENGKAP                            ║
╚═══════════════════════════════════════════════════════════════╝

STEP 1: Normalisasi
-----------------------------------------------------------------
Untuk setiap kriteria j:
  f*_j = nilai terbaik (max untuk BENEFIT)
  f-_j = nilai terburuk (min untuk BENEFIT)

STEP 2: Hitung S dan R
-----------------------------------------------------------------
Untuk setiap alternatif i:

  S_i = Σ[w_j × (f*_j - f_ij) / (f*_j - f-_j)]
       j=1 to n
  
  R_i = max[w_j × (f*_j - f_ij) / (f*_j - f-_j)]
        j=1 to n

Dimana:
  - w_j = bobot kriteria j (total = 1)
  - f_ij = nilai alternatif i pada kriteria j
  - n = jumlah kriteria (5 kriteria)

STEP 3: Hitung Q (VIKOR Index)
-----------------------------------------------------------------
  Q_i = v × (S_i - S*) / (S- - S*) + (1-v) × (R_i - R*) / (R- - R*)

Dimana:
  - S* = min(S_i), S- = max(S_i)
  - R* = min(R_i), R- = max(R_i)
  - v = weight untuk strategi (default 0.5)

STEP 4: Ranking
-----------------------------------------------------------------
  Urutkan berdasarkan Q (ascending)
  Q terkecil = Nasabah TERBAIK! 🏆

`);

// ============================================================
// DEMO 4: Contoh Perhitungan Manual
// ============================================================

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                  CONTOH PERHITUNGAN MANUAL                    ║
╚═══════════════════════════════════════════════════════════════╝

Misalkan ada 2 nasabah:

Nasabah A:
  - Total Berat: 100 kg
  - Frekuensi: 10 kali
  - Konsistensi: 5 kali
  - Pendapatan: Rp 500.000
  - Variasi: 4 jenis

Nasabah B:
  - Total Berat: 50 kg
  - Frekuensi: 15 kali
  - Konsistensi: 8 kali
  - Pendapatan: Rp 300.000
  - Variasi: 6 jenis

KRITERIA 1: Total Berat (w = 0.25)
  f* = 100 (max)
  f- = 50 (min)
  
  Nasabah A: S_contrib = 0.25 × (100-100)/(100-50) = 0
  Nasabah B: S_contrib = 0.25 × (100-50)/(100-50) = 0.25

KRITERIA 2: Frekuensi (w = 0.20)
  f* = 15 (max)
  f- = 10 (min)
  
  Nasabah A: S_contrib = 0.20 × (15-10)/(15-10) = 0.20
  Nasabah B: S_contrib = 0.20 × (15-15)/(15-10) = 0

... dan seterusnya untuk semua kriteria.

Setelah semua dihitung:
  S_A = 0.35, R_A = 0.20
  S_B = 0.45, R_B = 0.25
  
Dengan v = 0.5:
  Q_A = 0.5 × (0.35-0.35)/(0.45-0.35) + 0.5 × (0.20-0.20)/(0.25-0.20) = 0
  Q_B = 0.5 × (0.45-0.35)/(0.45-0.35) + 0.5 × (0.25-0.20)/(0.25-0.20) = 1

Nasabah A menang dengan Q = 0 (lebih kecil) 🏆

`);

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                         SELESAI                               ║
║     Terima kasih telah menggunakan VIKOR Algorithm Demo!     ║
╚═══════════════════════════════════════════════════════════════╝

📚 Referensi:
- Opricovic, S., & Tzeng, G. H. (2004). Compromise solution by 
  MCDM methods: A comparative analysis of VIKOR and TOPSIS.
- European Journal of Operational Research, 156(2), 445-455.

🔗 Untuk informasi lebih lanjut, kunjungi:
   https://en.wikipedia.org/wiki/VIKOR_method

💻 Source code tersedia di: src/utils/vikorAlgorithm.js

`);

// Export untuk digunakan di tempat lain
export { 
  calculateVikorRanking,
  vValues 
};
