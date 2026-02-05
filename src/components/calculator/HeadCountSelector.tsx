/**
 * HeadCountSelector - Visual grid selector for embroidery head count
 * @requirement P3-PG-CALC-009
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface HeadCountSelectorProps {
    value: number;
    onChange: (count: number) => void;
    min?: number;
    max?: number;
    label?: string;
    className?: string;
}

export const HeadCountSelector = forwardRef<HTMLDivElement, HeadCountSelectorProps>(
    ({ value, onChange, min = 1, max = 21, label = 'Head Count', className = '' }, ref) => {
        // Create array of available head counts
        const headCounts = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        // Common head counts to highlight
        const commonCounts = [6, 9, 12, 15, 18, 21];

        return (
            <div ref={ref} className={`space-y-3 ${className}`}>
                {/* Label */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                        {label}
                    </label>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {value} heads
                    </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                    {headCounts.map((count) => {
                        const isSelected = count === value;
                        const isCommon = commonCounts.includes(count);

                        return (
                            <motion.button
                                key={count}
                                onClick={() => onChange(count)}
                                className={`
                  relative h-9 rounded-[var(--radius-md)] font-medium text-sm
                  transition-colors duration-150
                  ${isSelected
                                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                                        : isCommon
                                            ? 'bg-[var(--color-glass)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]'
                                            : 'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]'
                                    }
                  border ${isSelected ? 'border-[var(--color-primary)]' : 'border-transparent'}
                `}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {count}
                                {isCommon && !isSelected && (
                                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Legend */}
                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full inline-block" />
                    Common configurations
                </p>
            </div>
        );
    }
);

HeadCountSelector.displayName = 'HeadCountSelector';
