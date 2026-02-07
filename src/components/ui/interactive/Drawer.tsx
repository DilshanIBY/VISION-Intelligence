import { ReactNode, useEffect, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      footer,
      side = 'right',
      size = 'md',
      closeOnBackdrop = true,
      closeOnEscape = true,
      showCloseButton = true,
      className = '',
    },
    ref
  ) => {
    const sizes = {
      sm: 'w-72',
      md: 'w-96',
      lg: 'w-[480px]',
      xl: 'w-[600px]',
    };

    const slideVariants = {
      left: {
        initial: { x: '-100%' },
        animate: { x: 0 },
        exit: { x: '-100%' },
      },
      right: {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
      },
    };

    // Handle escape key
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, handleKeyDown]);

    const drawerContent = (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[var(--z-modal)]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Drawer */}
            <motion.div
              ref={ref}
              variants={slideVariants[side]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`
                absolute top-0 h-full
                bg-[var(--color-surface)] shadow-[var(--shadow-2xl)]
                flex flex-col
                ${side === 'left' ? 'left-0 rounded-r-[var(--radius-2xl)]' : 'right-0 rounded-l-[var(--radius-2xl)]'}
                ${sizes[size]}
                ${className}
              `}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-glass-border)]">
                  {title && (
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 rounded-[var(--radius-lg)] text-[var(--color-text-muted)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 px-6 py-5 overflow-y-auto">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-glass-border)] bg-[var(--color-glass)]">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    return createPortal(drawerContent, document.body);
  }
);

Drawer.displayName = 'Drawer';
