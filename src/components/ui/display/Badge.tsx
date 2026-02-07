import { ReactNode, forwardRef, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
  outline?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      dot = false,
      icon,
      outline = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      default: {
        solid: 'bg-[var(--color-glass)] text-[var(--color-text-secondary)]',
        outline: 'border border-[var(--color-glass-border)] text-[var(--color-text-secondary)]',
        dot: 'bg-[var(--color-text-muted)]',
      },
      primary: {
        solid: 'bg-[var(--color-primary)] text-white',
        outline: 'border border-[var(--color-primary)] text-[var(--color-primary)]',
        dot: 'bg-[var(--color-primary)]',
      },
      secondary: {
        solid: 'bg-[var(--color-secondary)] text-white',
        outline: 'border border-[var(--color-secondary)] text-[var(--color-secondary)]',
        dot: 'bg-[var(--color-secondary)]',
      },
      success: {
        solid: 'bg-[var(--color-success)] text-white',
        outline: 'border border-[var(--color-success)] text-[var(--color-success)]',
        dot: 'bg-[var(--color-success)]',
      },
      warning: {
        solid: 'bg-[var(--color-warning)] text-white',
        outline: 'border border-[var(--color-warning)] text-[var(--color-warning)]',
        dot: 'bg-[var(--color-warning)]',
      },
      error: {
        solid: 'bg-[var(--color-error)] text-white',
        outline: 'border border-[var(--color-error)] text-[var(--color-error)]',
        dot: 'bg-[var(--color-error)]',
      },
      info: {
        solid: 'bg-[var(--color-info)] text-white',
        outline: 'border border-[var(--color-info)] text-[var(--color-info)]',
        dot: 'bg-[var(--color-info)]',
      },
    };

    const sizes = {
      sm: 'px-1.5 py-0.5 text-[10px]',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    };

    const dotSizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    };

    const currentVariant = variants[variant];
    const colorStyle = outline ? currentVariant.outline : currentVariant.solid;

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5 font-medium rounded-full
          ${colorStyle}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {dot && <span className={`rounded-full ${currentVariant.dot} ${dotSizes[size]}`} />}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
