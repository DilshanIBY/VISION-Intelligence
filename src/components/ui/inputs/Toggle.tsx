import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, description, size = 'md', checked = false, onCheckedChange, disabled, className = '', ...props }, ref) => {
        const sizes = {
            sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 16 },
            md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 20 },
            lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 26 },
        };

        const currentSize = sizes[size];

        const handleChange = () => {
            if (!disabled) {
                onCheckedChange?.(!checked);
            }
        };

        return (
            <label
                className={`
          inline-flex items-start gap-3 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
            >
                {/* Hidden input for form compatibility */}
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only"
                    {...props}
                />

                {/* Toggle Track */}
                <motion.div
                    className={`
            relative flex-shrink-0 rounded-full
            transition-colors duration-200
            ${currentSize.track}
          `}
                    animate={{
                        backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-glass)',
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={handleChange}
                >
                    {/* Toggle Thumb */}
                    <motion.div
                        className={`
              absolute top-0.5 left-0.5 rounded-full
              bg-white shadow-md
              ${currentSize.thumb}
            `}
                        initial={false}
                        animate={{
                            x: checked ? currentSize.translate : 0,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                        }}
                    />

                    {/* Glow effect when checked */}
                    {checked && (
                        <motion.div
                            className={`
                absolute inset-0 rounded-full
                bg-[var(--color-primary)]
              `}
                            initial={{ opacity: 0, scale: 1.5 }}
                            animate={{ opacity: 0, scale: 1.5 }}
                            style={{ filter: 'blur(8px)' }}
                        />
                    )}
                </motion.div>

                {/* Label & Description */}
                {(label || description) && (
                    <div className="flex flex-col">
                        {label && (
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
                        )}
                        {description && (
                            <span className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</span>
                        )}
                    </div>
                )}
            </label>
        );
    }
);

Toggle.displayName = 'Toggle';
