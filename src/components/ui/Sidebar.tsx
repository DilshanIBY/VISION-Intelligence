import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  Grid3X3,
  BarChart3,
  Settings,
  Aperture,
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
  { path: '/settings', label: 'Settings', icon: <Settings size={22} /> },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      onMouseLeave={() => setIsExpanded(false)}
      className={`
        glass-heavy rounded-[2rem] p-3
        flex flex-col gap-2
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isExpanded ? 'w-[240px]' : 'w-[76px]'}
        z-50
        shadow-float hover:shadow-float-hover
      `}
    >
      {/* Brand Icon (Toggle Trigger) */}
      <div
        onMouseEnter={() => setIsExpanded(true)}
        className="flex items-center h-14 w-full mb-2 overflow-hidden cursor-pointer"
      >
        <div className="flex-shrink-0 w-[52px] h-[52px] flex items-center justify-center rounded-[1.5rem] bg-primary text-white shadow-glow-primary ml-0.5 transition-transform duration-300 hover:scale-105">
          <Aperture size={26} />
        </div>
        <div className={`ml-3 flex flex-col transition-opacity duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-bold text-lg text-text-primary tracking-tight">APPAREL</span>
          <span className="text-xs text-text-muted">Intelligence</span>
        </div>
      </div>

      <div className="h-px w-full bg-glass-border my-1 rounded-full opacity-50" />

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center h-12 rounded-[1.25rem] px-3.5
              transition-all duration-300 overflow-hidden
              ${isActive
                ? 'bg-primary text-white shadow-glow-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
              }
            `}
          >
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
              {item.icon}
            </div>

            <span className={`
              absolute left-[60px] font-medium whitespace-nowrap 
              transition-opacity duration-300
              ${isExpanded ? 'opacity-100 delay-100' : 'opacity-0'}
            `}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
