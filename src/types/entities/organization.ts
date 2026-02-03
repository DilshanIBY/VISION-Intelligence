/**
 * Organization entity
 * @module types/entities/organization
 * @see PRD §7.1 - organizations table
 * @requirement P2-ENT-007
 */

// ============================================================================
// Settings Types
// ============================================================================

/**
 * Organization-level settings
 */
export interface OrganizationSettings {
    /** Default currency for cost calculations */
    currency?: string;
    /** Default timezone */
    timezone?: string;
    /** Custom branding colors */
    branding?: {
        primaryColor?: string;
        logoUrl?: string;
    };
    /** Feature flags */
    features?: Record<string, boolean>;
}

// ============================================================================
// Organization Entity
// ============================================================================

/**
 * Organization - Top level entity for multi-tenancy
 * Represents a consulting firm or manufacturing company
 */
export interface Organization {
    /** Unique identifier (UUID) */
    id: string;

    /** Organization display name */
    name: string;

    /** Creation timestamp */
    createdAt: Date;

    /** Organization-level settings */
    settings: OrganizationSettings;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create organization input
 */
export interface CreateOrganizationInput {
    name: string;
    settings?: Partial<OrganizationSettings>;
}

/**
 * Update organization input
 */
export interface UpdateOrganizationInput {
    name?: string;
    settings?: Partial<OrganizationSettings>;
}
