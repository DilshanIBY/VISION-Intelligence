/**
 * Project and Organization validation schemas
 * @module types/validation/project-schemas
 * @see PRD §6.1, §7.1
 * @requirement P2-VAL-004
 */

import { z } from 'zod';
import { uuidSchema, nonEmptyStringSchema, emailSchema } from './common-schemas';

// ============================================================================
// Project Status Schema
// ============================================================================

/**
 * Project status enum schema
 * @see PRD §7.1
 */
export const projectStatusSchema = z.enum(['draft', 'active', 'completed', 'archived']);

/**
 * User role enum schema
 * @see PRD §7.1
 */
export const userRoleSchema = z.enum(['admin', 'consultant', 'viewer']);

// ============================================================================
// Project Metadata Schema
// ============================================================================

/**
 * Project metadata schema
 */
export const projectMetadataSchema = z
  .object({
    /** Industry segment */
    industry: z.string().max(100).optional(),

    /** Target production capacity */
    targetCapacity: z.number().positive().optional(),

    /** Project location/region */
    location: z.string().max(200).optional(),

    /** Custom tags for organization */
    tags: z.array(z.string().max(50)).max(10).optional(),

    /** Notes or description */
    notes: z.string().max(2000).optional(),
  })
  .strict();

// ============================================================================
// Project Validation Schemas
// @requirement P2-VAL-004
// ============================================================================

/**
 * Create project request schema
 */
export const createProjectSchema = z.object({
  /** Project name (required, max 255 chars) */
  name: nonEmptyStringSchema.max(255, 'Project name must be at most 255 characters'),

  /** Client company name (optional, max 255 chars) */
  clientName: z.string().max(255, 'Client name must be at most 255 characters').optional(),

  /** Initial status (defaults to 'draft') */
  status: projectStatusSchema.optional().default('draft'),

  /** Additional metadata */
  metadata: projectMetadataSchema.optional(),
});

/**
 * Update project request schema
 */
export const updateProjectSchema = z
  .object({
    /** Project name */
    name: z.string().min(1).max(255).optional(),

    /** Client company name */
    clientName: z.string().max(255).optional().nullable(),

    /** Project status */
    status: projectStatusSchema.optional(),

    /** Metadata updates (partial) */
    metadata: projectMetadataSchema.partial().optional(),
  })
  .refine(data => Object.keys(data).length > 0, 'At least one field must be provided for update');

/**
 * Update project status request schema
 */
export const updateProjectStatusSchema = z.object({
  status: projectStatusSchema,
});

// ============================================================================
// Organization Validation Schemas
// ============================================================================

/**
 * Organization settings schema
 */
export const organizationSettingsSchema = z
  .object({
    /** Default theme preference */
    defaultTheme: z.enum(['light', 'dark', 'system']).optional(),

    /** Date format preference */
    dateFormat: z.string().max(20).optional(),

    /** Time zone */
    timezone: z.string().max(50).optional(),

    /** Default units (metric/imperial) */
    units: z.enum(['metric', 'imperial']).optional(),

    /** Feature flags */
    features: z.record(z.string(), z.boolean()).optional(),
  })
  .strict();

/**
 * Create organization request schema
 */
export const createOrganizationSchema = z.object({
  /** Organization name */
  name: nonEmptyStringSchema.max(255, 'Organization name must be at most 255 characters'),

  /** Organization settings */
  settings: organizationSettingsSchema.optional(),
});

/**
 * Update organization request schema
 */
export const updateOrganizationSchema = z
  .object({
    /** Organization name */
    name: z.string().min(1).max(255).optional(),

    /** Settings updates */
    settings: organizationSettingsSchema.partial().optional(),
  })
  .refine(data => Object.keys(data).length > 0, 'At least one field must be provided for update');

// ============================================================================
// User Validation Schemas
// ============================================================================

/**
 * User preferences schema
 */
export const userPreferencesSchema = z
  .object({
    /** Theme preference */
    theme: z.enum(['light', 'dark', 'system']).optional(),

    /** Notification settings */
    notifications: z
      .object({
        email: z.boolean().optional(),
        inApp: z.boolean().optional(),
      })
      .optional(),

    /** Default dashboard ID */
    defaultDashboardId: uuidSchema.optional(),

    /** UI density */
    density: z.enum(['compact', 'comfortable', 'spacious']).optional(),
  })
  .strict();

/**
 * Create user request schema (admin)
 */
export const createUserSchema = z.object({
  /** User email */
  email: emailSchema,

  /** User role */
  role: userRoleSchema,

  /** User preferences */
  preferences: userPreferencesSchema.optional(),
});

/**
 * Update user request schema
 */
export const updateUserSchema = z.object({
  /** User role (admin only) */
  role: userRoleSchema.optional(),

  /** User preferences */
  preferences: userPreferencesSchema.partial().optional(),
});

/**
 * Update own profile request schema
 */
export const updateProfileSchema = z.object({
  /** User preferences */
  preferences: userPreferencesSchema.partial().optional(),
});

// ============================================================================
// State Transition Validation
// ============================================================================

/**
 * Valid project status transitions
 */
export const PROJECT_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['active', 'archived'],
  active: ['completed', 'archived'],
  completed: ['archived'],
  archived: ['draft'], // Can restore from archive
} as const;

/**
 * Validate project status transition
 */
export function validateProjectStatusTransition(
  currentStatus: string,
  newStatus: string
): { valid: boolean; message?: string } {
  const allowedTransitions = PROJECT_STATUS_TRANSITIONS[currentStatus] || [];

  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      message: `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ')}`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Type Exports
// ============================================================================

// Note: ProjectStatus and UserRole are exported from enums.ts
// The following types are derived from Zod schemas
export type ProjectMetadataSchema = z.infer<typeof projectMetadataSchema>;
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
export type OrganizationSettingsSchema = z.infer<typeof organizationSettingsSchema>;
export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
export type UserPreferencesSchema = z.infer<typeof userPreferencesSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
