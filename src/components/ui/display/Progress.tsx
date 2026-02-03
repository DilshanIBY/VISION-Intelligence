import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface ProgressProps {
    value: number;
    max?: number;
    variant?: 'bar' | 'circular' | 'stepped';
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    showValue?: boolean;
    label?: string;
    steps?: number;
    className?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
    (
        {
            value,
            max = 100,
            variant = 'bar',
            size = 'md',
            color = 'primary',
            showValue = false,
            label,
            steps = 5,
            className = '',
        },
        ref
    ) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));

        const colors = {
            primary: 'var(--color-primary)',
            secondary: 'var(--color-secondary)',
            success: 'var(--color-success)',
            warning: 'var(--color-warning)',
            error: 'var(--color-error)',
        };

        const barSizes = {
            sm: 'h-1.5',
            md: 'h-2.5',
            lg: 'h-4',
        };

        const circularSizes = {
            sm: { size: 48, strokeWidth: 4 },
            md: { size: 64, strokeWidth: 6 },
            lg: { size: 96, strokeWidth: 8 },
        };

        // Bar Progress
        if (variant === 'bar') {
            return (
                <div ref={ref} className={className}>
                    {(label || showValue) && (
                        <div className="flex items-center justify-between mb-1.5">
                            {label && <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>}
                            {showValue && (
                                <span className="text-sm font-semibold text-[var(--color-text-primary)]">{Math.round(percentage)}%</span>
                            )}
                        </div>
                    )}
                    <div className={`relative w-full rounded-full bg-[var(--color-glass)] ${barSizes[size]}`}>
                        <motion.div
                            className={`absolute left-0 top-0 h-full rounded-full`}
                            style={{ backgroundColor: colors[color] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            );
        }

        // Circular Progress
        if (variant === 'circular') {
            const { size: circleSize, strokeWidth } = circularSizes[size];
            const radius = (circleSize - strokeWidth) / 2;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;

            return (
                <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`}>
                    <svg width={circleSize} height={circleSize} className="-rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            fill="none"
                            stroke="var(--color-glass)"
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx={circleSize / 2}
                            cy={circleSize / 2}
                            r={radius}
                            fill="none"
                            stroke={colors[color]}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </svg>
                    {showValue && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`font-bold text-[var(--color-text-primary)] ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
                                {Math.round(percentage)}%
                            </span>
                        </div>
                    )}
                </div>
            );
        }

        // Stepped Progress
        if (variant === 'stepped') {
            const currentStep = Math.ceil((percentage / 100) * steps);

            return (
                <div ref={ref} className={className}>
                    {label && <span className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">{label}</span>}
                    <div className="flex gap-1.5">
                        {Array.from({ length: steps }).map((_, index) => {
                            const isCompleted = index < currentStep;
                            return (
                                <motion.div
                                    key={index}
                                    className={`flex-1 rounded-full ${barSizes[size]}`}
                                    initial={{ backgroundColor: 'var(--color-glass)' }}
                                    animate={{
                                        backgroundColor: isCompleted ? colors[color] : 'var(--color-glass)',
                                    }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                />
                            );
                        })}
                    </div>
                    {showValue && (
                        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                            Step {currentStep} of {steps}
                        </p>
                    )}
                </div>
            );
        }

        return null;
    }
);

Progress.displayName = 'Progress';
