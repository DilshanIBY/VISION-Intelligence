/**
 * Error State Components
 * Display for error scenarios with retry options
 * @requirement P3-ST-003
 */

import {
    type ReactNode,
    forwardRef,
    type HTMLAttributes,
    Component,
    type ErrorInfo
} from 'react';
import { AlertCircleIcon, RefreshCwIcon, AlertTriangleIcon, XCircleIcon } from 'lucide-react';

// =====================================================
// Types
// =====================================================

type ErrorSeverity = 'warning' | 'error' | 'critical';

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
    /** Error severity level */
    severity?: ErrorSeverity;
    /** Error title */
    title?: string;
    /** Error message/description */
    message?: string;
    /** Retry callback */
    onRetry?: () => void;
    /** Custom action */
    action?: ReactNode;
    /** Show details (for dev mode) */
    details?: string;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

// =====================================================
// Severity Configurations
// =====================================================

const severityConfig: Record<ErrorSeverity, {
    icon: typeof AlertCircleIcon;
    color: string;
    bgColor: string;
    title: string;
}> = {
    warning: {
        icon: AlertTriangleIcon,
        color: 'var(--color-warning)',
        bgColor: 'rgba(249, 115, 22, 0.1)',
        title: 'Warning',
    },
    error: {
        icon: AlertCircleIcon,
        color: 'var(--color-error)',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        title: 'Something Went Wrong',
    },
    critical: {
        icon: XCircleIcon,
        color: 'var(--color-error)',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        title: 'Critical Error',
    },
};

// =====================================================
// Error State Component
// =====================================================

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
    (
        {
            severity = 'error',
            title,
            message = 'An unexpected error occurred. Please try again.',
            onRetry,
            action,
            details,
            className = '',
            ...props
        },
        ref
    ) => {
        const config = severityConfig[severity];
        const Icon = config.icon;
        const displayTitle = title || config.title;

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
                        flex items-center justify-center
                        mb-6
                    "
                    style={{ backgroundColor: config.bgColor }}
                >
                    <Icon
                        size={40}
                        style={{ color: config.color }}
                        strokeWidth={1.5}
                    />
                </div>

                {/* Title */}
                <h3 className="
                    text-lg font-semibold
                    text-[var(--color-text-primary)]
                    mb-2
                ">
                    {displayTitle}
                </h3>

                {/* Message */}
                <p className="
                    text-sm
                    text-[var(--color-text-secondary)]
                    max-w-xs
                    mb-6
                ">
                    {message}
                </p>

                {/* Details (collapsible for dev) */}
                {details && (
                    <details className="
                        text-xs text-left
                        text-[var(--color-text-muted)]
                        bg-[var(--color-glass)]
                        rounded-lg p-3
                        max-w-sm mb-4
                        cursor-pointer
                    ">
                        <summary className="font-medium">Error Details</summary>
                        <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                            {details}
                        </pre>
                    </details>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="
                                flex items-center gap-2
                                px-4 py-2
                                bg-[var(--color-primary)]
                                text-white
                                rounded-xl
                                text-sm font-medium
                                hover:bg-[var(--color-primary-hover)]
                                transition-colors
                            "
                        >
                            <RefreshCwIcon size={16} />
                            Try Again
                        </button>
                    )}
                    {action}
                </div>
            </div>
        );
    }
);

ErrorState.displayName = 'ErrorState';

// =====================================================
// Error Boundary Component
// =====================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorState
                    severity="error"
                    title="Something Went Wrong"
                    message="An unexpected error occurred in this section."
                    details={this.state.error?.message}
                    onRetry={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}

// =====================================================
// Inline Error (for form fields)
// =====================================================

interface InlineErrorProps extends HTMLAttributes<HTMLDivElement> {
    message: string;
}

export const InlineError = forwardRef<HTMLDivElement, InlineErrorProps>(
    ({ message, className = '', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
                    flex items-center gap-1.5
                    text-xs
                    text-[var(--color-error)]
                    mt-1
                    ${className}
                `}
                {...props}
            >
                <AlertCircleIcon size={12} />
                <span>{message}</span>
            </div>
        );
    }
);

InlineError.displayName = 'InlineError';

export default ErrorState;
