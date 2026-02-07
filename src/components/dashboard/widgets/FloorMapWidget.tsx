/**
 * Floor Map Widget Component
 * Displays a preview of factory floor layout
 */

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { FloorLayoutPreview } from '../../../types/dashboard';

interface FloorMapWidgetProps {
  data: FloorLayoutPreview;
  onViewDetails?: () => void;
}

const statusConfig = {
  valid: {
    icon: CheckCircle,
    color: 'var(--color-success)',
    label: 'Valid Layout',
  },
  warnings: {
    icon: AlertTriangle,
    color: 'var(--color-warning)',
    label: 'Has Warnings',
  },
  errors: {
    icon: XCircle,
    color: 'var(--color-error)',
    label: 'Has Errors',
  },
};

export function FloorMapWidget({ data, onViewDetails }: FloorMapWidgetProps) {
  const StatusIcon = statusConfig[data.validationStatus].icon;

  // Create a simple grid visualization of departments
  return (
    <div className="h-full flex flex-col">
      {/* Mini floor map visualization */}
      <div className="flex-1 relative bg-[var(--color-glass)] rounded-lg p-3 overflow-hidden">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-text-muted) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-text-muted) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Department blocks */}
        <div className="relative h-full flex flex-wrap gap-1.5 content-start">
          {data.departments.map((dept, index) => {
            // Calculate relative size based on area percentage
            const areaPercentage = (dept.area / data.totalArea) * 100;
            const width = Math.max(areaPercentage * 2, 20);

            return (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-center rounded-md text-xs font-medium"
                style={{
                  backgroundColor: dept.color,
                  width: `${Math.min(width, 45)}%`,
                  minWidth: '60px',
                  height: '40px',
                  color: '#374151',
                }}
                title={`${dept.name}: ${dept.area} m²`}
              >
                <span className="truncate px-1">{dept.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-3 border-t border-[var(--color-glass-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon size={14} style={{ color: statusConfig[data.validationStatus].color }} />
            <span className="text-xs text-[var(--color-text-muted)]">
              {statusConfig[data.validationStatus].label}
            </span>
          </div>

          <div className="text-xs text-[var(--color-text-muted)]">
            {data.totalArea.toLocaleString()} m²
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-medium text-[var(--color-primary)] bg-[var(--color-glass)]
              hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            <ExternalLink size={12} />
            View Full Layout
          </button>
        )}
      </div>
    </div>
  );
}
