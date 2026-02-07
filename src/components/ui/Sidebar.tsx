import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calculator,
  Grid3X3,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useUI } from '../../contexts/UIContextDefinition';

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
  const { isSidebarExpanded } = useUI();

  return (
    <motion.aside
      layout
      transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }}
      className={`
        glass-heavy py-6 px-4
        flex flex-col gap-2 items-center
        z-50 shadow-float hover:shadow-float-hover
        ${isSidebarExpanded
          ? 'w-[240px] h-full items-start px-6 rounded-3xl'
          : 'w-[88px] h-auto rounded-[44px]' // 44px is geometric match for 88px width
        }
      `}
    >
      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 w-full">
        <AnimatePresence mode='popLayout'>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center h-12 rounded-full px-3.5
                transition-colors duration-300 overflow-hidden w-full
                ${isActive
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                }
                ${!isSidebarExpanded && 'justify-center'}
              `}
            >
              <motion.div
                layout
                className={`flex-shrink-0 flex items-center justify-center w-6 h-6 ${isSidebarExpanded ? 'mr-3' : ''}`}
              >
                {item.icon}
              </motion.div>

              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </AnimatePresence>
      </nav>
    </motion.aside>
  );
}
