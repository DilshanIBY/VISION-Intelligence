import { forwardRef } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

export interface BarChartData {
    name: string;
    [key: string]: string | number;
}

export interface BarChartProps {
    data: BarChartData[];
    dataKeys: { key: string; color?: string; name?: string }[];
    layout?: 'horizontal' | 'vertical';
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    stacked?: boolean;
    height?: number | string;
    className?: string;
}

const DEFAULT_COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
];

export const BarChartComponent = forwardRef<HTMLDivElement, BarChartProps>(
    (
        {
            data,
            dataKeys,
            layout = 'horizontal',
            showGrid = true,
            showLegend = true,
            showTooltip = true,
            stacked = false,
            height = 300,
            className = '',
        },
        ref
    ) => {
        const isVertical = layout === 'vertical';

        return (
            <div ref={ref} className={`w-full ${className}`} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout={isVertical ? 'vertical' : 'horizontal'}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        {showGrid && (
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--color-glass-border)"
                                opacity={0.5}
                            />
                        )}

                        {isVertical ? (
                            <>
                                <XAxis type="number" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    width={80}
                                />
                            </>
                        ) : (
                            <>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: 'var(--color-glass-border)' }}
                                />
                                <YAxis
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                            </>
                        )}

                        {showTooltip && (
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-glass-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-lg)',
                                }}
                                labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
                                itemStyle={{ color: 'var(--color-text-secondary)' }}
                            />
                        )}

                        {showLegend && (
                            <Legend
                                wrapperStyle={{ paddingTop: 16 }}
                                formatter={(value) => (
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{value}</span>
                                )}
                            />
                        )}

                        {dataKeys.map((item, index) => (
                            <Bar
                                key={item.key}
                                dataKey={item.key}
                                name={item.name || item.key}
                                fill={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                radius={[4, 4, 0, 0]}
                                stackId={stacked ? 'stack' : undefined}
                            >
                                {data.map((_, cellIndex) => (
                                    <Cell
                                        key={`cell-${cellIndex}`}
                                        fill={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
);

BarChartComponent.displayName = 'BarChartComponent';
