/**
 * Calculation input validation schemas
 * @module types/validation/calculation-schemas
 * @see PRD §6.1 Input Validation Matrix
 * @requirement P2-VAL-001, P2-VAL-002
 */

import { z } from 'zod';
import {
    uuidSchema,
    efficiencySchema,
    workingHoursSchema,
    futureDateSchema
} from './common-schemas';

// ============================================================================
// PRD §6.1 Input Validation Matrix Constants
// ============================================================================

/**
 * Validation limits from PRD §6.1
 */
export const VALIDATION_LIMITS = {
    /** Punch count: 1-50000 */
    PUNCH_COUNT_MIN: 1,
    PUNCH_COUNT_MAX: 50000,

    /** Thread colors: 1-15 */
    THREAD_COLORS_MIN: 1,
    THREAD_COLORS_MAX: 15,

    /** Head count: 1-21 */
    HEAD_COUNT_MIN: 1,
    HEAD_COUNT_MAX: 21,

    /** Machine speed SPM: 100-1200 */
    MACHINE_SPEED_MIN: 100,
    MACHINE_SPEED_MAX: 1200,

    /** Target quantity: >= 1 */
    TARGET_QUANTITY_MIN: 1,

    /** Working hours: 0.5-24 */
    WORKING_HOURS_MIN: 0.5,
    WORKING_HOURS_MAX: 24,

    /** Efficiency: 0.5-1.0 (50%-100%) */
    EFFICIENCY_MIN: 0.5,
    EFFICIENCY_MAX: 1.0,
} as const;

// ============================================================================
// Basic Machinery Calculation Validation
// @requirement P2-VAL-001
// ============================================================================

/**
 * Basic machinery calculation input schema
 * @see PRD §3.1.2, §6.1
 */
export const machineryInputSchema = z.object({
    /** Machine type reference (UUID) */
    machineTypeId: uuidSchema,

    /** Target production quantity (>= 1) */
    targetQuantity: z.number()
        .int('Quantity must be a whole number')
        .min(VALIDATION_LIMITS.TARGET_QUANTITY_MIN, 'Quantity must be at least 1'),

    /** Working hours per day (0.5-24) */
    workingHoursPerDay: workingHoursSchema,

    /** Production deadline (must be >= today) */
    deadline: futureDateSchema,

    /** Efficiency factor (0.5-1.0) */
    efficiencyFactor: efficiencySchema,
});

/**
 * Validation error messages for machinery inputs
 */
export const MACHINERY_ERROR_MESSAGES = {
    targetQuantity: 'Quantity must be at least 1',
    deadline: 'Deadline cannot be in the past',
    workingHours: 'Working hours must be 0.5-24',
    efficiency: 'Efficiency must be 50-100%',
} as const;

// ============================================================================
// Embroidery Calculation Validation
// @requirement P2-VAL-002
// ============================================================================

/**
 * Embroidery-specific calculation input schema
 * @see PRD §3.1.2, §6.1
 */
export const embroideryInputSchema = machineryInputSchema.extend({
    /** Punch/stitch count per piece (1-50000) */
    punchCount: z.number()
        .int('Punch count must be a whole number')
        .min(VALIDATION_LIMITS.PUNCH_COUNT_MIN, 'Punch count must be at least 1')
        .max(VALIDATION_LIMITS.PUNCH_COUNT_MAX, 'Punch count must be at most 50,000'),

    /** Number of thread colors (1-15) */
    threadColors: z.number()
        .int('Thread colors must be a whole number')
        .min(VALIDATION_LIMITS.THREAD_COLORS_MIN, 'At least 1 thread color required')
        .max(VALIDATION_LIMITS.THREAD_COLORS_MAX, 'Maximum 15 thread colors supported'),

    /** Machine head count (1-21) */
    headCount: z.number()
        .int('Head count must be a whole number')
        .min(VALIDATION_LIMITS.HEAD_COUNT_MIN, 'At least 1 head required')
        .max(VALIDATION_LIMITS.HEAD_COUNT_MAX, 'Head count must be 1-21'),

    /** Machine speed in SPM (100-1200) */
    machineSpeed: z.number()
        .int('Machine speed must be a whole number')
        .min(VALIDATION_LIMITS.MACHINE_SPEED_MIN, 'Machine speed must be at least 100 SPM')
        .max(VALIDATION_LIMITS.MACHINE_SPEED_MAX, 'Machine speed must be at most 1200 SPM'),
});

/**
 * Validation error messages for embroidery inputs
 */
export const EMBROIDERY_ERROR_MESSAGES = {
    ...MACHINERY_ERROR_MESSAGES,
    punchCount: 'Punch count must be between 1-50,000',
    threadColors: 'Maximum 15 thread colors supported',
    headCount: 'Head count must be 1-21',
    machineSpeed: 'Machine speed must be 100-1200 SPM',
} as const;

// ============================================================================
// Create Calculation Request Schemas
// ============================================================================

/**
 * Create machinery calculation request schema
 */
export const createMachineryCalculationSchema = z.object({
    projectId: uuidSchema,
    parameters: machineryInputSchema,
});

/**
 * Create embroidery calculation request schema
 */
export const createEmbroideryCalculationSchema = z.object({
    projectId: uuidSchema,
    parameters: embroideryInputSchema,
});

// ============================================================================
// Business Rule Validation Helpers
// ============================================================================

/**
 * Validate head count capacity rule
 * @see PRD §3.1.5, §6.2
 */
export function validateHeadCountCapacity(params: {
    headCount: number;
    machineSpeed: number;
    workingHoursPerDay: number;
    targetQuantity: number;
    availableDays: number;
}): { valid: boolean; message?: string } {
    const maxOutput = params.headCount * params.machineSpeed * params.workingHoursPerDay * 60;
    const requiredOutput = params.targetQuantity / params.availableDays;

    if (maxOutput < requiredOutput) {
        return {
            valid: false,
            message: 'Head count insufficient for target quantity within deadline',
        };
    }

    return { valid: true };
}

/**
 * Validate thread color impact
 * @see PRD §3.1.5
 */
export function validateThreadColorImpact(threadColors: number): {
    warning: boolean;
    message?: string;
} {
    if (threadColors > 8) {
        return {
            warning: true,
            message: 'High color count significantly impacts production time',
        };
    }
    return { warning: false };
}

// ============================================================================
// Type Exports
// ============================================================================

// Note: CreateMachineryCalculationInput and CreateEmbroideryCalculationInput
// already exist in entities/calculation.ts. These are Zod-derived schema types.
export type MachineryInputSchema = z.infer<typeof machineryInputSchema>;
export type EmbroideryInputSchema = z.infer<typeof embroideryInputSchema>;
export type CreateMachineryCalculationSchema = z.infer<typeof createMachineryCalculationSchema>;
export type CreateEmbroideryCalculationSchema = z.infer<typeof createEmbroideryCalculationSchema>;

