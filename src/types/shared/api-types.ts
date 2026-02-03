/**
 * Common API types for shared use
 * @module types/shared/api-types
 * @see PRD §8
 * @requirement P2-TYP-001
 */

// Re-export commonly used API types for convenience
export type {
    ApiResponse,
    ApiError,
    PaginatedResponse,
    PaginationParams,
    PaginationMeta,
    SortParams,
    SortDirection,
    ListQueryParams,
    HttpMethod,
    HttpStatusCode,
} from '../api/common';

// Re-export HttpStatus constant (not a type)
export { HttpStatus } from '../api/common';

// ============================================================================
// API Utility Types
// ============================================================================

/**
 * Extract data type from ApiResponse
 */
export type ExtractResponseData<T> = T extends { data?: infer D } ? D : never;

/**
 * Unwrap paginated response to get item type
 */
export type ExtractPaginatedItem<T> = T extends { data: Array<infer I> } ? I : never;

/**
 * API endpoint definition
 */
export interface ApiEndpoint<TRequest = unknown, TResponse = unknown> {
    /** HTTP method */
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /** URL path (can include :params) */
    path: string;
    /** Request body type (for POST/PUT/PATCH) */
    request?: TRequest;
    /** Response type */
    response: TResponse;
}

/**
 * Query string parameters
 */
export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Path parameters for URL templating
 */
export type PathParams = Record<string, string>;

// ============================================================================
// Request/Response Helpers
// ============================================================================

/**
 * Standard request headers
 */
export interface RequestHeaders {
    'Content-Type'?: string;
    'Authorization'?: string;
    'Accept'?: string;
    'X-Request-Id'?: string;
}

/**
 * Request configuration
 */
export interface RequestConfig<T = unknown> {
    /** Request body */
    data?: T;
    /** Query parameters */
    params?: QueryParams;
    /** Request headers */
    headers?: RequestHeaders;
    /** Request timeout in ms */
    timeout?: number;
    /** Abort signal for cancellation */
    signal?: AbortSignal;
}

/**
 * Response wrapper with metadata
 */
export interface ResponseWrapper<T> {
    /** Response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Response headers */
    headers: Record<string, string>;
    /** Request duration in ms */
    duration: number;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
    /** Field path that failed validation */
    path: string[];
    /** Error message */
    message: string;
    /** Error code */
    code?: string;
}

/**
 * Extended API error with validation details
 */
export interface ApiValidationError {
    /** Error code */
    code: 'VALIDATION_ERROR';
    /** Error message */
    message: string;
    /** Field-level validation errors */
    errors: ValidationErrorDetail[];
}

/**
 * Common API error codes
 */
export const API_ERROR_CODES = {
    // Authentication
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',

    // Resources
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',

    // Server
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

    // Rate limiting
    RATE_LIMITED: 'RATE_LIMITED',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
