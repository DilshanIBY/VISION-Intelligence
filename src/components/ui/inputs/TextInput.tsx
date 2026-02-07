import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, success, helperText, size = 'md', className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const sizeStyles = {
      sm: 'h-10 text-sm',
      md: 'h-12 text-base',
      lg: 'h-14 text-lg',
    };

    const labelSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className={`relative ${className}`}>
        {/* Input Container */}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={`
              w-full px-4 pt-5 pb-2 rounded-[var(--radius-xl)]
              bg-[var(--color-surface)] border-2
              text-[var(--color-text-primary)]
              transition-all duration-200 ease-out
              focus:outline-none
              ${sizeStyles[size]}
              ${
                error
                  ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                  : success
                    ? 'border-[var(--color-success)] focus:border-[var(--color-success)] focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]'
                    : 'border-[var(--color-glass-border)] focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-glow-primary)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={e => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
          />

          {/* Floating Label */}
          <motion.label
            className={`
              absolute left-4 pointer-events-none
              text-[var(--color-text-secondary)]
              transition-colors duration-200
              ${labelSizes[size]}
              ${isFocused ? 'text-[var(--color-primary)]' : ''}
              ${error ? 'text-[var(--color-error)]' : ''}
              ${success ? 'text-[var(--color-success)]' : ''}
            `}
            initial={false}
            animate={{
              y: isFloating ? -8 : 0,
              scale: isFloating ? 0.85 : 1,
              originX: 0,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ top: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '14px' }}
          >
            {label}
          </motion.label>

          {/* Status Icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-[var(--color-error)]"
                >
                  <AlertCircle size={18} />
                </motion.div>
              )}
              {success && !error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-[var(--color-success)]"
                >
                  <Check size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`
                mt-1.5 text-xs px-1
                ${error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}
              `}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
