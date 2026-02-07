/**
 * Line Chart Widget Component
 * Displays a line chart for trend data
 */

import { LineChartComponent, LineChartData } from '../../ui/display';
import { ChartData } from '../../../types/dashboard';

interface LineChartWidgetProps {
  data: ChartData;
  showLegend?: boolean;
}

export function LineChartWidget({ data, showLegend = true }: LineChartWidgetProps) {
  // Map color names to CSS variable values
  const colorMap: Record<string, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
  };

  // Transform to LineChartData format with explicit name property
  const chartData: LineChartData[] = data.labels.map((label, index) => {
    const item: LineChartData = { name: label };
    data.datasets.forEach(dataset => {
      item[dataset.label] = dataset.data[index];
    });
    return item;
  });

  const dataKeys = data.datasets.map(dataset => ({
    key: dataset.label,
    name: dataset.label,
    color: colorMap[dataset.color] || colorMap.primary,
  }));

  return (
    <div className="h-full w-full">
      <LineChartComponent
        data={chartData}
        dataKeys={dataKeys}
        showLegend={showLegend}
        showGrid
        showTooltip
        curved
        showArea
        height="100%"
        className="h-full"
      />
    </div>
  );
}
