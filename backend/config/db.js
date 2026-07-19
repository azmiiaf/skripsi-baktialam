const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "banksampah_bakti_alam",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
});

// Test koneksi saat startup
pool.getConnection()
  .then(async (conn) => {
    console.log("✅ MySQL Database terhubung:", process.env.DB_NAME);
    
    // Auto-migrate: Tambah kolom password_plain ke tabel users jika belum ada
    try {
      const [columns] = await conn.query("SHOW COLUMNS FROM users LIKE 'password_plain'");
      if (columns.length === 0) {
        await conn.query("ALTER TABLE users ADD COLUMN password_plain VARCHAR(255) DEFAULT NULL AFTER password");
        console.log("ℹ️ Kolom 'password_plain' berhasil ditambahkan ke tabel 'users'");
      }
      
      const [verifiedCol] = await conn.query("SHOW COLUMNS FROM users LIKE 'is_verified'");
      if (verifiedCol.length === 0) {
        await conn.query("ALTER TABLE users ADD COLUMN is_verified TINYINT DEFAULT 0 AFTER role");
        console.log("ℹ️ Kolom 'is_verified' berhasil ditambahkan ke tabel 'users'");
      }

      const [tokenCol] = await conn.query("SHOW COLUMNS FROM users LIKE 'verification_token'");
      if (tokenCol.length === 0) {
        await conn.query("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL AFTER is_verified");
        console.log("ℹ️ Kolom 'verification_token' berhasil ditambahkan ke tabel 'users'");
      }
    } catch (err) {
      console.error("⚠️ Gagal memeriksa/menambahkan kolom migrasi:", err.message);
    }
    
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Gagal koneksi ke MySQL:", err.message);
    console.error("Pastikan XAMPP/MySQL sudah berjalan dan konfigurasi .env sudah benar.");
  });

module.exports = pool;
