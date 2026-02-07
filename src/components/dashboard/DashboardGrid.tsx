/**
 * Dashboard Grid Component
 * Draggable/resizable widget grid using react-grid-layout v2
 */

import { useCallback, useMemo } from 'react';
import { GridLayout, useContainerWidth } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { DashboardWidgetWrapper } from './DashboardWidgetWrapper';
import {
  KPIWidget,
  GaugeWidget,
  BarChartWidget,
  TimelineWidget,
  FloorMapWidget,
  CostBreakdownWidget,
  ComparisonWidget,
  LineChartWidget,
} from './widgets';
import {
  mockKPIData,
  mockGaugeData,
  mockBarChartData,
  mockTimelineData,
  mockFloorLayoutPreview,
  mockCostBreakdown,
  mockScenarioComparison,
} from '../../mocks/dashboard';
import { DashboardWidget, widgetLibrary } from '../../types/dashboard';

interface DashboardGridProps {
  widgets: DashboardWidget[];
  columns?: number;
  rowHeight?: number;
  isEditing?: boolean;
  onLayoutChange?: (widgets: DashboardWidget[]) => void;
  onRemoveWidget?: (widgetId: string) => void;
}

export function DashboardGrid({
  widgets,
  columns = 4,
  rowHeight = 10,
  isEditing = false,
  onLayoutChange,
  onRemoveWidget,
}: DashboardGridProps) {
  // Use hook for container width measurement
  const { width, containerRef, mounted } = useContainerWidth({
    initialWidth: 1200,
  });

  // Convert widgets to grid layout format
  const layout: Layout = useMemo(
    () =>
      widgets.map(widget => ({
        i: widget.id,
        x: widget.x,
        y: widget.y,
        w: widget.w,
        h: widget.h,
        minW: widgetLibrary.find(w => w.type === widget.type)?.minSize.w || 1,
        minH: widgetLibrary.find(w => w.type === widget.type)?.minSize.h || 1,
        maxW: widgetLibrary.find(w => w.type === widget.type)?.maxSize.w || 4,
        maxH: widgetLibrary.find(w => w.type === widget.type)?.maxSize.h || 4,
      })),
    [widgets]
  );

  // Handle layout changes
  const handleLayoutChange = useCallback(
    (newLayout: Layout) => {
      if (!onLayoutChange) return;

      const updatedWidgets = widgets.map(widget => {
        const layoutItem = newLayout.find((l: LayoutItem) => l.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return widget;
      });

      onLayoutChange(updatedWidgets);
    },
    [widgets, onLayoutChange]
  );

  // Render widget content based on type
  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'kpi': {
        const kpiId = widget.config?.kpiId as string;
        const kpiData = mockKPIData.find(k => k.id === kpiId) || mockKPIData[0];
        return <KPIWidget data={kpiData} size="sm" />;
      }

      case 'gauge': {
        const gaugeKey = (widget.config?.gaugeKey as string) || 'machineUtilization';
        const gaugeData =
          mockGaugeData[gaugeKey as keyof typeof mockGaugeData] || mockGaugeData.machineUtilization;
        return (
          <GaugeWidget
            value={gaugeData.value}
            min={gaugeData.min}
            max={gaugeData.max}
            label={gaugeData.label}
            thresholds={gaugeData.thresholds}
            size="md"
          />
        );
      }

      case 'bar-chart':
        return <BarChartWidget data={mockBarChartData} showLegend />;

      case 'line-chart':
        return <LineChartWidget data={mockBarChartData} showLegend />;

      case 'timeline':
        return <TimelineWidget data={mockTimelineData} />;

      case 'floor-map':
        return <FloorMapWidget data={mockFloorLayoutPreview} />;

      case 'cost-breakdown':
        return <CostBreakdownWidget data={mockCostBreakdown} />;

      case 'comparison':
        return <ComparisonWidget data={mockScenarioComparison} />;

      default:
        return (
          <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
            Unknown widget type
          </div>
        );
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      {mounted && (
        <GridLayout
          className="layout"
          width={width}
          layout={layout}
          gridConfig={{
            cols: columns,
            rowHeight: rowHeight,
            margin: [16, 16] as const,
            containerPadding: [0, 0] as const,
          }}
          dragConfig={{
            enabled: isEditing,
            handle: '.drag-handle',
          }}
          resizeConfig={{
            enabled: isEditing,
          }}
          onLayoutChange={handleLayoutChange}
        >
          {widgets.map(widget => (
            <div key={widget.id}>
              <DashboardWidgetWrapper
                title={widget.title}
                isEditing={isEditing}
                onRemove={() => onRemoveWidget?.(widget.id)}
              >
                {renderWidgetContent(widget)}
              </DashboardWidgetWrapper>
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
}
