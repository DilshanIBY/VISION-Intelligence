import { useState, useRef, useEffect, ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right' | 'center';
    side?: 'top' | 'bottom';
    offset?: number;
    className?: string;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
    ({ trigger, children, align = 'left', side = 'bottom', offset = 8, className = '' }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [position, setPosition] = useState({ top: 0, left: 0 });
        const triggerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        // Calculate position
        useEffect(() => {
            if (isOpen && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const contentRect = contentRef.current?.getBoundingClientRect();
                const contentWidth = contentRect?.width || 200;

                let left = rect.left;
                if (align === 'right') {
                    left = rect.right - contentWidth;
                } else if (align === 'center') {
                    left = rect.left + rect.width / 2 - contentWidth / 2;
                }

                let top = side === 'bottom' ? rect.bottom + offset : rect.top - (contentRect?.height || 0) - offset;

                // Keep within viewport
                left = Math.max(8, Math.min(left, window.innerWidth - contentWidth - 8));
                top = Math.max(8, top);

                setPosition({ top, left });
            }
        }, [isOpen, align, side, offset]);

        // Close on click outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (
                    triggerRef.current &&
                    !triggerRef.current.contains(e.target as Node) &&
                    contentRef.current &&
                    !contentRef.current.contains(e.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen]);

        // Close on scroll
        useEffect(() => {
            const handleScroll = () => setIsOpen(false);

            if (isOpen) {
                window.addEventListener('scroll', handleScroll, true);
            }

            return () => {
                window.removeEventListener('scroll', handleScroll, true);
            };
        }, [isOpen]);

        return (
            <>
                {/* Trigger */}
                <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className="inline-block">
                    {trigger}
                </div>

                {/* Dropdown Content (Portal) */}
                {createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                ref={(node) => {
                                    contentRef.current = node;
                                    if (typeof ref === 'function') ref(node);
                                    else if (ref) ref.current = node;
                                }}
                                initial={{ opacity: 0, y: side === 'bottom' ? -8 : 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: side === 'bottom' ? -8 : 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                style={{ top: position.top, left: position.left }}
                                className={`
                  fixed z-[var(--z-dropdown)] min-w-[160px]
                  py-2 rounded-[var(--radius-xl)]
                  bg-[var(--color-surface)] border border-[var(--color-glass-border)]
                  shadow-[var(--shadow-xl)]
                  ${className}
                `}
                            >
                                {children}
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </>
        );
    }
);

Dropdown.displayName = 'Dropdown';

// Dropdown Item component for convenience
export interface DropdownItemProps {
    children: ReactNode;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    className?: string;
}

export function DropdownItem({ children, icon, onClick, disabled, danger, className = '' }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-full flex items-center gap-2 px-4 py-2 text-left text-sm
        transition-colors duration-100
        ${danger
                    ? 'text-[var(--color-error)] hover:bg-[var(--color-error)]/10'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-glass)]'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
}

export function DropdownSeparator() {
    return <div className="my-1 border-t border-[var(--color-glass-border)]" />;
}
