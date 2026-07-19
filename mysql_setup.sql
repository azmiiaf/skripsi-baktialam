-- =====================================================
-- Bank Sampah Bakti Alam — MySQL Setup
-- Jalankan file ini di phpMyAdmin atau MySQL CLI
-- Pastikan database 'banksampah_bakti_alam' sudah dibuat
-- =====================================================

CREATE DATABASE IF NOT EXISTS banksampah_bakti_alam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE banksampah_bakti_alam;

-- =====================================================
-- Tabel Users / Nasabah
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  rt VARCHAR(50) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  password_plain VARCHAR(255) DEFAULT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  reset_password_token VARCHAR(255) DEFAULT NULL,
  reset_password_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Tabel Sessions (untuk autentikasi)
-- =====================================================
CREATE TABLE IF NOT EXISTS app_sessions (
  token VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Tabel Setoran / Deposits
-- =====================================================
CREATE TABLE IF NOT EXISTS deposits (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  items JSON NOT NULL DEFAULT ('[]'),
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  priority VARCHAR(50) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Tabel Notifikasi
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Tabel Harga Sampah (opsional, jika ada endpoint prices)
-- =====================================================
CREATE TABLE IF NOT EXISTS waste_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'kg',
  price_per_unit DECIMAL(15,2) NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Data Harga Sampah (Seed Data)
-- =====================================================
INSERT IGNORE INTO waste_prices (name, unit, price_per_unit, category) VALUES
('Botol/Gelas Plastik', 'kg', 3000, 'Plastik'),
('Kardus', 'kg', 2000, 'Kertas'),
('Buku', 'kg', 1500, 'Kertas'),
('Logam/Besi', 'kg', 5000, 'Logam'),
('Emberan/Campuran', 'kg', 1000, 'Campuran'),
('Elektronik', 'kg', 8000, 'Elektronik'),
('Oli', 'liter', 2500, 'Cairan'),
('Minyak Jelantah', 'liter', 3500, 'Cairan');

-- =====================================================
-- Akun Admin Default
-- Password: admin123 (bcrypt hash)
-- =====================================================
INSERT IGNORE INTO users (id, username, name, email, role, password) VALUES
(
  'admin-001',
  'admin',
  'Administrator',
  'admin@banksampah.com',
  'admin',
  '$2b$10$epiMbXw0HoPjuc.4t4VNyuFwniKmMy.Tmjx.H/9AgHEI0RGdYS9ue'  -- password: admin123
);

-- =====================================================
-- Index untuk performa
-- =====================================================
CREATE INDEX idx_deposits_user_id ON deposits(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_sessions_user_id ON app_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON app_sessions(expires_at);
