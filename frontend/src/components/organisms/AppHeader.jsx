import { User, ChevronDown } from "lucide-react";

/**
 * Organism: AppHeader
 * Header atas aplikasi dengan logo, nama aplikasi, dan info user.
 * Digunakan di AdminDashboard dan UserDashboard.
 */
function AppHeader({ appName, currentUser, gradientVar, onProfileClick }) {
  return (
    <header
      style={{
        background: gradientVar || "var(--gradient-primary)",
        color: "white",
        padding: "var(--spacing-lg) 0",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div className="container flex-between header-content">
        {/* Left: Logo + App Name */}
        <div className="flex gap-md" style={{ alignItems: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid white",
            }}
          >
            <img
              src="/img/logo.png"
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem" }}>
              {appName}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                margin: 0,
                fontSize: "0.8rem",
              }}
            >
              Halo, {currentUser.name}
            </p>
          </div>
        </div>

        {/* Right: Profile Section (Desktop) */}
        <div className="flex gap-md" style={{ alignItems: "center" }}>
          <div
            className="header-profile-section desktop-only"
            onClick={onProfileClick}
          >
            <span className="header-username">{currentUser.name}</span>
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "var(--spacing-sm)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <User size={20} />
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
