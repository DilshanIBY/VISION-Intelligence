/**
 * Calculations API contracts
 * @module types/api/calculations-api
 * @see PRD §8.1, §8.2
 * @requirement P2-API-001
 */

import type {
    ApiResponse,
    PaginatedResponse,
    ListQueryParams
} from './common';

import type {
    Calculation,
    MachineryCalculationInputs,
    MachineryCalculationOutputs,
    EmbroideryCalculationInputs,
    EmbroideryCalculationOutputs,
    LayoutCalculationInputs,
    LayoutCalculationOutputs,
    ValidationResult
} from '../entities/calculation';

import type { CalculationType, CalculationStatus } from '../enums';

// ============================================================================
// POST /api/calculations/machinery
// ============================================================================

/**
 * Request body for POST /api/calculations/machinery
 * @see PRD §8.2
 */
export interface CreateMachineryCalculationRequest {
    /** Parent project ID */
    projectId: string;
    /** Calculation parameters */
    parameters: MachineryCalculationInputs;
}

/**
 * Response for machinery calculation
 */
export interface MachineryCalculationResponse {
    /** Calculation ID */
    id: string;
    /** Calculation type */
    type: 'machinery';
    /** Computed results */
    results: MachineryCalculationOutputs;
    /** Validation results */
    validation: ValidationResult;
    /** Creation timestamp */
    createdAt: string;
}

// ============================================================================
// POST /api/calculations/embroidery
// ============================================================================

/**
 * Request body for POST /api/calculations/embroidery
 * @see PRD §8.2
 */
export interface CreateEmbroideryCalculationRequest {
    /** Parent project ID */
    projectId: string;
    /** Embroidery-specific parameters */
    parameters: EmbroideryCalculationInputs;
}

/**
 * Response for embroidery calculation
 * @see PRD §8.2 Response Example
 */
export interface EmbroideryCalculationResponse {
    /** Calculation ID */
    id: string;
    /** Calculation type */
    type: 'embroidery';
    /** Computed results */
    results: EmbroideryCalculationOutputs;
    /** Validation results */
    validation: ValidationResult;
    /** Creation timestamp */
    createdAt: string;
}

// ============================================================================
// POST /api/calculations/layout
// ============================================================================

/**
 * Request body for POST /api/calculations/layout
 */
export interface CreateLayoutCalculationRequest {
    /** Parent project ID */
    projectId: string;
    /** Layout parameters */
    parameters: LayoutCalculationInputs;
}

/**
 * Response for layout calculation
 */
export interface LayoutCalculationResponse {
    /** Calculation ID */
    id: string;
    /** Calculation type */
    type: 'layout';
    /** Computed results */
    results: LayoutCalculationOutputs;
    /** Validation results */
    validation: ValidationResult;
    /** Creation timestamp */
    createdAt: string;
}

// ============================================================================
// GET /api/calculations/:id
// ============================================================================

/**
 * Path parameters for GET /api/calculations/:id
 */
export interface GetCalculationParams {
    /** Calculation ID */
    id: string;
}

/**
 * Response for getting a single calculation
 */
export type GetCalculationResponse = ApiResponse<Calculation>;

// ============================================================================
// GET /api/calculations/project/:projectId
// ============================================================================

/**
 * Path parameters for calculations by project
 */
export interface GetProjectCalculationsParams {
    /** Project ID */
    projectId: string;
}

/**
 * Query parameters for listing calculations
 */
export interface ListCalculationsQuery extends ListQueryParams {
    /** Filter by calculation type */
    type?: CalculationType;
    /** Filter by status */
    status?: CalculationStatus;
}

/**
 * Response for listing project calculations
 */
export type ListProjectCalculationsResponse = PaginatedResponse<Calculation>;

// ============================================================================
// Union Types for API
// ============================================================================

/**
 * Any calculation request type
 */
export type CreateCalculationRequest =
    | CreateMachineryCalculationRequest
    | CreateEmbroideryCalculationRequest
    | CreateLayoutCalculationRequest;

/**
 * Any calculation response type
 */
export type CalculationResponse =
    | MachineryCalculationResponse
    | EmbroideryCalculationResponse
    | LayoutCalculationResponse;

/**
 * Wrapped API response for calculation creation
 */
export type CreateCalculationApiResponse = ApiResponse<CalculationResponse>;
