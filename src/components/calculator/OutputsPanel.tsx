/**
 * OutputsPanel - Right panel showing calculation results with visualizations
 * Updated for VISION Intelligence v2.1
 * Removed: Production Timeline, Time Per Piece
 * Added: Capacity info for embroidery/fusing
 */

import { forwardRef } from 'react';
import { Activity } from 'lucide-react';

// UI Components
import { GaugeChart } from '@components/ui/display/GaugeChart';
import { Progress } from '@components/ui/display/Progress';

// Calculator Components
import {
  OutputCard,
  MachinesRequiredCard,
  CostBreakdownCard,
} from './OutputCard';

// Mock Data
import { type CalculatorOutputs, type CalculationTab, mockCostBreakdown } from '@mocks/calculator';

export interface OutputsPanelProps {
  outputs: CalculatorOutputs;
  activeTab: CalculationTab;
  className?: string;
}

export const OutputsPanel = forwardRef<HTMLDivElement, OutputsPanelProps>(
  ({ outputs, activeTab, className = '' }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col gap-4 ${className}`}>
        {/* Top Row: Machines Required + Daily Output */}
        <div className="grid grid-cols-2 gap-4">
          {/* Machines Required */}
          <MachinesRequiredCard count={outputs.machinesRequired} />

          {/* Daily Output */}
          <OutputCard title="Daily Output" icon={<Activity size={14} />}>
            <div className="flex items-end gap-4">
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                {outputs.dailyOutput.toLocaleString()}
              </span>
              <span className="text-sm text-[var(--color-text-muted)] mb-1">
                {activeTab === 'fusing' ? 'pcs/day capacity' : 'pieces/day'}
              </span>
            </div>
            <div className="mt-3">
              <Progress
                value={Math.min(100, outputs.dailyOutput / 50)}
                variant="bar"
                color="secondary"
                showValue={false}
                size="md"
              />
            </div>
          </OutputCard>
        </div>

        {/* Middle Row: Utilization Rate + Extra Info */}
        <div className="grid grid-cols-2 gap-4">
          {/* Utilization Rate (gauge chart) */}
          <OutputCard title="Utilization Rate">
            <div className="flex justify-center -mt-2">
              <GaugeChart
                value={Math.round(outputs.utilizationRate * 100)}
                min={0}
                max={100}
                unit="%"
                size="sm"
                color="auto"
                thresholds={{ warning: 70, error: 95 }}
              />
            </div>
          </OutputCard>

          {/* Tab-specific extra info */}
          {activeTab === 'embroidery' && outputs.stitchingTimePerPiece !== undefined ? (
            <OutputCard title="Embroidery Details">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-muted)]">Stitch Time</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {outputs.stitchingTimePerPiece.toFixed(2)} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-muted)]">Output / Head</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {outputs.outputPerHead?.toLocaleString()} pcs
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--color-glass-border)] flex justify-between items-center">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Output / Machine
                  </span>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {outputs.outputPerMachine?.toLocaleString()} pcs
                  </span>
                </div>
              </div>
            </OutputCard>
          ) : activeTab === 'fusing' && outputs.capacityPerMachine !== undefined ? (
            <OutputCard title="Fusing Details">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-muted)]">Capacity / Machine</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {outputs.capacityPerMachine.toLocaleString()} pcs/day
                  </span>
                </div>
              </div>
            </OutputCard>
          ) : (
            <OutputCard title="Production Summary">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-muted)]">Machines</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {outputs.machinesRequired}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-muted)]">Daily Output</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {outputs.dailyOutput.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--color-glass-border)] flex justify-between items-center">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Efficiency
                  </span>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {Math.round(outputs.utilizationRate * 100)}%
                  </span>
                </div>
              </div>
            </OutputCard>
          )}
        </div>

        {/* Bottom Row: Cost Breakdown */}
        <div className="grid grid-cols-1 gap-4">
          {/* Cost Estimate */}
          <CostBreakdownCard total={outputs.costEstimate} categories={mockCostBreakdown} />
        </div>
      </div>
    );
  }
);

OutputsPanel.displayName = 'OutputsPanel';
