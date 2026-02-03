/**
 * FloorLayout entity
 * @module types/entities/floor-layout
 * @see PRD §7.1 - floor_layouts table, §3.2, §5.2
 * @requirement P2-ENT-003
 */

import type {
    ValidationStatus,
    LayoutStatus,
    ProductType,
    DepartmentType,
    ValidationSeverity
} from '../enums';

// ============================================================================
// Department Types
// ============================================================================

/**
 * Position on the floor canvas
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * Size dimensions
 */
export interface Dimensions {
    width: number;
    height: number;
}

/**
 * Department block in the layout
 * @see PRD §5.2
 */
export interface Department {
    /** Unique identifier within layout */
    id: string;

    /** Department type */
    type: DepartmentType;

    /** Display name */
    name: string;

    /** Position on canvas (grid units) */
    position: Position;

    /** Size of department (grid units) */
    size: Dimensions;

    /** Calculated area in m² */
    area: number;

    /** Floor number (1-indexed) */
    floor: number;

    /** Color for display */
    color: string;

    /** Icon identifier */
    icon: string;

    /** Whether department is locked */
    isLocked?: boolean;
}

/**
 * Department colors from PRD §5.2
 */
export const DEPARTMENT_COLORS: Record<DepartmentType, string> = {
    warehouse: '#FBBF24',    // Yellow
    cutting: '#F97316',       // Orange
    sewing: '#3B82F6',        // Blue
    embroidery: '#A855F7',    // Purple
    finishing: '#22C55E',     // Green
    packing: '#14B8A6',       // Teal
    utilities: '#6B7280',     // Gray
};

/**
 * Department icons from PRD §5.2
 */
export const DEPARTMENT_ICONS: Record<DepartmentType, string> = {
    warehouse: '📦',
    cutting: '✂️',
    sewing: '🧵',
    embroidery: '🎨',
    finishing: '✅',
    packing: '📤',
    utilities: '⚡',
};

// ============================================================================
// Flow Path Types
// ============================================================================

/**
 * Material flow path between departments
 */
export interface FlowPath {
    /** Unique identifier */
    id: string;

    /** Source department ID */
    fromDepartmentId: string;

    /** Target department ID */
    toDepartmentId: string;

    /** Path type */
    type: 'primary' | 'secondary';

    /** Distance in grid units */
    distance?: number;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Bottleneck detection result
 * @see PRD §3.2.6, §6.2
 */
export interface BottleneckWarning {
    /** Rule that triggered this warning */
    ruleId: string;

    /** Severity */
    severity: ValidationSeverity;

    /** Affected department */
    departmentId: string;

    /** Warning message */
    message: string;

    /** Suggested action */
    suggestion?: string;
}

/**
 * Layout validation result
 */
export interface LayoutValidation {
    /** Overall status */
    status: ValidationStatus;

    /** Flow efficiency score (0.0 - 1.0) */
    flowEfficiency: number;

    /** Adjacency score (0.0 - 1.0) */
    adjacencyScore: number;

    /** Bottleneck warnings */
    bottlenecks: BottleneckWarning[];

    /** Overlapping departments */
    overlaps: string[][];
}

// ============================================================================
// Parameters Types
// ============================================================================

/**
 * Floor layout input parameters
 * @see PRD §3.2.2
 */
export interface FloorLayoutParameters {
    /** Total number of operators */
    operators: number;

    /** Product type */
    productType: ProductType;

    /** Working hours per day */
    workingHoursPerDay: number;

    /** Number of floors */
    floors: number;

    /** Dimensions per floor */
    floorDimensions: Dimensions;

    /** Grid cell size in meters */
    gridCellSize: number;
}

/**
 * Space modifiers by product type
 * @see PRD §3.2.3
 */
export const PRODUCT_TYPE_MODIFIERS: Record<ProductType, number> = {
    innerwear: 0.85,
    outerwear: 1.15,
    casual: 1.0,
    wash_casual: 1.25,
    sportswear: 1.1,
};

// ============================================================================
// Layout Data Types
// ============================================================================

/**
 * Complete layout data structure
 */
export interface FloorLayoutData {
    /** All department blocks */
    departments: Department[];

    /** Material flow paths */
    flowPaths: FlowPath[];

    /** Canvas grid dimensions */
    gridSize: Dimensions;

    /** Zoom level */
    zoom: number;

    /** Pan offset */
    panOffset: Position;
}

// ============================================================================
// FloorLayout Entity
// ============================================================================

/**
 * FloorLayout - Factory floor layout configuration
 */
export interface FloorLayout {
    /** Unique identifier (UUID) */
    id: string;

    /** Parent project */
    projectId: string;

    /** Layout display name */
    name?: string;

    /** Input parameters */
    parameters: FloorLayoutParameters;

    /** Layout configuration data */
    layoutData: FloorLayoutData;

    /** Validation status */
    validationStatus: ValidationStatus;

    /** Full validation results */
    validation?: LayoutValidation;

    /** Editing state */
    status: LayoutStatus;

    /** Thumbnail image (base64 or URL) */
    thumbnail?: string;

    /** Creation timestamp */
    createdAt: Date;

    /** Last update timestamp */
    updatedAt?: Date;
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Create floor layout input
 */
export interface CreateFloorLayoutInput {
    projectId: string;
    name?: string;
    parameters: FloorLayoutParameters;
}

/**
 * Update floor layout input
 */
export interface UpdateFloorLayoutInput {
    name?: string;
    parameters?: Partial<FloorLayoutParameters>;
    layoutData?: Partial<FloorLayoutData>;
}

/**
 * Export layout options
 */
export interface ExportLayoutOptions {
    format: 'png' | 'pdf';
    includeLabels: boolean;
    includeFlowPaths: boolean;
    scale: number;
}
