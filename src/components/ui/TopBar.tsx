
import { Search, Sun, Moon, Bell, Aperture } from 'lucide-react';
import { useState, useEffect } from 'react';


export function TopBar() {


  const [isDark, setIsDark] = useState(false);

  // Apply theme on mount and when changed
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

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
    <header className="
      glass-heavy rounded-full px-6 py-3
      flex items-center justify-between gap-6
      shadow-float hover:shadow-float-hover
      transition-all duration-300
      w-full max-w-[98%] mx-auto
    ">
      {/* Left: App Branding */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-glow-primary">
          <Aperture size={20} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-text-primary tracking-tight leading-none">APPAREL</h1>
          <span className="text-[10px] text-text-muted font-medium tracking-wide">INTELLIGENCE</span>
        </div>
      </div>

      {/* Center Actions - Search & Tools */}
      <div className="flex-1 flex justify-center items-center gap-4 max-w-2xl">
        {/* Search */}
        <div className="relative w-full max-w-sm hidden md:block group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="
              w-full py-2 pl-10 pr-4 rounded-full
              bg-surface/50 border border-glass-border
              text-sm text-text-primary
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface
              transition-all placeholder:text-text-muted/70
            "
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-glass text-text-muted border border-glass-border">⌘K</kbd>
          </div>
        </div>


      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Notifications */}
        <button
          className="p-2.5 rounded-full text-text-secondary hover:bg-surface hover:text-primary transition-all relative group"
          title="Notifications"
        >
          <Bell size={20} className="group-hover:animate-swing" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-accent rounded-full border border-surface shadow-glow-accent"></span>
        </button>

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
          className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full hover:bg-surface/50 border border-transparent hover:border-glass-border transition-all group"
          title="Profile"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform ring-2 ring-surface">
            <span className="font-semibold text-sm">JD</span>
          </div>
          <div className="hidden xl:flex flex-col items-start">
            <span className="text-sm font-medium text-text-primary leading-none">John Doe</span>
            <span className="text-[10px] text-text-muted mt-0.5">Consultant</span>
          </div>
        </button>
      </div>
    </header>
  );
}
