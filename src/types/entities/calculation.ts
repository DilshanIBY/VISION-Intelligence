/**
 * Calculation entity
 * @module types/entities/calculation
 * @see PRD §7.1 - calculations table, §8.2
 * @requirement P2-ENT-002
 */

import type { CalculationType, CalculationStatus, ValidationSeverity } from '../enums';

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation message for calculation results
 */
export interface ValidationMessage {
  /** Rule identifier */
  ruleId: string;
  /** Severity level */
  severity: ValidationSeverity;
  /** Human-readable message */
  message: string;
  /** Affected field/parameter */
  field?: string;
}

/**
 * Validation result summary
 */
export interface ValidationResult {
  /** Overall status */
  status: 'valid' | 'warnings' | 'errors';
  /** List of validation messages */
  warnings: ValidationMessage[];
  /** List of error messages */
  errors: ValidationMessage[];
}

// ============================================================================
// Machinery Calculation Types
// ============================================================================

/**
 * Basic machinery calculation inputs
 * @see PRD §3.1.2
 */
export interface MachineryCalculationInputs {
  /** Machine type reference */
  machineTypeId: string;
  /** Target production quantity */
  targetQuantity: number;
  /** Working hours per day */
  workingHoursPerDay: number;
  /** Production deadline */
  deadline: Date;
  /** Efficiency factor (0.5 - 1.0) */
  efficiencyFactor: number;
}

/**
 * Basic machinery calculation outputs
 * @see PRD §3.1.3
 */
export interface MachineryCalculationOutputs {
  /** Number of machines required */
  machinesRequired: number;
  /** Total production days */
  totalProductionDays: number;
  /** Daily output rate */
  dailyOutput: number;
  /** Utilization rate (0.0 - 1.0) */
  utilizationRate: number;
  /** Estimated cost */
  costEstimate?: number;
}

// ============================================================================
// Embroidery Calculation Types
// ============================================================================

/**
 * Embroidery-specific calculation inputs
 * @see PRD §3.1.2
 */
export interface EmbroideryCalculationInputs extends MachineryCalculationInputs {
  /** Stitch count per piece */
  punchCount: number;
  /** Number of thread colors (1-15) */
  threadColors: number;
  /** Machine head count */
  headCount: number;
  /** Machine speed in SPM */
  machineSpeed: number;
}

/**
 * Time breakdown for embroidery
 */
export interface EmbroideryTimeBreakdown {
  /** Stitching time in minutes */
  stitching: number;
  /** Color change time in minutes */
  colorChanges: number;
  /** Total time per piece in minutes */
  total: number;
}

/**
 * Embroidery-specific calculation outputs
 * @see PRD §8.2
 */
export interface EmbroideryCalculationOutputs extends MachineryCalculationOutputs {
  /** Time breakdown per piece */
  timePerPiece: EmbroideryTimeBreakdown;
}

// ============================================================================
// Layout Calculation Types
// ============================================================================

/**
 * Layout calculation inputs
 * @see PRD §3.2.2
 */
export interface LayoutCalculationInputs {
  /** Total number of operators */
  operators: number;
  /** Product type */
  productType: string;
  /** Working hours per day */
  workingHoursPerDay: number;
  /** Number of building floors */
  floors: number;
  /** Floor dimensions */
  floorDimensions: {
    width: number;
    length: number;
  };
}

/**
 * Department area calculation
 */
export interface DepartmentArea {
  /** Department type */
  type: string;
  /** Calculated area in m² */
  area: number;
  /** Minimum required area */
  minArea: number;
}

/**
 * Layout calculation outputs
 */
export interface LayoutCalculationOutputs {
  /** Total required area */
  totalArea: number;
  /** Department breakdowns */
  departments: DepartmentArea[];
  /** Available area */
  availableArea: number;
  /** Utilization percentage */
  utilization: number;
}

// ============================================================================
// Unified Input/Output Types
// ============================================================================

/**
 * Combined calculation inputs by type
 */
export type CalculationInputs =
  | MachineryCalculationInputs
  | EmbroideryCalculationInputs
  | LayoutCalculationInputs;

/**
 * Combined calculation outputs by type
 */
export type CalculationOutputs =
  | MachineryCalculationOutputs
  | EmbroideryCalculationOutputs
  | LayoutCalculationOutputs;

// ============================================================================
// Calculation Entity
// ============================================================================

/**
 * Calculation - Saved calculation with inputs and results
 */
export interface Calculation {
  /** Unique identifier (UUID) */
  id: string;

  /** Parent project */
  projectId: string;

  /** Type of calculation */
  type: CalculationType;

  /** Calculation inputs */
  inputs: CalculationInputs;

  /** Calculated outputs */
  outputs: CalculationOutputs;

  /** Validation results */
  validation: ValidationResult;

  /** Processing status */
  status: CalculationStatus;

  /** User who created this calculation */
  createdBy: string;

  /** Creation timestamp */
  createdAt: Date;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create machinery calculation request
 */
export interface CreateMachineryCalculationInput {
  projectId: string;
  parameters: MachineryCalculationInputs;
}

/**
 * Create embroidery calculation request
 */
export interface CreateEmbroideryCalculationInput {
  projectId: string;
  parameters: EmbroideryCalculationInputs;
}

/**
 * Create layout calculation request
 */
export interface CreateLayoutCalculationInput {
  projectId: string;
  parameters: LayoutCalculationInputs;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if inputs are for embroidery calculation
 */
export function isEmbroideryInputs(
  inputs: CalculationInputs
): inputs is EmbroideryCalculationInputs {
  return 'punchCount' in inputs && 'threadColors' in inputs;
}

/**
 * Check if outputs are for embroidery calculation
 */
export function isEmbroideryOutputs(
  outputs: CalculationOutputs
): outputs is EmbroideryCalculationOutputs {
  return 'timePerPiece' in outputs;
}
