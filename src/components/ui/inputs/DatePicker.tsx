import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      minDate,
      maxDate,
      placeholder = 'Select date',
      disabled = false,
      error,
      size = 'md',
      className = '',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

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

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
      return new Date(year, month, 1).getDay();
    };

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const isSameDay = (date1: Date, date2: Date) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    const isToday = (date: Date) => isSameDay(date, new Date());

    const handlePrevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
      const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      if (!isDateDisabled(selectedDate)) {
        onChange?.(selectedDate);
        setIsOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    };

    const renderCalendar = () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);
      const days: (number | null)[] = [];

      // Empty cells for days before the first day
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      return days;
    };

    return (
      <div ref={ref} className={`relative ${className}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {label}
          </label>
        )}

        {/* Date Input */}
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
              ${
                error
                  ? 'border-[var(--color-error)]'
                  : isOpen
                    ? 'border-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]'
                    : 'border-[var(--color-glass-border)] hover:border-[var(--color-text-muted)]'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span
              className={
                value ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
              }
            >
              {value ? formatDate(value) : placeholder}
            </span>

            <div className="flex items-center gap-1">
              {value && !disabled && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="p-1 rounded-full hover:bg-[var(--color-glass)] text-[var(--color-text-muted)]"
                >
                  <X size={14} />
                </motion.button>
              )}
              <Calendar size={18} className="text-[var(--color-text-muted)]" />
            </div>
          </button>

          {/* Calendar Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute z-[var(--z-dropdown)] mt-2 p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-glass-border)] shadow-[var(--shadow-xl)]"
              >
                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                    className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]"
                  >
                    <ChevronLeft size={18} />
                  </motion.button>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextMonth}
                    className="p-2 rounded-[var(--radius-lg)] hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]"
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(day => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-[var(--color-text-muted)] py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar().map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="w-9 h-9" />;
                    }

                    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                    const isSelected = value && isSameDay(date, value);
                    const isDisabled = isDateDisabled(date);
                    const isTodayDate = isToday(date);

                    return (
                      <motion.button
                        key={day}
                        type="button"
                        whileHover={{ scale: isDisabled ? 1 : 1.1 }}
                        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                        onClick={() => handleSelectDate(day)}
                        disabled={isDisabled}
                        className={`
                          w-9 h-9 rounded-[var(--radius-lg)] text-sm font-medium
                          transition-colors duration-100
                          ${
                            isSelected
                              ? 'bg-[var(--color-primary)] text-white'
                              : isTodayDate
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'hover:bg-[var(--color-glass)] text-[var(--color-text-primary)]'
                          }
                          ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {day}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Today Button */}
                <div className="mt-3 pt-3 border-t border-[var(--color-glass-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      onChange?.(today);
                      setViewDate(today);
                      setIsOpen(false);
                    }}
                    className="w-full py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-glass)] rounded-[var(--radius-lg)] transition-colors"
                  >
                    Today
                  </button>
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

DatePicker.displayName = 'DatePicker';
