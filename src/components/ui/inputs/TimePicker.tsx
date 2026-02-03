import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

export interface TimePickerProps {
    label?: string;
    value?: string; // Format: "HH:MM" (24h) or "HH:MM AM/PM" (12h)
    onChange?: (time: string) => void;
    use24Hour?: boolean;
    minuteStep?: number;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
    (
        {
            label,
            value,
            onChange,
            use24Hour = false,
            minuteStep = 5,
            placeholder = 'Select time',
            disabled = false,
            error,
            size = 'md',
            className = '',
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        // Parse value into hours, minutes, and period
        const parseTime = (timeStr?: string) => {
            if (!timeStr) return { hours: 12, minutes: 0, period: 'AM' };

            if (use24Hour) {
                const [h, m] = timeStr.split(':').map(Number);
                return { hours: h || 0, minutes: m || 0, period: 'AM' };
            } else {
                const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
                if (match) {
                    return { hours: parseInt(match[1]), minutes: parseInt(match[2]), period: match[3].toUpperCase() };
                }
                return { hours: 12, minutes: 0, period: 'AM' };
            }
        };

        const [time, setTime] = useState(parseTime(value));

        useEffect(() => {
            setTime(parseTime(value));
        }, [value, use24Hour]);

        const sizeStyles = {
            sm: 'h-10 text-sm',
            md: 'h-12 text-base',
            lg: 'h-14 text-lg',
        };

        // Close on click outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const formatDisplay = () => {
            if (!value) return placeholder;

            const h = String(time.hours).padStart(2, '0');
            const m = String(time.minutes).padStart(2, '0');

            return use24Hour ? `${h}:${m}` : `${h}:${m} ${time.period}`;
        };

        const updateTime = (newTime: typeof time) => {
            setTime(newTime);
            const h = String(newTime.hours).padStart(2, '0');
            const m = String(newTime.minutes).padStart(2, '0');
            const formatted = use24Hour ? `${h}:${m}` : `${h}:${m} ${newTime.period}`;
            onChange?.(formatted);
        };

        const incrementHours = () => {
            const maxHours = use24Hour ? 23 : 12;
            const minHours = use24Hour ? 0 : 1;
            const newHours = time.hours >= maxHours ? minHours : time.hours + 1;
            updateTime({ ...time, hours: newHours });
        };

        const decrementHours = () => {
            const maxHours = use24Hour ? 23 : 12;
            const minHours = use24Hour ? 0 : 1;
            const newHours = time.hours <= minHours ? maxHours : time.hours - 1;
            updateTime({ ...time, hours: newHours });
        };

        const incrementMinutes = () => {
            const newMinutes = (time.minutes + minuteStep) % 60;
            updateTime({ ...time, minutes: newMinutes });
        };

        const decrementMinutes = () => {
            const newMinutes = time.minutes - minuteStep < 0 ? 60 - minuteStep : time.minutes - minuteStep;
            updateTime({ ...time, minutes: newMinutes });
        };

        const togglePeriod = () => {
            updateTime({ ...time, period: time.period === 'AM' ? 'PM' : 'AM' });
        };

        return (
            <div ref={ref} className={`relative ${className}`}>
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
                )}

                {/* Time Input */}
                <div ref={containerRef}>
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={`
              w-full flex items-center justify-between gap-2 px-4 rounded-[var(--radius-xl)]
              bg-[var(--color-surface)] border-2
              transition-all duration-200
              ${sizeStyles[size]}
              ${error
                                ? 'border-[var(--color-error)]'
                                : isOpen
                                    ? 'border-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]'
                                    : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        <span className={value ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
                            {formatDisplay()}
                        </span>
                        <Clock size={18} className="text-[var(--color-text-muted)]" />
                    </button>

                    {/* Time Picker Dropdown */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-[var(--z-dropdown)] mt-2 p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-glass-border)] shadow-[var(--shadow-xl)]"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Hours */}
                                    <div className="flex flex-col items-center">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={incrementHours}
                                            className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]"
                                        >
                                            <ChevronUp size={18} />
                                        </motion.button>
                                        <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[var(--color-text-primary)]">
                                            {String(time.hours).padStart(2, '0')}
                                        </div>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={decrementHours}
                                            className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]"
                                        >
                                            <ChevronDown size={18} />
                                        </motion.button>
                                    </div>

                                    {/* Separator */}
                                    <span className="text-2xl font-bold text-[var(--color-text-muted)]">:</span>

                                    {/* Minutes */}
                                    <div className="flex flex-col items-center">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={incrementMinutes}
                                            className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]"
                                        >
                                            <ChevronUp size={18} />
                                        </motion.button>
                                        <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[var(--color-text-primary)]">
                                            {String(time.minutes).padStart(2, '0')}
                                        </div>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={decrementMinutes}
                                            className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]"
                                        >
                                            <ChevronDown size={18} />
                                        </motion.button>
                                    </div>

                                    {/* AM/PM (12-hour only) */}
                                    {!use24Hour && (
                                        <div className="flex flex-col items-center ml-2">
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={togglePeriod}
                                                className={`
                          px-3 py-2 rounded-[var(--radius-lg)] text-sm font-semibold
                          transition-colors duration-200
                          ${time.period === 'AM' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-glass)] text-[var(--color-text-secondary)]'}
                        `}
                                            >
                                                AM
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={togglePeriod}
                                                className={`
                          px-3 py-2 mt-1 rounded-[var(--radius-lg)] text-sm font-semibold
                          transition-colors duration-200
                          ${time.period === 'PM' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-glass)] text-[var(--color-text-secondary)]'}
                        `}
                                            >
                                                PM
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Error Message */}
                {error && <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>}
            </div>
        );
    }
);

TimePicker.displayName = 'TimePicker';
