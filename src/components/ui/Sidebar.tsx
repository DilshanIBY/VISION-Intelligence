import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  Grid3X3,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scissors,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
  { path: '/calculator', label: 'Calculator', icon: <Calculator size={22} /> },
  { path: '/floor-layout', label: 'Floor Layout', icon: <Grid3X3 size={22} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={22} /> },
];

const bottomNavItems: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: <Settings size={22} /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => setCollapsed(!collapsed);

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-[var(--radius-xl)] transition-all
          ${
            isActive
              ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow-primary)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]'
          }
          ${collapsed ? 'justify-center px-3' : ''}
        `}
        title={collapsed ? item.label : undefined}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={`
        glass flex flex-col h-full transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-glass-border)]">
        <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white">
          <Scissors size={20} />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-[var(--color-text-primary)]">
              APPAREL
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">Industry Tools</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">{navItems.map(renderNavItem)}</nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-[var(--color-glass-border)]">
        {bottomNavItems.map(renderNavItem)}

        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className={`
            flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-xl)]
            text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]
            hover:text-[var(--color-text-primary)] transition-all
            ${collapsed ? 'justify-center px-3' : ''}
          `}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="flex-shrink-0">
            {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </span>
          {!collapsed && <span className="font-medium text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
