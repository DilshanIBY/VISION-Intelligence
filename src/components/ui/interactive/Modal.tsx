import { ReactNode, useEffect, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      footer,
      size = 'md',
      closeOnBackdrop = true,
      closeOnEscape = true,
      showCloseButton = true,
      className = '',
    },
    ref
  ) => {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
      full: 'max-w-[90vw] max-h-[90vh]',
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

    const modalContent = (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`
                relative w-full rounded-[var(--radius-2xl)]
                bg-[var(--color-surface)] shadow-[var(--shadow-2xl)]
                overflow-hidden
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
              <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">{children}</div>

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

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';
