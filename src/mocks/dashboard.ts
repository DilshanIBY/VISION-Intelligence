/**
 * Dashboard Mock Data
 * Mock data for Phase 3 UI prototype - no real API calls
 */

import type {
  DashboardConfig,
  DashboardWidget,
  KPIData,
  ChartData,
  TimelineItem,
  FloorLayoutPreview,
  CostBreakdown,
  ScenarioComparison,
} from '../types/dashboard';

// =====================================================
// KPI Mock Data
// =====================================================

export const mockKPIData: KPIData[] = [
  {
    id: 'kpi-1',
    title: 'Active Projects',
    value: 12,
    unit: '',
    trend: { value: 8.5, direction: 'up', label: 'vs last month' },
    icon: 'folder',
  },
  {
    id: 'kpi-2',
    title: 'Machines Required',
    value: 48,
    unit: '',
    trend: { value: 12, direction: 'up', label: 'this quarter' },
    icon: 'settings',
  },
  {
    id: 'kpi-3',
    title: 'Utilization Rate',
    value: 87,
    unit: '%',
    trend: { value: 3.2, direction: 'up', label: 'vs target' },
    icon: 'gauge',
  },
  {
    id: 'kpi-4',
    title: 'Cost Savings',
    value: 24500,
    unit: '$',
    trend: { value: 15, direction: 'up', label: 'this year' },
    icon: 'dollar',
  },
  {
    id: 'kpi-5',
    title: 'Floor Layouts',
    value: 8,
    unit: '',
    trend: { value: 2, direction: 'neutral', label: 'active' },
    icon: 'grid',
  },
  {
    id: 'kpi-6',
    title: 'Production Days',
    value: 45,
    unit: 'days',
    trend: { value: -5, direction: 'down', label: 'ahead schedule' },
    icon: 'calendar',
  },
];

// =====================================================
// Gauge Chart Mock Data
// =====================================================

export const mockGaugeData = {
  machineUtilization: {
    value: 87,
    min: 0,
    max: 100,
    label: 'Machine Utilization',
    thresholds: { warning: 70, error: 90 },
  },
  productionEfficiency: {
    value: 92,
    min: 0,
    max: 100,
    label: 'Production Efficiency',
    thresholds: { warning: 80, error: 95 },
  },
  capacityUsage: {
    value: 65,
    min: 0,
    max: 100,
    label: 'Capacity Usage',
    thresholds: { warning: 75, error: 90 },
  },
};

// =====================================================
// Bar Chart Mock Data
// =====================================================

export const mockBarChartData: ChartData = {
  labels: ['Sewing', 'Embroidery', 'Cutting', 'Finishing', 'Packing'],
  datasets: [
    {
      label: 'Current Capacity',
      data: [85, 72, 90, 65, 78],
      color: 'primary',
    },
    {
      label: 'Required Capacity',
      data: [80, 85, 75, 70, 72],
      color: 'secondary',
    },
  ],
};

export const mockMachinesByTypeData: ChartData = {
  labels: ['Lockstitch', 'Overlock', 'Embroidery', 'Bartack', 'Button'],
  datasets: [
    {
      label: 'Machines Count',
      data: [24, 18, 12, 8, 6],
      color: 'primary',
    },
  ],
};

// =====================================================
// Line Chart Mock Data
// =====================================================

export const mockLineChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Production Output',
      data: [4500, 5200, 4800, 6100, 5800, 6400],
      color: 'primary',
    },
    {
      label: 'Target',
      data: [5000, 5000, 5500, 5500, 6000, 6000],
      color: 'accent',
    },
  ],
};

// =====================================================
// Timeline Mock Data
// =====================================================

export const mockTimelineData: TimelineItem[] = [
  {
    id: 'tl-1',
    title: 'Order #2024-001',
    startDate: '2026-02-01',
    endDate: '2026-02-15',
    progress: 75,
    status: 'in-progress',
    color: 'primary',
  },
  {
    id: 'tl-2',
    title: 'Order #2024-002',
    startDate: '2026-02-05',
    endDate: '2026-02-20',
    progress: 45,
    status: 'in-progress',
    color: 'secondary',
  },
  {
    id: 'tl-3',
    title: 'Order #2024-003',
    startDate: '2026-02-10',
    endDate: '2026-02-28',
    progress: 20,
    status: 'pending',
    color: 'accent',
  },
  {
    id: 'tl-4',
    title: 'Order #2024-004',
    startDate: '2026-02-18',
    endDate: '2026-03-05',
    progress: 0,
    status: 'pending',
    color: 'success',
  },
];

// =====================================================
// Floor Layout Preview Mock Data
// =====================================================

export const mockFloorLayoutPreview: FloorLayoutPreview = {
  id: 'floor-1',
  name: 'Factory A - Ground Floor',
  totalArea: 2500,
  departments: [
    { name: 'Warehouse', area: 200, color: '#FEF3C7' },
    { name: 'Cutting', area: 300, color: '#FFEDD5' },
    { name: 'Sewing', area: 1200, color: '#DBEAFE' },
    { name: 'Embroidery', area: 250, color: '#E9D5FF' },
    { name: 'Finishing', area: 350, color: '#D1FAE5' },
    { name: 'Packing', area: 200, color: '#CCFBF1' },
  ],
  validationStatus: 'valid',
  lastUpdated: '2026-02-03',
};

// =====================================================
// Cost Breakdown Mock Data
// =====================================================

export const mockCostBreakdown: CostBreakdown = {
  totalCost: 125000,
  currency: 'USD',
  categories: [
    { name: 'Machinery', amount: 45000, percentage: 36, color: 'primary' },
    { name: 'Labor', amount: 35000, percentage: 28, color: 'secondary' },
    { name: 'Materials', amount: 25000, percentage: 20, color: 'accent' },
    { name: 'Utilities', amount: 12000, percentage: 9.6, color: 'success' },
    { name: 'Overhead', amount: 8000, percentage: 6.4, color: 'warning' },
  ],
};

// =====================================================
// Scenario Comparison Mock Data
// =====================================================

export const mockScenarioComparison: ScenarioComparison = {
  scenarios: [
    {
      id: 'baseline',
      name: 'Baseline',
      isBaseline: true,
      metrics: {
        machinesRequired: 5,
        productionDays: 15,
        totalCost: 50000,
        utilization: 85,
      },
    },
    {
      id: 'scenario-a',
      name: 'High Capacity',
      isBaseline: false,
      metrics: {
        machinesRequired: 7,
        productionDays: 10,
        totalCost: 70000,
        utilization: 92,
      },
    },
    {
      id: 'scenario-b',
      name: 'Cost Optimized',
      isBaseline: false,
      metrics: {
        machinesRequired: 3,
        productionDays: 25,
        totalCost: 30000,
        utilization: 72,
      },
    },
  ],
};

// =====================================================
// Default Dashboard Layout
// =====================================================

export const defaultDashboardWidgets: DashboardWidget[] = [
  {
    id: 'w-1',
    type: 'kpi',
    title: 'Active Projects',
    x: 0,
    y: 0,
    w: 1,
    h: 8,
    config: { kpiId: 'kpi-1' },
  },
  {
    id: 'w-2',
    type: 'kpi',
    title: 'Machines Required',
    x: 1,
    y: 0,
    w: 1,
    h: 8,
    config: { kpiId: 'kpi-2' },
  },
  {
    id: 'w-3',
    type: 'kpi',
    title: 'Utilization Rate',
    x: 2,
    y: 0,
    w: 1,
    h: 8,
    config: { kpiId: 'kpi-3' },
  },
  {
    id: 'w-4',
    type: 'kpi',
    title: 'Cost Savings',
    x: 3,
    y: 0,
    w: 1,
    h: 8,
    config: { kpiId: 'kpi-4' },
  },
  {
    id: 'w-5',
    type: 'gauge',
    title: 'Machine Utilization',
    x: 0,
    y: 9,
    w: 1,
    h: 14.5,
    config: { gaugeKey: 'machineUtilization' },
  },
  {
    id: 'w-6',
    type: 'bar-chart',
    title: 'Capacity Analysis',
    x: 1,
    y: 9,
    w: 2,
    h: 14.5,
    config: { chartKey: 'capacity' },
  },
  {
    id: 'w-7',
    type: 'timeline',
    title: 'Production Schedule',
    x: 3,
    y: 9,
    w: 1,
    h: 14.5,
    config: {},
  },
  {
    id: 'w-8',
    type: 'floor-map',
    title: 'Floor Layout',
    x: 0,
    y: 24,
    w: 2,
    h: 17,
    config: { layoutId: 'floor-1' },
  },
  {
    id: 'w-9',
    type: 'comparison',
    title: 'Scenario Comparison',
    x: 2,
    y: 24,
    w: 2,
    h: 17,
    config: {},
  },
];

export const mockDashboardConfig: DashboardConfig = {
  id: 'dashboard-1',
  name: 'Main Dashboard',
  widgets: defaultDashboardWidgets,
  theme: 'auto',
  columns: 4,
  rowHeight: 10,
};
