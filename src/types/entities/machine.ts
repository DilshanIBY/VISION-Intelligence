/**
 * Machine entity (runtime instance)
 * @module types/entities/machine
 * @see PRD §7.1, §3.1
 * @requirement P2-ENT-001
 */

import type { MachineCategory } from '../enums';

// ============================================================================
// Specifications Types
// ============================================================================

/**
 * Machine technical specifications
 */
export interface MachineSpecifications {
    /** Manufacturer/brand */
    manufacturer?: string;
    /** Model number */
    model?: string;
    /** Max stitches per minute (embroidery) */
    maxSpm?: number;
    /** Min stitches per minute (embroidery) */
    minSpm?: number;
    /** Number of needle heads (embroidery) */
    needleHeads?: number;
    /** Max thread colors (embroidery) */
    maxColors?: number;
    /** Power consumption in watts */
    powerConsumption?: number;
    /** Floor space required in m² */
    footprint?: number;
    /** Additional custom specs */
    custom?: Record<string, unknown>;
}

// ============================================================================
// Machine Entity
// ============================================================================

/**
 * Machine - Runtime machine instance in calculations
 * Represents a specific machine being used in a calculation
 */
export interface Machine {
    /** Unique identifier (UUID) */
    id: string;

    /** Reference to machine type template */
    typeId: string;

    /** Machine display name */
    name: string;

    /** Machine category */
    category: MachineCategory;

    /** Operating speed (SPM for embroidery, units/hour for others) */
    speed: number;

    /** Efficiency factor (0.0 - 1.0) */
    efficiency: number;

    /** Number of heads (embroidery machines) */
    headCount?: number;

    /** Technical specifications */
    specifications?: MachineSpecifications;
}

// ============================================================================
// Embroidery-Specific Types
// ============================================================================

/**
 * Embroidery machine with required head count
 */
export interface EmbroideryMachine extends Omit<Machine, 'category' | 'headCount' | 'specifications'> {
    category: 'embroidery';
    headCount: number;
    specifications: MachineSpecifications & {
        maxSpm: number;
        minSpm: number;
        needleHeads: number;
        maxColors: number;
    };
}

/**
 * Type guard to check if machine is embroidery type
 */
export function isEmbroideryMachine(machine: Machine): machine is EmbroideryMachine {
    return machine.category === 'embroidery' && machine.headCount !== undefined;
}
