/**
 * Analytics Mock Data
 * Mock data for Analytics Dashboard - Phase 3 UI prototype
 */

import type { KPIData, TimelineItem } from '../types/dashboard';

// =====================================================
// Analytics KPI Data (focused on insights/trends)
// =====================================================

export const analyticsKPIs: KPIData[] = [
  {
    id: 'analytics-kpi-1',
    title: 'Total Calculations',
    value: 847,
    unit: '',
    trend: { value: 23, direction: 'up', label: 'this month' },
    icon: 'calculator',
  },
  {
    id: 'analytics-kpi-2',
    title: 'Avg. Accuracy',
    value: 98.5,
    unit: '%',
    trend: { value: 2.1, direction: 'up', label: 'improvement' },
    icon: 'target',
  },
  {
    id: 'analytics-kpi-3',
    title: 'Time Saved',
    value: 156,
    unit: 'hrs',
    trend: { value: 34, direction: 'up', label: 'this quarter' },
    icon: 'clock',
  },
  {
    id: 'analytics-kpi-4',
    title: 'Client Projects',
    value: 28,
    unit: '',
    trend: { value: 7, direction: 'up', label: 'active' },
    icon: 'briefcase',
  },
];

// =====================================================
// Usage Trends Data (format for LineChartComponent)
// =====================================================

export const usageTrendsData = [
  { name: 'Mon', calculations: 45, layouts: 12 },
  { name: 'Tue', calculations: 62, layouts: 18 },
  { name: 'Wed', calculations: 58, layouts: 15 },
  { name: 'Thu', calculations: 71, layouts: 22 },
  { name: 'Fri', calculations: 68, layouts: 19 },
  { name: 'Sat', calculations: 32, layouts: 8 },
  { name: 'Sun', calculations: 28, layouts: 5 },
];

export const usageTrendsDataKeys = [
  { key: 'calculations', color: 'var(--color-primary)', name: 'Calculations' },
  { key: 'layouts', color: 'var(--color-secondary)', name: 'Layout Sessions' },
];

// =====================================================
// Module Usage Data (format for BarChartComponent)
// =====================================================

export const moduleUsageData = [
  { name: 'Machinery Calculator', sessions: 420 },
  { name: 'Floor Layout', sessions: 285 },
  { name: 'Dashboard', sessions: 180 },
  { name: 'Reports', sessions: 95 },
];

export const moduleUsageDataKeys = [
  { key: 'sessions', color: 'var(--color-primary)', name: 'Sessions' },
];

// =====================================================
// Performance Metrics
// =====================================================

export const performanceMetrics = {
  avgCalculationTime: {
    value: 0.8,
    unit: 's',
    target: 2,
    label: 'Avg. Calculation Time',
  },
  layoutValidationRate: {
    value: 94,
    unit: '%',
    target: 90,
    label: 'Layout Validation Pass Rate',
  },
  userSatisfaction: {
    value: 4.7,
    unit: '/5',
    target: 4.5,
    label: 'User Satisfaction',
  },
};

// =====================================================
// Recent Activity
// =====================================================

export const recentActivityData: TimelineItem[] = [
  {
    id: 'activity-1',
    title: 'Embroidery Calculation - Client ABC',
    startDate: '2026-02-06',
    endDate: '2026-02-06',
    progress: 100,
    status: 'completed',
    color: 'success',
  },
  {
    id: 'activity-2',
    title: 'Floor Layout - Factory XYZ',
    startDate: '2026-02-06',
    endDate: '2026-02-08',
    progress: 65,
    status: 'in-progress',
    color: 'primary',
  },
  {
    id: 'activity-3',
    title: 'Machinery Assessment - Project Delta',
    startDate: '2026-02-05',
    endDate: '2026-02-10',
    progress: 40,
    status: 'in-progress',
    color: 'secondary',
  },
  {
    id: 'activity-4',
    title: 'Cost Analysis - Client MNO',
    startDate: '2026-02-07',
    endDate: '2026-02-12',
    progress: 0,
    status: 'pending',
    color: 'accent',
  },
];

// =====================================================
// Monthly Summary (format for BarChartComponent)
// =====================================================

export const monthlySummary = [
  { name: 'Jan', completed: 8, newProjects: 10 },
  { name: 'Feb', completed: 12, newProjects: 14 },
  { name: 'Mar', completed: 10, newProjects: 12 },
  { name: 'Apr', completed: 15, newProjects: 16 },
  { name: 'May', completed: 14, newProjects: 15 },
  { name: 'Jun', completed: 18, newProjects: 20 },
];

export const monthlySummaryDataKeys = [
  { key: 'completed', color: 'var(--color-success)', name: 'Projects Completed' },
  { key: 'newProjects', color: 'var(--color-primary)', name: 'New Projects' },
];

// =====================================================
// Insights Highlights
// =====================================================

export const insightsHighlights = [
  {
    id: 'insight-1',
    type: 'success' as const,
    title: 'Peak Efficiency Achieved',
    description: 'Machine utilization reached 95% in the last sprint',
    metric: '+12%',
    timestamp: '2 hours ago',
  },
  {
    id: 'insight-2',
    type: 'info' as const,
    title: 'Popular Configuration',
    description: '21-head embroidery machines most calculated this week',
    metric: '156 calcs',
    timestamp: '5 hours ago',
  },
  {
    id: 'insight-3',
    type: 'warning' as const,
    title: 'Capacity Alert',
    description: 'Cutting department showing 85% utilization across layouts',
    metric: '85%',
    timestamp: '1 day ago',
  },
];

// =====================================================
// Auto-Cycle Slides for Presentation Mode
// =====================================================

export const presentationSlides = [
  {
    id: 'slide-1',
    title: 'Performance Overview',
    widgets: ['kpi-grid', 'gauge-utilization'],
  },
  {
    id: 'slide-2',
    title: 'Usage Trends',
    widgets: ['usage-chart', 'module-usage'],
  },
  {
    id: 'slide-3',
    title: 'Project Activity',
    widgets: ['activity-timeline', 'monthly-summary'],
  },
  {
    id: 'slide-4',
    title: 'Key Insights',
    widgets: ['insights-highlights', 'performance-metrics'],
  },
];
