/**
 * Projects API contracts
 * @module types/api/projects-api
 * @see PRD §8.1 (implied)
 * @requirement P2-API-005
 */

import type {
    ApiResponse,
    PaginatedResponse,
    ListQueryParams
} from './common';

import type {
    Project,
    ProjectWithStats,
    CreateProjectInput,
    UpdateProjectInput
} from '../entities/project';

import type { ProjectStatus } from '../enums';

// ============================================================================
// GET /api/projects
// ============================================================================

/**
 * Query parameters for listing projects
 */
export interface ListProjectsQuery extends ListQueryParams {
    /** Filter by status */
    status?: ProjectStatus;
    /** Filter by client name */
    clientName?: string;
    /** Include statistics */
    includeStats?: boolean;
}

/**
 * Response for listing projects
 */
export type ListProjectsResponse = PaginatedResponse<Project>;

/**
 * Response for listing projects with stats
 */
export type ListProjectsWithStatsResponse = PaginatedResponse<ProjectWithStats>;

// ============================================================================
// POST /api/projects
// ============================================================================

/**
 * Request body for POST /api/projects
 */
export type CreateProjectRequest = CreateProjectInput;

/**
 * Response for project creation
 */
export interface CreateProjectResponse {
    /** Created project */
    project: Project;
}

/**
 * Wrapped API response
 */
export type CreateProjectApiResponse = ApiResponse<CreateProjectResponse>;

// ============================================================================
// GET /api/projects/:id
// ============================================================================

/**
 * Path parameters for getting project
 */
export interface GetProjectParams {
    /** Project ID */
    id: string;
}

/**
 * Query parameters for getting project
 */
export interface GetProjectQuery {
    /** Include statistics */
    includeStats?: boolean;
}

/**
 * Response for getting a single project
 */
export type GetProjectResponse = ApiResponse<Project>;

/**
 * Response for getting a project with stats
 */
export type GetProjectWithStatsResponse = ApiResponse<ProjectWithStats>;

// ============================================================================
// PUT /api/projects/:id
// ============================================================================

/**
 * Path parameters for updating project
 */
export interface UpdateProjectParams {
    /** Project ID */
    id: string;
}

/**
 * Request body for PUT /api/projects/:id
 */
export type UpdateProjectRequest = UpdateProjectInput;

/**
 * Response for project update
 */
export interface UpdateProjectResponse {
    /** Updated project */
    project: Project;
}

/**
 * Wrapped API response
 */
export type UpdateProjectApiResponse = ApiResponse<UpdateProjectResponse>;

// ============================================================================
// DELETE /api/projects/:id
// ============================================================================

/**
 * Path parameters for deleting project
 */
export interface DeleteProjectParams {
    /** Project ID */
    id: string;
}

/**
 * Response for project deletion
 */
export interface DeleteProjectResponse {
    /** Deleted project ID */
    deletedId: string;
}

/**
 * Wrapped API response
 */
export type DeleteProjectApiResponse = ApiResponse<DeleteProjectResponse>;

// ============================================================================
// Project Status Transitions
// ============================================================================

/**
 * Request body for PATCH /api/projects/:id/status
 */
export interface UpdateProjectStatusRequest {
    /** New status */
    status: ProjectStatus;
}

/**
 * Response for status update
 */
export interface UpdateProjectStatusResponse {
    /** Updated project */
    project: Project;
    /** Previous status */
    previousStatus: ProjectStatus;
}

/**
 * Wrapped API response
 */
export type UpdateProjectStatusApiResponse = ApiResponse<UpdateProjectStatusResponse>;
