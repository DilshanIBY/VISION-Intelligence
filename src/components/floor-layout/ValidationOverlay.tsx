/**
 * ValidationOverlay Component
 * Displays bottleneck detection and validation warnings
 * @requirement P3-PG-FLOOR-018 Bottleneck detection overlay
 * @requirement P3-PG-FLOOR-019 Validation warnings display
 */

import { AlertTriangle, AlertCircle, Info, X, Lightbulb } from 'lucide-react';
import { type ValidationWarning } from '@mocks/floor-layout';

interface ValidationOverlayProps {
  warnings: ValidationWarning[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function ValidationOverlay({ warnings, onDismiss, className = '' }: ValidationOverlayProps) {
  if (warnings.length === 0) return null;

  const errorCount = warnings.filter(w => w.severity === 'error').length;
  const warningCount = warnings.filter(w => w.severity === 'warning').length;

  const getSeverityIcon = (severity: ValidationWarning['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'info':
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const getSeverityStyle = (severity: ValidationWarning['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30';
      case 'warning':
        return 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30';
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Summary Header */}
      <div className="flex flex-col gap-2 p-3 bg-glass rounded-xl border border-glass-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-muted">Total Issues</span>
          <span className="text-sm font-bold text-text-primary">{warnings.length}</span>
        </div>

        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-800">
              <AlertCircle size={12} />
              {errorCount} Error{errorCount !== 1 ? 's' : ''}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800">
              <AlertTriangle size={12} />
              {warningCount} Warning{warningCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Warning List */}
      <div className="space-y-2">
        {warnings.map(warning => (
          <div
            key={warning.id}
            className={`
              relative flex items-start gap-3 p-3 rounded-xl border transition-all
              ${getSeverityStyle(warning.severity)}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(warning.severity)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary leading-tight">
                {warning.message}
              </p>

              {warning.suggestion && (
                <p className="flex items-center gap-1.5 mt-1.5 text-xs text-text-muted">
                  <Lightbulb size={12} className="text-amber-500 flex-shrink-0" />
                  {warning.suggestion}
                </p>
              )}
            </div>

            {/* Dismiss Button */}
            {onDismiss && (
              <button
                onClick={() => onDismiss(warning.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors absolute top-2 right-2"
              >
                <X size={14} className="text-text-muted" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
