const pool = require("../config/db");

/**
 * Middleware: Validasi session token dari header Authorization.
 * Token dikirim sebagai "Bearer <token>" dari frontend.
 * Mencari token di tabel `app_sessions` dan menyimpan user ke req.user.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role, u.rt, u.created_at
       FROM app_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > NOW()
       LIMIT 1`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = rows[0];
    req.token = token;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Middleware: Pastikan user yang login adalah admin.
 * Harus digunakan setelah `authenticate`.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = { authenticate, requireAdmin };
