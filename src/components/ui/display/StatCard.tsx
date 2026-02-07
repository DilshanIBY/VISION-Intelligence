import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    { title, value, subtitle, icon, trend, variant = 'default', size = 'md', className = '' },
    ref
  ) => {
    const variantStyles = {
      default: {
        bg: 'bg-[var(--color-surface)]',
        accent: 'bg-[var(--color-glass)]',
        iconColor: 'text-[var(--color-primary)]',
      },
      primary: {
        bg: 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)]',
        accent: 'bg-white/20',
        iconColor: 'text-white',
      },
      success: {
        bg: 'bg-gradient-to-br from-[var(--color-success)] to-emerald-600',
        accent: 'bg-white/20',
        iconColor: 'text-white',
      },
      warning: {
        bg: 'bg-gradient-to-br from-[var(--color-warning)] to-orange-600',
        accent: 'bg-white/20',
        iconColor: 'text-white',
      },
      error: {
        bg: 'bg-gradient-to-br from-[var(--color-error)] to-red-600',
        accent: 'bg-white/20',
        iconColor: 'text-white',
      },
    };

    const sizeStyles = {
      sm: { padding: 'p-4', valueSize: 'text-2xl', titleSize: 'text-xs', iconSize: 'w-8 h-8' },
      md: { padding: 'p-5', valueSize: 'text-3xl', titleSize: 'text-sm', iconSize: 'w-10 h-10' },
      lg: { padding: 'p-6', valueSize: 'text-4xl', titleSize: 'text-base', iconSize: 'w-12 h-12' },
    };

    const trendColors = {
      up: 'text-[var(--color-success)]',
      down: 'text-[var(--color-error)]',
      neutral: 'text-[var(--color-text-muted)]',
    };

    const TrendIcon = {
      up: TrendingUp,
      down: TrendingDown,
      neutral: Minus,
    };

    const isColoredVariant = variant !== 'default';
    const currentStyles = variantStyles[variant];
    const currentSize = sizeStyles[size];

    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`
          rounded-[var(--radius-xl)] shadow-[var(--shadow-float)]
          ${currentStyles.bg}
          ${currentSize.padding}
          ${className}
        `}
      >
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="flex-1">
            <p
              className={`
                font-medium uppercase tracking-wide
                ${currentSize.titleSize}
                ${isColoredVariant ? 'text-white/80' : 'text-[var(--color-text-muted)]'}
              `}
            >
              {title}
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`
                  font-bold tracking-tight
                  ${currentSize.valueSize}
                  ${isColoredVariant ? 'text-white' : 'text-[var(--color-text-primary)]'}
                `}
              >
                {value}
              </span>

              {/* Trend Indicator */}
              {trend && (
                <div
                  className={`
                    flex items-center gap-0.5 text-sm font-medium
                    ${isColoredVariant ? 'text-white/90' : trendColors[trend.direction]}
                  `}
                >
                  {(() => {
                    const Icon = TrendIcon[trend.direction];
                    return <Icon size={14} />;
                  })()}
                  <span>
                    {trend.value > 0 ? '+' : ''}
                    {trend.value}%
                  </span>
                </div>
              )}
            </div>

            {subtitle && (
              <p
                className={`
                  mt-1 text-sm
                  ${isColoredVariant ? 'text-white/70' : 'text-[var(--color-text-muted)]'}
                `}
              >
                {subtitle}
              </p>
            )}

            {trend?.label && (
              <p
                className={`
                  mt-1 text-xs
                  ${isColoredVariant ? 'text-white/60' : 'text-[var(--color-text-muted)]'}
                `}
              >
                {trend.label}
              </p>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div
              className={`
                flex items-center justify-center rounded-[var(--radius-lg)]
                ${currentStyles.accent}
                ${currentStyles.iconColor}
                ${currentSize.iconSize}
              `}
            >
              {icon}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

StatCard.displayName = 'StatCard';
