import { ReactNode, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    badge?: string | number;
}

export interface TabBarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
}

export const TabBar = forwardRef<HTMLDivElement, TabBarProps>(
    ({ tabs, activeTab, onTabChange, variant = 'default', size = 'md', fullWidth = false, className = '' }, ref) => {
        const [hoveredTab, setHoveredTab] = useState<string | null>(null);

        const sizes = {
            sm: 'text-sm py-1.5 px-3',
            md: 'text-base py-2 px-4',
            lg: 'text-lg py-2.5 px-5',
        };

        const variantStyles = {
            default: {
                container: 'bg-[var(--color-glass)] p-1 rounded-[var(--radius-xl)]',
                tab: 'rounded-[var(--radius-lg)]',
                active: 'bg-[var(--color-surface)] shadow-[var(--shadow-sm)]',
                inactive: 'hover:bg-[var(--color-glass)]',
            },
            pills: {
                container: 'gap-2',
                tab: 'rounded-full',
                active: 'bg-[var(--color-primary)] text-white',
                inactive: 'hover:bg-[var(--color-glass)]',
            },
            underline: {
                container: 'border-b border-[var(--color-glass-border)]',
                tab: 'relative pb-3 border-b-2 border-transparent -mb-px',
                active: 'border-[var(--color-primary)] text-[var(--color-primary)]',
                inactive: 'hover:text-[var(--color-text-primary)] hover:border-[var(--color-glass-border)]',
            },
        };

        const currentVariant = variantStyles[variant];

        return (
            <div
                ref={ref}
                className={`flex items-center ${fullWidth ? 'w-full' : 'w-fit'} ${currentVariant.container} ${className}`}
            >
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    const isHovered = tab.id === hoveredTab;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => !tab.disabled && onTabChange(tab.id)}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            disabled={tab.disabled}
                            whileTap={tab.disabled ? {} : { scale: 0.98 }}
                            className={`
                relative flex items-center justify-center gap-2 font-medium
                transition-all duration-200
                ${sizes[size]}
                ${currentVariant.tab}
                ${fullWidth ? 'flex-1' : ''}
                ${isActive
                                    ? `${currentVariant.active} text-[var(--color-text-primary)]`
                                    : `${currentVariant.inactive} text-[var(--color-text-muted)]`
                                }
                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            {/* Hover/Active Background for default variant */}
                            {variant === 'default' && (isActive || isHovered) && (
                                <motion.div
                                    layoutId="tab-background"
                                    className={`absolute inset-0 ${currentVariant.tab} ${isActive ? currentVariant.active : 'bg-[var(--color-glass)]'}`}
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Content */}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span
                                        className={`
                      px-1.5 py-0.5 text-xs font-semibold rounded-full
                      ${isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-glass)] text-[var(--color-text-muted)]'}
                    `}
                                    >
                                        {tab.badge}
                                    </span>
                                )}
                            </span>

                            {/* Underline indicator */}
                            {variant === 'underline' && isActive && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        );
    }
);

TabBar.displayName = 'TabBar';
