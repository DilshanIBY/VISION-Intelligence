/**
 * Scenario entity
 * @module types/entities/scenario
 * @see PRD §7.1 - scenarios table, §5.1
 * @requirement P2-ENT-005
 */

// ============================================================================
// Scenario Entity
// ============================================================================

/**
 * Scenario - What-if scenario for comparison
 * Represents a variation of calculation parameters for comparison
 */
export interface Scenario {
  /** Unique identifier (UUID) */
  id: string;

  /** Parent calculation */
  calculationId: string;

  /** Scenario display name */
  name?: string;

  /** Modified parameters from baseline */
  parameters: Record<string, unknown>;

  /** Calculated results */
  results: Record<string, unknown>;

  /** Whether this is the baseline scenario */
  isBaseline: boolean;

  /** Creation timestamp */
  createdAt: Date;
}

// ============================================================================
// Comparison Types
// ============================================================================

/**
 * Delta change indicator
 */
export interface ScenarioDelta {
  /** Field that changed */
  field: string;
  /** Baseline value */
  baselineValue: number;
  /** Scenario value */
  scenarioValue: number;
  /** Absolute change */
  absoluteChange: number;
  /** Percentage change */
  percentageChange: number;
  /** Direction of change */
  direction: 'increase' | 'decrease' | 'unchanged';
}

/**
 * Scenario comparison result
 */
export interface ScenarioComparison {
  /** Baseline scenario */
  baseline: Scenario;
  /** Scenarios being compared */
  scenarios: Scenario[];
  /** Computed deltas per scenario */
  deltas: Map<string, ScenarioDelta[]>;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create scenario input
 */
export interface CreateScenarioInput {
  calculationId: string;
  name?: string;
  parameters: Record<string, unknown>;
}

/**
 * Update scenario input
 */
export interface UpdateScenarioInput {
  name?: string;
  parameters?: Record<string, unknown>;
}

/**
 * Compare scenarios request
 */
export interface CompareScenarioInput {
  /** Baseline scenario ID */
  baselineId: string;
  /** Scenario IDs to compare */
  scenarioIds: string[];
}
