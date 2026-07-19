/**
 * Molecule: BottomNavItem
 * Item navigasi bawah untuk tampilan mobile.
 * Digunakan di AdminDashboard dan UserDashboard.
 */
function BottomNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bottom-nav-item ${active ? "active" : ""}`}
    >
      <div className="icon-wrapper">{icon}</div>
      <span>{label}</span>
    </button>
  );
}

export default BottomNavItem;
