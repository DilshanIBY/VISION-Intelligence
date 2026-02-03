/**
 * Common enumerations used across APPAREL entities
 * @module types/enums
 */

// ============================================================================
// User & Organization
// ============================================================================

/**
 * User role within an organization
 * @see PRD §7.1 - users table
 */
export type UserRole = 'admin' | 'consultant' | 'viewer';

// ============================================================================
// Project
// ============================================================================

/**
 * Project lifecycle status
 * @see PRD §7.1 - projects table, §11 Phase 2 State Machines
 */
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

// ============================================================================
// Calculations
// ============================================================================

/**
 * Types of calculations supported
 * @see PRD §7.1 - calculations table
 */
export type CalculationType = 'machinery' | 'embroidery' | 'layout';

/**
 * Calculation processing state
 * @see PRD §11 Phase 2 State Machines
 */
export type CalculationStatus = 'pending' | 'processing' | 'completed' | 'error';

// ============================================================================
// Floor Layout
// ============================================================================

/**
 * Validation status for floor layouts
 * @see PRD §7.1 - floor_layouts table
 */
export type ValidationStatus = 'valid' | 'warnings' | 'errors';

/**
 * Floor layout editing state
 * @see PRD §11 Phase 2 State Machines
 */
export type LayoutStatus = 'editing' | 'validated' | 'exported';

/**
 * Product type categories affecting space calculations
 * @see PRD §3.2.3
 */
export type ProductType = 'innerwear' | 'outerwear' | 'casual' | 'wash_casual' | 'sportswear';

/**
 * Department types in floor layouts
 * @see PRD §5.2
 */
export type DepartmentType =
  | 'warehouse'
  | 'cutting'
  | 'sewing'
  | 'embroidery'
  | 'finishing'
  | 'packing'
  | 'utilities';

// ============================================================================
// Machines
// ============================================================================

/**
 * Machine category classification
 * @see PRD §7.1 - machine_types table
 */
export type MachineCategory = 'sewing' | 'embroidery' | 'cutting' | 'finishing';

// ============================================================================
// Dashboard
// ============================================================================

/**
 * Dashboard widget types
 * @see PRD §3.3.2
 */
export type WidgetType =
  | 'kpi_card'
  | 'gauge_chart'
  | 'bar_chart'
  | 'line_chart'
  | 'timeline'
  | 'floor_map'
  | 'cost_breakdown'
  | 'comparison_table';

/**
 * Widget size options
 * @see PRD §3.3.2
 */
export type WidgetSize = '1x1' | '2x1' | '2x2' | '3x1' | '3x2' | '3x3' | '4x1';

// ============================================================================
// Validation
// ============================================================================

/**
 * Severity levels for validation messages
 * @see PRD §6.2
 */
export type ValidationSeverity = 'info' | 'warning' | 'error' | 'success';
