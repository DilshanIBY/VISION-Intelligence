import { Search, Sun, Moon, Bell, Mic } from 'lucide-react';
import appLogo from '../../assets/logo.jpg';
import { useState, useEffect } from 'react';
import { useUI } from '../../contexts/UIContextDefinition';
import { useNavigate } from 'react-router-dom';
import placeholderAvatar from '../../assets/placeholder-avatar.png';
import { NotificationPopover } from './NotificationPopover';

export function TopBar() {
  const { toggleSidebar, isSidebarExpanded } = useUI();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Apply theme on mount and when changed
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to Light mode if no theme is saved, ignoring system preference for now as per request
    const shouldBeDark = savedTheme === 'dark';

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header
      className="
      glass-heavy rounded-full px-5 py-3
      flex items-center justify-between gap-6
      shadow-float hover:shadow-float-hover
      transition-all duration-300
      w-full mx-auto
      relative z-30
    "
    >
      {/* Left: App Branding (Sidebar Toggle) */}
      <div
        className="flex items-center gap-5 min-w-[240px] cursor-pointer group select-none"
        onClick={toggleSidebar}
      >
        <div
          className={`
          flex items-center justify-center w-12 h-12 rounded-2xl 
          bg-white ring-2 ring-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]
          transition-all duration-300 group-hover:scale-105 group-active:scale-95
          dark:bg-slate-800 dark:ring-red-400/25 dark:shadow-[0_0_20px_rgba(248,113,113,0.2)]
          ${isSidebarExpanded ? 'rotate-360' : 'rotate-0'}
        `}
        >
          <img
            src={appLogo}
            alt="VISION Logo"
            className="w-full h-full object-cover scale-95 rounded-2xl"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-black text-text-primary tracking-[0.35em] leading-none ml-1">
            VISION
          </h1>
          <span className="text-[10px] text-text-muted font-bold tracking-[0.2em] self-start ml-1.5 mt-1.5 text-opacity-80">
            INTELLIGENCE
          </span>
        </div>
      </div>

      {/* Center Actions - Search & Tools */}
      <div className="flex-1 flex justify-center items-center px-8 relative">
        {/* Search */}
        <div className="w-full max-w-4xl hidden md:block group">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-text-muted group-hover:text-primary transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Good Evening Mr. Sanjeewa, what's in your mind?"
              className="
                w-full py-3.5 pl-14 pr-6 rounded-full
                bg-surface/60 border border-glass-border
                text-sm font-medium text-text-primary
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface
                transition-all placeholder:text-text-muted/60
                shadow-inner
              "
            />
            <div className="absolute inset-y-0 right-5 flex items-center">
              <button
                className="p-1.5 rounded-full hover:bg-glass-border/50 text-text-muted hover:text-primary transition-colors"
                title="Voice Search"
              >
                <Mic size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-3 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2.5 rounded-full text-text-secondary hover:bg-surface hover:text-primary transition-all relative group ${isNotificationsOpen ? 'bg-surface text-primary' : ''}`}
            title="Notifications"
          >
            <Bell size={20} className="group-hover:animate-swing" />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-accent rounded-full border border-surface shadow-glow-accent"></span>
          </button>

          <NotificationPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllRead={() => { }}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-text-secondary hover:bg-surface hover:text-warning transition-all"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-px h-6 bg-glass-border mx-1" />

        {/* User Profile */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full hover:bg-surface/50 border border-transparent hover:border-glass-border transition-all group"
          title="Profile - Go to Settings"
        >
          <div className="w-9 h-9 rounded-full shadow-lg group-hover:scale-105 transition-transform ring-2 ring-surface overflow-hidden">
            <img
              src={placeholderAvatar}
              alt="User Profile"
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </button>
      </div>
    </header>
  );
}
