/**
 * Molecule: StatCard
 * Kartu statistik dengan icon, nilai, dan label.
 * Digunakan di tab Dashboard admin.
 */
function StatCard({ icon, label, value, variant = "primary" }) {
  const isLongValue = typeof value === "string" && value.length > 12;

  return (
    <div className={`stat-card ${variant}`}>
      <div className={`stat-icon ${variant}`}>{icon}</div>
      <div className={`stat-value ${isLongValue ? "mobile-compact-text" : ""}`}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default StatCard;
