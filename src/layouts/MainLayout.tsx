import { Outlet } from 'react-router-dom';
import { Sidebar } from '@components/ui/Sidebar';
import { TopBar } from '@components/ui/TopBar';
import { useUI } from '../contexts/UIContext';
import { motion } from 'framer-motion';

export function MainLayout() {
  const { isPresentationMode } = useUI();

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-bg text-text-primary transition-colors duration-300">
      {/* Ambient Background Gradient (Vision Pro Style) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,var(--color-primary-light),transparent_70%)] blur-3xl" />

      {/* Floating Elements Shell */}
      <div className={`relative z-10 flex h-full w-full flex-col ${isPresentationMode ? 'p-0' : 'p-4 md:p-6 gap-4 md:gap-6'}`}>

        {/* Top Bar - Floating Capsule (Hidden in Presentation Mode) */}
        {!isPresentationMode && (
          <div className="flex-none z-50 flex justify-center w-full">
            <TopBar />
          </div>
        )}

        {/* Main Stage */}
        <div className="flex-1 flex gap-4 md:gap-6 min-h-0 overflow-hidden relative">
          {/* Sidebar - Floating Dock (Left) (Hidden in Presentation Mode) */}
          {!isPresentationMode && (
            <div className="flex-none z-40 hidden md:flex flex-col justify-center">
              <Sidebar />
            </div>
          )}

          {/* Content Area - Glass Stage */}
          <motion.main
            layout
            className={`
              flex-1 relative overflow-hidden glass shadow-2xl animate-in fade-in zoom-in-95 duration-500
              ${isPresentationMode ? 'rounded-none border-0' : 'rounded-3xl'}
            `}
            style={{
              willChange: 'width, transform',
              transform: 'translateZ(0)' // Force hardware acceleration
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }}
          >
            {/* Content Scroll Area */}
            <div className={`absolute inset-0 overflow-auto scroll-smooth custom-scrollbar ${isPresentationMode ? 'p-0' : 'p-6 md:p-8'}`}>
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
