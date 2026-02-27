/**
 * Floor Layout Calculator Mock Data
 * Mock data for Phase 3 UI prototype - no real API calls
 * @requirement P3-PG-FLOOR-001 to P3-PG-FLOOR-019
 */

// =====================================================
// Product Types
// =====================================================

export interface ProductType {
  id: string;
  code: string;
  name: string;
  description: string;
  spaceModifier: number;
  departments: string[];
  icon: string;
}

export const productTypes: ProductType[] = [
  {
    id: 'pt-iw',
    code: 'IW',
    name: 'Innerwear',
    description: 'Basic undergarments, lingerie',
    spaceModifier: 0.85,
    departments: ['warehouse', 'cutting', 'sewing', 'finishing', 'packing', 'utilities'],
    icon: '👔',
  },
  {
    id: 'pt-ow',
    code: 'OW',
    name: 'Outerwear',
    description: 'Jackets, coats, heavy garments',
    spaceModifier: 1.15,
    departments: [
      'warehouse',
      'cutting',
      'sewing',
      'embroidery',
      'finishing',
      'packing',
      'utilities',
    ],
    icon: '🧥',
  },
  {
    id: 'pt-cs',
    code: 'CS',
    name: 'Casual',
    description: 'T-shirts, casual wear',
    spaceModifier: 1.0,
    departments: ['warehouse', 'cutting', 'sewing', 'finishing', 'packing', 'utilities'],
    icon: '👕',
  },
  {
    id: 'pt-wc',
    code: 'WC',
    name: 'Wash & Casual',
    description: 'Denim, washed garments',
    spaceModifier: 1.25,
    departments: ['warehouse', 'cutting', 'sewing', 'washing', 'finishing', 'packing', 'utilities'],
    icon: '👖',
  },
  {
    id: 'pt-sw',
    code: 'SW',
    name: 'Sportswear',
    description: 'Athletic wear, performance',
    spaceModifier: 1.1,
    departments: [
      'warehouse',
      'cutting',
      'sewing',
      'sublimation',
      'finishing',
      'packing',
      'utilities',
    ],
    icon: '🎽',
  },
];

// =====================================================
// Department Types
// =====================================================

export interface DepartmentType {
  id: string;
  name: string;
  icon: string;
  color: string;
  baseFormula: string;
  minArea: number;
  description: string;
}

export const departmentTypes: DepartmentType[] = [
  {
    id: 'warehouse',
    name: 'Warehouse',
    icon: '📦',
    color: '#F59E0B',
    baseFormula: 'operators × 0.8 m²',
    minArea: 100,
    description: 'Raw materials and finished goods storage',
  },
  {
    id: 'cutting',
    name: 'Cutting',
    icon: '✂️',
    color: '#F97316',
    baseFormula: 'sewing_area × 0.25',
    minArea: 50,
    description: 'Fabric cutting and preparation',
  },
  {
    id: 'sewing',
    name: 'Sewing',
    icon: '🧵',
    color: '#3B82F6',
    baseFormula: 'operators × 6 m²',
    minArea: 200,
    description: 'Main garment assembly lines',
  },
  {
    id: 'embroidery',
    name: 'Embroidery',
    icon: '🎨',
    color: '#8B5CF6',
    baseFormula: 'machines × 15 m²',
    minArea: 30,
    description: 'Embroidery and embellishment',
  },
  {
    id: 'finishing',
    name: 'Finishing',
    icon: '✅',
    color: '#10B981',
    baseFormula: 'sewing_area × 0.18',
    minArea: 40,
    description: 'Ironing, pressing, quality check',
  },
  {
    id: 'packing',
    name: 'Packing',
    icon: '📤',
    color: '#0D9488',
    baseFormula: 'sewing_area × 0.12',
    minArea: 30,
    description: 'Final packing and dispatch',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: '⚡',
    color: '#6B7280',
    baseFormula: 'total × 0.08',
    minArea: 20,
    description: 'Electrical, maintenance, facilities',
  },
  {
    id: 'washing',
    name: 'Wash Bay',
    icon: '💧',
    color: '#06B6D4',
    baseFormula: 'sewing_area × 0.15',
    minArea: 60,
    description: 'Garment washing and treatment',
  },
  {
    id: 'sublimation',
    name: 'Sublimation',
    icon: '🔥',
    color: '#EF4444',
    baseFormula: 'sewing_area × 0.1',
    minArea: 40,
    description: 'Heat transfer printing',
  },
];

// =====================================================
// Layout Input Parameters
// =====================================================

export interface FloorLayoutInputs {
  totalOperators: number;
  productTypeId: string;
  workingHours: number;
  buildingFloors: number;
  floorWidth: number; // meters
  floorHeight: number; // meters
}

export const defaultFloorLayoutInputs: FloorLayoutInputs = {
  totalOperators: 500,
  productTypeId: 'pt-cs',
  workingHours: 8,
  buildingFloors: 2,
  floorWidth: 100,
  floorHeight: 60,
};

// =====================================================
// Placed Department (on canvas)
// =====================================================

export interface PlacedDepartment {
  id: string;
  departmentTypeId: string;
  floorIndex: number;
  x: number; // grid position
  y: number;
  width: number; // grid units
  height: number;
  calculatedArea: number; // m²
}

// =====================================================
// Floor Layout State
// =====================================================

export interface FloorLayoutState {
  inputs: FloorLayoutInputs;
  departments: PlacedDepartment[];
  selectedDepartmentId: string | null;
  activeFloorIndex: number;
  canvasZoom: number;
  canvasPan: { x: number; y: number };
  showGrid: boolean;
  showFlowArrows: boolean;
  validationStatus: 'valid' | 'warnings' | 'errors';
}

export const defaultFloorLayoutState: FloorLayoutState = {
  inputs: defaultFloorLayoutInputs,
  departments: [],
  selectedDepartmentId: null,
  activeFloorIndex: 0,
  canvasZoom: 1,
  canvasPan: { x: 0, y: 0 },
  showGrid: true,
  showFlowArrows: true,
  validationStatus: 'valid',
};

// =====================================================
// Space Calculation (Mock)
// =====================================================

export interface CalculatedDepartmentArea {
  departmentTypeId: string;
  name: string;
  icon: string;
  color: string;
  calculatedArea: number;
  minArea: number;
  gridWidth: number;
  gridHeight: number;
}

export function calculateDepartmentAreas(inputs: FloorLayoutInputs): CalculatedDepartmentArea[] {
  const productType = productTypes.find(pt => pt.id === inputs.productTypeId) || productTypes[2];
  const spaceModifier = productType.spaceModifier;

  // Calculate sewing area first (base for other calculations)
  const sewingArea = Math.max(200, inputs.totalOperators * 6 * spaceModifier);

  const results: CalculatedDepartmentArea[] = [];

  for (const deptType of departmentTypes) {
    // Only include departments for this product type
    if (!productType.departments.includes(deptType.id)) continue;

    let area: number;

    // Skip utilities for now - it's calculated from total at the end
    if (deptType.id === 'utilities') continue;

    switch (deptType.id) {
      case 'warehouse':
        area = Math.max(deptType.minArea, inputs.totalOperators * 0.8 * spaceModifier);
        break;
      case 'cutting':
        area = Math.max(deptType.minArea, sewingArea * 0.25);
        break;
      case 'sewing':
        area = sewingArea;
        break;
      case 'embroidery':
        // Assume 1 embroidery machine per 50 operators, apply space modifier
        area = Math.max(
          deptType.minArea,
          Math.ceil(inputs.totalOperators / 50) * 15 * spaceModifier
        );
        break;
      case 'finishing':
        area = Math.max(deptType.minArea, sewingArea * 0.18);
        break;
      case 'packing':
        area = Math.max(deptType.minArea, sewingArea * 0.12);
        break;
      case 'washing':
        area = Math.max(deptType.minArea, sewingArea * 0.15);
        break;
      case 'sublimation':
        area = Math.max(deptType.minArea, sewingArea * 0.1);
        break;
      default:
        area = deptType.minArea;
    }

    // Calculate grid dimensions (each grid cell = 5m × 5m = 25 m²)
    const gridCellArea = 25;
    const totalCells = Math.ceil(area / gridCellArea);
    const gridWidth = Math.ceil(Math.sqrt(totalCells * 1.5)); // Slightly wider than tall
    const gridHeight = Math.ceil(totalCells / gridWidth);

    results.push({
      departmentTypeId: deptType.id,
      name: deptType.name,
      icon: deptType.icon,
      color: deptType.color,
      calculatedArea: Math.round(area),
      minArea: deptType.minArea,
      gridWidth,
      gridHeight,
    });
  }

  // Calculate utilities from total of all other departments (PRD §3.2.4: total × 0.08)
  const utilitiesDeptType = departmentTypes.find(dt => dt.id === 'utilities');
  if (utilitiesDeptType && productType.departments.includes('utilities')) {
    const totalOtherAreas = results.reduce((sum, d) => sum + d.calculatedArea, 0);
    const utilitiesArea = Math.max(utilitiesDeptType.minArea, totalOtherAreas * 0.08);
    const gridCellArea = 25;
    const totalCells = Math.ceil(utilitiesArea / gridCellArea);
    const gridWidth = Math.ceil(Math.sqrt(totalCells * 1.5));
    const gridHeight = Math.ceil(totalCells / gridWidth);

    results.push({
      departmentTypeId: utilitiesDeptType.id,
      name: utilitiesDeptType.name,
      icon: utilitiesDeptType.icon,
      color: utilitiesDeptType.color,
      calculatedArea: Math.round(utilitiesArea),
      minArea: utilitiesDeptType.minArea,
      gridWidth,
      gridHeight,
    });
  }

  return results;
}

// =====================================================
// Validation & Bottleneck Detection (Mock)
// =====================================================

export interface ValidationWarning {
  id: string;
  severity: 'info' | 'warning' | 'error';
  departmentId?: string;
  message: string;
  suggestion?: string;
}

export function validateLayout(
  departments: PlacedDepartment[],
  inputs: FloorLayoutInputs
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check if all required departments are placed
  const productType = productTypes.find(pt => pt.id === inputs.productTypeId);
  if (productType) {
    const placedDeptTypes = new Set(departments.map(d => d.departmentTypeId));
    for (const reqDept of productType.departments) {
      if (!placedDeptTypes.has(reqDept)) {
        const deptType = departmentTypes.find(dt => dt.id === reqDept);
        warnings.push({
          id: `missing-${reqDept}`,
          severity: 'error',
          message: `Missing required department: ${deptType?.name || reqDept}`,
          suggestion: `Add ${deptType?.name} from the palette`,
        });
      }
    }
  }

  // Check for overlapping departments on same floor
  for (let i = 0; i < departments.length; i++) {
    for (let j = i + 1; j < departments.length; j++) {
      const a = departments[i];
      const b = departments[j];
      if (a.floorIndex !== b.floorIndex) continue;

      const overlapsX = a.x < b.x + b.width && a.x + a.width > b.x;
      const overlapsY = a.y < b.y + b.height && a.y + a.height > b.y;

      if (overlapsX && overlapsY) {
        const aDept = departmentTypes.find(dt => dt.id === a.departmentTypeId);
        const bDept = departmentTypes.find(dt => dt.id === b.departmentTypeId);
        warnings.push({
          id: `overlap-${a.id}-${b.id}`,
          severity: 'error',
          departmentId: a.id,
          message: `${aDept?.name} overlaps with ${bDept?.name}`,
          suggestion: 'Move departments to prevent overlap',
        });
      }
    }
  }

  // Check cutting-sewing balance (mock bottleneck detection)
  const cuttingDept = departments.find(d => d.departmentTypeId === 'cutting');
  const sewingDept = departments.find(d => d.departmentTypeId === 'sewing');

  if (cuttingDept && sewingDept) {
    const cuttingArea = cuttingDept.calculatedArea;
    const sewingArea = sewingDept.calculatedArea;

    if (cuttingArea > sewingArea * 0.3) {
      warnings.push({
        id: 'bottleneck-cutting',
        severity: 'warning',
        departmentId: cuttingDept.id,
        message: 'Cutting capacity may exceed sewing capacity',
        suggestion: 'Consider reducing cutting area or increasing sewing capacity',
      });
    }
  }

  // Check finishing constraint
  const finishingDept = departments.find(d => d.departmentTypeId === 'finishing');
  if (finishingDept && sewingDept) {
    if (finishingDept.calculatedArea < sewingDept.calculatedArea * 0.15) {
      warnings.push({
        id: 'bottleneck-finishing',
        severity: 'warning',
        departmentId: finishingDept.id,
        message: 'Finishing area may be undersized for production volume',
        suggestion: 'Consider expanding finishing area',
      });
    }
  }

  return warnings;
}

// =====================================================
// Flow Efficiency (Mock)
// =====================================================

export interface FlowConnection {
  fromDepartmentId: string;
  toDepartmentId: string;
  efficiency: number; // 0-1
  distance: number; // grid units
}

export function calculateFlowEfficiency(departments: PlacedDepartment[]): FlowConnection[] {
  const flowOrder = ['warehouse', 'cutting', 'sewing', 'embroidery', 'finishing', 'packing'];
  const connections: FlowConnection[] = [];

  for (let i = 0; i < flowOrder.length - 1; i++) {
    const fromDept = departments.find(d => d.departmentTypeId === flowOrder[i]);
    const toDept = departments.find(d => d.departmentTypeId === flowOrder[i + 1]);

    if (fromDept && toDept && fromDept.floorIndex === toDept.floorIndex) {
      const dx = toDept.x + toDept.width / 2 - (fromDept.x + fromDept.width / 2);
      const dy = toDept.y + toDept.height / 2 - (fromDept.y + fromDept.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Efficiency decreases with distance (mock formula)
      const maxOptimalDistance = 10;
      const efficiency = Math.max(0.3, 1 - (distance / maxOptimalDistance) * 0.5);

      connections.push({
        fromDepartmentId: fromDept.id,
        toDepartmentId: toDept.id,
        efficiency,
        distance: Math.round(distance),
      });
    }
  }

  return connections;
}

// =====================================================
// Layout Templates
// =====================================================

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  operatorRange: string;
  thumbnail: string; // Emoji placeholder
  inputs: Partial<FloorLayoutInputs>;
  departments: Omit<PlacedDepartment, 'id' | 'calculatedArea'>[];
}

export const layoutTemplates: LayoutTemplate[] = [
  {
    id: 'tpl-small',
    name: 'Small Factory',
    description: 'Compact layout for small operations',
    operatorRange: '50-150 operators',
    thumbnail: '🏭',
    inputs: {
      totalOperators: 100,
      buildingFloors: 1,
      floorWidth: 50,
      floorHeight: 40,
    },
    departments: [
      { departmentTypeId: 'warehouse', floorIndex: 0, x: 0, y: 0, width: 4, height: 3 },
      { departmentTypeId: 'cutting', floorIndex: 0, x: 5, y: 0, width: 3, height: 3 },
      { departmentTypeId: 'sewing', floorIndex: 0, x: 0, y: 4, width: 8, height: 4 },
      { departmentTypeId: 'finishing', floorIndex: 0, x: 9, y: 0, width: 3, height: 3 },
      { departmentTypeId: 'packing', floorIndex: 0, x: 9, y: 4, width: 3, height: 3 },
      { departmentTypeId: 'utilities', floorIndex: 0, x: 9, y: 7, width: 3, height: 1 },
    ],
  },
  {
    id: 'tpl-medium',
    name: 'Medium Factory',
    description: 'Standard layout for mid-size operations',
    operatorRange: '200-500 operators',
    thumbnail: '🏢',
    inputs: {
      totalOperators: 350,
      buildingFloors: 2,
      floorWidth: 80,
      floorHeight: 50,
    },
    departments: [
      { departmentTypeId: 'warehouse', floorIndex: 0, x: 0, y: 0, width: 6, height: 4 },
      { departmentTypeId: 'cutting', floorIndex: 0, x: 7, y: 0, width: 5, height: 4 },
      { departmentTypeId: 'sewing', floorIndex: 0, x: 0, y: 5, width: 12, height: 5 },
      { departmentTypeId: 'embroidery', floorIndex: 1, x: 0, y: 0, width: 4, height: 4 },
      { departmentTypeId: 'finishing', floorIndex: 1, x: 5, y: 0, width: 4, height: 4 },
      { departmentTypeId: 'packing', floorIndex: 1, x: 0, y: 5, width: 5, height: 3 },
      { departmentTypeId: 'utilities', floorIndex: 1, x: 6, y: 5, width: 3, height: 3 },
    ],
  },
  {
    id: 'tpl-large',
    name: 'Large Factory',
    description: 'Comprehensive layout for large operations',
    operatorRange: '500-1500 operators',
    thumbnail: '🏛️',
    inputs: {
      totalOperators: 1000,
      buildingFloors: 3,
      floorWidth: 120,
      floorHeight: 80,
    },
    departments: [
      { departmentTypeId: 'warehouse', floorIndex: 0, x: 0, y: 0, width: 8, height: 6 },
      { departmentTypeId: 'cutting', floorIndex: 0, x: 9, y: 0, width: 7, height: 6 },
      { departmentTypeId: 'sewing', floorIndex: 1, x: 0, y: 0, width: 16, height: 8 },
      { departmentTypeId: 'embroidery', floorIndex: 1, x: 0, y: 9, width: 6, height: 5 },
      { departmentTypeId: 'finishing', floorIndex: 2, x: 0, y: 0, width: 8, height: 5 },
      { departmentTypeId: 'packing', floorIndex: 2, x: 9, y: 0, width: 7, height: 5 },
      { departmentTypeId: 'utilities', floorIndex: 0, x: 0, y: 7, width: 4, height: 3 },
    ],
  },
];

// =====================================================
// Mock Initial Departments (for demo)
// =====================================================

export const mockPlacedDepartments: PlacedDepartment[] = [
  {
    id: 'dept-1',
    departmentTypeId: 'warehouse',
    floorIndex: 0,
    x: 0,
    y: 0,
    width: 5,
    height: 4,
    calculatedArea: 400,
  },
  {
    id: 'dept-2',
    departmentTypeId: 'cutting',
    floorIndex: 0,
    x: 6,
    y: 0,
    width: 4,
    height: 3,
    calculatedArea: 240,
  },
  {
    id: 'dept-3',
    departmentTypeId: 'sewing',
    floorIndex: 0,
    x: 0,
    y: 5,
    width: 10,
    height: 6,
    calculatedArea: 3000,
  },
];
