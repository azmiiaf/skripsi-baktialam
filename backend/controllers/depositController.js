const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/**
 * GET /api/deposits
 * Admin: Dapatkan semua setoran + nama depositor
 */
const getDeposits = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT d.id, d.user_id AS userId, d.items, d.total_amount AS totalAmount,
              d.date, d.status, d.priority, d.created_at AS createdAt,
              u.name AS depositorName
       FROM deposits d
       LEFT JOIN users u ON u.id = d.user_id
       ORDER BY d.created_at DESC`
    );

    // Parse items JSON dari string menjadi array
    const parsed = rows.map((r) => ({
      ...r,
      items: typeof r.items === "string" ? JSON.parse(r.items) : r.items,
    }));

    return res.json(parsed);
  } catch (err) {
    console.error("getDeposits error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/deposits/user/:userId
 * Admin atau Nasabah sendiri: Dapatkan setoran berdasarkan userId
 */
const getDepositsByUser = async (req, res) => {
  const { userId } = req.params;

  // Pastikan nasabah biasa hanya bisa lihat data miliknya sendiri
  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT d.id, d.user_id AS userId, d.items, d.total_amount AS totalAmount,
              d.date, d.status, d.priority, d.created_at AS createdAt,
              u.name AS depositorName
       FROM deposits d
       LEFT JOIN users u ON u.id = d.user_id
       WHERE d.user_id = ?
       ORDER BY d.created_at DESC`,
      [userId]
    );

    const parsed = rows.map((r) => ({
      ...r,
      items: typeof r.items === "string" ? JSON.parse(r.items) : r.items,
    }));

    return res.json(parsed);
  } catch (err) {
    console.error("getDepositsByUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/deposits
 * Admin: Tambah setoran baru
 * Body: { userId, items, totalAmount, date, status?, priority? }
 */
const addDeposit = async (req, res) => {
  const { userId, items, totalAmount, date, status = "completed", priority = "normal" } = req.body;

  if (!userId || !date) {
    return res.json({ success: false, message: "userId dan date wajib diisi" });
  }

  try {
    const id = uuidv4();
    const itemsJson = JSON.stringify(Array.isArray(items) ? items : []);

    // Pastikan format date benar (YYYY-MM-DD)
    const dateFormatted = date ? date.split("T")[0] : new Date().toISOString().split("T")[0];

    await pool.execute(
      `INSERT INTO deposits (id, user_id, items, total_amount, date, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, itemsJson, Number(totalAmount) || 0, dateFormatted, status, priority]
    );

    return res.json({ success: true, id });
  } catch (err) {
    console.error("addDeposit error:", err.message);
    console.error("addDeposit SQL error code:", err.code, "| errno:", err.errno);
    console.error("addDeposit SQL:", err.sql);
    return res.status(500).json({ success: false, message: `Database error: ${err.message}` });
  }
};

/**
 * PUT /api/deposits/:id
 * Admin: Update setoran
 */
const updateDeposit = async (req, res) => {
  const { id } = req.params;
  const { userId, items, totalAmount, date, status = "completed", priority = "normal" } = req.body;

  try {
    const itemsJson = JSON.stringify(Array.isArray(items) ? items : []);
    // Pastikan format date benar (YYYY-MM-DD)
    const dateFormatted = date ? date.split("T")[0] : new Date().toISOString().split("T")[0];

    await pool.execute(
      `UPDATE deposits SET user_id = ?, items = ?, total_amount = ?, date = ?, status = ?, priority = ?
       WHERE id = ?`,
      [userId, itemsJson, Number(totalAmount) || 0, dateFormatted, status, priority, id]
    );
    return res.json({ success: true, message: "Setoran berhasil diperbarui" });
  } catch (err) {
    console.error("updateDeposit error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * DELETE /api/deposits/:id
 * Admin: Hapus setoran
 */
const deleteDeposit = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute(`DELETE FROM deposits WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Setoran tidak ditemukan" });
    }
    return res.json({ success: true, message: "Setoran berhasil dihapus" });
  } catch (err) {
    console.error("deleteDeposit error:", err);
    return res.status(500).json({ success: false, message: `Database error: ${err.message}` });
  }
};

module.exports = { getDeposits, getDepositsByUser, addDeposit, updateDeposit, deleteDeposit };
