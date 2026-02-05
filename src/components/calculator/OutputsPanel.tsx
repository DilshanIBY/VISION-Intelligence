/**
 * OutputsPanel - Right panel showing calculation results with visualizations
 * @requirement P3-PG-CALC-011 to P3-PG-CALC-015
 */

import { forwardRef } from 'react';
import { Clock, Activity } from 'lucide-react';

// UI Components
import { GaugeChart } from '@components/ui/display/GaugeChart';
import { Progress } from '@components/ui/display/Progress';

// Calculator Components
import {
    OutputCard,
    MachinesRequiredCard,
    ProductionTimelineCard,
    CostBreakdownCard
} from './OutputCard';

// Mock Data
import {
    type CalculatorOutputs,
    mockCostBreakdown,
} from '@mocks/calculator';

export interface OutputsPanelProps {
    outputs: CalculatorOutputs;
    deadline: string;
    className?: string;
}

export const OutputsPanel = forwardRef<HTMLDivElement, OutputsPanelProps>(
    ({ outputs, deadline, className = '' }, ref) => {
        return (
            <div
                ref={ref}
                className={`flex flex-col gap-4 ${className}`}
            >
                {/* Top Row: Machines Required + Timeline */}
                <div className="grid grid-cols-2 gap-4">
                    {/* P3-PG-CALC-011: Machines Required */}
                    <MachinesRequiredCard count={outputs.machinesRequired} />

                    {/* P3-PG-CALC-012: Production Timeline */}
                    <ProductionTimelineCard
                        totalDays={outputs.totalProductionDays}
                        deadline={deadline}
                    />
                </div>

                {/* Middle Row: Daily Output + Utilization */}
                <div className="grid grid-cols-2 gap-4">
                    {/* P3-PG-CALC-013: Daily Output Rate (progress arc) */}
                    <OutputCard
                        title="Daily Output"
                        icon={<Activity size={14} />}
                    >
                        <div className="flex items-end gap-4">
                            <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                                {outputs.dailyOutput.toLocaleString()}
                            </span>
                            <span className="text-sm text-[var(--color-text-muted)] mb-1">pieces/day</span>
                        </div>
                        <div className="mt-3">
                            <Progress
                                value={Math.min(100, outputs.dailyOutput / 15)}
                                variant="bar"
                                color="secondary"
                                showValue={false}
                                size="md"
                            />
                        </div>
                    </OutputCard>

                    {/* P3-PG-CALC-014: Utilization Rate (gauge chart) */}
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
                </div>

                {/* Bottom Row: Time per Piece + Cost Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Time per Piece breakdown */}
                    <OutputCard title="Time per Piece" icon={<Clock size={14} />}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-text-muted)]">Stitching</span>
                                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                    {outputs.timePerPiece.stitching.toFixed(2)} min
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--color-text-muted)]">Color Changes</span>
                                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                    {outputs.timePerPiece.colorChanges.toFixed(2)} min
                                </span>
                            </div>
                            <div className="pt-2 border-t border-[var(--color-glass-border)] flex justify-between items-center">
                                <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total</span>
                                <span className="text-lg font-bold text-[var(--color-primary)]">
                                    {outputs.timePerPiece.total.toFixed(2)} min
                                </span>
                            </div>
                        </div>
                    </OutputCard>

                    {/* P3-PG-CALC-015: Cost Estimate */}
                    <CostBreakdownCard
                        total={outputs.costEstimate}
                        categories={mockCostBreakdown}
                    />
                </div>
            </div>
        );
    }
);

OutputsPanel.displayName = 'OutputsPanel';
