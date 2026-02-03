import { useState, useRef, useEffect, ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface PopoverProps {
    trigger: ReactNode;
    content: ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    offset?: number;
    className?: string;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    ({ trigger, content, side = 'bottom', align = 'start', offset = 8, className = '' }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [position, setPosition] = useState({ top: 0, left: 0 });
        const triggerRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        // Calculate position
        useEffect(() => {
            if (isOpen && triggerRef.current && contentRef.current) {
                const triggerRect = triggerRef.current.getBoundingClientRect();
                const contentRect = contentRef.current.getBoundingClientRect();

                let top = 0;
                let left = 0;

                // Calculate vertical position
                switch (side) {
                    case 'top':
                        top = triggerRect.top - contentRect.height - offset;
                        break;
                    case 'bottom':
                        top = triggerRect.bottom + offset;
                        break;
                    case 'left':
                        left = triggerRect.left - contentRect.width - offset;
                        top = triggerRect.top;
                        break;
                    case 'right':
                        left = triggerRect.right + offset;
                        top = triggerRect.top;
                        break;
                }

                // Calculate horizontal alignment for top/bottom
                if (side === 'top' || side === 'bottom') {
                    switch (align) {
                        case 'start':
                            left = triggerRect.left;
                            break;
                        case 'center':
                            left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
                            break;
                        case 'end':
                            left = triggerRect.right - contentRect.width;
                            break;
                    }
                }

                // Calculate vertical alignment for left/right
                if (side === 'left' || side === 'right') {
                    switch (align) {
                        case 'start':
                            break;
                        case 'center':
                            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
                            break;
                        case 'end':
                            top = triggerRect.bottom - contentRect.height;
                            break;
                    }
                }

                // Keep within viewport
                left = Math.max(8, Math.min(left, window.innerWidth - contentRect.width - 8));
                top = Math.max(8, Math.min(top, window.innerHeight - contentRect.height - 8));

                setPosition({ top, left });
            }
        }, [isOpen, side, align, offset]);

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

        const translateAnimation = {
            top: { initial: { y: 4 }, animate: { y: 0 }, exit: { y: 4 } },
            bottom: { initial: { y: -4 }, animate: { y: 0 }, exit: { y: -4 } },
            left: { initial: { x: 4 }, animate: { x: 0 }, exit: { x: 4 } },
            right: { initial: { x: -4 }, animate: { x: 0 }, exit: { x: -4 } },
        };

        return (
            <>
                {/* Trigger */}
                <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className="inline-block">
                    {trigger}
                </div>

                {/* Popover (Portal) */}
                {createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                ref={(node) => {
                                    contentRef.current = node;
                                    if (typeof ref === 'function') ref(node);
                                    else if (ref) ref.current = node;
                                }}
                                initial={{ opacity: 0, scale: 0.96, ...translateAnimation[side].initial }}
                                animate={{ opacity: 1, scale: 1, ...translateAnimation[side].animate }}
                                exit={{ opacity: 0, scale: 0.96, ...translateAnimation[side].exit }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: 'fixed',
                                    top: position.top,
                                    left: position.left,
                                }}
                                className={`
                  z-[var(--z-popover)] p-4
                  rounded-[var(--radius-xl)]
                  bg-[var(--color-surface)] border border-[var(--color-glass-border)]
                  shadow-[var(--shadow-xl)]
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

Popover.displayName = 'Popover';
