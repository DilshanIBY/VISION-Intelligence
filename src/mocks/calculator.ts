/**
 * Machinery Calculator Mock Data
 * Mock data for Phase 3 UI prototype - no real API calls
 * Updated for VISION Intelligence v2.0 requirements
 * @requirement P3-PG-CALC-001 to P3-PG-CALC-019
 */

// =====================================================
// Machine Types for Dropdown (CRUD-capable)
// =====================================================

export interface MockMachineType {
  id: string;
  name: string;
  category: 'sewing' | 'embroidery' | 'cutting' | 'finishing' | 'fusing';
  defaultSMV: number;
  defaultEfficiency: number;
  isCustom?: boolean;
}

export const mockMachineTypes: MockMachineType[] = [
  // Sewing Machines
  {
    id: 'mt-001',
    name: 'Single Needle Lockstitch',
    category: 'sewing',
    defaultSMV: 24.5,
    defaultEfficiency: 0.80,
  },
  {
    id: 'mt-002',
    name: 'Double Needle Lockstitch',
    category: 'sewing',
    defaultSMV: 18.0,
    defaultEfficiency: 0.80,
  },
  {
    id: 'mt-003',
    name: 'Overlock 3-Thread',
    category: 'sewing',
    defaultSMV: 12.0,
    defaultEfficiency: 0.85,
  },
  {
    id: 'mt-004',
    name: 'Overlock 5-Thread',
    category: 'sewing',
    defaultSMV: 14.0,
    defaultEfficiency: 0.82,
  },
  {
    id: 'mt-005',
    name: 'Flatlock/Coverstitch',
    category: 'sewing',
    defaultSMV: 16.0,
    defaultEfficiency: 0.80,
  },
  { id: 'mt-006', name: 'Bartack', category: 'sewing', defaultSMV: 5.0, defaultEfficiency: 0.90 },
  {
    id: 'mt-007',
    name: 'Button Attach',
    category: 'sewing',
    defaultSMV: 8.0,
    defaultEfficiency: 0.88,
  },
  {
    id: 'mt-008',
    name: 'Buttonhole',
    category: 'sewing',
    defaultSMV: 6.0,
    defaultEfficiency: 0.85,
  },

  // Embroidery Machines
  {
    id: 'mt-101',
    name: 'Barudan BEXT-S1501C',
    category: 'embroidery',
    defaultSMV: 0,
    defaultEfficiency: 0.80,
  },
  {
    id: 'mt-102',
    name: 'Barudan BEXT-S1506C',
    category: 'embroidery',
    defaultSMV: 0,
    defaultEfficiency: 0.80,
  },
  {
    id: 'mt-103',
    name: 'SWF MA-6',
    category: 'embroidery',
    defaultSMV: 0,
    defaultEfficiency: 0.80,
  },
  {
    id: 'mt-104',
    name: 'Brother PR1050X',
    category: 'embroidery',
    defaultSMV: 0,
    defaultEfficiency: 0.80,
  },
  {
    id: 'mt-105',
    name: 'Tajima TFMX-IIC',
    category: 'embroidery',
    defaultSMV: 0,
    defaultEfficiency: 0.85,
  },

  // Cutting Machines
  {
    id: 'mt-201',
    name: 'Auto Cutter - Single Ply',
    category: 'cutting',
    defaultSMV: 30.0,
    defaultEfficiency: 0.90,
  },
  {
    id: 'mt-202',
    name: 'Auto Cutter - Multi Ply',
    category: 'cutting',
    defaultSMV: 22.0,
    defaultEfficiency: 0.88,
  },
  {
    id: 'mt-203',
    name: 'Band Knife',
    category: 'cutting',
    defaultSMV: 15.0,
    defaultEfficiency: 0.85,
  },

  // Finishing Machines
  {
    id: 'mt-301',
    name: 'Steam Press',
    category: 'finishing',
    defaultSMV: 4.0,
    defaultEfficiency: 0.90,
  },
  {
    id: 'mt-302',
    name: 'Thread Trimmer',
    category: 'finishing',
    defaultSMV: 2.0,
    defaultEfficiency: 0.92,
  },

  // Fusing Machines
  {
    id: 'mt-401',
    name: 'Collar Fusing Machine',
    category: 'fusing',
    defaultSMV: 0,
    defaultEfficiency: 0.90,
  },
  {
    id: 'mt-402',
    name: 'Interlining Fusing Machine',
    category: 'fusing',
    defaultSMV: 0,
    defaultEfficiency: 0.88,
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
// Duration Options
// =====================================================

export type DurationType = 'daily' | 'weekly' | 'monthly';

export const durationOptions: { value: DurationType; label: string; defaultDays: number }[] = [
  { value: 'daily', label: 'Daily', defaultDays: 1 },
  { value: 'weekly', label: 'Weekly', defaultDays: 6 },
  { value: 'monthly', label: 'Monthly', defaultDays: 26 },
];

// =====================================================
// Product Categories for Fusing
// =====================================================

export const fusingProductCategories = [
  { value: 'trouser', label: 'Trouser' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'tshirt', label: 'T-Shirt' },
  { value: 'apron', label: 'Apron' },
  { value: 'cap', label: 'Cap' },
];

// =====================================================
// Default Input Values
// =====================================================

export type CalculationTab = 'basic' | 'embroidery' | 'fusing';

export interface CalculatorInputs {
  // Basic (Sewing)
  machineTypeId: string;
  smv: number;
  numberOfOperators: number;
  workingHoursPerDay: number;
  duration: DurationType;
  workingDays: number;
  saturdayWork: boolean;
  sundayWork: boolean;
  efficiencyFactor: number;
  targetQuantity: number;
  // Embroidery
  punchCount: number;
  threadColors: number;
  headCount: number;
  machineSpeed: number;
  handlingTimePerPiece: number;
  // Fusing
  fusingProductCategory: string;
  fusingTimePerPiece: number;
  fusingDailyQuantity: number;
  // Mode
  activeTab: CalculationTab;
}

export const defaultCalculatorInputs: CalculatorInputs = {
  // Basic (Sewing) defaults
  machineTypeId: 'mt-001',
  smv: 24.5,
  numberOfOperators: 90,
  workingHoursPerDay: 9,
  duration: 'monthly',
  workingDays: 26,
  saturdayWork: true,
  sundayWork: false,
  efficiencyFactor: 0.80,
  targetQuantity: 40000,
  // Embroidery defaults
  punchCount: 5000,
  threadColors: 3,
  headCount: 12,
  machineSpeed: 800,
  handlingTimePerPiece: 1.5,
  // Fusing defaults
  fusingProductCategory: 'shirt',
  fusingTimePerPiece: 15,
  fusingDailyQuantity: 2000,
  // Mode
  activeTab: 'basic',
};

// =====================================================
// Calculation Results (Mock)
// =====================================================

export interface CalculatorOutputs {
  machinesRequired: number;
  dailyOutput: number;
  utilizationRate: number;
  costEstimate: number;
  // Embroidery-specific
  outputPerHead?: number;
  outputPerMachine?: number;
  stitchingTimePerPiece?: number;
  // Fusing-specific
  capacityPerMachine?: number;
}

export const mockCalculatorOutputs: CalculatorOutputs = {
  machinesRequired: 90,
  dailyOutput: 1585,
  utilizationRate: 0.80,
  costEstimate: 48500,
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
    inputs: { ...defaultCalculatorInputs },
    outputs: {
      machinesRequired: 90,
      dailyOutput: 1585,
      utilizationRate: 0.80,
      costEstimate: 48500,
    },
  },
  {
    id: 'scenario-a',
    name: 'High Efficiency',
    isBaseline: false,
    inputs: {
      efficiencyFactor: 0.90,
      numberOfOperators: 120,
    },
    outputs: {
      machinesRequired: 120,
      dailyOutput: 2376,
      utilizationRate: 0.90,
      costEstimate: 62000,
    },
  },
  {
    id: 'scenario-b',
    name: 'Cost Optimized',
    isBaseline: false,
    inputs: { numberOfOperators: 60, efficiencyFactor: 0.75 },
    outputs: {
      machinesRequired: 60,
      dailyOutput: 991,
      utilizationRate: 0.75,
      costEstimate: 35000,
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
    severity: 'info',
    message: 'Efficiency above 85% is excellent and may be optimistic for new setups',
    field: 'efficiencyFactor',
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
// Uses VISION Excel formulas
// =====================================================

export function calculateMockResults(inputs: CalculatorInputs): CalculatorOutputs {
  if (inputs.activeTab === 'embroidery') {
    return calculateEmbroideryResults(inputs);
  }
  if (inputs.activeTab === 'fusing') {
    return calculateFusingResults(inputs);
  }
  return calculateSewingResults(inputs);
}

/**
 * Sewing Machine Calculation (VISION Formula):
 * Daily_Output = (No_of_Operators × Working_Minutes / SMV) × Efficiency
 * Machines_Required = ceil(Target_Quantity / (Daily_Output × Working_Days))
 */
function calculateSewingResults(inputs: CalculatorInputs): CalculatorOutputs {
  const smv = Math.max(0.1, inputs.smv);
  const operators = Math.max(1, inputs.numberOfOperators);
  const efficiency = Math.max(0.01, Math.min(1, inputs.efficiencyFactor));
  const workingMinutes = Math.max(1, inputs.workingHoursPerDay * 60);
  const workingDays = Math.max(1, inputs.workingDays);
  const targetQuantity = Math.max(1, inputs.targetQuantity);

  // Core formula: Daily output per operator line
  const dailyOutput = Math.round((operators * workingMinutes * efficiency) / smv);
  const totalOutput = dailyOutput * workingDays;

  // Machines required (1 operator : 1 machine for sewing)
  const machinesRequired = operators;

  // Utilization = actual demand vs capacity
  const utilizationRate = Math.min(1, targetQuantity / Math.max(1, totalOutput));

  // Mock cost estimate
  const costPerMachineDay = 200;
  const costEstimate = machinesRequired * workingDays * costPerMachineDay;

  return {
    machinesRequired,
    dailyOutput,
    utilizationRate: Math.round(utilizationRate * 100) / 100,
    costEstimate,
  };
}

/**
 * Embroidery Capacity Calculation (VISION Formula):
 * Stitching_Time = Punch_Count / Machine_Speed (minutes)
 * Total_Time = Stitching_Time + Handling_Time
 * Available_Minutes = Shift_Hours × 60 × Efficiency
 * Output_Per_Head = Available_Minutes / Total_Time
 * Output_Per_Machine = Output_Per_Head × Head_Count
 * Machines_Required = ceil(Order_Quantity / Output_Per_Machine)
 */
function calculateEmbroideryResults(inputs: CalculatorInputs): CalculatorOutputs {
  const machineSpeed = Math.max(1, inputs.machineSpeed);
  const headCount = Math.max(1, inputs.headCount);
  const efficiency = Math.max(0.01, Math.min(1, inputs.efficiencyFactor));
  const workingHours = Math.max(0.5, inputs.workingHoursPerDay);
  const targetQuantity = Math.max(1, inputs.targetQuantity);
  const handlingTime = Math.max(0, inputs.handlingTimePerPiece);

  // Time per piece (minutes)
  const stitchingTime = inputs.punchCount / machineSpeed;
  const totalTimePerPiece = stitchingTime + handlingTime;
  const safeTime = Math.max(0.01, totalTimePerPiece);

  // Available minutes per shift
  const availableMinutes = workingHours * 60 * efficiency;

  // Output calculations
  const outputPerHead = availableMinutes / safeTime;
  const outputPerMachine = outputPerHead * headCount;

  // Machines required
  const machinesRequired = Math.max(1, Math.ceil(targetQuantity / Math.max(1, outputPerMachine)));

  const actualDailyOutput = Math.round(machinesRequired * outputPerMachine);
  const utilizationRate = targetQuantity / (machinesRequired * Math.max(1, outputPerMachine));

  const costPerMachineDay = 450;
  const costEstimate = machinesRequired * costPerMachineDay;

  return {
    machinesRequired,
    dailyOutput: actualDailyOutput,
    utilizationRate: Math.min(1, Math.max(0, Math.round(utilizationRate * 100) / 100)),
    costEstimate,
    outputPerHead: Math.round(outputPerHead),
    outputPerMachine: Math.round(outputPerMachine),
    stitchingTimePerPiece: Math.round(stitchingTime * 100) / 100,
  };
}

/**
 * Fusing Machine Calculation (VISION Formula):
 * Available_Seconds = Working_Hours × 3600 × (Efficiency / 100)
 * Capacity_Per_Machine = Available_Seconds / Seconds_Per_Piece
 * Machines_Required = ceil(Daily_Quantity / Capacity_Per_Machine)
 */
function calculateFusingResults(inputs: CalculatorInputs): CalculatorOutputs {
  const efficiency = Math.max(0.01, Math.min(1, inputs.efficiencyFactor));
  const workingHours = Math.max(0.5, inputs.workingHoursPerDay);
  const secondsPerPiece = Math.max(1, inputs.fusingTimePerPiece);
  const dailyQuantity = Math.max(1, inputs.fusingDailyQuantity);

  // Available seconds per shift
  const availableSeconds = workingHours * 3600 * efficiency;

  // Capacity per machine
  const capacityPerMachine = Math.floor(availableSeconds / secondsPerPiece);

  // Machines required
  const machinesRequired = Math.max(1, Math.ceil(dailyQuantity / Math.max(1, capacityPerMachine)));

  const actualCapacity = machinesRequired * capacityPerMachine;
  const utilizationRate = dailyQuantity / Math.max(1, actualCapacity);

  const costPerMachine = 800;
  const costEstimate = machinesRequired * costPerMachine;

  return {
    machinesRequired,
    dailyOutput: actualCapacity,
    utilizationRate: Math.min(1, Math.max(0, Math.round(utilizationRate * 100) / 100)),
    costEstimate,
    capacityPerMachine,
  };
}
