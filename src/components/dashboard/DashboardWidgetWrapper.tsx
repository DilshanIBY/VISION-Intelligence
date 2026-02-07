/**
 * Dashboard Widget Wrapper Component
 * Generic wrapper for all dashboard widgets with glass styling
 */

import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Maximize2, MoreHorizontal, X } from 'lucide-react';

export interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
  isEditing?: boolean;
  onRemove?: () => void;
  onMaximize?: () => void;
  onSettings?: () => void;
}

export const DashboardWidgetWrapper = forwardRef<HTMLDivElement, DashboardWidgetProps>(
  (
    { title, children, className = '', isEditing = false, onRemove, onMaximize, onSettings },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={`
          h-full flex flex-col rounded-[var(--radius-xl)] overflow-hidden
          bg-[var(--color-surface)] border border-[var(--color-glass-border)]
          shadow-[var(--shadow-float)]
          ${className}
        `}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-glass-border)]">
          <div className="flex items-center gap-2">
            {isEditing && (
              <div className="drag-handle cursor-grab active:cursor-grabbing text-[var(--color-text-muted)]">
                <GripVertical size={16} />
              </div>
            )}
            <h3 className="font-medium text-sm text-[var(--color-text-primary)]">{title}</h3>
          </div>

          <div className="flex items-center gap-1">
            {onMaximize && (
              <button
                onClick={onMaximize}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-glass)] transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            )}
            {onSettings && (
              <button
                onClick={onSettings}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-glass)] transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
            )}
            {isEditing && onRemove && (
              <button
                onClick={onRemove}
                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-red-50 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto custom-scrollbar">{children}</div>
      </motion.div>
    );
  }
);

DashboardWidgetWrapper.displayName = 'DashboardWidgetWrapper';
