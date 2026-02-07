import { useState, useCallback, forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange'
> {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
  showTooltip?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  size?: 'sm' | 'md' | 'lg';
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      value = 0,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      marks,
      showTooltip = true,
      showValue = true,
      formatValue = v => String(v),
      size = 'md',
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const percentage = ((value - min) / (max - min)) * 100;

    const sizes = {
      sm: { track: 'h-1', thumb: 'w-3 h-3' },
      md: { track: 'h-2', thumb: 'w-4 h-4' },
      lg: { track: 'h-3', thumb: 'w-5 h-5' },
    };

    const currentSize = sizes[size];

    const handleChange = useCallback(
      (newValue: number) => {
        const clampedValue = Math.min(max, Math.max(min, newValue));
        onChange?.(clampedValue);
      },
      [min, max, onChange]
    );

    return (
      <div className={`space-y-2 ${className}`}>
        {/* Label Row */}
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {formatValue(value)}
              </span>
            )}
          </div>
        )}

        {/* Slider Container */}
        <div
          className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Track Background */}
          <div className={`relative rounded-full bg-[var(--color-glass)] ${currentSize.track}`}>
            {/* Filled Track */}
            <motion.div
              className={`absolute left-0 top-0 h-full rounded-full bg-[var(--color-primary)]`}
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.1 }}
            />

            {/* Marks */}
            {marks?.map(mark => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${markPercentage}%` }}
                >
                  <div
                    className={`
                      w-2 h-2 rounded-full
                      ${value >= mark.value ? 'bg-white' : 'bg-[var(--color-text-muted)]'}
                    `}
                  />
                </div>
              );
            })}
          </div>

          {/* Thumb */}
          <motion.div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full
              bg-white shadow-lg border-2 border-[var(--color-primary)]
              ${currentSize.thumb}
            `}
            style={{ left: `${percentage}%` }}
            initial={false}
            animate={{
              scale: isDragging || isHovering ? 1.2 : 1,
              boxShadow:
                isDragging || isHovering
                  ? '0 0 0 4px rgba(30, 64, 175, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            transition={{ duration: 0.15 }}
          />

          {/* Tooltip */}
          {showTooltip && (isDragging || isHovering) && (
            <motion.div
              className="absolute -translate-x-1/2 px-2 py-1 rounded-[var(--radius-md)] bg-[var(--color-surface)] shadow-lg border border-[var(--color-glass-border)] text-xs font-medium text-[var(--color-text-primary)]"
              style={{ left: `${percentage}%`, bottom: '100%', marginBottom: '8px' }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
            >
              {formatValue(value)}
              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[var(--color-surface)] border-r border-b border-[var(--color-glass-border)] transform rotate-45 -mt-1" />
            </motion.div>
          )}

          {/* Hidden Range Input */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => handleChange(Number(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ top: '-4px', height: 'calc(100% + 8px)' }}
            {...props}
          />
        </div>

        {/* Mark Labels */}
        {marks && (
          <div className="relative h-4">
            {marks.map(mark => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                mark.label && (
                  <span
                    key={mark.value}
                    className="absolute text-xs text-[var(--color-text-muted)] -translate-x-1/2"
                    style={{ left: `${markPercentage}%` }}
                  >
                    {mark.label}
                  </span>
                )
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
