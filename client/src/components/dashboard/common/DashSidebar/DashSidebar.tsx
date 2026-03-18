import UserAvatar from "../UserAvatar/UserAvatar.tsx";
import "./DashSidebar.css";

interface NavItem {
  tab:   string;
  icon:  string;
  label: string;
  badge?: number;
}

interface DashSidebarProps {
  name:        string;
  role:        string;
  activeTab:   string;
  navItems:    NavItem[];
  onTabChange: (tab: string) => void;
  footerNote:  string;
}

export default function DashSidebar({
  name, role, activeTab, navItems, onTabChange, footerNote,
}: DashSidebarProps) {
  return (
    <aside className="dsb-sidebar">
      {/* Profile */}
      <div className="dsb-profile">
        <UserAvatar name={name} size="md" />
        <div>
          <p className="dsb-name">{name}</p>
          <p className="dsb-role">{role}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="dsb-nav">
        {navItems.map(item => (
          <button
            key={item.tab}
            className={`dsb-btn ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => onTabChange(item.tab)}
          >
            <span className="dsb-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <span className="dsb-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="dsb-footer">{footerNote}</div>
    </aside>
  );
}