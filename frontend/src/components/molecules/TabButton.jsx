/**
 * Molecule: TabButton
 * Tombol tab navigasi untuk desktop.
 * Digunakan di AdminDashboard dan UserDashboard.
 *
 * @param {string} colorScheme - "primary" untuk admin, "secondary" untuk user
 */
function TabButton({
  icon,
  label,
  active,
  onClick,
  badge,
  colorScheme = "primary",
}) {
  return (
    <button
      onClick={onClick}
      className="flex gap-sm"
      style={{
        padding: "var(--spacing-md) var(--spacing-lg)",
        background: active
          ? `var(--color-${colorScheme}-50)`
          : "transparent",
        color: active
          ? `var(--color-${colorScheme}-700)`
          : "var(--text-secondary)",
        border: "none",
        borderBottom: active
          ? `3px solid var(--color-${colorScheme}-600)`
          : "3px solid transparent",
        cursor: "pointer",
        fontWeight: active ? "700" : "500",
        fontSize: "0.875rem",
        transition: "all var(--transition-fast)",
        alignItems: "center",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      {icon}
      {label}
      {badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: "0.25rem",
            right: "0.25rem",
            background: "#ef4444",
            color: "white",
            fontSize: "0.625rem",
            fontWeight: "700",
            padding: "0.125rem 0.375rem",
            borderRadius: "var(--radius-full)",
            minWidth: "1.25rem",
            textAlign: "center",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default TabButton;
