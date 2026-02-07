import { useState, forwardRef, InputHTMLAttributes, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange'
> {
  label: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  showSlider?: boolean;
  error?: string;
  helperText?: string;
  suffix?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      value = 0,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      size = 'md',
      showSlider = false,
      error,
      helperText,
      className = '',
      disabled,
      suffix,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    const currentValue = value ?? localValue;

    const sizeStyles = {
      sm: 'h-10',
      md: 'h-12',
      lg: 'h-14',
    };

    const buttonSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    const handleChange = useCallback(
      (newValue: number) => {
        const clampedValue = Math.min(max, Math.max(min, newValue));
        setLocalValue(clampedValue);
        onChange?.(clampedValue);
      },
      [min, max, onChange]
    );

    const increment = () => handleChange(currentValue + step);
    const decrement = () => handleChange(currentValue - step);

    const sliderPercentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className={`space-y-2 ${className}`}>
        {/* Label */}
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>

        {/* Input Container */}
        <div
          className={`
            flex items-center gap-2 px-1 rounded-[var(--radius-xl)]
            bg-[var(--color-surface)] border-2
            transition-all duration-200 overflow-visible
            ${sizeStyles[size]}
            ${
              error
                ? 'border-[var(--color-error)]'
                : isFocused
                  ? 'border-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]'
                  : 'border-[var(--color-glass-border)]'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Decrement Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={decrement}
            disabled={disabled || currentValue <= min}
            className={`
              flex items-center justify-center rounded-[var(--radius-lg)]
              bg-[var(--color-glass)] text-[var(--color-text-secondary)]
              hover:bg-[var(--color-primary)] hover:text-white
              transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-glass)]
              disabled:hover:text-[var(--color-text-secondary)]
              ${buttonSizes[size]}
            `}
          >
            <Minus size={16} />
          </motion.button>

          {/* Number Input */}
          <input
            ref={ref}
            type="number"
            value={currentValue}
            onChange={e => handleChange(Number(e.target.value))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={`
              flex-1 text-center font-semibold text-lg
              bg-transparent text-[var(--color-text-primary)]
              focus:outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            `}
            {...props}
          />

          {/* Suffix */}
          {suffix && (
            <span className="text-xs text-[var(--color-text-muted)] mr-1 select-none">
              {suffix}
            </span>
          )}

          {/* Increment Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={increment}
            disabled={disabled || currentValue >= max}
            className={`
              flex items-center justify-center rounded-[var(--radius-lg)]
              bg-[var(--color-glass)] text-[var(--color-text-secondary)]
              hover:bg-[var(--color-primary)] hover:text-white
              transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-glass)]
              disabled:hover:text-[var(--color-text-secondary)]
              ${buttonSizes[size]}
            `}
          >
            <Plus size={16} />
          </motion.button>
        </div>

        {/* Optional Slider */}
        {showSlider && (
          <div className="relative h-2 mt-3">
            <div className="absolute inset-0 rounded-full bg-[var(--color-glass)]" />
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-[var(--color-primary)]"
              initial={false}
              animate={{ width: `${sliderPercentage}%` }}
              transition={{ duration: 0.1 }}
            />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue}
              onChange={e => handleChange(Number(e.target.value))}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            {/* Slider Thumb Indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 border-[var(--color-primary)] pointer-events-none"
              initial={false}
              animate={{ left: `calc(${sliderPercentage}% - 8px)` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        {/* Helper / Error Text */}
        {(error || helperText) && (
          <p
            className={`text-xs ${error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
