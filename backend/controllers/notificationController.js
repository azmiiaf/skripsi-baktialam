const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/**
 * GET /api/notifications/:userId
 * Admin atau Nasabah sendiri: Dapatkan notifikasi berdasarkan userId
 */
const getNotifications = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT id, user_id AS userId, title, message, type,
              is_read AS isRead, created_at AS date, created_at AS createdAt
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("getNotifications error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/notifications
 * Admin: Tambah notifikasi baru untuk nasabah
 * Body: { userId, title, message, type? }
 */
const addNotification = async (req, res) => {
  const { userId, title, message, type = "info" } = req.body;

  if (!userId || !title || !message) {
    return res.json({ success: false, message: "userId, title, dan message wajib diisi" });
  }

  try {
    const id = uuidv4();
    await pool.execute(
      `INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)`,
      [id, userId, title.trim(), message.trim(), type || "info"]
    );
    return res.json({ success: true, id });
  } catch (err) {
    console.error("addNotification error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Admin atau Nasabah sendiri: Tandai notifikasi sebagai sudah dibaca
 */
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(`SELECT user_id FROM notifications WHERE id = ? LIMIT 1`, [id]);
    if (rows.length === 0) return res.json({ success: false, message: "Notifikasi tidak ditemukan" });

    if (req.user.role !== "admin" && req.user.id !== rows[0].user_id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await pool.execute(`UPDATE notifications SET is_read = TRUE WHERE id = ?`, [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error("markAsRead error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * DELETE /api/notifications/user/:userId
 * Admin atau Nasabah sendiri: Hapus semua notifikasi milik userId
 */
const clearNotifications = async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    await pool.execute(`DELETE FROM notifications WHERE user_id = ?`, [userId]);
    return res.json({ success: true });
  } catch (err) {
    console.error("clearNotifications error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getNotifications, addNotification, markAsRead, clearNotifications };
