import BottomNavItem from "../molecules/BottomNavItem";

/**
 * Organism: BottomNav
 * Navigasi bawah untuk tampilan mobile.
 * Digunakan di AdminDashboard dan UserDashboard.
 */
function BottomNav({ items }) {
  return (
    <nav className="bottom-nav no-print">
      {items.map((item, index) => (
        <BottomNavItem
          key={index}
          icon={item.icon}
          label={item.label}
          active={item.active}
          onClick={item.onClick}
        />
      ))}
    </nav>
  );
}

export default BottomNav;
