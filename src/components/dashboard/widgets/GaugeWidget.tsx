/**
 * Gauge Widget Component
 * Displays a gauge chart for utilization metrics
 */

import { GaugeChart } from '../../ui/display/GaugeChart';

interface GaugeWidgetProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  thresholds?: { warning: number; error: number };
  size?: 'sm' | 'md' | 'lg';
}

export function GaugeWidget({
  value,
  min = 0,
  max = 100,
  label,
  unit = '%',
  thresholds = { warning: 70, error: 90 },
  size = 'md',
}: GaugeWidgetProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <GaugeChart
        value={value}
        min={min}
        max={max}
        label={label}
        unit={unit}
        thresholds={thresholds}
        size={size}
        color="auto"
        showValue
        responsive
      />
    </div>
  );
}
