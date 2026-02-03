/**
 * Floor Layouts API contracts
 * @module types/api/floor-layouts-api
 * @see PRD §8.1
 * @requirement P2-API-003
 */

import type { ApiResponse, PaginatedResponse, ListQueryParams } from './common';

import type {
  FloorLayout,
  LayoutValidation,
  CreateFloorLayoutInput,
  UpdateFloorLayoutInput,
  ExportLayoutOptions,
} from '../entities/floor-layout';

import type { ValidationStatus } from '../enums';

// ============================================================================
// POST /api/layouts
// ============================================================================

/**
 * Request body for POST /api/layouts
 */
export type CreateFloorLayoutRequest = CreateFloorLayoutInput;

/**
 * Response for layout creation
 */
export interface CreateFloorLayoutResponse {
  /** Created layout */
  layout: FloorLayout;
}

/**
 * Wrapped API response
 */
export type CreateFloorLayoutApiResponse = ApiResponse<CreateFloorLayoutResponse>;

// ============================================================================
// GET /api/layouts/:id
// ============================================================================

/**
 * Path parameters for getting layout
 */
export interface GetFloorLayoutParams {
  /** Layout ID */
  id: string;
}

/**
 * Response for getting a single layout
 */
export type GetFloorLayoutResponse = ApiResponse<FloorLayout>;

// ============================================================================
// PUT /api/layouts/:id
// ============================================================================

/**
 * Path parameters for updating layout
 */
export interface UpdateFloorLayoutParams {
  /** Layout ID */
  id: string;
}

/**
 * Request body for PUT /api/layouts/:id
 */
export type UpdateFloorLayoutRequest = UpdateFloorLayoutInput;

/**
 * Response for layout update
 */
export interface UpdateFloorLayoutResponse {
  /** Updated layout */
  layout: FloorLayout;
}

/**
 * Wrapped API response
 */
export type UpdateFloorLayoutApiResponse = ApiResponse<UpdateFloorLayoutResponse>;

// ============================================================================
// DELETE /api/layouts/:id
// ============================================================================

/**
 * Path parameters for deleting layout
 */
export interface DeleteFloorLayoutParams {
  /** Layout ID */
  id: string;
}

/**
 * Response for layout deletion
 */
export interface DeleteFloorLayoutResponse {
  /** Deleted layout ID */
  deletedId: string;
}

/**
 * Wrapped API response
 */
export type DeleteFloorLayoutApiResponse = ApiResponse<DeleteFloorLayoutResponse>;

// ============================================================================
// POST /api/layouts/:id/validate
// ============================================================================

/**
 * Path parameters for validating layout
 */
export interface ValidateFloorLayoutParams {
  /** Layout ID */
  id: string;
}

/**
 * Response for layout validation
 */
export interface ValidateFloorLayoutResponse {
  /** Validation results */
  validation: LayoutValidation;
  /** Updated layout with validation status */
  layout: FloorLayout;
}

/**
 * Wrapped API response
 */
export type ValidateFloorLayoutApiResponse = ApiResponse<ValidateFloorLayoutResponse>;

// ============================================================================
// POST /api/layouts/:id/export
// ============================================================================

/**
 * Path parameters for exporting layout
 */
export interface ExportFloorLayoutParams {
  /** Layout ID */
  id: string;
}

/**
 * Request body for POST /api/layouts/:id/export
 */
export type ExportFloorLayoutRequest = ExportLayoutOptions;

/**
 * Response for layout export
 */
export interface ExportFloorLayoutResponse {
  /** Export file URL or base64 data */
  exportUrl?: string;
  exportData?: string;
  /** Export format */
  format: 'png' | 'pdf';
  /** File size in bytes */
  size: number;
  /** Export timestamp */
  exportedAt: string;
}

/**
 * Wrapped API response
 */
export type ExportFloorLayoutApiResponse = ApiResponse<ExportFloorLayoutResponse>;

// ============================================================================
// GET /api/layouts (List)
// ============================================================================

/**
 * Query parameters for listing layouts
 */
export interface ListFloorLayoutsQuery extends ListQueryParams {
  /** Filter by project ID */
  projectId?: string;
  /** Filter by validation status */
  validationStatus?: ValidationStatus;
}

/**
 * Response for listing layouts
 */
export type ListFloorLayoutsResponse = PaginatedResponse<FloorLayout>;
