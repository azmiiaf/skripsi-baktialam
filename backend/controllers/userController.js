const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/**
 * POST /api/users
 * Admin: Tambah nasabah baru langsung (is_verified = 1, tanpa email verifikasi)
 */
const addUser = async (req, res) => {
  const { name, email, rt, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.json({ success: false, message: "Nama minimal 2 karakter" });
  }
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return res.json({ success: false, message: "Format email tidak valid" });
  }
  if (!password || password.length < 6) {
    return res.json({ success: false, message: "Password minimal 6 karakter" });
  }

  try {
    // Cek apakah email sudah dipakai
    const [existing] = await pool.execute(
      `SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      [email.trim()]
    );
    if (existing.length > 0) {
      return res.json({ success: false, message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.execute(
      `INSERT INTO users (id, name, email, rt, password, password_plain, role, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, 'user', 1)`,
      [userId, name.trim(), email.toLowerCase().trim(), rt || null, hashedPassword, password]
    );

    return res.json({ success: true, message: "Nasabah berhasil ditambahkan" });
  } catch (err) {
    console.error("addUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/users
 * Admin: Dapatkan semua nasabah (role = 'user')
 */
const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email, rt, role, password, password_plain AS passwordPlain, created_at AS createdAt
       FROM users WHERE role = 'user' ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * PUT /api/users/:id
 * Admin: Update data nasabah
 * Body: { username?, name?, email?, rt?, password? }
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, rt, password } = req.body;

  try {
    // Cek apakah email sudah dipakai oleh user lain
    if (email) {
      const [conflict] = await pool.execute(
        `SELECT id FROM users WHERE id <> ? AND LOWER(email) = LOWER(?) LIMIT 1`,
        [id, email]
      );
      if (conflict.length > 0) {
        return res.json({ success: false, message: "Email sudah digunakan" });
      }
    }

    await pool.execute(
      `UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(LOWER(?), email),
        rt = ?
       WHERE id = ?`,
      [name?.trim() || null, email?.trim() || null, rt || null, id]
    );

    if (password && password.length >= 6) {
      const isAlreadyHashed = password.startsWith("$2b$") || password.startsWith("$2a$");
      if (!isAlreadyHashed) {
        const [current] = await pool.execute(`SELECT password_plain FROM users WHERE id = ?`, [id]);
        const currentPlain = current[0]?.password_plain;
        if (password !== currentPlain) {
          const hashed = await bcrypt.hash(password, 10);
          await pool.execute(`UPDATE users SET password = ?, password_plain = ? WHERE id = ?`, [hashed, password, id]);
        }
      }
    }

    return res.json({ success: true, message: "Data nasabah berhasil diperbarui" });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * DELETE /api/users/:id
 * Admin: Hapus nasabah (hanya yang role = 'user')
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Manually delete dependent records to prevent database constraint errors
    await pool.execute(`DELETE FROM deposits WHERE user_id = ?`, [id]);
    await pool.execute(`DELETE FROM notifications WHERE user_id = ?`, [id]);
    await pool.execute(`DELETE FROM app_sessions WHERE user_id = ?`, [id]);

    const [result] = await pool.execute(`DELETE FROM users WHERE id = ? AND role = 'user'`, [id]);
    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Nasabah tidak ditemukan atau role bukan 'user'" });
    }
    return res.json({ success: true, message: "Nasabah berhasil dihapus" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ success: false, message: `Database error: ${err.message}` });
  }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };
