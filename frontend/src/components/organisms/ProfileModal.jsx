import { LogOut, User, Moon, Sun } from "lucide-react";

/**
 * Organism: ProfileModal
 * Modal profil pengguna yang menampilkan info akun, toggle dark mode, dan tombol logout.
 * Digunakan bersama oleh AdminDashboard dan UserDashboard.
 */
function ProfileModal({
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  onClose,
}) {
  return (
    <>
      <div className="dropdown-overlay" onClick={onClose}></div>
      <div
        className="modal modal-profile active fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 0, overflow: "hidden" }}
      >
        {/* Header */}
        <div
          style={{
            background: isDarkMode
              ? "var(--gradient-dark)"
              : "var(--color-primary)",
            padding: "var(--spacing-2xl) var(--spacing-xl)",
            color: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            ×
          </button>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "white",
              margin: "0 auto var(--spacing-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              color: "var(--color-primary-600)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <User size={40} />
          </div>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{currentUser.name}</h3>
          <span
            style={{
              fontSize: "0.875rem",
              opacity: 0.9,
              background: "rgba(255,255,255,0.2)",
              padding: "2px 12px",
              borderRadius: "var(--radius-full)",
              marginTop: "8px",
              display: "inline-block",
            }}
          >
            {currentUser.role === "admin" ? "Administrator" : "Nasabah"}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "var(--spacing-xl)" }}>
          {/* Account Info */}
          <div className="menu-group" style={{ marginBottom: "var(--spacing-xl)" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary)",
                fontWeight: "700",
                textTransform: "uppercase",
                marginBottom: "var(--spacing-sm)",
                letterSpacing: "1px",
              }}
            >
              Informasi Akun
            </div>
            <div className="menu-item-simple">
              <span className="label">Email</span>
              <span className="value">{currentUser.email || "Belum diatur"}</span>
            </div>
            <div className="menu-item-simple">
              <span className="label">Wilayah</span>
              <span className="value">
                {currentUser.rt ? `RT ${currentUser.rt}` : "Belum diatur"}
              </span>
            </div>
          </div>

          {/* Settings */}
          <div className="menu-group" style={{ marginBottom: "var(--spacing-xl)" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary)",
                fontWeight: "700",
                textTransform: "uppercase",
                marginBottom: "var(--spacing-sm)",
                letterSpacing: "1px",
              }}
            >
              Pengaturan
            </div>
            {/* Dark Mode Toggle */}
            <div
              className="menu-item-action"
              onClick={onToggleDarkMode}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--spacing-md)",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
              </div>
              {/* Toggle Switch */}
              <div
                style={{
                  width: "40px",
                  height: "20px",
                  background: isDarkMode
                    ? "var(--color-primary-500)"
                    : "var(--border-light)",
                  borderRadius: "20px",
                  position: "relative",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: isDarkMode ? "22px" : "2px",
                    transition: "all 0.3s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            className="btn btn-danger"
            style={{ width: "100%", justifyContent: "center", gap: "12px" }}
            onClick={onLogout}
          >
            <LogOut size={20} />
            Keluar dari Aplikasi
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileModal;
