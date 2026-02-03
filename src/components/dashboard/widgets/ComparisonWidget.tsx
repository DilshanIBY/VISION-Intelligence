/**
 * Comparison Widget Component
 * Displays scenario comparison table
 */

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, CheckCircle } from 'lucide-react';
import { ScenarioComparison } from '../../../types/dashboard';

interface ComparisonWidgetProps {
    data: ScenarioComparison;
}

export function ComparisonWidget({ data }: ComparisonWidgetProps) {
    const baseline = data.scenarios.find((s) => s.isBaseline);

    const getComparisonIcon = (current: number, baseline: number, inverse: boolean = false) => {
        if (current === baseline) {
            return <Minus size={12} className="text-[var(--color-text-muted)]" />;
        }
        const isUp = current > baseline;
        const isPositive = inverse ? !isUp : isUp;

        return isUp ? (
            <TrendingUp
                size={12}
                className={isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}
            />
        ) : (
            <TrendingDown
                size={12}
                className={isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}
            />
        );
    };

    const getPercentDiff = (current: number, baseline: number): string => {
        if (baseline === 0) return '—';
        const diff = ((current - baseline) / baseline) * 100;
        return diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
    };

    const formatValue = (key: string, value: number): string => {
        switch (key) {
            case 'totalCost':
                return `$${value.toLocaleString()}`;
            case 'utilization':
                return `${value}%`;
            default:
                return value.toString();
        }
    };

    const metricLabels: Record<string, string> = {
        machinesRequired: 'Machines',
        productionDays: 'Days',
        totalCost: 'Cost',
        utilization: 'Utilization',
    };

    // For lower-is-better metrics (cost, days, machines)
    const inverseMetrics = ['totalCost', 'productionDays', 'machinesRequired'];

    return (
        <div className="h-full overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-glass-border)]">
                        <th className="text-left py-2 px-2 font-medium text-[var(--color-text-muted)] text-xs uppercase">
                            Metric
                        </th>
                        {data.scenarios.map((scenario) => (
                            <th
                                key={scenario.id}
                                className="text-center py-2 px-2 font-medium text-[var(--color-text-muted)] text-xs uppercase"
                            >
                                <div className="flex items-center justify-center gap-1">
                                    {scenario.isBaseline && (
                                        <CheckCircle size={12} className="text-[var(--color-success)]" />
                                    )}
                                    {scenario.name}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(metricLabels).map((metricKey, index) => (
                        <motion.tr
                            key={metricKey}
                            className="border-b border-[var(--color-glass-border)] last:border-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <td className="py-3 px-2 text-[var(--color-text-secondary)]">
                                {metricLabels[metricKey]}
                            </td>
                            {data.scenarios.map((scenario) => {
                                const value = scenario.metrics[metricKey as keyof typeof scenario.metrics];
                                const baselineValue = baseline?.metrics[metricKey as keyof typeof baseline.metrics];
                                const isInverse = inverseMetrics.includes(metricKey);

                                return (
                                    <td key={scenario.id} className="py-3 px-2 text-center">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="font-medium text-[var(--color-text-primary)]">
                                                {formatValue(metricKey, value)}
                                            </span>
                                            {!scenario.isBaseline && baseline && (
                                                <div className="flex items-center gap-1 text-xs">
                                                    {getComparisonIcon(value, baselineValue!, isInverse)}
                                                    <span className="text-[var(--color-text-muted)]">
                                                        {getPercentDiff(value, baselineValue!)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
