import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    headerActions?: ReactNode;
    footer?: ReactNode;
    variant?: 'default' | 'glass' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            title,
            subtitle,
            headerActions,
            footer,
            variant = 'default',
            padding = 'md',
            hoverable = false,
            className = '',
            onClick,
        },
        ref
    ) => {
        const variantStyles = {
            default: 'bg-[var(--color-surface)] border border-[var(--color-glass-border)]',
            glass: 'glass',
            elevated: 'bg-[var(--color-surface)] shadow-[var(--shadow-float)]',
        };

        const paddingStyles = {
            none: '',
            sm: 'p-3',
            md: 'p-5',
            lg: 'p-7',
        };

        const containerClass = `
      rounded-[var(--radius-xl)] overflow-hidden
      ${variantStyles[variant]}
      ${hoverable ? 'cursor-pointer' : ''}
      ${className}
    `;

        const content = (
            <>
                {/* Header */}
                {(title || headerActions) && (
                    <div
                        className={`
              flex items-center justify-between gap-4
              ${padding !== 'none' ? `px-5 py-4 border-b border-[var(--color-glass-border)]` : ''}
            `}
                    >
                        <div>
                            {title && <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>}
                            {subtitle && <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
                        </div>
                        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
                    </div>
                )}

                {/* Content */}
                <div className={paddingStyles[padding]}>{children}</div>

                {/* Footer */}
                {footer && (
                    <div
                        className={`
              border-t border-[var(--color-glass-border)]
              ${padding !== 'none' ? 'px-5 py-3' : ''}
            `}
                    >
                        {footer}
                    </div>
                )}
            </>
        );

        if (hoverable) {
            return (
                <motion.div
                    ref={ref}
                    className={containerClass}
                    whileHover={{ y: -4, boxShadow: 'var(--shadow-float-hover)' }}
                    transition={{ duration: 0.2 }}
                    onClick={onClick}
                >
                    {content}
                </motion.div>
            );
        }

        return (
            <div ref={ref} className={containerClass} onClick={onClick}>
                {content}
            </div>
        );
    }
);

Card.displayName = 'Card';

