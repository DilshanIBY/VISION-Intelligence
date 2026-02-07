/**
 * Empty State Component
 * Display for no-data scenarios with optional CTA
 * @requirement P3-ST-002
 */

import { type ReactNode, forwardRef, type HTMLAttributes } from 'react';
import {
  InboxIcon,
  SearchIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  CalculatorIcon,
  Building2Icon,
  type LucideIcon,
} from 'lucide-react';

// =====================================================
// Types
// =====================================================

type EmptyStateVariant = 'default' | 'search' | 'dashboard' | 'calculator' | 'floorLayout' | 'list';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Pre-defined variant */
  variant?: EmptyStateVariant;
  /** Custom icon (overrides variant icon) */
  icon?: LucideIcon;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Action button or content */
  action?: ReactNode;
  /** Icon size */
  iconSize?: number;
}

// =====================================================
// Variant Configurations
// =====================================================

const variantConfig: Record<
  EmptyStateVariant,
  { icon: LucideIcon; title: string; description: string }
> = {
  default: {
    icon: InboxIcon,
    title: 'No Data Available',
    description: 'There is nothing to display here yet.',
  },
  search: {
    icon: SearchIcon,
    title: 'No Results Found',
    description: 'Try adjusting your search or filter criteria.',
  },
  dashboard: {
    icon: LayoutDashboardIcon,
    title: 'Dashboard is Empty',
    description: 'Add widgets to build your custom dashboard.',
  },
  calculator: {
    icon: CalculatorIcon,
    title: 'No Calculations Yet',
    description: 'Enter parameters and run a calculation to see results.',
  },
  floorLayout: {
    icon: Building2Icon,
    title: 'No Departments Placed',
    description: 'Drag departments from the palette onto the canvas.',
  },
  list: {
    icon: FolderOpenIcon,
    title: 'No Items',
    description: 'Create your first item to get started.',
  },
};

// =====================================================
// Component
// =====================================================

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      variant = 'default',
      icon: CustomIcon,
      title,
      description,
      action,
      iconSize = 48,
      className = '',
      ...props
    },
    ref
  ) => {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;

    return (
      <div
        ref={ref}
        className={`
                    flex flex-col items-center justify-center
                    text-center
                    py-12 px-6
                    ${className}
                `}
        {...props}
      >
        {/* Icon Container */}
        <div
          className="
                    w-20 h-20
                    rounded-2xl
                    bg-[var(--color-glass)]
                    backdrop-blur-sm
                    flex items-center justify-center
                    mb-6
                    shadow-[var(--shadow-float)]
                "
        >
          <Icon size={iconSize} className="text-[var(--color-text-muted)]" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3
          className="
                    text-lg font-semibold
                    text-[var(--color-text-primary)]
                    mb-2
                "
        >
          {displayTitle}
        </h3>

        {/* Description */}
        <p
          className="
                    text-sm
                    text-[var(--color-text-secondary)]
                    max-w-xs
                    mb-6
                "
        >
          {displayDescription}
        </p>

        {/* Action */}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
