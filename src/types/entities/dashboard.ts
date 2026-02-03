/**
 * Dashboard entity
 * @module types/entities/dashboard
 * @see PRD §7.1 - dashboards table, §3.3
 * @requirement P2-ENT-004
 */

// ============================================================================
// Layout Types
// ============================================================================

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  /** Grid columns */
  columns: number;

  /** Grid rows */
  rows: number;

  /** Gap between widgets in pixels */
  gap: number;

  /** Padding around the dashboard */
  padding: number;
}

/**
 * Default dashboard layout
 */
export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  columns: 12,
  rows: 8,
  gap: 16,
  padding: 24,
};

// ============================================================================
// Theme Types
// ============================================================================

/**
 * Dashboard theme configuration
 */
export interface DashboardTheme {
  /** Theme name */
  name: string;

  /** Primary color */
  primaryColor: string;

  /** Background style */
  background: 'solid' | 'gradient' | 'blur';

  /** Widget style */
  widgetStyle: 'glass' | 'solid' | 'outline';
}

/**
 * Preset themes
 */
export const DASHBOARD_THEMES: DashboardTheme[] = [
  {
    name: 'Default',
    primaryColor: '#1E40AF',
    background: 'solid',
    widgetStyle: 'glass',
  },
  {
    name: 'Dark Professional',
    primaryColor: '#60A5FA',
    background: 'gradient',
    widgetStyle: 'glass',
  },
  {
    name: 'Light Minimal',
    primaryColor: '#0D9488',
    background: 'solid',
    widgetStyle: 'outline',
  },
];

// ============================================================================
// Dashboard Entity
// ============================================================================

/**
 * Dashboard - Customizable analytics dashboard
 */
export interface Dashboard {
  /** Unique identifier (UUID) */
  id: string;

  /** Optional parent project (null for global dashboards) */
  projectId?: string;

  /** Owner user */
  userId: string;

  /** Dashboard display name */
  name: string;

  /** Layout configuration */
  layout: DashboardLayout;

  /** Theme configuration */
  theme?: DashboardTheme;

  /** Whether this is a template */
  isTemplate: boolean;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt?: Date;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create dashboard input
 */
export interface CreateDashboardInput {
  name: string;
  projectId?: string;
  layout?: Partial<DashboardLayout>;
  theme?: DashboardTheme;
  isTemplate?: boolean;
}

/**
 * Update dashboard input
 */
export interface UpdateDashboardInput {
  name?: string;
  layout?: Partial<DashboardLayout>;
  theme?: DashboardTheme;
  isTemplate?: boolean;
}

/**
 * Duplicate dashboard input
 */
export interface DuplicateDashboardInput {
  /** Source dashboard ID */
  sourceId: string;
  /** New dashboard name */
  name: string;
  /** Target project (optional) */
  projectId?: string;
}
