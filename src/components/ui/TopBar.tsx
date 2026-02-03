import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, User, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/calculator': 'Machinery Calculator',
  '/floor-layout': 'Floor Layout Planner',
  '/analytics': 'Analytics Dashboard',
  '/settings': 'Settings',
};

export function TopBar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  const currentTitle = pageTitles[location.pathname] || 'APPAREL';

  // Apply theme on mount and when changed
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <header className="glass flex items-center justify-between px-6 py-4 border-b border-[var(--color-glass-border)]">
      {/* Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">{currentTitle}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-xl)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-all"
          title="Search"
        >
          <Search size={18} />
          <span className="text-sm hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-[var(--color-glass)] text-[var(--color-text-muted)]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-[var(--radius-xl)] text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)] transition-all"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-[var(--radius-xl)] text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)] transition-all"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Profile */}
        <button
          className="flex items-center gap-2 p-2 rounded-[var(--radius-xl)] text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)] transition-all"
          title="Profile"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
            <User size={16} />
          </div>
        </button>
      </div>
    </header>
  );
}
