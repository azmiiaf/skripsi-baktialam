const pool = require("../config/db");

/**
 * Mapping nama sampah (kolom `name` di DB) → kode type (yang dipakai frontend)
 * Sesuai dengan WASTE_TYPES di vikorAlgorithm.js
 */
const NAME_TO_TYPE = {
  "Botol/Gelas Plastik": "bottlePlastic",
  "Kardus":              "cardboard",
  "Buku":                "paper",
  "Logam/Besi":          "metal",
  "Emberan/Campuran":    "mixed",
  "Elektronik":          "electronic",
  "Oli":                 "oilWaste",
  "Minyak Jelantah":     "cookingOil",
};

const TYPE_TO_NAME = Object.fromEntries(
  Object.entries(NAME_TO_TYPE).map(([name, type]) => [type, name])
);

// Harga default jika tabel kosong
const DEFAULT_PRICES = [
  { type: "bottlePlastic", label: "Botol/Gelas Plastik", price: 3000 },
  { type: "cardboard",     label: "Kardus",               price: 2000 },
  { type: "paper",         label: "Buku",                 price: 1500 },
  { type: "metal",         label: "Logam/Besi",           price: 5000 },
  { type: "mixed",         label: "Emberan/Campuran",     price: 1000 },
  { type: "electronic",    label: "Elektronik",           price: 8000 },
  { type: "oilWaste",      label: "Oli",                  price: 2500 },
  { type: "cookingOil",    label: "Minyak Jelantah",      price: 3500 },
];

/**
 * GET /api/prices
 * Publik: Dapatkan semua harga sampah
 * Mengembalikan format [{type, price}] yang dipakai frontend
 */
const getWastePrices = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT name, price_per_unit AS price FROM waste_prices ORDER BY id`
    );

    if (rows.length === 0) return res.json(DEFAULT_PRICES);

    // Konversi ke format {type, price} yang diharapkan frontend
    const mapped = rows.map((r) => ({
      type:  NAME_TO_TYPE[r.name] || r.name,
      price: Number(r.price),
    }));

    return res.json(mapped);
  } catch (err) {
    console.error("getWastePrices error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * PUT /api/prices
 * Admin: Update daftar harga sampah
 * Body: [{ type, price }] atau { type: price } object
 */
const updateWastePrices = async (req, res) => {
  const body = req.body;

  // Terima array [{type, price}] atau object {type: price}
  let prices = [];
  if (Array.isArray(body)) {
    prices = body;
  } else if (typeof body === "object") {
    prices = Object.entries(body).map(([type, price]) => ({ type, price }));
  }

  if (prices.length === 0) {
    return res.json({ success: false, message: "Data harga tidak valid" });
  }

  try {
    for (const item of prices) {
      if (!item.type || item.price === undefined) continue;
      const name = TYPE_TO_NAME[item.type] || item.type;
      await pool.execute(
        `UPDATE waste_prices SET price_per_unit = ? WHERE name = ?`,
        [Number(item.price), name]
      );
    }
    return res.json({ success: true, message: "Harga sampah berhasil diperbarui" });
  } catch (err) {
    console.error("updateWastePrices error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getWastePrices, updateWastePrices };
