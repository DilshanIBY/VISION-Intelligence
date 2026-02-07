/**
 * OutputCard - Individual output metric card for calculation results
 * @requirement P3-PG-CALC-011 to P3-PG-CALC-015
 */

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface OutputCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OutputCard = forwardRef<HTMLDivElement, OutputCardProps>(
  ({ title, children, icon, size = 'md', className = '' }, ref) => {
    const sizeStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    };

    return (
      <motion.div
        ref={ref}
        className={`
          bg-[var(--color-surface)]
          rounded-[var(--radius-xl)] shadow-[var(--shadow-float)]
          ${sizeStyles[size]}
          ${className}
        `}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-[var(--color-text-muted)]">{icon}</span>}
          <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
            {title}
          </h4>
        </div>

        {/* Content */}
        {children}
      </motion.div>
    );
  }
);

OutputCard.displayName = 'OutputCard';

// =====================================================
// Specialized Output Cards
// =====================================================

/**
 * MachinesRequiredCard - Large number display with machine icon grid
 */
export interface MachinesRequiredCardProps {
  count: number;
  className?: string;
}

export const MachinesRequiredCard = forwardRef<HTMLDivElement, MachinesRequiredCardProps>(
  ({ count, className = '' }, ref) => {
    // Show up to 12 icons, then just show "+N more"
    const maxIcons = 12;
    const showIcons = Math.min(count, maxIcons);
    const remaining = count - maxIcons;

    return (
      <OutputCard ref={ref} title="Machines Required" size="lg" className={className}>
        <div className="flex items-end gap-4">
          {/* Large number */}
          <motion.span
            className="text-5xl font-bold text-[var(--color-primary)]"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {count}
          </motion.span>

          {/* Icon grid */}
          <div className="flex flex-wrap gap-1.5 mb-1">
            {Array.from({ length: showIcons }).map((_, i) => (
              <motion.div
                key={i}
                className="w-5 h-5 rounded bg-[var(--color-primary)] opacity-80"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
            {remaining > 0 && (
              <span className="text-xs text-[var(--color-text-muted)] self-center ml-1">
                +{remaining}
              </span>
            )}
          </div>
        </div>
      </OutputCard>
    );
  }
);

MachinesRequiredCard.displayName = 'MachinesRequiredCard';

/**
 * ProductionTimelineCard - Gantt-style bar showing production timeline
 */
export interface ProductionTimelineCardProps {
  totalDays: number;
  deadline: string;
  startDate?: string;
  className?: string;
}

export const ProductionTimelineCard = forwardRef<HTMLDivElement, ProductionTimelineCardProps>(
  ({ totalDays, deadline, startDate, className = '' }, ref) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(deadline);
    const totalAvailableDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const percentage = Math.min(100, (totalDays / totalAvailableDays) * 100);

    const isOnTime = percentage <= 100;

    return (
      <OutputCard ref={ref} title="Production Timeline" className={className}>
        {/* Date labels */}
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-2">
          <span>{start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span>{end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Timeline bar */}
        <div className="h-8 bg-[var(--color-surface)] rounded-[var(--radius-lg)] overflow-hidden">
          <motion.div
            className={`h-full rounded-[var(--radius-lg)] ${isOnTime ? 'bg-[var(--color-success)]' : 'bg-[var(--color-error)]'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-2">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {totalDays} days required
          </span>
          <span
            className={`text-sm font-medium ${isOnTime ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
          >
            {isOnTime ? '✓ On Time' : '⚠ Deadline Risk'}
          </span>
        </div>
      </OutputCard>
    );
  }
);

ProductionTimelineCard.displayName = 'ProductionTimelineCard';

/**
 * CostBreakdownCard - Currency display with category breakdown
 */
export interface CostCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface CostBreakdownCardProps {
  total: number;
  categories: CostCategory[];
  currency?: string;
  className?: string;
}

export const CostBreakdownCard = forwardRef<HTMLDivElement, CostBreakdownCardProps>(
  ({ total, categories, currency = 'USD', className = '' }, ref) => {
    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);

    return (
      <OutputCard ref={ref} title="Cost Estimate" size="lg" className={className}>
        {/* Total */}
        <motion.p
          className="text-3xl font-bold text-[var(--color-text-primary)] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatCurrency(total)}
        </motion.p>

        {/* Stacked bar */}
        <div className="h-3 flex rounded-full overflow-hidden mb-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="h-full"
              style={{ backgroundColor: cat.color }}
              initial={{ width: 0 }}
              animate={{ width: `${cat.percentage}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <div key={cat.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-[var(--color-text-muted)] truncate">{cat.name}</span>
              <span className="text-xs font-medium text-[var(--color-text-primary)] ml-auto">
                {formatCurrency(cat.amount)}
              </span>
            </div>
          ))}
        </div>
      </OutputCard>
    );
  }
);

CostBreakdownCard.displayName = 'CostBreakdownCard';
