/**
 * MachineType entity (catalog/template)
 * @module types/entities/machine-type
 * @see PRD §7.1 - machine_types table
 * @requirement P2-ENT-010
 */

import type { MachineCategory } from '../enums';

// ============================================================================
// MachineType Entity
// ============================================================================

/**
 * MachineType - Machine catalog/template entry
 * Defines default values for machine instances
 */
export interface MachineType {
    /** Unique identifier (UUID) */
    id: string;

    /** Machine type name (e.g., "Barudan 12-Head") */
    name: string;

    /** Machine category */
    category: MachineCategory;

    /** Default operating speed */
    defaultSpeed: number;

    /** Default efficiency factor (0.0 - 1.0) */
    defaultEfficiency: number;

    /** Technical specifications template */
    specifications?: Record<string, unknown>;

    /** Whether this type is active in the catalog */
    isActive: boolean;
}

// ============================================================================
// Embroidery Machine Type
// ============================================================================

/**
 * Embroidery machine type specifications
 */
export interface EmbroideryMachineTypeSpecs {
    /** Manufacturer/brand */
    manufacturer: string;
    /** Number of heads available */
    headCount: number;
    /** Maximum speed in SPM */
    maxSpm: number;
    /** Minimum speed in SPM */
    minSpm: number;
    /** Maximum thread colors */
    maxColors: number;
    /** Hoop sizes supported */
    hoopSizes?: string[];
}

/**
 * Embroidery machine type with required specifications
 */
export interface EmbroideryMachineType extends Omit<MachineType, 'category' | 'specifications'> {
    category: 'embroidery';
    specifications: EmbroideryMachineTypeSpecs;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create machine type input
 */
export interface CreateMachineTypeInput {
    name: string;
    category: MachineCategory;
    defaultSpeed: number;
    defaultEfficiency: number;
    specifications?: Record<string, unknown>;
}

/**
 * Update machine type input
 */
export interface UpdateMachineTypeInput {
    name?: string;
    defaultSpeed?: number;
    defaultEfficiency?: number;
    specifications?: Record<string, unknown>;
    isActive?: boolean;
}

// ============================================================================
// Reference Data
// ============================================================================

/**
 * Machine reference from PRD Appendix B
 */
export interface MachineReference {
    name: string;
    category: MachineCategory;
    typicalSpeed: number;
    heads?: number;
}

/**
 * Standard machine references from PRD
 */
export const MACHINE_REFERENCES: MachineReference[] = [
    { name: 'Single Needle Lockstitch', category: 'sewing', typicalSpeed: 5000 },
    { name: 'Overlock', category: 'sewing', typicalSpeed: 7000 },
    { name: 'Barudan', category: 'embroidery', typicalSpeed: 1000, heads: 12 },
    { name: 'SWF', category: 'embroidery', typicalSpeed: 975, heads: 10 },
    { name: 'Brother', category: 'embroidery', typicalSpeed: 1050, heads: 9 },
];
