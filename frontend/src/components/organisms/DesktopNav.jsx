import TabButton from "../molecules/TabButton";

/**
 * Organism: DesktopNav
 * Navigasi tab untuk tampilan desktop.
 * Digunakan di AdminDashboard dan UserDashboard.
 */
function DesktopNav({ tabs, activeTab, onTabChange, colorScheme = "primary" }) {
  return (
    <div
      className="desktop-nav no-print"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "2px solid var(--border-light)",
      }}
    >
      <div className="container">
        <div
          className="flex gap-md"
          style={{ overflowX: "auto", padding: "var(--spacing-md) 0" }}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.key}
              onClick={() => onTabChange(tab.key)}
              badge={tab.badge}
              colorScheme={colorScheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DesktopNav;
