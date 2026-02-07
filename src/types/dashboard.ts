/**
 * Dashboard Type Definitions
 * Types for dashboard widgets, layouts, and data
 */

// =====================================================
// Widget Types
// =====================================================

export type WidgetType =
  | 'kpi'
  | 'gauge'
  | 'bar-chart'
  | 'line-chart'
  | 'timeline'
  | 'floor-map'
  | 'cost-breakdown'
  | 'comparison';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: Record<string, unknown>;
}

export interface DashboardConfig {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'auto';
  columns: number;
  rowHeight: number;
}

// =====================================================
// KPI Data
// =====================================================

export interface KPIData {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: string;
}

// =====================================================
// Chart Data
// =====================================================

export interface ChartDataset {
  label: string;
  data: number[];
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// =====================================================
// Timeline Data
// =====================================================

export interface TimelineItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

// =====================================================
// Floor Layout Preview
// =====================================================

export interface FloorDepartment {
  name: string;
  area: number;
  color: string;
}

export interface FloorLayoutPreview {
  id: string;
  name: string;
  totalArea: number;
  departments: FloorDepartment[];
  validationStatus: 'valid' | 'warnings' | 'errors';
  lastUpdated: string;
}

// =====================================================
// Cost Breakdown
// =====================================================

export interface CostCategory {
  name: string;
  amount: number;
  percentage: number;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

export interface CostBreakdown {
  totalCost: number;
  currency: string;
  categories: CostCategory[];
}

// =====================================================
// Scenario Comparison
// =====================================================

export interface ScenarioMetrics {
  machinesRequired: number;
  productionDays: number;
  totalCost: number;
  utilization: number;
}

export interface Scenario {
  id: string;
  name: string;
  isBaseline: boolean;
  metrics: ScenarioMetrics;
}

export interface ScenarioComparison {
  scenarios: Scenario[];
}

// =====================================================
// Widget Library
// =====================================================

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize: { w: number; h: number };
}

export const widgetLibrary: WidgetDefinition[] = [
  {
    type: 'kpi',
    name: 'KPI Card',
    description: 'Display a single key metric with trend',
    icon: 'hash',
    defaultSize: { w: 1, h: 8 },
    minSize: { w: 1, h: 8 },
    maxSize: { w: 2, h: 12 },
  },
  {
    type: 'gauge',
    name: 'Gauge Chart',
    description: 'Semi-circle gauge for utilization metrics',
    icon: 'gauge',
    defaultSize: { w: 1, h: 12 },
    minSize: { w: 1, h: 12 },
    maxSize: { w: 2, h: 24 },
  },
  {
    type: 'bar-chart',
    name: 'Bar Chart',
    description: 'Compare values across categories',
    icon: 'bar-chart-3',
    defaultSize: { w: 2, h: 12 },
    minSize: { w: 2, h: 12 },
    maxSize: { w: 4, h: 24 },
  },
  {
    type: 'line-chart',
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: 'trending-up',
    defaultSize: { w: 2, h: 12 },
    minSize: { w: 2, h: 12 },
    maxSize: { w: 4, h: 24 },
  },
  {
    type: 'timeline',
    name: 'Timeline',
    description: 'Production schedule Gantt view',
    icon: 'calendar',
    defaultSize: { w: 3, h: 14.5 },
    minSize: { w: 1, h: 6 },
    maxSize: { w: 4, h: 24 },
  },
  {
    type: 'floor-map',
    name: 'Floor Map',
    description: 'Floor layout preview',
    icon: 'layout-grid',
    defaultSize: { w: 2, h: 17 },
    minSize: { w: 2, h: 15 },
    maxSize: { w: 3, h: 24 },
  },
  {
    type: 'cost-breakdown',
    name: 'Cost Breakdown',
    description: 'Detailed cost analysis',
    icon: 'dollar-sign',
    defaultSize: { w: 2, h: 12 },
    minSize: { w: 2, h: 12 },
    maxSize: { w: 3, h: 24 },
  },
  {
    type: 'comparison',
    name: 'Comparison Table',
    description: 'Compare multiple scenarios',
    icon: 'columns-3',
    defaultSize: { w: 2, h: 12 },
    minSize: { w: 2, h: 12 },
    maxSize: { w: 4, h: 24 },
  },
];
