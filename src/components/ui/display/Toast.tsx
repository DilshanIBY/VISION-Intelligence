import { createContext, useContext, useState, ReactNode, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastData {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after duration
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

interface ToastContainerProps {
    toasts: ToastData[];
    onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-6 right-6 z-[var(--z-toast)] flex flex-col gap-3 max-w-sm">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

interface ToastProps extends ToastData {
    onClose: () => void;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
    ({ message, type = 'info', action, onClose }, ref) => {
        const config = {
            success: {
                icon: CheckCircle,
                bg: 'bg-[var(--color-success)]',
                iconColor: 'text-white',
            },
            error: {
                icon: AlertCircle,
                bg: 'bg-[var(--color-error)]',
                iconColor: 'text-white',
            },
            warning: {
                icon: AlertTriangle,
                bg: 'bg-[var(--color-warning)]',
                iconColor: 'text-white',
            },
            info: {
                icon: Info,
                bg: 'bg-[var(--color-primary)]',
                iconColor: 'text-white',
            },
        };

        const { icon: Icon, bg, iconColor } = config[type];

        return (
            <motion.div
                ref={ref}
                layout
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`
          flex items-start gap-3 px-4 py-3 rounded-[var(--radius-xl)]
          ${bg} text-white shadow-[var(--shadow-xl)]
          min-w-[300px] max-w-sm
        `}
            >
                {/* Icon */}
                <div className={`flex-shrink-0 ${iconColor}`}>
                    <Icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{message}</p>
                    {action && (
                        <button
                            onClick={action.onClick}
                            className="mt-1 text-xs font-semibold underline underline-offset-2 hover:no-underline"
                        >
                            {action.label}
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X size={16} />
                </motion.button>
            </motion.div>
        );
    }
);

Toast.displayName = 'Toast';
