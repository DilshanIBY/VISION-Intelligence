/**
 * Common API types used across all endpoints
 * @module types/api/common
 * @see PRD §8
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    /** Whether the request was successful */
    success: boolean;
    /** Response data (present on success) */
    data?: T;
    /** Error information (present on failure) */
    error?: ApiError;
    /** Response metadata */
    meta?: ResponseMeta;
}

/**
 * API error structure
 */
export interface ApiError {
    /** Error code for programmatic handling */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Detailed validation errors by field */
    details?: Record<string, string[]>;
    /** Stack trace (development only) */
    stack?: string;
}

/**
 * Response metadata
 */
export interface ResponseMeta {
    /** Request timestamp */
    timestamp: string;
    /** Request duration in ms */
    duration?: number;
    /** API version */
    version?: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination query parameters
 */
export interface PaginationParams {
    /** Page number (1-indexed) */
    page?: number;
    /** Items per page */
    limit?: number;
    /** Cursor for cursor-based pagination */
    cursor?: string;
}

/**
 * Pagination metadata in response
 */
export interface PaginationMeta {
    /** Current page number */
    page: number;
    /** Items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether there's a next page */
    hasNextPage: boolean;
    /** Whether there's a previous page */
    hasPreviousPage: boolean;
    /** Next page cursor (for cursor-based) */
    nextCursor?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    /** Whether the request was successful */
    success: boolean;
    /** Array of items */
    data: T[];
    /** Pagination metadata */
    pagination: PaginationMeta;
    /** Error information (present on failure) */
    error?: ApiError;
}

// ============================================================================
// Sorting & Filtering Types
// ============================================================================

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameters
 */
export interface SortParams {
    /** Field to sort by */
    sortBy?: string;
    /** Sort direction */
    sortDirection?: SortDirection;
}

/**
 * Filter operator for complex queries
 */
export type FilterOperator =
    | 'eq'      // equals
    | 'neq'     // not equals
    | 'gt'      // greater than
    | 'gte'     // greater than or equal
    | 'lt'      // less than
    | 'lte'     // less than or equal
    | 'in'      // in array
    | 'contains' // string contains
    | 'startsWith'
    | 'endsWith';

/**
 * Filter condition
 */
export interface FilterCondition {
    /** Field name */
    field: string;
    /** Filter operator */
    operator: FilterOperator;
    /** Filter value */
    value: unknown;
}

// ============================================================================
// Query Parameters Types
// ============================================================================

/**
 * Combined query parameters for list endpoints
 */
export interface ListQueryParams extends PaginationParams, SortParams {
    /** Search query string */
    search?: string;
    /** Filter conditions */
    filters?: FilterCondition[];
}

// ============================================================================
// HTTP Types
// ============================================================================

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Common HTTP status codes
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];
