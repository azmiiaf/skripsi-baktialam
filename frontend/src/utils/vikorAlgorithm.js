/**
 * VIKOR (VIseKriterijumska Optimizacija I Kompromisno Resenje) Algorithm
 *
 * VIKOR adalah metode Multi-Criteria Decision Making (MCDM) yang digunakan untuk
 * menentukan ranking/peringkat berdasarkan berbagai kriteria.
 *
 * Untuk Bank Sampah, kriteria yang digunakan:
 * 1. Total Berat Sampah (kg) - BENEFIT (semakin banyak semakin baik)
 * 2. Frekuensi Setoran - BENEFIT (semakin sering semakin baik)
 * 3. Total Pendapatan (Rp) - BENEFIT
 * 4. Variasi Jenis Sampah - BENEFIT (semakin beragam semakin baik)
 *
 * LANGKAH-LANGKAH VIKOR:
 * 1. Normalisasi matriks keputusan
 * 2. Hitung nilai S (utility measure) dan R (regret measure)
 * 3. Hitung nilai Q (VIKOR index)
 * 4. Ranking berdasarkan nilai Q (semakin kecil semakin baik)
 */

// We'll pass these as arguments to functions instead to support API integration

// Waste type prices (Rp per kg/liter)
export const WASTE_PRICES = {
  bottlePlastic: 3000, // Botol/Gelas Plastik (per kg)
  plasticCaps: 2000, // Tutup Botol Plastik (per kg)
  cardboard: 2000, // Kardus (per kg)
  paper: 1500, // Buku (per kg)
  metal: 5000, // Logam/Besi (per kg)
  mixed: 1000, // Emberan/Campuran (per kg)
  electronic: 8000, // Elektronik (per kg)
  oilWaste: 2500, // Oli (per liter)
  cookingOil: 3500, // Minyak Jelantah (per liter)
};

export const WASTE_TYPES = {
  bottlePlastic: "Botol/Gelas Plastik",
  plasticCaps: "Tutup Botol Plastik",
  cardboard: "Kardus",
  paper: "Buku",
  metal: "Logam/Besi",
  mixed: "Emberan/Campuran",
  electronic: "Elektronik",
  oilWaste: "Oli",
  cookingOil: "Minyak Jelantah",
};

// Calculate user statistics from deposits
const calculateUserStats = (userId, deposits) => {
  const userDeposits = deposits.filter((d) => d.userId === userId);

  if (userDeposits.length === 0) {
    return {
      totalWeight: 0,
      frequency: 0,
      totalRevenue: 0,
      varietyScore: 0,
    };
  }

  // 1. Total Weight (kg/liter)
  let totalWeight = 0;
  userDeposits.forEach((deposit) => {
    deposit.items.forEach((item) => {
      totalWeight += Number(item.weight || 0);
    });
  });

  // 2. Frequency (jumlah setoran)
  const frequency = userDeposits.length;

  // 3. Total Revenue
  let totalRevenue = 0;
  userDeposits.forEach((deposit) => {
    totalRevenue += Number(deposit.totalAmount || 0);
  });

  // 5. Variety Score (berapa jenis sampah yang pernah disetor)
  const wasteTypes = new Set();
  userDeposits.forEach((deposit) => {
    deposit.items.forEach((item) => {
      wasteTypes.add(item.type);
    });
  });
  const varietyScore = wasteTypes.size;

  return {
    totalWeight,
    frequency,
    totalRevenue,
    varietyScore,
  };
};

/**
 * VIKOR Algorithm Implementation
 * @param {Array} users - Array of user objects
 * @param {Array} deposits - Array of deposit objects
 * @param {number} v - Weight for strategy of maximum group utility (default 0.5)
 * @returns {Array} Ranked users with VIKOR scores
 */
export const calculateVikorRanking = (depositsInput, usersInput, v = 0.5) => {
  console.log("=== VIKOR ALGORITHM - STEP BY STEP ===\n");

  const users = usersInput || [];
  const deposits = depositsInput || [];

  if (users.length === 0) {
    console.log("Tidak ada nasabah untuk di-ranking.");
    return [];
  }

  // STEP 0: Collect criteria values for each alternative (user)
  console.log("STEP 0: Mengumpulkan data kriteria untuk setiap nasabah");
  const alternatives = users.map((user) => {
    const stats = calculateUserStats(user.id, deposits);
    console.log(
      `- ${user.name}: Weight=${stats.totalWeight}kg, Frequency=${stats.frequency}, Revenue=Rp${stats.totalRevenue}, Variety=${stats.varietyScore}`,
    );
    return {
      id: user.id,
      name: user.name,
      rt: user.rt,
      criteria: {
        totalWeight: stats.totalWeight,
        frequency: stats.frequency,
        totalRevenue: stats.totalRevenue,
        varietyScore: stats.varietyScore,
      },
      rawStats: stats,
    };
  });

  // Filter out users with fewer than 3 deposits (as requested for better accuracy)
  const activeAlternatives = alternatives.filter(
    (alt) => alt.criteria.frequency >= 3,
  );

  if (activeAlternatives.length === 0) {
    console.log(
      "\nTidak ada nasabah dengan minimal 3 setoran (syarat untuk perankingan akurat).",
    );
    return [];
  }

  console.log(
    `\nTotal nasabah yang memenuhi syarat (min 3 setoran): ${activeAlternatives.length}\n`,
  );

  // Criteria weights (bobot masing-masing kriteria, total = 1)
  const weights = {
    totalWeight: 0.3, // 30%
    frequency: 0.3, // 30%
    totalRevenue: 0.3, // 30%
    varietyScore: 0.1, // 10%
  };

  console.log("BOBOT KRITERIA:");
  console.log(`- Total Berat: ${weights.totalWeight * 100}%`);
  console.log(`- Frekuensi Setoran: ${weights.frequency * 100}%`);
  console.log(`- Total Pendapatan: ${weights.totalRevenue * 100}%`);
  console.log(`- Variasi Jenis Sampah: ${weights.varietyScore * 100}%\n`);

  // STEP 1: Determine best (f*) and worst (f-) values for each criterion
  console.log(
    "STEP 1: Menentukan nilai TERBAIK (f*) dan TERBURUK (f-) untuk setiap kriteria",
  );
  console.log("(Semua kriteria adalah BENEFIT - semakin besar semakin baik)\n");

  const criteriaKeys = Object.keys(weights);
  const bestValues = {};
  const worstValues = {};

  criteriaKeys.forEach((criterion) => {
    const values = activeAlternatives.map((alt) => alt.criteria[criterion]);
    bestValues[criterion] = Math.max(...values); // f* = max (karena benefit)
    worstValues[criterion] = Math.min(...values); // f- = min (karena benefit)

    console.log(`${criterion}:`);
    console.log(`  f* (terbaik) = ${bestValues[criterion]}`);
    console.log(`  f- (terburuk) = ${worstValues[criterion]}`);
  });

  // STEP 2: Calculate S and R values
  console.log(
    "\nSTEP 2: Menghitung nilai S (Utility Measure) dan R (Regret Measure)\n",
  );
  console.log("Formula S: S_i = Σ[w_j * (f*_j - f_ij) / (f*_j - f-_j)]");
  console.log("Formula R: R_i = max[w_j * (f*_j - f_ij) / (f*_j - f-_j)]\n");

  const results = activeAlternatives.map((alt) => {
    let S = 0;
    let R = 0;
    const calculations = {};

    criteriaKeys.forEach((criterion) => {
      const fStar = bestValues[criterion];
      const fMinus = worstValues[criterion];
      const fValue = alt.criteria[criterion];
      const weight = weights[criterion];

      // Normalized distance from best
      let normalized = 0;
      if (fStar !== fMinus) {
        normalized = (fStar - fValue) / (fStar - fMinus);
      }

      const weighted = weight * normalized;
      S += weighted;
      R = Math.max(R, weighted);

      calculations[criterion] = {
        value: fValue,
        normalized,
        weighted,
      };
    });

    console.log(`${alt.name}:`);
    console.log(`  S = ${S.toFixed(4)}`);
    console.log(`  R = ${R.toFixed(4)}`);

    return {
      ...alt,
      S,
      R,
      calculations,
    };
  });

  // STEP 3: Calculate Q values
  console.log("\nSTEP 3: Menghitung nilai Q (VIKOR Index)\n");

  const sValues = results.map((r) => r.S);
  const rValues = results.map((r) => r.R);
  const sStar = Math.min(...sValues);
  const sMinus = Math.max(...sValues);
  const rStar = Math.min(...rValues);
  const rMinus = Math.max(...rValues);

  console.log(`S* (S terbaik) = ${sStar.toFixed(4)}`);
  console.log(`S- (S terburuk) = ${sMinus.toFixed(4)}`);
  console.log(`R* (R terbaik) = ${rStar.toFixed(4)}`);
  console.log(`R- (R terburuk) = ${rMinus.toFixed(4)}`);
  console.log(`v (weight) = ${v}\n`);
  console.log(
    "Formula Q: Q_i = v * (S_i - S*)/(S- - S*) + (1-v) * (R_i - R*)/(R- - R*)\n",
  );

  const finalResults = results.map((result) => {
    let Q = 0;

    if (sMinus !== sStar && rMinus !== rStar) {
      const sComponent = (v * (result.S - sStar)) / (sMinus - sStar);
      const rComponent = ((1 - v) * (result.R - rStar)) / (rMinus - rStar);
      Q = sComponent + rComponent;
    }

    console.log(`${result.name}:`);
    console.log(`  Q = ${Q.toFixed(4)}`);

    return {
      ...result,
      Q,
    };
  });

  // STEP 4: Sort by Q (ascending - smaller is better)
  console.log(
    "\nSTEP 4: Ranking berdasarkan nilai Q (semakin kecil semakin baik)\n",
  );

  const ranked = finalResults.sort((a, b) => a.Q - b.Q);

  console.log("HASIL RANKING:");
  ranked.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.name} - Q: ${result.Q.toFixed(4)}, S: ${result.S.toFixed(4)}, R: ${result.R.toFixed(4)}`,
    );
  });

  console.log("\n=== SELESAI ===\n");

  return ranked.map((result, index) => ({
    rank: index + 1,
    userId: result.id,
    name: result.name,
    qScore: result.Q,
    sScore: result.S,
    rScore: result.R,
    stats: result.rawStats,
    rt: result.rt || "-",
  }));
};

/**
 * Calculate total balance for a user
 * Note: getDeposits is removed, callers should pass data
 */
export const calculateUserBalance = (userDeposits) => {
  return userDeposits.reduce(
    (total, deposit) => total + Number(deposit.totalAmount || 0),
    0,
  );
};

// getUserRankingSummary is removed as it's not used and depends on localStorage

/**
 * Get monthly deposit statistics
 */
// Get monthly deposit statistics
export const getMonthlyDepositStats = (depositsInput) => {
  const deposits = depositsInput || [];
  const monthlyData = {};

  deposits.forEach((deposit) => {
    const date = new Date(deposit.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        totalAmount: 0,
        totalWeight: 0,
        count: 0,
        wasteTypes: {},
      };
    }

    monthlyData[monthKey].totalAmount += Number(deposit.totalAmount || 0);
    monthlyData[monthKey].count += 1;

    deposit.items.forEach((item) => {
      const itemWeight = Number(item.weight || 0);
      const itemPrice = Number(item.price || 0);

      monthlyData[monthKey].totalWeight += itemWeight;

      // Aggregate by waste type
      const type = item.type;
      if (!monthlyData[monthKey].wasteTypes[type]) {
        monthlyData[monthKey].wasteTypes[type] = {
          weight: 0,
          amount: 0,
        };
      }
      monthlyData[monthKey].wasteTypes[type].weight += itemWeight;
      monthlyData[monthKey].wasteTypes[type].amount += itemWeight * itemPrice;
    });
  });

  // Convert to array and sort by month
  return Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
};
