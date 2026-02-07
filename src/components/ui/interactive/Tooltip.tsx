import { useState, useRef, ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, side = 'top', delay = 400, className = '' }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const calculatePosition = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const offset = 8;

      let top = 0;
      let left = 0;

      switch (side) {
        case 'top':
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - offset;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + offset;
          break;
      }

      setPosition({ top, left });
    };

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        calculatePosition();
        setIsVisible(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    const transformOrigin = {
      top: 'bottom center',
      bottom: 'top center',
      left: 'center right',
      right: 'center left',
    };

    const translateAnimation = {
      top: { initial: { y: 4 }, animate: { y: 0 } },
      bottom: { initial: { y: -4 }, animate: { y: 0 } },
      left: { initial: { x: 4 }, animate: { x: 0 } },
      right: { initial: { x: -4 }, animate: { x: 0 } },
    };

    const positionStyles = {
      top: 'translate(-50%, -100%)',
      bottom: 'translate(-50%, 0)',
      left: 'translate(-100%, -50%)',
      right: 'translate(0, -50%)',
    };

    return (
      <>
        {/* Trigger */}
        <div
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          className="inline-block"
        >
          {children}
        </div>

        {/* Tooltip (Portal) */}
        {createPortal(
          <AnimatePresence>
            {isVisible && (
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.96, ...translateAnimation[side].initial }}
                animate={{ opacity: 1, scale: 1, ...translateAnimation[side].animate }}
                exit={{ opacity: 0, scale: 0.96, ...translateAnimation[side].initial }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'fixed',
                  top: position.top,
                  left: position.left,
                  transform: positionStyles[side],
                  transformOrigin: transformOrigin[side],
                }}
                className={`
                  z-[var(--z-tooltip)] px-3 py-1.5
                  rounded-[var(--radius-lg)]
                  bg-[var(--color-surface)] border border-[var(--color-glass-border)]
                  shadow-[var(--shadow-lg)]
                  text-sm text-[var(--color-text-primary)]
                  pointer-events-none whitespace-nowrap
                  ${className}
                `}
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';
