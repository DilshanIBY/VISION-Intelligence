/**
 * Timeline Widget Component
 * Displays production schedule as horizontal bars
 */

import { motion } from 'framer-motion';
import { TimelineItem } from '../../../types/dashboard';

interface TimelineWidgetProps {
    data: TimelineItem[];
}

const statusColors: Record<string, string> = {
    pending: 'var(--color-text-muted)',
    'in-progress': 'var(--color-primary)',
    completed: 'var(--color-success)',
    delayed: 'var(--color-error)',
};

const colorVariants: Record<string, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
};

export function TimelineWidget({ data }: TimelineWidgetProps) {
    // Calculate date range for scaling
    const allDates = data.flatMap((item) => [new Date(item.startDate), new Date(item.endDate)]);
    const minDate = Math.min(...allDates.map((d) => d.getTime()));
    const maxDate = Math.max(...allDates.map((d) => d.getTime()));
    const totalDuration = maxDate - minDate;

    const getBarPosition = (startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return {
            left: ((start - minDate) / totalDuration) * 100,
            width: ((end - start) / totalDuration) * 100,
        };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Timeline items */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {data.map((item, index) => {
                    const { left, width } = getBarPosition(item.startDate, item.endDate);

                    return (
                        <div key={item.id} className="group">
                            {/* Title and dates */}
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                                    {item.title}
                                </span>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-6 bg-[var(--color-glass)] rounded-lg overflow-hidden">
                                {/* Background bar (full duration) */}
                                <motion.div
                                    className="absolute h-full opacity-30 rounded-lg"
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        backgroundColor: colorVariants[item.color] || colorVariants.primary,
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                />

                                {/* Progress bar */}
                                <motion.div
                                    className="absolute h-full rounded-lg"
                                    style={{
                                        left: `${left}%`,
                                        width: `${(width * item.progress) / 100}%`,
                                        backgroundColor: colorVariants[item.color] || colorVariants.primary,
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.7, delay: index * 0.1 + 0.2 }}
                                />

                                {/* Progress text */}
                                <div
                                    className="absolute inset-0 flex items-center px-2"
                                    style={{ left: `${left}%` }}
                                >
                                    <span className="text-xs font-medium text-white drop-shadow-sm">
                                        {item.progress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Status legend */}
            <div className="mt-3 pt-3 border-t border-[var(--color-glass-border)] flex flex-wrap gap-3">
                {['pending', 'in-progress', 'completed', 'delayed'].map((status) => (
                    <div key={status} className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: statusColors[status] }}
                        />
                        <span className="text-xs text-[var(--color-text-muted)] capitalize">
                            {status.replace('-', ' ')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
