/**
 * Bar Chart Widget Component
 * Displays a bar chart for comparative data
 */

import { BarChartComponent, BarChartData } from '../../ui/display';
import { ChartData } from '../../../types/dashboard';

interface BarChartWidgetProps {
    data: ChartData;
    showLegend?: boolean;
    horizontal?: boolean;
}

export function BarChartWidget({ data, showLegend = true, horizontal = false }: BarChartWidgetProps) {
    // Map color names to CSS variable values
    const colorMap: Record<string, string> = {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
    };

    // Transform to BarChartData format with explicit name property
    const chartData: BarChartData[] = data.labels.map((label, index) => {
        const item: BarChartData = { name: label };
        data.datasets.forEach((dataset) => {
            item[dataset.label] = dataset.data[index];
        });
        return item;
    });

    const dataKeys = data.datasets.map((dataset) => ({
        key: dataset.label,
        name: dataset.label,
        color: colorMap[dataset.color] || colorMap.primary,
    }));

    return (
        <div className="h-full w-full">
            <BarChartComponent
                data={chartData}
                dataKeys={dataKeys}
                layout={horizontal ? 'vertical' : 'horizontal'}
                showLegend={showLegend}
                showGrid
                height={200}
                className="h-full"
            />
        </div>
    );
}
