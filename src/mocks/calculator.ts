/**
 * Machinery Calculator Mock Data
 * Mock data for Phase 3 UI prototype - no real API calls
 * @requirement P3-PG-CALC-001 to P3-PG-CALC-019
 */

// =====================================================
// Machine Types for Dropdown
// =====================================================

export interface MockMachineType {
  id: string;
  name: string;
  category: 'sewing' | 'embroidery' | 'cutting' | 'finishing';
  defaultSpeed: number;
  defaultEfficiency: number;
}

export const mockMachineTypes: MockMachineType[] = [
  // Sewing Machines
  {
    id: 'mt-001',
    name: 'Single Needle Lockstitch',
    category: 'sewing',
    defaultSpeed: 5000,
    defaultEfficiency: 0.85,
  },
  {
    id: 'mt-002',
    name: 'Double Needle Lockstitch',
    category: 'sewing',
    defaultSpeed: 4500,
    defaultEfficiency: 0.82,
  },
  {
    id: 'mt-003',
    name: 'Overlock 3-Thread',
    category: 'sewing',
    defaultSpeed: 7000,
    defaultEfficiency: 0.88,
  },
  {
    id: 'mt-004',
    name: 'Overlock 5-Thread',
    category: 'sewing',
    defaultSpeed: 6500,
    defaultEfficiency: 0.85,
  },
  {
    id: 'mt-005',
    name: 'Flatlock/Coverstitch',
    category: 'sewing',
    defaultSpeed: 5500,
    defaultEfficiency: 0.8,
  },
  { id: 'mt-006', name: 'Bartack', category: 'sewing', defaultSpeed: 3000, defaultEfficiency: 0.9 },
  {
    id: 'mt-007',
    name: 'Button Attach',
    category: 'sewing',
    defaultSpeed: 1500,
    defaultEfficiency: 0.92,
  },
  {
    id: 'mt-008',
    name: 'Buttonhole',
    category: 'sewing',
    defaultSpeed: 1200,
    defaultEfficiency: 0.9,
  },

  // Embroidery Machines
  {
    id: 'mt-101',
    name: 'Barudan BEXT-S1501C',
    category: 'embroidery',
    defaultSpeed: 1000,
    defaultEfficiency: 0.85,
  },
  {
    id: 'mt-102',
    name: 'Barudan BEXT-S1506C',
    category: 'embroidery',
    defaultSpeed: 950,
    defaultEfficiency: 0.83,
  },
  {
    id: 'mt-103',
    name: 'SWF MA-6',
    category: 'embroidery',
    defaultSpeed: 1100,
    defaultEfficiency: 0.82,
  },
  {
    id: 'mt-104',
    name: 'Brother PR1050X',
    category: 'embroidery',
    defaultSpeed: 1000,
    defaultEfficiency: 0.85,
  },
  {
    id: 'mt-105',
    name: 'Tajima TFMX-IIC',
    category: 'embroidery',
    defaultSpeed: 1200,
    defaultEfficiency: 0.88,
  },

  // Cutting Machines
  {
    id: 'mt-201',
    name: 'Auto Cutter - Single Ply',
    category: 'cutting',
    defaultSpeed: 0,
    defaultEfficiency: 0.95,
  },
  {
    id: 'mt-202',
    name: 'Auto Cutter - Multi Ply',
    category: 'cutting',
    defaultSpeed: 0,
    defaultEfficiency: 0.92,
  },
  {
    id: 'mt-203',
    name: 'Band Knife',
    category: 'cutting',
    defaultSpeed: 0,
    defaultEfficiency: 0.85,
  },

  // Finishing Machines
  {
    id: 'mt-301',
    name: 'Steam Press',
    category: 'finishing',
    defaultSpeed: 0,
    defaultEfficiency: 0.9,
  },
  {
    id: 'mt-302',
    name: 'Fusing Machine',
    category: 'finishing',
    defaultSpeed: 0,
    defaultEfficiency: 0.92,
  },
  {
    id: 'mt-303',
    name: 'Thread Trimmer',
    category: 'finishing',
    defaultSpeed: 0,
    defaultEfficiency: 0.95,
  },
];

// =====================================================
// Speed Presets for Embroidery
// =====================================================

export interface SpeedPreset {
  label: string;
  value: number;
  description: string;
}

export const embroiderySpeedPresets: SpeedPreset[] = [
  { label: 'Slow', value: 400, description: 'Detailed work, thick fabric' },
  { label: 'Normal', value: 800, description: 'Standard operation' },
  { label: 'Fast', value: 1000, description: 'Simple designs, thin fabric' },
  { label: 'Max', value: 1200, description: 'Maximum speed' },
];

// =====================================================
// Thread Color Palette
// =====================================================

export interface ThreadColor {
  id: string;
  name: string;
  hex: string;
}

export const mockThreadColors: ThreadColor[] = [
  { id: 'tc-01', name: 'Black', hex: '#1a1a1a' },
  { id: 'tc-02', name: 'White', hex: '#ffffff' },
  { id: 'tc-03', name: 'Red', hex: '#dc2626' },
  { id: 'tc-04', name: 'Navy', hex: '#1e3a8a' },
  { id: 'tc-05', name: 'Royal Blue', hex: '#2563eb' },
  { id: 'tc-06', name: 'Forest Green', hex: '#166534' },
  { id: 'tc-07', name: 'Gold', hex: '#ca8a04' },
  { id: 'tc-08', name: 'Orange', hex: '#ea580c' },
  { id: 'tc-09', name: 'Purple', hex: '#7c3aed' },
  { id: 'tc-10', name: 'Pink', hex: '#ec4899' },
  { id: 'tc-11', name: 'Gray', hex: '#6b7280' },
  { id: 'tc-12', name: 'Brown', hex: '#78350f' },
  { id: 'tc-13', name: 'Teal', hex: '#0d9488' },
  { id: 'tc-14', name: 'Maroon', hex: '#881337' },
  { id: 'tc-15', name: 'Silver', hex: '#94a3b8' },
];

// =====================================================
// Default Input Values
// =====================================================

export interface CalculatorInputs {
  // Basic
  machineTypeId: string;
  targetQuantity: number;
  workingHoursPerDay: number;
  deadline: string; // ISO date string
  efficiencyFactor: number;
  // Embroidery
  punchCount: number;
  threadColors: number;
  selectedThreadColors: string[];
  headCount: number;
  machineSpeed: number;
  // Mode
  isEmbroidery: boolean;
}

export const defaultCalculatorInputs: CalculatorInputs = {
  machineTypeId: 'mt-101',
  targetQuantity: 10000,
  workingHoursPerDay: 8,
  deadline: '2026-03-15',
  efficiencyFactor: 0.85,
  punchCount: 5000,
  threadColors: 3,
  selectedThreadColors: ['#ffffff', '#000000', '#dc2626'], // White, Black, Red
  headCount: 12,
  machineSpeed: 800,
  isEmbroidery: true,
};

// =====================================================
// Calculation Results (Mock)
// =====================================================

export interface CalculatorOutputs {
  machinesRequired: number;
  totalProductionDays: number;
  dailyOutput: number;
  utilizationRate: number;
  costEstimate: number;
  timePerPiece: {
    stitching: number;
    colorChanges: number;
    total: number;
  };
}

export const mockCalculatorOutputs: CalculatorOutputs = {
  machinesRequired: 4,
  totalProductionDays: 12,
  dailyOutput: 834,
  utilizationRate: 0.92,
  costEstimate: 48500,
  timePerPiece: {
    stitching: 6.25,
    colorChanges: 1.5,
    total: 7.75,
  },
};

// =====================================================
// What-If Scenarios
// =====================================================

export interface Scenario {
  id: string;
  name: string;
  isBaseline: boolean;
  inputs: Partial<CalculatorInputs>;
  outputs: CalculatorOutputs;
}

export const mockScenarios: Scenario[] = [
  {
    id: 'baseline',
    name: 'Baseline',
    isBaseline: true,
    // Clone defaults to include selectedThreadColors
    inputs: { ...defaultCalculatorInputs },
    outputs: {
      machinesRequired: 4,
      totalProductionDays: 12,
      dailyOutput: 834,
      utilizationRate: 0.92,
      costEstimate: 48500,
      timePerPiece: { stitching: 6.25, colorChanges: 1.5, total: 7.75 },
    },
  },
  {
    id: 'scenario-a',
    name: 'High Capacity',
    isBaseline: false,
    inputs: {
      headCount: 21,
      machineSpeed: 1000,
      // Keep existing colors if undefined, but partial inputs handling might need attention in UI
    },
    outputs: {
      machinesRequired: 2,
      totalProductionDays: 8,
      dailyOutput: 1250,
      utilizationRate: 0.88,
      costEstimate: 62000,
      timePerPiece: { stitching: 5.0, colorChanges: 1.5, total: 6.5 },
    },
  },
  {
    id: 'scenario-b',
    name: 'Cost Optimized',
    isBaseline: false,
    inputs: { headCount: 6, machineSpeed: 600 },
    outputs: {
      machinesRequired: 6,
      totalProductionDays: 18,
      dailyOutput: 556,
      utilizationRate: 0.78,
      costEstimate: 35000,
      timePerPiece: { stitching: 8.33, colorChanges: 1.5, total: 9.83 },
    },
  },
];

// =====================================================
// Validation Warnings (Mock)
// =====================================================

export interface ValidationWarning {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  field?: string;
}

export const mockValidationWarnings: ValidationWarning[] = [
  {
    id: 'warn-1',
    severity: 'warning',
    message: 'High color count (>8) significantly impacts production time',
    field: 'threadColors',
  },
];

// =====================================================
// Cost Breakdown
// =====================================================

export interface CostCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export const mockCostBreakdown: CostCategory[] = [
  { name: 'Machine Operation', amount: 19400, percentage: 40, color: 'var(--color-primary)' },
  { name: 'Labor', amount: 14550, percentage: 30, color: 'var(--color-secondary)' },
  { name: 'Thread & Materials', amount: 7275, percentage: 15, color: 'var(--color-accent)' },
  { name: 'Utilities', amount: 4850, percentage: 10, color: 'var(--color-success)' },
  { name: 'Overhead', amount: 2425, percentage: 5, color: 'var(--color-warning)' },
];

// =====================================================
// Mock Calculation Engine (for real-time updates)
// =====================================================

export function calculateMockResults(inputs: CalculatorInputs): CalculatorOutputs {
  // Guard against invalid inputs
  const machineSpeed = Math.max(1, inputs.machineSpeed);
  const headCount = Math.max(1, inputs.headCount);
  const efficiencyFactor = Math.max(0.01, Math.min(1, inputs.efficiencyFactor));
  const workingHours = Math.max(0.5, Math.min(24, inputs.workingHoursPerDay));
  const targetQuantity = Math.max(1, inputs.targetQuantity);

  // Time per piece (minutes) — each head embroiders one piece at a time
  // punchCount / machineSpeed = minutes of stitching per piece per head
  const baseTime = inputs.punchCount / machineSpeed;
  // ~30 seconds per color change
  const colorChangeTime = (inputs.threadColors - 1) * 0.5;
  const totalTimePerPiece = baseTime + colorChangeTime;

  // Guard against zero/negative time per piece
  const safeTimePerPiece = Math.max(0.01, totalTimePerPiece);

  // Throughput: each machine has `headCount` heads working in parallel
  // So pieces per hour = (60 / timePerPiece) × headCount × efficiency
  const piecesPerHourPerMachine = (60 / safeTimePerPiece) * headCount * efficiencyFactor;
  const piecesPerDayPerMachine = piecesPerHourPerMachine * workingHours;

  // Calculate days until deadline
  const today = new Date();
  const deadline = new Date(inputs.deadline);
  const availableDays = Math.max(
    1,
    Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  const requiredDailyOutput = targetQuantity / availableDays;
  const safeDailyPerMachine = Math.max(1, piecesPerDayPerMachine);
  const machinesRequired = Math.max(1, Math.ceil(requiredDailyOutput / safeDailyPerMachine));

  const actualDailyOutput = Math.round(machinesRequired * piecesPerDayPerMachine);
  const safeActualDaily = Math.max(1, actualDailyOutput);
  const actualDays = Math.ceil(targetQuantity / safeActualDaily);
  const utilizationRate = requiredDailyOutput / (machinesRequired * safeDailyPerMachine);

  const costPerMachineDay = 450; // Mock cost
  const costEstimate = machinesRequired * actualDays * costPerMachineDay;

  return {
    machinesRequired,
    totalProductionDays: actualDays,
    dailyOutput: actualDailyOutput,
    utilizationRate: Math.min(1, Math.max(0, utilizationRate)),
    costEstimate,
    timePerPiece: {
      stitching: Math.round(baseTime * 100) / 100,
      colorChanges: Math.round(colorChangeTime * 100) / 100,
      total: Math.round(safeTimePerPiece * 100) / 100,
    },
  };
}
