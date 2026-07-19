const pool = require("../config/db");

/**
 * GET /api/ranking
 * Accessible to all authenticated users (nasabah & admin).
 * Mengembalikan data yang dibutuhkan frontend untuk menghitung VIKOR ranking:
 * - Daftar user (id, name, rt saja — tanpa data sensitif)
 * - Semua setoran (userId, items, totalAmount, date)
 */
const getRankingData = async (req, res) => {
  try {
    // Ambil daftar user (hanya field publik untuk ranking)
    const [users] = await pool.execute(
      `SELECT id, name, rt FROM users WHERE role = 'user' ORDER BY created_at ASC`
    );

    // Ambil semua deposit (field yang diperlukan untuk kalkulasi VIKOR)
    const [deposits] = await pool.execute(
      `SELECT id, user_id AS userId, items, total_amount AS totalAmount, date
       FROM deposits
       ORDER BY created_at ASC`
    );

    // Parse items JSON
    const parsedDeposits = deposits.map((d) => ({
      ...d,
      items: typeof d.items === "string" ? JSON.parse(d.items) : d.items,
    }));

    return res.json({
      success: true,
      users,
      deposits: parsedDeposits,
    });
  } catch (err) {
    console.error("getRankingData error:", err.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getRankingData };
