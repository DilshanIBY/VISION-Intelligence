/**
 * Success State Component
 * Display for successful operations with confirmations
 * @requirement P3-ST-004
 */

import { type ReactNode, forwardRef, type HTMLAttributes } from 'react';
import { CheckCircle2Icon, CheckIcon, PartyPopperIcon } from 'lucide-react';

// =====================================================
// Types
// =====================================================

type SuccessVariant = 'default' | 'celebration' | 'minimal';

interface SuccessStateProps extends HTMLAttributes<HTMLDivElement> {
    /** Success variant style */
    variant?: SuccessVariant;
    /** Title text */
    title?: string;
    /** Description text */
    description?: string;
    /** Primary action */
    action?: ReactNode;
    /** Secondary action */
    secondaryAction?: ReactNode;
    /** Auto-hide duration (ms), 0 to disable */
    autoHideMs?: number;
    /** Callback when auto-hidden */
    onAutoHide?: () => void;
}

// =====================================================
// Component
// =====================================================

export const SuccessState = forwardRef<HTMLDivElement, SuccessStateProps>(
    (
        {
            variant = 'default',
            title = 'Success!',
            description = 'Your action was completed successfully.',
            action,
            secondaryAction,
            className = '',
            ...props
        },
        ref
    ) => {
        const renderIcon = () => {
            switch (variant) {
                case 'celebration':
                    return <PartyPopperIcon size={40} className="text-[var(--color-accent)]" strokeWidth={1.5} />;
                case 'minimal':
                    return <CheckIcon size={32} className="text-[var(--color-success)]" strokeWidth={2} />;
                default:
                    return <CheckCircle2Icon size={40} className="text-[var(--color-success)]" strokeWidth={1.5} />;
            }
        };

        const iconBgColor = variant === 'celebration'
            ? 'rgba(245, 158, 11, 0.1)'
            : 'rgba(16, 185, 129, 0.1)';

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
                {/* Animated Icon Container */}
                <div
                    className="
                        w-20 h-20
                        rounded-full
                        flex items-center justify-center
                        mb-6
                        success-icon-animate
                    "
                    style={{ backgroundColor: iconBgColor }}
                >
                    {renderIcon()}
                </div>

                {/* Title */}
                <h3 className="
                    text-lg font-semibold
                    text-[var(--color-text-primary)]
                    mb-2
                ">
                    {title}
                </h3>

                {/* Description */}
                <p className="
                    text-sm
                    text-[var(--color-text-secondary)]
                    max-w-xs
                    mb-6
                ">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    {action}
                    {secondaryAction}
                </div>
            </div>
        );
    }
);

SuccessState.displayName = 'SuccessState';

// =====================================================
// Success Checkmark (inline indicator)
// =====================================================

interface SuccessCheckmarkProps extends HTMLAttributes<HTMLDivElement> {
    /** Size in pixels */
    size?: number;
    /** Show animation */
    animate?: boolean;
}

export const SuccessCheckmark = forwardRef<HTMLDivElement, SuccessCheckmarkProps>(
    ({ size = 24, animate = true, className = '', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
                    inline-flex items-center justify-center
                    rounded-full
                    bg-[var(--color-success)]
                    ${animate ? 'success-checkmark-animate' : ''}
                    ${className}
                `}
                style={{ width: size, height: size }}
                {...props}
            >
                <CheckIcon
                    size={size * 0.6}
                    className="text-white"
                    strokeWidth={3}
                />
            </div>
        );
    }
);

SuccessCheckmark.displayName = 'SuccessCheckmark';

// =====================================================
// Success Toast Content (for use with Toast component)
// =====================================================

interface SuccessToastProps {
    title?: string;
    description?: string;
}

export const SuccessToastContent = ({
    title = 'Success',
    description
}: SuccessToastProps) => (
    <div className="flex items-start gap-3">
        <SuccessCheckmark size={20} />
        <div>
            <p className="font-medium text-[var(--color-text-primary)]">{title}</p>
            {description && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    {description}
                </p>
            )}
        </div>
    </div>
);

export default SuccessState;
