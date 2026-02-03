/**
 * DashboardWidget entity
 * @module types/entities/dashboard-widget
 * @see PRD §7.1 - dashboard_widgets table, §3.3.2
 * @requirement P2-ENT-009
 */

import type { WidgetType } from '../enums';

// ============================================================================
// Position Types
// ============================================================================

/**
 * Widget position on dashboard grid
 */
export interface WidgetPosition {
    /** Grid column (0-indexed) */
    x: number;

    /** Grid row (0-indexed) */
    y: number;

    /** Width in grid units */
    w: number;

    /** Height in grid units */
    h: number;
}

// ============================================================================
// Data Source Types
// ============================================================================

/**
 * Widget data source configuration
 */
export interface WidgetDataSource {
    /** Source type */
    type: 'calculation' | 'scenario' | 'layout' | 'static' | 'aggregation';

    /** Reference ID (calculation, scenario, or layout ID) */
    referenceId?: string;

    /** Field path to extract from source */
    fieldPath?: string;

    /** Static value (for static type) */
    staticValue?: unknown;

    /** Aggregation configuration */
    aggregation?: {
        function: 'sum' | 'avg' | 'min' | 'max' | 'count';
        groupBy?: string;
    };
}

// ============================================================================
// Widget Configuration Types
// ============================================================================

/**
 * KPI Card widget configuration
 */
export interface KpiCardConfig {
    /** Label text */
    label: string;
    /** Value format (e.g., 'number', 'currency', 'percent') */
    format: 'number' | 'currency' | 'percent';
    /** Decimal places */
    decimals?: number;
    /** Currency code (for currency format) */
    currency?: string;
    /** Show trend indicator */
    showTrend?: boolean;
    /** Trend comparison field */
    trendField?: string;
    /** Icon name */
    icon?: string;
}

/**
 * Gauge Chart widget configuration
 */
export interface GaugeChartConfig {
    /** Label text */
    label: string;
    /** Minimum value */
    min: number;
    /** Maximum value */
    max: number;
    /** Warning threshold */
    warningThreshold?: number;
    /** Error threshold */
    errorThreshold?: number;
    /** Unit suffix */
    unit?: string;
}

/**
 * Bar Chart widget configuration
 */
export interface BarChartConfig {
    /** Chart title */
    title: string;
    /** X-axis label */
    xAxisLabel?: string;
    /** Y-axis label */
    yAxisLabel?: string;
    /** Orientation */
    orientation: 'horizontal' | 'vertical';
    /** Show legend */
    showLegend?: boolean;
    /** Color scheme */
    colorScheme?: string[];
}

/**
 * Timeline widget configuration
 */
export interface TimelineConfig {
    /** Title */
    title: string;
    /** Start date field */
    startDateField: string;
    /** End date field */
    endDateField: string;
    /** Label field */
    labelField: string;
    /** Show milestones */
    showMilestones?: boolean;
}

/**
 * Floor Map widget configuration
 */
export interface FloorMapConfig {
    /** Layout ID to display */
    layoutId: string;
    /** Show flow paths */
    showFlowPaths: boolean;
    /** Show labels */
    showLabels: boolean;
    /** Interactive mode */
    interactive: boolean;
}

/**
 * Cost Breakdown widget configuration
 */
export interface CostBreakdownConfig {
    /** Title */
    title: string;
    /** Currency code */
    currency: string;
    /** Show percentages */
    showPercentages: boolean;
    /** Category field */
    categoryField: string;
    /** Value field */
    valueField: string;
}

/**
 * Comparison Table widget configuration
 */
export interface ComparisonTableConfig {
    /** Title */
    title: string;
    /** Columns to display */
    columns: {
        field: string;
        label: string;
        format?: 'number' | 'currency' | 'percent' | 'text';
    }[];
    /** Highlight differences */
    highlightDifferences: boolean;
}

/**
 * Combined widget configuration type
 */
export type WidgetConfig =
    | KpiCardConfig
    | GaugeChartConfig
    | BarChartConfig
    | TimelineConfig
    | FloorMapConfig
    | CostBreakdownConfig
    | ComparisonTableConfig
    | Record<string, unknown>;

// ============================================================================
// DashboardWidget Entity
// ============================================================================

/**
 * DashboardWidget - Individual widget on a dashboard
 */
export interface DashboardWidget {
    /** Unique identifier (UUID) */
    id: string;

    /** Parent dashboard */
    dashboardId: string;

    /** Widget type */
    type: WidgetType;

    /** Position on grid */
    position: WidgetPosition;

    /** Widget-specific configuration */
    config: WidgetConfig;

    /** Data source configuration */
    dataSource?: WidgetDataSource;

    /** Custom title override */
    title?: string;

    /** Order index for same-position widgets */
    zIndex?: number;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create widget input
 */
export interface CreateWidgetInput {
    dashboardId: string;
    type: WidgetType;
    position: WidgetPosition;
    config: WidgetConfig;
    dataSource?: WidgetDataSource;
    title?: string;
}

/**
 * Update widget input
 */
export interface UpdateWidgetInput {
    position?: Partial<WidgetPosition>;
    config?: Partial<WidgetConfig>;
    dataSource?: WidgetDataSource;
    title?: string;
}

// ============================================================================
// Size Helpers
// ============================================================================

/**
 * Get default size for widget type
 * @see PRD §3.3.2
 */
export function getDefaultWidgetSize(type: WidgetType): WidgetPosition {
    const sizes: Record<WidgetType, WidgetPosition> = {
        kpi_card: { x: 0, y: 0, w: 2, h: 1 },
        gauge_chart: { x: 0, y: 0, w: 2, h: 2 },
        bar_chart: { x: 0, y: 0, w: 4, h: 3 },
        line_chart: { x: 0, y: 0, w: 4, h: 3 },
        timeline: { x: 0, y: 0, w: 6, h: 2 },
        floor_map: { x: 0, y: 0, w: 4, h: 4 },
        cost_breakdown: { x: 0, y: 0, w: 3, h: 3 },
        comparison_table: { x: 0, y: 0, w: 4, h: 3 },
    };
    return sizes[type];
}
