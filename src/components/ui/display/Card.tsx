import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outline';
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
      default: 'bg-surface/80 border border-glass-border shadow-sm backdrop-blur-md',
      glass: 'glass',
      elevated: 'card-float',
      outline: 'border border-glass-border bg-transparent',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
    };

    const containerClass = `
      rounded-[var(--radius-xl)] overflow-hidden
      transition-all duration-300
      ${variantStyles[variant]}
      ${hoverable ? 'cursor-pointer hover:shadow-float-hover hover:-translate-y-1' : ''}
      ${className}
    `;

    const content = (
      <>
        {/* Header */}
        {(title || headerActions) && (
          <div
            className={`
              flex items-center justify-between gap-4
              ${padding !== 'none' ? `px-5 py-4 border-b border-glass-border` : ''}
            `}
          >
            <div>
              {title && <h3 className="font-semibold text-text-primary text-lg">{title}</h3>}
              {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
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
              border-t border-glass-border
              ${padding !== 'none' ? 'px-5 py-3 bg-surface/30' : ''}
            `}
          >
            {footer}
          </div>
        )}
      </>
    );

    if (hoverable) {
      return (
        <motion.div ref={ref} className={containerClass} onClick={onClick} whileHover={{ y: -4 }}>
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
