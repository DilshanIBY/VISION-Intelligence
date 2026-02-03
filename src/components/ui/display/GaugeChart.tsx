import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface GaugeChartProps {
    value: number;
    min?: number;
    max?: number;
    label?: string;
    unit?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'auto';
    showValue?: boolean;
    thresholds?: { warning: number; error: number };
    className?: string;
}

export const GaugeChart = forwardRef<HTMLDivElement, GaugeChartProps>(
    (
        {
            value,
            min = 0,
            max = 100,
            label,
            unit = '%',
            size = 'md',
            color = 'auto',
            showValue = true,
            thresholds = { warning: 70, error: 90 },
            className = '',
        },
        ref
    ) => {
        const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

        const sizes = {
            sm: { width: 120, strokeWidth: 10, fontSize: 'text-lg', labelSize: 'text-xs' },
            md: { width: 160, strokeWidth: 14, fontSize: 'text-2xl', labelSize: 'text-sm' },
            lg: { width: 200, strokeWidth: 18, fontSize: 'text-3xl', labelSize: 'text-base' },
        };

        const { width, strokeWidth, fontSize, labelSize } = sizes[size];
        const radius = (width - strokeWidth) / 2;
        const circumference = Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        const getColor = () => {
            if (color !== 'auto') {
                const colors = {
                    primary: 'var(--color-primary)',
                    secondary: 'var(--color-secondary)',
                    success: 'var(--color-success)',
                    warning: 'var(--color-warning)',
                    error: 'var(--color-error)',
                };
                return colors[color];
            }

            // Auto color based on thresholds
            if (percentage >= thresholds.error) return 'var(--color-error)';
            if (percentage >= thresholds.warning) return 'var(--color-warning)';
            return 'var(--color-success)';
        };

        const currentColor = getColor();

        return (
            <div ref={ref} className={`flex flex-col items-center ${className}`}>
                <div className="relative" style={{ width, height: width / 2 + 20 }}>
                    <svg
                        width={width}
                        height={width / 2 + strokeWidth}
                        viewBox={`0 0 ${width} ${width / 2 + strokeWidth}`}
                        className="overflow-visible"
                    >
                        {/* Background Arc */}
                        <path
                            d={`
                M ${strokeWidth / 2} ${width / 2}
                A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2}
              `}
                            fill="none"
                            stroke="var(--color-glass)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />

                        {/* Colored Arc */}
                        <motion.path
                            d={`
                M ${strokeWidth / 2} ${width / 2}
                A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2}
              `}
                            fill="none"
                            stroke={currentColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />

                        {/* Tick Marks */}
                        {[0, 25, 50, 75, 100].map((tick) => {
                            const angle = ((tick / 100) * 180 - 180) * (Math.PI / 180);
                            const x1 = width / 2 + (radius - strokeWidth) * Math.cos(angle);
                            const y1 = width / 2 + (radius - strokeWidth) * Math.sin(angle);
                            const x2 = width / 2 + (radius + 4) * Math.cos(angle);
                            const y2 = width / 2 + (radius + 4) * Math.sin(angle);

                            return (
                                <line
                                    key={tick}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="var(--color-text-muted)"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>

                    {/* Value Display */}
                    {showValue && (
                        <div
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{ bottom: 0 }}
                        >
                            <motion.span
                                className={`font-bold ${fontSize} text-[var(--color-text-primary)]`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {Math.round(value)}
                            </motion.span>
                            <span className="text-[var(--color-text-muted)] text-sm ml-0.5">{unit}</span>
                        </div>
                    )}

                    {/* Needle */}
                    <motion.div
                        className="absolute left-1/2 origin-bottom"
                        style={{
                            bottom: 0,
                            width: 4,
                            height: radius - 10,
                            marginLeft: -2,
                            background: 'var(--color-text-primary)',
                            borderRadius: 2,
                        }}
                        initial={{ rotate: -90 }}
                        animate={{ rotate: (percentage / 100) * 180 - 90 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />

                    {/* Center Dot */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-text-primary)]"
                        style={{ bottom: -6 }}
                    />
                </div>

                {/* Label */}
                {label && (
                    <p className={`mt-3 font-medium text-[var(--color-text-secondary)] ${labelSize}`}>{label}</p>
                )}

                {/* Min/Max Labels */}
                <div className="w-full flex justify-between px-2 mt-1">
                    <span className="text-xs text-[var(--color-text-muted)]">{min}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{max}</span>
                </div>
            </div>
        );
    }
);

GaugeChart.displayName = 'GaugeChart';
