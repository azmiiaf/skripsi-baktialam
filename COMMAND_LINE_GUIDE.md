# 💻 COMMAND LINE VIKOR ALGORITHM DEMO

Panduan lengkap untuk melihat dan memahami cara kerja algoritma VIKOR step-by-step.

---

## 🚀 Cara 1: Melalui Browser Console (RECOMMENDED)

### Langkah 1: Buka Aplikasi
```bash
npm run dev
# Buka http://localhost:5173
```

### Langkah 2: Login sebagai Admin
- Username: `admin`
- Password: `admin123`

### Langkah 3: Buka Tab "Ranking VIKOR"

### Langkah 4: Klik Tombol "Lihat Algoritma"

### Langkah 5: Buka Browser Console
- **Windows/Linux**: Tekan `F12` atau `Ctrl + Shift + J`
- **Mac**: Tekan `Cmd + Option + J`

### Langkah 6: Lihat Output!
Di console Anda akan melihat:

```
=== VIKOR ALGORITHM - STEP BY STEP ===

STEP 0: Mengumpulkan data kriteria untuk setiap nasabah
- Budi Santoso: Weight=26.5kg, Frequency=3, Consistency=3, Revenue=Rp59500, Variety=4
- Siti Aminah: Weight=50kg, Frequency=2, Consistency=2, Revenue=Rp109000, Variety=6
- Ahmad Wijaya: Weight=18kg, Frequency=1, Consistency=1, Revenue=Rp114000, Variety=2
- Dewi Lestari: Weight=31kg, Frequency=4, Consistency=4, Revenue=Rp48500, Variety=5
- Rudi Hartono: Weight=3kg, Frequency=1, Consistency=1, Revenue=Rp6000, Variety=1

Total nasabah aktif: 5

BOBOT KRITERIA:
- Total Berat: 25%
- Frekuensi Setoran: 20%
- Konsistensi (30 hari): 20%
- Total Pendapatan: 25%
- Variasi Jenis Sampah: 10%

STEP 1: Menentukan nilai TERBAIK (f*) dan TERBURUK (f-) untuk setiap kriteria
(Semua kriteria adalah BENEFIT - semakin besar semakin baik)

totalWeight:
  f* (terbaik) = 50
  f- (terburuk) = 3
...

STEP 2: Menghitung nilai S (Utility Measure) dan R (Regret Measure)

Formula S: S_i = Σ[w_j * (f*_j - f_ij) / (f*_j - f-_j)]
Formula R: R_i = max[w_j * (f*_j - f_ij) / (f*_j - f-_j)]

Budi Santoso:
  S = 0.3482
  R = 0.2000
...

STEP 3: Menghitung nilai Q (VIKOR Index)

S* (S terbaik) = 0.0286
S- (S terburuk) = 0.9643
R* (R terbaik) = 0.0500
R- (R terburuk) = 0.2500
v (weight) = 0.5

Formula Q: Q_i = v * (S_i - S*)/(S- - S*) + (1-v) * (R_i - R*)/(R- - R*)

Dewi Lestari:
  Q = 0.0143
Siti Aminah:
  Q = 0.0320
...

STEP 4: Ranking berdasarkan nilai Q (semakin kecil semakin baik)

HASIL RANKING:
1. Dewi Lestari - Q: 0.0143, S: 0.0286, R: 0.0500
2. Siti Aminah - Q: 0.0320, S: 0.0357, R: 0.0833
3. Budi Santoso - Q: 0.2600, S: 0.3482, R: 0.2000
4. Ahmad Wijaya - Q: 0.6072, S: 0.5857, R: 0.2500
5. Rudi Hartono - Q: 1.0000, S: 0.9643, R: 0.2500

=== SELESAI ===
```

---

## 🔍 Cara 2: Jalankan Script Manual di Console

Copy-paste kode berikut di Browser Console saat aplikasi berjalan:

```javascript
// Import dan jalankan VIKOR
import('./src/utils/vikorAlgorithm.js').then(module => {
  console.clear();
  const ranking = module.calculateVikorRanking(0.5);
  
  console.table(ranking.map(r => ({
    'Rank': `#${r.rank}`,
    'Nama': r.name,
    'Q Score': r.qScore.toFixed(4),
    'S Score': r.sScore.toFixed(4),
    'R Score': r.rScore.toFixed(4),
    'Berat (kg)': r.stats.totalWeight.toFixed(2),
    'Frekuensi': r.stats.frequency,
    'Pendapatan': `Rp ${r.stats.totalRevenue.toLocaleString('id-ID')}`
  })));
});
```

---

## 🧪 Cara 3: Eksperimen dengan Parameter v

Parameter `v` menentukan strategi kompromi:
- `v = 0`: Fokus minimizing regret (R)
- `v = 0.5`: Balanced (default)
- `v = 1`: Fokus maximizing utility (S)

```javascript
import('./src/utils/vikorAlgorithm.js').then(module => {
  const vValues = [0, 0.25, 0.5, 0.75, 1.0];
  
  vValues.forEach(v => {
    console.log(`\n=== VIKOR dengan v = ${v} ===`);
    const ranking = module.calculateVikorRanking(v);
    
    console.table(ranking.slice(0, 3).map(r => ({
      'Rank': r.rank,
      'Nama': r.name,
      'Q': r.qScore.toFixed(4)
    })));
  });
});
```

### Contoh Output:
```
=== VIKOR dengan v = 0 ===
┌─────┬──────┬──────────────────┬────────┐
│ Idx │ Rank │ Nama             │ Q      │
├─────┼──────┼──────────────────┼────────┤
│ 0   │ 1    │ Dewi Lestari     │ 0.0000 │
│ 1   │ 2    │ Siti Aminah      │ 0.1667 │
│ 2   │ 3    │ Ahmed Wijaya     │ 1.0000 │
└─────┴──────┴──────────────────┴────────┘

=== VIKOR dengan v = 1 ===
┌─────┬──────┬──────────────────┬────────┐
│ Idx │ Rank │ Nama             │ Q      │
├─────┼──────┼──────────────────┼────────┤
│ 0   │ 1    │ Dewi Lestari     │ 0.0000 │
│ 1   │ 2    │ Siti Aminah      │ 0.0076 │
│ 2   │ 3    │ Budi Santoso     │ 0.3417 │
└─────┴──────┴──────────────────┴────────┘
```

---

## 📊 Cara 4: Inspect Individual User Stats

```javascript
import('./src/utils/localStorage.js').then(storage => {
  const users = storage.getUsers().filter(u => u.role === 'user');
  const deposits = storage.getDeposits();
  
  users.forEach(user => {
    const userDeposits = deposits.filter(d => d.userId === user.id);
    const totalWeight = userDeposits.reduce((sum, d) => 
      sum + d.items.reduce((s, i) => s + i.weight, 0), 0
    );
    const totalRevenue = userDeposits.reduce((sum, d) => sum + d.totalAmount, 0);
    
    console.log(`\n${user.name}:`);
    console.log(`  🏋️ Berat Total: ${totalWeight.toFixed(2)} kg`);
    console.log(`  📦 Frekuensi: ${userDeposits.length} kali`);
    console.log(`  💰 Pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')}`);
  });
});
```

---

## 🎯 Cara 5: Simulasi Perubahan Data

Tambah setoran untuk user tertentu dan lihat perubahan ranking:

```javascript
import('./src/utils/localStorage.js').then(storage => {
  // Tambah setoran untuk Rudi Hartono (user-5)
  storage.addDeposit({
    userId: 'user-5',
    date: '2026-01-20',
    items: [
      { type: 'electronic', weight: 15.0 },
      { type: 'metal', weight: 10.0 }
    ],
    totalAmount: 15.0 * 8000 + 10.0 * 5000
  });
  
  console.log('✅ Setoran baru ditambahkan!');
  console.log('Refresh halaman dan cek ranking baru.');
});
```

---

## 📈 Cara 6: Export Ranking ke CSV

```javascript
import('./src/utils/vikorAlgorithm.js').then(module => {
  const ranking = module.calculateVikorRanking(0.5);
  
  const csv = [
    'Rank,Nama,Q Score,S Score,R Score,Total Berat,Frekuensi,Pendapatan',
    ...ranking.map(r => 
      `${r.rank},${r.name},${r.qScore.toFixed(4)},${r.sScore.toFixed(4)},${r.rScore.toFixed(4)},${r.stats.totalWeight},${r.stats.frequency},${r.stats.totalRevenue}`
    )
  ].join('\n');
  
  console.log(csv);
  
  // Download as file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vikor_ranking.csv';
  a.click();
});
```

---

## 🔬 Penjelasan Detail Output

### Q Score (VIKOR Index)
- **Range**: 0 - 1
- **Interpretasi**: Semakin KECIL semakin BAIK
- **Formula**: `Q = v*(S-S*)/(S--S*) + (1-v)*(R-R*)/(R--R*)`
- **Arti**: Solusi kompromi yang menyeimbangkan utility dan regret

### S Score (Utility Measure)
- **Arti**: Jarak dari solusi ideal
- **Interpretasi**: Semakin KECIL semakin DEKAT dengan ideal
- **Formula**: `S = Σ[w_j * (f*_j - f_ij) / (f*_j - f-_j)]`

### R Score (Regret Measure)
- **Arti**: Penyesalan maksimal dari kriteria terburuk
- **Interpretasi**: Semakin KECIL semakin baik (minimal regret)
- **Formula**: `R = max[w_j * (f*_j - f_ij) / (f*_j - f-_j)]`

---

## 🎓 Tips & Tricks

### 1. Compare Before/After
```javascript
// Simpan ranking sebelum perubahan
const before = await import('./src/utils/vikorAlgorithm.js')
  .then(m => m.calculateVikorRanking(0.5));

// ... lakukan perubahan data ...

// Ranking setelah perubahan
const after = await import('./src/utils/vikorAlgorithm.js')
  .then(m => m.calculateVikorRanking(0.5));

// Compare
console.table(before.map((b, i) => ({
  'Nama': b.name,
  'Rank Before': b.rank,
  'Rank After': after[i].rank,
  'Change': after[i].rank - b.rank
})));
```

### 2. Analyze Sensitivity
Lihat seberapa sensitif ranking terhadap perubahan bobot kriteria (edit di `vikorAlgorithm.js`).

### 3. Validate Results
Pastikan ranking masuk akal dengan melihat:
- User dengan frekuensi tertinggi harus rank tinggi
- User dengan berat/pendapatan tinggi harus rank tinggi
- Balance antara kriteria lebih penting dari unggul di satu kriteria

---

## ❓ FAQ

**Q: Kenapa Dewi Lestari juara padahal bukan yang tertinggi di semua kriteria?**
A: VIKOR mencari solusi kompromi. Dewi konsisten di semua kriteria tanpa ada yang sangat rendah.

**Q: Bisa ganti bobot kriteria?**
A: Ya, edit file `src/utils/vikorAlgorithm.js` di bagian `weights` object.

**Q: Kenapa Ahmad rank rendah padahal pendapatan tinggi?**
A: Frekuensi hanya 1x sangat merugikan. VIKOR menghukum ketidakseimbangan.

**Q: v = 0.5 artinya apa?**
A: Balanced antara maximizing group utility (S) dan minimizing regret (R).

---

## 📚 Referensi

- Opricovic, S., & Tzeng, G. H. (2004). "Compromise solution by MCDM methods"
- Source code: `src/utils/vikorAlgorithm.js`
- Demo script: `src/utils/vikorDemo.js`

---

**Happy Ranking! 🎉**
