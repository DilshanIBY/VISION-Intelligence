/**
 * Project entity
 * @module types/entities/project
 * @see PRD §7.1 - projects table
 * @requirement P2-ENT-006
 */

import type { ProjectStatus } from '../enums';

// ============================================================================
// Metadata Types
// ============================================================================

/**
 * Project metadata for additional context
 */
export interface ProjectMetadata {
  /** Industry segment */
  industry?: string;
  /** Target production capacity */
  targetCapacity?: number;
  /** Project location/region */
  location?: string;
  /** Custom tags for organization */
  tags?: string[];
  /** Notes or description */
  notes?: string;
}

// ============================================================================
// Project Entity
// ============================================================================

/**
 * Project - Container for calculations and layouts
 * Represents a client engagement or factory planning project
 */
export interface Project {
  /** Unique identifier (UUID) */
  id: string;

  /** Parent organization */
  organizationId: string;

  /** Project name */
  name: string;

  /** Client company name */
  clientName?: string;

  /** Current project status */
  status: ProjectStatus;

  /** Additional project metadata */
  metadata?: ProjectMetadata;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt?: Date;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create project input
 */
export interface CreateProjectInput {
  name: string;
  clientName?: string;
  status?: ProjectStatus;
  metadata?: ProjectMetadata;
}

/**
 * Update project input
 */
export interface UpdateProjectInput {
  name?: string;
  clientName?: string;
  status?: ProjectStatus;
  metadata?: Partial<ProjectMetadata>;
}

/**
 * Project with computed statistics
 */
export interface ProjectWithStats extends Project {
  /** Number of calculations */
  calculationCount: number;
  /** Number of floor layouts */
  layoutCount: number;
  /** Number of dashboards */
  dashboardCount: number;
}
