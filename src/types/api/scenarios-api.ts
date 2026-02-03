/**
 * Scenarios API contracts
 * @module types/api/scenarios-api
 * @see PRD §8.1
 * @requirement P2-API-002
 */

import type {
    ApiResponse,
    PaginatedResponse,
    ListQueryParams
} from './common';

import type {
    Scenario,
    ScenarioComparison,
    CreateScenarioInput,
    UpdateScenarioInput,
    CompareScenarioInput
} from '../entities/scenario';

// ============================================================================
// POST /api/scenarios
// ============================================================================

/**
 * Request body for POST /api/scenarios
 */
export interface CreateScenarioRequest extends CreateScenarioInput { }

/**
 * Response for scenario creation
 */
export interface CreateScenarioResponse {
    /** Created scenario */
    scenario: Scenario;
    /** Computed results based on parameters */
    results: Record<string, unknown>;
}

/**
 * Wrapped API response
 */
export type CreateScenarioApiResponse = ApiResponse<CreateScenarioResponse>;

// ============================================================================
// GET /api/scenarios/:calculationId
// ============================================================================

/**
 * Path parameters for listing scenarios
 */
export interface ListScenariosParams {
    /** Parent calculation ID */
    calculationId: string;
}

/**
 * Query parameters for listing scenarios
 */
export interface ListScenariosQuery extends ListQueryParams {
    /** Include only baseline scenarios */
    isBaseline?: boolean;
}

/**
 * Response for listing scenarios
 */
export type ListScenariosResponse = PaginatedResponse<Scenario>;

// ============================================================================
// PUT /api/scenarios/:id
// ============================================================================

/**
 * Path parameters for updating scenario
 */
export interface UpdateScenarioParams {
    /** Scenario ID */
    id: string;
}

/**
 * Request body for PUT /api/scenarios/:id
 */
export interface UpdateScenarioRequest extends UpdateScenarioInput { }

/**
 * Response for scenario update
 */
export interface UpdateScenarioResponse {
    /** Updated scenario */
    scenario: Scenario;
    /** Recomputed results */
    results: Record<string, unknown>;
}

/**
 * Wrapped API response
 */
export type UpdateScenarioApiResponse = ApiResponse<UpdateScenarioResponse>;

// ============================================================================
// DELETE /api/scenarios/:id
// ============================================================================

/**
 * Path parameters for deleting scenario
 */
export interface DeleteScenarioParams {
    /** Scenario ID */
    id: string;
}

/**
 * Response for scenario deletion
 */
export interface DeleteScenarioResponse {
    /** Deleted scenario ID */
    deletedId: string;
}

/**
 * Wrapped API response
 */
export type DeleteScenarioApiResponse = ApiResponse<DeleteScenarioResponse>;

// ============================================================================
// POST /api/scenarios/compare
// ============================================================================

/**
 * Request body for POST /api/scenarios/compare
 */
export interface CompareScenarioRequest extends CompareScenarioInput { }

/**
 * Response for scenario comparison
 */
export interface CompareScenarioResponse {
    /** Comparison results */
    comparison: ScenarioComparison;
    /** Summary statistics */
    summary: {
        /** Number of scenarios compared */
        scenarioCount: number;
        /** Fields with differences */
        changedFields: string[];
        /** Best scenario per metric */
        bestPerMetric: Record<string, string>;
    };
}

/**
 * Wrapped API response
 */
export type CompareScenarioApiResponse = ApiResponse<CompareScenarioResponse>;
