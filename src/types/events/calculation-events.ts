/**
 * Calculation Trigger Events
 * @module types/events/calculation-events
 * @see PRD §3.1, §11 Phase 2
 * @requirement P2-EVT-002
 */

import type { BaseEvent } from './base-event';
import type { CalculationType, ValidationSeverity } from '../enums';
import type {
    MachineryCalculationInputs,
    EmbroideryCalculationInputs,
    CalculationInputs,
    CalculationOutputs,
    ValidationResult
} from '../entities/calculation';

// ============================================================================
// Calculation Lifecycle Events
// ============================================================================

/**
 * Calculation started event - triggered when calculation begins
 */
export type CalculationStartedEvent = BaseEvent<'calculation:started', {
    calculationId: string;
    projectId: string;
    type: CalculationType;
    inputs: CalculationInputs;
}>;

/**
 * Calculation progress event - for long-running calculations
 */
export type CalculationProgressEvent = BaseEvent<'calculation:progress', {
    calculationId: string;
    progress: number; // 0-100
    stage: string;
    message?: string;
}>;

/**
 * Calculation completed event - triggered when calculation succeeds
 */
export type CalculationCompletedEvent = BaseEvent<'calculation:completed', {
    calculationId: string;
    projectId: string;
    type: CalculationType;
    outputs: CalculationOutputs;
    validation: ValidationResult;
    duration: number; // in milliseconds
}>;

/**
 * Calculation failed event - triggered when calculation fails
 */
export type CalculationFailedEvent = BaseEvent<'calculation:failed', {
    calculationId: string;
    projectId: string;
    type: CalculationType;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}>;

// ============================================================================
// Parameter Change Events
// ============================================================================

/**
 * Parameter change details
 */
export interface ParameterChange {
    field: string;
    previousValue: unknown;
    newValue: unknown;
}

/**
 * Calculation parameters changed event - for What-If playground
 */
export type CalculationParametersChangedEvent = BaseEvent<'calculation:parameters_changed', {
    calculationId: string;
    projectId: string;
    type: CalculationType;
    changes: ParameterChange[];
    triggerRecalculation: boolean;
}>;

// ============================================================================
// Validation Events
// ============================================================================

/**
 * Calculation validation event - triggered when validation rules are checked
 */
export type CalculationValidationEvent = BaseEvent<'calculation:validation', {
    calculationId: string;
    type: CalculationType;
    validation: ValidationResult;
}>;

/**
 * Calculation warning event - specific warning triggered
 */
export type CalculationWarningEvent = BaseEvent<'calculation:warning', {
    calculationId: string;
    ruleId: string;
    severity: ValidationSeverity;
    message: string;
    field?: string;
}>;

// ============================================================================
// Scenario Events
// ============================================================================

/**
 * Scenario created event
 */
export type ScenarioCreatedEvent = BaseEvent<'scenario:created', {
    scenarioId: string;
    calculationId: string;
    name: string;
    isBaseline: boolean;
}>;

/**
 * Scenario comparison event
 */
export type ScenarioComparisonEvent = BaseEvent<'scenario:comparison', {
    scenarioIds: string[];
    baselineId?: string;
}>;

/**
 * Scenario saved event
 */
export type ScenarioSavedEvent = BaseEvent<'scenario:saved', {
    scenarioId: string;
    calculationId: string;
    name: string;
}>;

// ============================================================================
// Type-Specific Calculation Events
// ============================================================================

/**
 * Machinery calculation specific event
 */
export type MachineryCalculationEvent = BaseEvent<'calculation:machinery', {
    calculationId: string;
    inputs: MachineryCalculationInputs;
    machinesRequired: number;
    utilizationRate: number;
}>;

/**
 * Embroidery calculation specific event
 */
export type EmbroideryCalculationEvent = BaseEvent<'calculation:embroidery', {
    calculationId: string;
    inputs: EmbroideryCalculationInputs;
    machinesRequired: number;
    timePerPiece: number;
    headCountWarning?: boolean;
}>;

// ============================================================================
// Union Types
// ============================================================================

/**
 * All calculation lifecycle events
 */
export type CalculationLifecycleEvent =
    | CalculationStartedEvent
    | CalculationProgressEvent
    | CalculationCompletedEvent
    | CalculationFailedEvent;

/**
 * All scenario events
 */
export type ScenarioEvent =
    | ScenarioCreatedEvent
    | ScenarioComparisonEvent
    | ScenarioSavedEvent;

/**
 * All calculation trigger events
 */
export type CalculationTriggerEvent =
    | CalculationLifecycleEvent
    | CalculationParametersChangedEvent
    | CalculationValidationEvent
    | CalculationWarningEvent
    | ScenarioEvent
    | MachineryCalculationEvent
    | EmbroideryCalculationEvent;

/**
 * Calculation event type strings
 */
export type CalculationEventType = CalculationTriggerEvent['type'];
