import { forwardRef } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
} from 'recharts';

export interface LineChartData {
    name: string;
    [key: string]: string | number;
}

export interface LineChartProps {
    data: LineChartData[];
    dataKeys: { key: string; color?: string; name?: string; dashed?: boolean }[];
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    showArea?: boolean;
    curved?: boolean;
    height?: number;
    className?: string;
}

const DEFAULT_COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
];

export const LineChartComponent = forwardRef<HTMLDivElement, LineChartProps>(
    (
        {
            data,
            dataKeys,
            showGrid = true,
            showLegend = true,
            showTooltip = true,
            showArea = false,
            curved = true,
            height = 300,
            className = '',
        },
        ref
    ) => {
        return (
            <div ref={ref} className={`w-full ${className}`} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        {showGrid && (
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--color-glass-border)"
                                opacity={0.5}
                            />
                        )}

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

                        {/* Area fills (if enabled) */}
                        {showArea &&
                            dataKeys.map((item, index) => (
                                <defs key={`gradient-${item.key}`}>
                                    <linearGradient id={`gradient-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                            ))}

                        {showArea &&
                            dataKeys.map((item, _index) => (
                                <Area
                                    key={`area-${item.key}`}
                                    type={curved ? 'monotone' : 'linear'}
                                    dataKey={item.key}
                                    stroke="none"
                                    fill={`url(#gradient-${item.key})`}
                                />
                            ))}

                        {/* Lines */}
                        {dataKeys.map((item, index) => (
                            <Line
                                key={item.key}
                                type={curved ? 'monotone' : 'linear'}
                                dataKey={item.key}
                                name={item.name || item.key}
                                stroke={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                strokeWidth={2}
                                strokeDasharray={item.dashed ? '5 5' : undefined}
                                dot={{ fill: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length], strokeWidth: 0, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--color-surface)' }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
);

LineChartComponent.displayName = 'LineChartComponent';
