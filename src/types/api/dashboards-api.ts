/**
 * Dashboards API contracts
 * @module types/api/dashboards-api
 * @see PRD §8.1
 * @requirement P2-API-004
 */

import type { ApiResponse, PaginatedResponse, ListQueryParams } from './common';

import type { Dashboard, CreateDashboardInput, UpdateDashboardInput } from '../entities/dashboard';

import type { DashboardWidget } from '../entities/dashboard-widget';

// ============================================================================
// GET /api/dashboards
// ============================================================================

/**
 * Query parameters for listing dashboards
 */
export interface ListDashboardsQuery extends ListQueryParams {
  /** Filter by project ID (null for global) */
  projectId?: string | null;
  /** Filter by template status */
  isTemplate?: boolean;
}

/**
 * Response for listing dashboards
 */
export type ListDashboardsResponse = PaginatedResponse<Dashboard>;

// ============================================================================
// POST /api/dashboards
// ============================================================================

/**
 * Request body for POST /api/dashboards
 */
export type CreateDashboardRequest = CreateDashboardInput;

/**
 * Response for dashboard creation
 */
export interface CreateDashboardResponse {
  /** Created dashboard */
  dashboard: Dashboard;
}

/**
 * Wrapped API response
 */
export type CreateDashboardApiResponse = ApiResponse<CreateDashboardResponse>;

// ============================================================================
// GET /api/dashboards/:id
// ============================================================================

/**
 * Path parameters for getting dashboard
 */
export interface GetDashboardParams {
  /** Dashboard ID */
  id: string;
}

/**
 * Full dashboard with widgets
 */
export interface DashboardWithWidgets extends Dashboard {
  /** Dashboard widgets */
  widgets: DashboardWidget[];
}

/**
 * Response for getting a single dashboard
 */
export type GetDashboardResponse = ApiResponse<DashboardWithWidgets>;

// ============================================================================
// PUT /api/dashboards/:id
// ============================================================================

/**
 * Path parameters for updating dashboard
 */
export interface UpdateDashboardParams {
  /** Dashboard ID */
  id: string;
}

/**
 * Request body for PUT /api/dashboards/:id
 */
export type UpdateDashboardRequest = UpdateDashboardInput;

/**
 * Response for dashboard update
 */
export interface UpdateDashboardResponse {
  /** Updated dashboard */
  dashboard: Dashboard;
}

/**
 * Wrapped API response
 */
export type UpdateDashboardApiResponse = ApiResponse<UpdateDashboardResponse>;

// ============================================================================
// DELETE /api/dashboards/:id
// ============================================================================

/**
 * Path parameters for deleting dashboard
 */
export interface DeleteDashboardParams {
  /** Dashboard ID */
  id: string;
}

/**
 * Response for dashboard deletion
 */
export interface DeleteDashboardResponse {
  /** Deleted dashboard ID */
  deletedId: string;
}

/**
 * Wrapped API response
 */
export type DeleteDashboardApiResponse = ApiResponse<DeleteDashboardResponse>;

// ============================================================================
// POST /api/dashboards/:id/duplicate
// ============================================================================

/**
 * Path parameters for duplicating dashboard
 */
export interface DuplicateDashboardParams {
  /** Source dashboard ID */
  id: string;
}

/**
 * Request body for POST /api/dashboards/:id/duplicate
 */
export interface DuplicateDashboardRequest {
  /** New dashboard name */
  name: string;
  /** Target project (optional) */
  projectId?: string;
}

/**
 * Response for dashboard duplication
 */
export interface DuplicateDashboardResponse {
  /** Newly created dashboard copy */
  dashboard: DashboardWithWidgets;
  /** Source dashboard ID */
  sourceId: string;
}

/**
 * Wrapped API response
 */
export type DuplicateDashboardApiResponse = ApiResponse<DuplicateDashboardResponse>;
