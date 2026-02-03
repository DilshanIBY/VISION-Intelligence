import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
}

export interface SelectProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    searchable?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            label,
            placeholder = 'Select an option...',
            options,
            value,
            onChange,
            searchable = false,
            clearable = false,
            disabled = false,
            error,
            size = 'md',
            className = '',
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const containerRef = useRef<HTMLDivElement>(null);
        const searchInputRef = useRef<HTMLInputElement>(null);

        const selectedOption = options.find((opt) => opt.value === value);

        const sizeStyles = {
            sm: 'h-10 text-sm',
            md: 'h-12 text-base',
            lg: 'h-14 text-lg',
        };

        // Filter options based on search
        const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Group options if any have groups
        const groupedOptions = filteredOptions.reduce(
            (acc, opt) => {
                const group = opt.group || '';
                if (!acc[group]) acc[group] = [];
                acc[group].push(opt);
                return acc;
            },
            {} as Record<string, SelectOption[]>
        );

        // Close on click outside
        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                    setSearchQuery('');
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        // Focus search input when opening
        useEffect(() => {
            if (isOpen && searchable && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, [isOpen, searchable]);

        const handleSelect = (optionValue: string) => {
            onChange?.(optionValue);
            setIsOpen(false);
            setSearchQuery('');
        };

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange?.('');
        };

        return (
            <div ref={ref} className={`relative ${className}`}>
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
                )}

                {/* Select Trigger */}
                <div ref={containerRef}>
                    <button
                        type="button"
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={`
              w-full flex items-center justify-between gap-2 px-4 rounded-[var(--radius-xl)]
              bg-[var(--color-surface)] border-2
              text-[var(--color-text-primary)]
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
                        <span className={selectedOption ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
                            {selectedOption?.label || placeholder}
                        </span>

                        <div className="flex items-center gap-1">
                            {clearable && value && !disabled && (
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
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown size={18} className="text-[var(--color-text-muted)]" />
                            </motion.div>
                        </div>
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-[var(--z-dropdown)] w-full mt-2 py-2 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-glass-border)] shadow-[var(--shadow-xl)]"
                            >
                                {/* Search Input */}
                                {searchable && (
                                    <div className="px-2 pb-2 border-b border-[var(--color-glass-border)]">
                                        <div className="relative">
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full pl-9 pr-3 py-2 rounded-[var(--radius-lg)] bg-[var(--color-glass)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Options List */}
                                <div className="max-h-60 overflow-auto">
                                    {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                                        <div key={group}>
                                            {group && (
                                                <div className="px-4 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                                    {group}
                                                </div>
                                            )}
                                            {groupOptions.map((option) => (
                                                <motion.button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => !option.disabled && handleSelect(option.value)}
                                                    disabled={option.disabled}
                                                    whileHover={{ backgroundColor: 'var(--color-glass)' }}
                                                    className={`
                            w-full flex items-center justify-between px-4 py-2.5 text-left
                            transition-colors duration-100
                            ${option.value === value ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-primary)]'}
                            ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                                                >
                                                    <span>{option.label}</span>
                                                    {option.value === value && <Check size={16} />}
                                                </motion.button>
                                            ))}
                                        </div>
                                    ))}

                                    {filteredOptions.length === 0 && (
                                        <div className="px-4 py-3 text-center text-sm text-[var(--color-text-muted)]">No options found</div>
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

Select.displayName = 'Select';
