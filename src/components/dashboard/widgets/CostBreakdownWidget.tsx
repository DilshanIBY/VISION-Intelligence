/**
 * Cost Breakdown Widget Component
 * Displays cost categories with percentages
 */

import { motion } from 'framer-motion';
import { CostBreakdown } from '../../../types/dashboard';

interface CostBreakdownWidgetProps {
    data: CostBreakdown;
}

const colorMap: Record<string, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
};

export function CostBreakdownWidget({ data }: CostBreakdownWidgetProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: data.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Total cost header */}
            <div className="text-center mb-4">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">Total Cost</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(data.totalCost)}
                </p>
            </div>

            {/* Stacked progress bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-[var(--color-glass)]">
                {data.categories.map((category, index) => (
                    <motion.div
                        key={category.name}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                            backgroundColor: colorMap[category.color] || colorMap.primary,
                            width: `${category.percentage}%`,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                ))}
            </div>

            {/* Category list */}
            <div className="flex-1 mt-4 space-y-2 overflow-y-auto">
                {data.categories.map((category, index) => (
                    <motion.div
                        key={category.name}
                        className="flex items-center justify-between py-2 border-b border-[var(--color-glass-border)] last:border-0"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colorMap[category.color] || colorMap.primary }}
                            />
                            <span className="text-sm text-[var(--color-text-primary)]">{category.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                {formatCurrency(category.amount)}
                            </span>
                            <span className="text-xs text-[var(--color-text-muted)] w-12 text-right">
                                {category.percentage.toFixed(1)}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
