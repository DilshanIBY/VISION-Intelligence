/**
 * Floor Layout input validation schemas
 * @module types/validation/floor-layout-schemas
 * @see PRD §6.1, §3.2.2
 * @requirement P2-VAL-003
 */

import { z } from 'zod';
import {
    uuidSchema,
    positiveIntSchema,
    positiveNumberSchema,
    workingHoursSchema,
    nonEmptyStringSchema
} from './common-schemas';

// ============================================================================
// PRD §6.1 Floor Layout Validation Limits
// ============================================================================

/**
 * Floor layout validation limits from PRD §6.1
 */
export const FLOOR_LAYOUT_LIMITS = {
    /** Operators: 1-10000 */
    OPERATORS_MIN: 1,
    OPERATORS_MAX: 10000,

    /** Building floors: 1-10 */
    FLOORS_MIN: 1,
    FLOORS_MAX: 10,

    /** Grid cell size: 0.5-5 meters */
    GRID_CELL_SIZE_MIN: 0.5,
    GRID_CELL_SIZE_MAX: 5,
} as const;

// ============================================================================
// Product Type Schema
// ============================================================================

/**
 * Product type enum schema
 * @see PRD §3.2.3
 */
export const productTypeSchema = z.enum([
    'innerwear',
    'outerwear',
    'casual',
    'wash_casual',
    'sportswear'
]);

/**
 * Department type enum schema
 * @see PRD §5.2
 */
export const departmentTypeSchema = z.enum([
    'warehouse',
    'cutting',
    'sewing',
    'embroidery',
    'finishing',
    'packing',
    'utilities'
]);

// ============================================================================
// Dimension Schemas
// ============================================================================

/**
 * Floor dimensions schema
 */
export const dimensionsSchema = z.object({
    width: positiveNumberSchema.describe('Width in meters'),
    height: positiveNumberSchema.describe('Height/length in meters'),
});

/**
 * Position on canvas schema
 */
export const positionSchema = z.object({
    x: z.number().nonnegative('X position must be non-negative'),
    y: z.number().nonnegative('Y position must be non-negative'),
});

// ============================================================================
// Floor Layout Input Validation
// @requirement P2-VAL-003
// ============================================================================

/**
 * Floor layout parameters schema
 * @see PRD §3.2.2, §6.1
 */
export const floorLayoutParametersSchema = z.object({
    /** Total number of operators (1-10000) */
    operators: z.number()
        .int('Operators must be a whole number')
        .min(FLOOR_LAYOUT_LIMITS.OPERATORS_MIN, 'At least 1 operator required')
        .max(FLOOR_LAYOUT_LIMITS.OPERATORS_MAX, 'Operators must be 1-10,000'),

    /** Product type */
    productType: productTypeSchema,

    /** Working hours per day (0.5-24) */
    workingHoursPerDay: workingHoursSchema,

    /** Number of building floors (1-10) */
    floors: z.number()
        .int('Floors must be a whole number')
        .min(FLOOR_LAYOUT_LIMITS.FLOORS_MIN, 'At least 1 floor required')
        .max(FLOOR_LAYOUT_LIMITS.FLOORS_MAX, 'Maximum 10 floors supported'),

    /** Floor dimensions in meters */
    floorDimensions: dimensionsSchema,

    /** Grid cell size in meters (0.5-5) */
    gridCellSize: z.number()
        .min(FLOOR_LAYOUT_LIMITS.GRID_CELL_SIZE_MIN, 'Grid cell size must be at least 0.5m')
        .max(FLOOR_LAYOUT_LIMITS.GRID_CELL_SIZE_MAX, 'Grid cell size must be at most 5m')
        .default(1),
});

/**
 * Validation error messages for floor layout inputs
 */
export const FLOOR_LAYOUT_ERROR_MESSAGES = {
    operators: 'Operators must be 1-10,000',
    floorArea: 'Floor area must be positive',
    floors: 'Building floors must be 1-10',
} as const;

// ============================================================================
// Department Block Validation
// ============================================================================

/**
 * Department block schema
 */
export const departmentSchema = z.object({
    /** Department identifier (unique within layout) */
    id: z.string().min(1),

    /** Department type */
    type: departmentTypeSchema,

    /** Display name */
    name: nonEmptyStringSchema,

    /** Position on canvas grid */
    position: positionSchema,

    /** Size in grid units */
    size: dimensionsSchema,

    /** Calculated area in m² */
    area: positiveNumberSchema,

    /** Floor number (1-indexed) */
    floor: positiveIntSchema,

    /** Display color (hex) */
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),

    /** Icon identifier */
    icon: z.string(),

    /** Whether department is locked for editing */
    isLocked: z.boolean().optional().default(false),
});

/**
 * Flow path schema
 */
export const flowPathSchema = z.object({
    /** Flow path identifier */
    id: z.string().min(1),

    /** Source department ID */
    fromDepartmentId: z.string().min(1),

    /** Target department ID */
    toDepartmentId: z.string().min(1),

    /** Path type */
    type: z.enum(['primary', 'secondary']),

    /** Distance in grid units (optional) */
    distance: z.number().nonnegative().optional(),
});

/**
 * Complete layout data schema
 */
export const floorLayoutDataSchema = z.object({
    /** All department blocks */
    departments: z.array(departmentSchema),

    /** Material flow paths */
    flowPaths: z.array(flowPathSchema),

    /** Canvas grid dimensions */
    gridSize: dimensionsSchema,

    /** Current zoom level */
    zoom: z.number().min(0.1).max(10).default(1),

    /** Pan offset */
    panOffset: positionSchema.default({ x: 0, y: 0 }),
});

// ============================================================================
// Create/Update Floor Layout Request Schemas
// ============================================================================

/**
 * Create floor layout request schema
 */
export const createFloorLayoutSchema = z.object({
    projectId: uuidSchema,
    name: z.string().max(100).optional(),
    parameters: floorLayoutParametersSchema,
});

/**
 * Update floor layout request schema
 */
export const updateFloorLayoutSchema = z.object({
    name: z.string().max(100).optional(),
    parameters: floorLayoutParametersSchema.partial().optional(),
    layoutData: floorLayoutDataSchema.partial().optional(),
});

/**
 * Export layout options schema
 */
export const exportLayoutOptionsSchema = z.object({
    format: z.enum(['png', 'pdf']),
    includeLabels: z.boolean().default(true),
    includeFlowPaths: z.boolean().default(true),
    scale: z.number().min(0.5).max(4).default(1),
});

// ============================================================================
// Business Rule Validation Helpers
// ============================================================================

/**
 * Validate department overlap
 * Returns list of overlapping department ID pairs
 */
export function validateDepartmentOverlaps(
    departments: Array<{ id: string; position: { x: number; y: number }; size: { width: number; height: number } }>
): string[][] {
    const overlaps: string[][] = [];

    for (let i = 0; i < departments.length; i++) {
        for (let j = i + 1; j < departments.length; j++) {
            const a = departments[i];
            const b = departments[j];

            const aRight = a.position.x + a.size.width;
            const aBottom = a.position.y + a.size.height;
            const bRight = b.position.x + b.size.width;
            const bBottom = b.position.y + b.size.height;

            // Check for overlap
            if (!(aRight <= b.position.x || a.position.x >= bRight ||
                aBottom <= b.position.y || a.position.y >= bBottom)) {
                overlaps.push([a.id, b.id]);
            }
        }
    }

    return overlaps;
}

// ============================================================================
// Type Exports
// ============================================================================

// Note: ProductType and DepartmentType are exported from enums.ts
// The following types are derived from Zod schemas
export type FloorLayoutParametersSchema = z.infer<typeof floorLayoutParametersSchema>;
export type DepartmentSchema = z.infer<typeof departmentSchema>;
export type FlowPathSchema = z.infer<typeof flowPathSchema>;
export type FloorLayoutDataSchema = z.infer<typeof floorLayoutDataSchema>;
export type CreateFloorLayoutSchema = z.infer<typeof createFloorLayoutSchema>;
export type UpdateFloorLayoutSchema = z.infer<typeof updateFloorLayoutSchema>;
export type ExportLayoutOptionsSchema = z.infer<typeof exportLayoutOptionsSchema>;
