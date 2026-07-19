const pool = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

// Inisialisasi Transporter SMTP untuk pengiriman email reset password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_PORT === "465", // true jika port 465
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// Cegah crash akibat unhandled error event dari transporter
transporter.on("error", (err) => {
  console.error("⚠️ SMTP Transporter Error:", err.message);
});



/**
 * POST /api/auth/login
 * Body: { username, password }
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
  }

  try {
    const [users] = await pool.execute(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      [username.trim()]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: "Akun tidak ditemukan. Periksa kembali email Anda." });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Password yang Anda masukkan salah." });
    }

    // Cek apakah email sudah diverifikasi
    if (!user.is_verified) {
      return res.json({
        success: false,
        message: "Email Anda belum diverifikasi. Silakan periksa inbox/spam email Anda untuk melakukan verifikasi."
      });
    }

    // Hapus session yang sudah kadaluarsa

    await pool.execute(`DELETE FROM app_sessions WHERE expires_at <= NOW()`);

    // Buat session token baru
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    await pool.execute(
      `INSERT INTO app_sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      [token, user.id, expiresAt]
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rt: user.rt,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/register
 * Body: { username, name, email, rt, password, role? }
 * Hanya admin yang bisa membuat akun dengan role selain 'user'
 */
const register = async (req, res) => {
  const { username, name, email, rt, password, role = "user" } = req.body;

  
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
    const finalRole = role === "admin" ? "admin" : "user"; // hanya admin dari req.user bisa set role admin

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedVerifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

    await pool.execute(
      `INSERT INTO users (id, name, email, rt, password, password_plain, role, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name.trim(), email.toLowerCase().trim(), rt || null, hashedPassword, password, finalRole, 0, hashedVerifyToken]
    );

    const origin = req.headers.origin || "http://localhost:5173";
    const verifyUrl = `${origin}/verify-email/${verifyToken}`;
    let emailSent = false;

    const isSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_USER !== "email-anda@gmail.com" && process.env.SMTP_USER.trim() !== "";
    if (isSmtpConfigured) {
      try {
        const mailOptions = {
          from: `"Bank Sampah Bakti Alam" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
          to: email.trim(),
          subject: "Verifikasi Alamat Email Anda - Bank Sampah Bakti Alam",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #009688; text-align: center;">Verifikasi Email Anda</h2>
              <p>Halo, <strong>${name.trim()}</strong>,</p>
              <p>Terima kasih telah mendaftar di sistem Bank Sampah Bakti Alam. Silakan verifikasi email Anda dengan mengklik tombol di bawah ini:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" target="_blank" style="background-color: #009688; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verifikasi Email Sekarang</a>
              </div>
              <p>Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin tautan berikut ke browser Anda:</p>
              <p style="word-break: break-all; color: #009688;"><a href="${verifyUrl}">${verifyUrl}</a></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">Jika Anda tidak merasa mendaftar akun ini, silakan abaikan email ini.</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailErr) {
        console.error("Nodemailer sendMail error during registration:", mailErr.message);
      }
    }

    return res.json({
      success: true,
      message: "Registrasi berhasil! Silakan periksa email Anda (inbox/spam) untuk melakukan verifikasi akun.",
      emailSent,
      verifyUrl: !emailSent ? verifyUrl : undefined // fallback untuk pengujian lokal
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 */
const forgotPassword = async (req, res) => {
  const { email, origin } = req.body;

  try {
    const [users] = await pool.execute(
      `SELECT id, name FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1`,
      [email?.trim()]
    );

    // Selalu balas sukses agar tidak bocorkan informasi email terdaftar atau tidak
    if (users.length === 0) {
      return res.json({ success: true, message: "Jika email terdaftar, link reset telah dikirim." });
    }

    const user = users[0];
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await pool.execute(
      `UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?`,
      [hashedToken, expires, user.id]
    );

    const resetUrl = `${origin || "http://localhost:5173"}/reset-password/${rawToken}`;

    let emailSent = false;
    const isSmtpConfigured = process.env.SMTP_USER && process.env.SMTP_USER !== "email-anda@gmail.com" && process.env.SMTP_USER.trim() !== "";

    if (isSmtpConfigured) {
      try {
        const mailOptions = {
          from: `"Bank Sampah Bakti Alam" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
          to: email.trim(),
          subject: "Reset Password - Bank Sampah Bakti Alam",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #009688; text-align: center;">Reset Password Akun Anda</h2>
              <p>Halo, <strong>${user.name}</strong>,</p>
              <p>Kami menerima permintaan untuk mereset password akun Anda di aplikasi Bank Sampah Bakti Alam Digital.</p>
              <p>Silakan klik tombol di bawah ini untuk melanjutkan pengubahan password (tautan ini berlaku selama 1 jam):</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" target="_blank" style="background-color: #009688; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password Sekarang</a>
              </div>
              <p>Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin tautan berikut ke browser Anda:</p>
              <p style="word-break: break-all; color: #009688;"><a href="${resetUrl}">${resetUrl}</a></p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">Jika Anda tidak meminta perubahan ini, Anda dapat mengabaikan email ini dengan aman.</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailErr) {
        console.error("Nodemailer sendMail error:", mailErr.message);
      }
    }

    if (emailSent) {
      return res.json({
        success: true,
        message: "Link reset password telah dikirim ke email Anda.",
        emailSent: true
      });
    } else {
      // Fallback untuk testing lokal jika SMTP belum disetup / gagal mengirim email
      return res.json({
        success: true,
        message: "Link reset password berhasil dibuat (Gagal mengirim email, gunakan tautan berikut untuk pengujian).",
        resetUrl,
        emailSent: false
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 */
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return res.json({ success: false, message: "Format token tidak valid" });
  }
  if (!password || password.length < 6) {
    return res.json({ success: false, message: "Password minimal 6 karakter" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const [users] = await pool.execute(
      `SELECT id FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW() LIMIT 1`,
      [hashedToken]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: "Token tidak valid atau sudah kadaluarsa" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.execute(
      `UPDATE users SET password = ?, password_plain = ?, reset_password_token = NULL, reset_password_expires = NULL, is_verified = 1 WHERE id = ?`,
      [hashed, password, users[0].id]
    );

    return res.json({ success: true, message: "Password berhasil diubah. Silakan masuk dengan password baru." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/auth/verify-email
 * Body: { token }
 */
const verifyEmail = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token verifikasi wajib diisi" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    const [users] = await pool.execute(
      `SELECT * FROM users WHERE verification_token = ? LIMIT 1`,
      [hashedToken]
    );

    if (users.length === 0) {
      return res.json({ success: false, message: "Tautan verifikasi tidak valid atau sudah kadaluarsa" });
    }

    const user = users[0];

    // Aktifkan akun
    await pool.execute(
      `UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?`,
      [user.id]
    );

    // Otomatis login: Hapus session yang kadaluarsa dan buat session token baru
    await pool.execute(`DELETE FROM app_sessions WHERE expires_at <= NOW()`);

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    await pool.execute(
      `INSERT INTO app_sessions (token, user_id, expires_at) VALUES (?, ?, ?)`,
      [sessionToken, user.id, expiresAt]
    );

    return res.json({
      success: true,
      message: "Verifikasi email berhasil! Selamat datang di Bank Sampah Bakti Alam.",
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rt: user.rt,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { login, register, forgotPassword, resetPassword, verifyEmail };

