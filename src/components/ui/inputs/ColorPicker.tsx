import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface ColorOption {
    value: string;
    label?: string;
}

export interface ColorPickerProps {
    label?: string;
    colors?: ColorOption[];
    value?: string[];
    onChange?: (colors: string[]) => void;
    maxSelection?: number;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    error?: string;
    className?: string;
}

// Default thread colors for embroidery
const DEFAULT_THREAD_COLORS: ColorOption[] = [
    { value: '#FFFFFF', label: 'White' },
    { value: '#000000', label: 'Black' },
    { value: '#EF4444', label: 'Red' },
    { value: '#F97316', label: 'Orange' },
    { value: '#FBBF24', label: 'Yellow' },
    { value: '#22C55E', label: 'Green' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#6366F1', label: 'Indigo' },
    { value: '#A855F7', label: 'Purple' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#14B8A6', label: 'Teal' },
    { value: '#78716C', label: 'Stone' },
    { value: '#C2410C', label: 'Rust' },
    { value: '#1D4ED8', label: 'Navy' },
    { value: '#B45309', label: 'Amber' },
];

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
    (
        {
            label,
            colors = DEFAULT_THREAD_COLORS,
            value = [],
            onChange,
            maxSelection = 15,
            size = 'md',
            disabled = false,
            error,
            className = '',
        },
        ref
    ) => {
        const sizes = {
            sm: { swatch: 'w-6 h-6', gap: 'gap-1' },
            md: { swatch: 'w-8 h-8', gap: 'gap-2' },
            lg: { swatch: 'w-10 h-10', gap: 'gap-2' },
        };

        const currentSize = sizes[size];

        const isSelected = (color: string) => value.includes(color);

        const handleColorClick = (color: string) => {
            if (disabled) return;

            if (isSelected(color)) {
                // Remove color
                onChange?.(value.filter((c) => c !== color));
            } else if (value.length < maxSelection) {
                // Add color
                onChange?.([...value, color]);
            }
        };

        const getContrastColor = (hex: string) => {
            // Convert hex to RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            // Calculate luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#000000' : '#FFFFFF';
        };

        return (
            <div ref={ref} className={className}>
                {/* Label Row */}
                {label && (
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>
                        <span className="text-xs text-[var(--color-text-muted)]">
                            {value.length}/{maxSelection} selected
                        </span>
                    </div>
                )}

                {/* Color Grid */}
                <div className={`flex flex-wrap ${currentSize.gap}`}>
                    {colors.map((color) => {
                        const selected = isSelected(color.value);
                        const atLimit = value.length >= maxSelection && !selected;

                        return (
                            <motion.button
                                key={color.value}
                                type="button"
                                whileHover={{ scale: disabled || atLimit ? 1 : 1.15 }}
                                whileTap={{ scale: disabled || atLimit ? 1 : 0.95 }}
                                onClick={() => handleColorClick(color.value)}
                                disabled={disabled || atLimit}
                                className={`
                  relative rounded-[var(--radius-lg)] border-2
                  transition-all duration-200
                  ${currentSize.swatch}
                  ${selected ? 'border-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]' : 'border-transparent'}
                  ${disabled || atLimit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
                `}
                                style={{ backgroundColor: color.value }}
                                title={color.label || color.value}
                            >
                                {/* Selection Indicator */}
                                {selected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Check size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} color={getContrastColor(color.value)} strokeWidth={3} />
                                    </motion.div>
                                )}

                                {/* Selection Order Number */}
                                {selected && (
                                    <div
                                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center"
                                    >
                                        {value.indexOf(color.value) + 1}
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>



                {/* Selected Colors Display */}
                {value.length > 0 && (
                    <div className="mt-3 flex items-center gap-1">
                        <span className="text-xs text-[var(--color-text-muted)] mr-2">Selected:</span>
                        {value.map((color, index) => (
                            <div
                                key={color}
                                className="w-4 h-4 rounded-full border border-[var(--color-glass-border)]"
                                style={{ backgroundColor: color }}
                                title={`${index + 1}. ${colors.find((c) => c.value === color)?.label || color}`}
                            />
                        ))}
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>}
            </div>
        );
    }
);

ColorPicker.displayName = 'ColorPicker';
