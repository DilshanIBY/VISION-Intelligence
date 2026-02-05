/**
 * ValidationWarnings - Display component for calculation warnings/errors
 * @requirement P3-PG-CALC-019
 */

import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ValidationWarning } from '@mocks/calculator';

export interface ValidationWarningsProps {
    warnings: ValidationWarning[];
    onDismiss?: (id: string) => void;
    className?: string;
}

const iconMap = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
};

const colorMap = {
    info: {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-500',
        text: 'text-blue-800 dark:text-blue-200',
    },
    warning: {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'text-amber-500',
        text: 'text-amber-800 dark:text-amber-200',
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-500',
        text: 'text-red-800 dark:text-red-200',
    },
};

export const ValidationWarnings = forwardRef<HTMLDivElement, ValidationWarningsProps>(
    ({ warnings, onDismiss, className = '' }, ref) => {
        if (warnings.length === 0) return null;

        return (
            <div ref={ref} className={`space-y-2 ${className}`}>
                <AnimatePresence mode="popLayout">
                    {warnings.map((warning) => {
                        const Icon = iconMap[warning.severity];
                        const colors = colorMap[warning.severity];

                        return (
                            <motion.div
                                key={warning.id}
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className={`
                  flex items-start gap-3 p-3 rounded-[var(--radius-lg)]
                  border ${colors.bg} ${colors.border}
                `}
                            >
                                <Icon size={18} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${colors.text}`}>
                                        {warning.message}
                                    </p>
                                    {warning.field && (
                                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                            Field: {warning.field}
                                        </p>
                                    )}
                                </div>
                                {onDismiss && (
                                    <button
                                        onClick={() => onDismiss(warning.id)}
                                        className={`flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${colors.text}`}
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        );
    }
);

ValidationWarnings.displayName = 'ValidationWarnings';
