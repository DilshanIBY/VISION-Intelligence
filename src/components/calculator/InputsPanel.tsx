/**
 * InputsPanel - Left panel containing all calculator input controls
 * Updated for VISION Intelligence v2.1
 * Supports 3 tabs: Basic (Sewing), Embroidery, Fusing
 * v2.1: No SPM in sewing tab. Stitches field added to embroidery.
 */

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Palette, Gauge, Flame } from 'lucide-react';

// UI Components
import { Select } from '@components/ui/inputs/Select';
import { NumberInput } from '@components/ui/inputs/NumberInput';
import { Slider } from '@components/ui/inputs/Slider';

// Calculator Components
import { HeadCountSelector } from './HeadCountSelector';
import { MachineTypeManager } from './MachineTypeManager';
import { SpeedPresets } from './SpeedPresets';
import { ValidationWarnings } from './ValidationWarnings';

// Mock Data
import {
  durationOptions,
  fusingProductCategories,
  type CalculatorInputs,
  type CalculationTab,
  type ValidationWarning,
} from '@mocks/calculator';
import { VALIDATION_LIMITS } from '@/types/validation/calculation-schemas';

export interface InputsPanelProps {
  inputs: CalculatorInputs;
  onInputChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  warnings: ValidationWarning[];
  onDismissWarning?: (id: string) => void;
  className?: string;
}

export const InputsPanel = forwardRef<HTMLDivElement, InputsPanelProps>(
  ({ inputs, onInputChange, warnings, onDismissWarning, className = '' }, ref) => {
    const [activeTab, setActiveTab] = useState<CalculationTab>(inputs.activeTab || 'basic');

    const handleTabChange = (tab: CalculationTab) => {
      setActiveTab(tab);
      onInputChange('activeTab', tab);
    };

    // Duration options for Select
    const durationSelectOptions = durationOptions.map(d => ({
      value: d.value,
      label: d.label,
    }));

    // Fusing product category options
    const fusingCategoryOptions = fusingProductCategories.map(c => ({
      value: c.value,
      label: c.label,
    }));

    return (
      <div
        ref={ref}
        className={`flex flex-col bg-[var(--color-glass)] backdrop-blur-md rounded-[var(--radius-2xl)] border border-[var(--color-glass-border)] overflow-hidden ${className}`}
      >
        {/* Panel Header with 3 Tabs */}
        <div className="flex-none p-4 border-b border-[var(--color-glass-border)]">
          <div className="flex gap-2">
            <motion.button
              onClick={() => handleTabChange('basic')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-lg)] text-sm font-medium
                transition-all duration-200
                ${activeTab === 'basic'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]'
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              <Settings2 size={16} />
              Sewing
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('embroidery')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-lg)] text-sm font-medium
                transition-all duration-200
                ${activeTab === 'embroidery'
                  ? 'bg-[var(--color-secondary)] text-white shadow-md'
                  : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]'
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              <Palette size={16} />
              Embroidery
            </motion.button>
            <motion.button
              onClick={() => handleTabChange('fusing')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-[var(--radius-lg)] text-sm font-medium
                transition-all duration-200
                ${activeTab === 'fusing'
                  ? 'bg-[var(--color-accent)] text-white shadow-md'
                  : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]'
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              <Flame size={16} />
              Fusing
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-text-muted)]/20 hover:scrollbar-thumb-[var(--color-primary)]/50">
          {/* Validation Warnings */}
          <ValidationWarnings warnings={warnings} onDismiss={onDismissWarning} />

          {activeTab === 'basic' ? (
            // =====================================================
            // BASIC (SEWING) PARAMETERS
            // =====================================================
            <div className="space-y-5">
              {/* Machine Type — Add/Remove per project */}
              <div className="relative z-50">
                <MachineTypeManager
                  value={inputs.machineTypeId}
                  onChange={value => onInputChange('machineTypeId', value)}
                  categoryFilter="sewing"
                />
              </div>

              {/* SMV (Standard Minute Value) — PRIMARY INPUT */}
              <div className="space-y-2 relative z-40">
                <NumberInput
                  label="SMV (Standard Minute Value)"
                  value={inputs.smv}
                  onChange={value => onInputChange('smv', value)}
                  min={0.1}
                  max={200}
                  step={0.5}
                />
                <Slider
                  value={inputs.smv}
                  onChange={value => onInputChange('smv', value)}
                  min={0.5}
                  max={100}
                  step={0.5}
                  showTooltip
                  showValue={false}
                  formatValue={v => `${v} min`}
                  marks={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' },
                  ]}
                />
              </div>

              {/* Number of Operators */}
              <div className="space-y-2 relative z-30">
                <NumberInput
                  label="Number of Operators"
                  value={inputs.numberOfOperators}
                  onChange={value => onInputChange('numberOfOperators', value)}
                  min={1}
                  max={10000}
                  step={1}
                />
                <Slider
                  value={inputs.numberOfOperators}
                  onChange={value => onInputChange('numberOfOperators', value)}
                  min={1}
                  max={500}
                  step={1}
                  showTooltip
                  showValue={false}
                  marks={[
                    { value: 50, label: '50' },
                    { value: 150, label: '150' },
                    { value: 300, label: '300' },
                    { value: 500, label: '500' },
                  ]}
                />
              </div>

              {/* Target Quantity */}
              <div className="space-y-2 relative z-20">
                <NumberInput
                  label="Target Quantity"
                  value={inputs.targetQuantity}
                  onChange={value => onInputChange('targetQuantity', value)}
                  min={VALIDATION_LIMITS.TARGET_QUANTITY_MIN}
                  max={1000000}
                  step={100}
                />
                <Slider
                  value={inputs.targetQuantity}
                  onChange={value => onInputChange('targetQuantity', value)}
                  min={100}
                  max={100000}
                  step={100}
                  showTooltip
                  showValue={false}
                />
              </div>

              {/* Working Hours/Day */}
              <NumberInput
                label="Working Hours / Day"
                value={inputs.workingHoursPerDay}
                onChange={value => onInputChange('workingHoursPerDay', value)}
                min={1}
                max={24}
                step={0.5}
              />

              {/* Duration */}
              <div className="relative z-10">
                <Select
                  label="Duration"
                  options={durationSelectOptions}
                  value={inputs.duration}
                  onChange={value => {
                    onInputChange('duration', value as CalculatorInputs['duration']);
                    // Auto-set default working days
                    const opt = durationOptions.find(d => d.value === value);
                    if (opt) onInputChange('workingDays', opt.defaultDays);
                  }}
                />
              </div>

              {/* Working Days */}
              <div className="space-y-2">
                <NumberInput
                  label="Working Days"
                  value={inputs.workingDays}
                  onChange={value => onInputChange('workingDays', value)}
                  min={1}
                  max={31}
                  step={1}
                />
                {/* Sat/Sun toggles */}
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.saturdayWork}
                      onChange={e => onInputChange('saturdayWork', e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--color-glass-border)] text-[var(--color-primary)] accent-[var(--color-primary)]"
                    />
                    Saturday
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.sundayWork}
                      onChange={e => onInputChange('sundayWork', e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--color-glass-border)] text-[var(--color-primary)] accent-[var(--color-primary)]"
                    />
                    Sunday
                  </label>
                </div>
              </div>

              {/* Efficiency Factor */}
              <Slider
                label="Efficiency Factor"
                value={inputs.efficiencyFactor * 100}
                onChange={value => onInputChange('efficiencyFactor', value / 100)}
                min={VALIDATION_LIMITS.EFFICIENCY_MIN * 100}
                max={VALIDATION_LIMITS.EFFICIENCY_MAX * 100}
                step={1}
                formatValue={v => `${v}%`}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' },
                ]}
              />
            </div>
          ) : activeTab === 'embroidery' ? (
            // =====================================================
            // EMBROIDERY PARAMETERS
            // =====================================================
            <div className="space-y-5">
              {/* Order Quantity */}
              <div className="space-y-2">
                <NumberInput
                  label="Order Quantity"
                  value={inputs.targetQuantity}
                  onChange={value => onInputChange('targetQuantity', value)}
                  min={1}
                  max={1000000}
                  step={100}
                />
              </div>

              {/* Punch Count */}
              <div className="space-y-2">
                <NumberInput
                  label="Punch Count (stitches/logo)"
                  value={inputs.punchCount}
                  onChange={value => onInputChange('punchCount', value)}
                  min={VALIDATION_LIMITS.PUNCH_COUNT_MIN}
                  max={VALIDATION_LIMITS.PUNCH_COUNT_MAX}
                  step={100}
                />
                <Slider
                  value={inputs.punchCount}
                  onChange={value => onInputChange('punchCount', value)}
                  min={VALIDATION_LIMITS.PUNCH_COUNT_MIN}
                  max={VALIDATION_LIMITS.PUNCH_COUNT_MAX}
                  step={100}
                  formatValue={v => v.toLocaleString()}
                  showValue={false}
                  marks={[
                    { value: 1000, label: '1K' },
                    { value: 25000, label: '25K' },
                    { value: 50000, label: '50K' },
                  ]}
                />
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <Gauge size={12} />
                  <span>
                    {inputs.punchCount < 5000
                      ? 'Simple'
                      : inputs.punchCount < 15000
                        ? 'Medium'
                        : inputs.punchCount < 35000
                          ? 'Complex'
                          : 'Very Complex'}{' '}
                    design
                  </span>
                </div>
              </div>

              {/* Machine Speed (Embroidery only) */}
              <SpeedPresets
                value={inputs.machineSpeed}
                onChange={speed => onInputChange('machineSpeed', speed)}
                min={VALIDATION_LIMITS.MACHINE_SPEED_MIN}
                max={VALIDATION_LIMITS.MACHINE_SPEED_MAX}
              />

              {/* Handling Time Per Piece */}
              <NumberInput
                label="Handling Time / Piece (min)"
                value={inputs.handlingTimePerPiece}
                onChange={value => onInputChange('handlingTimePerPiece', value)}
                min={0}
                max={30}
                step={0.5}
              />

              {/* Shift Hours */}
              <NumberInput
                label="Shift Hours"
                value={inputs.workingHoursPerDay}
                onChange={value => onInputChange('workingHoursPerDay', value)}
                min={1}
                max={24}
                step={0.5}
              />

              {/* Efficiency */}
              <Slider
                label="Efficiency"
                value={inputs.efficiencyFactor * 100}
                onChange={value => onInputChange('efficiencyFactor', value / 100)}
                min={50}
                max={100}
                step={1}
                formatValue={v => `${v}%`}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 80, label: '80%' },
                  { value: 100, label: '100%' },
                ]}
              />

              {/* Machine Head Count */}
              <HeadCountSelector
                value={inputs.headCount}
                onChange={count => onInputChange('headCount', count)}
                min={VALIDATION_LIMITS.HEAD_COUNT_MIN}
                max={VALIDATION_LIMITS.HEAD_COUNT_MAX}
              />

              {/* Thread Colors (Number only, no color picker) */}
              <div className="space-y-2">
                <NumberInput
                  label="Number of Colors"
                  value={inputs.threadColors}
                  onChange={value => onInputChange('threadColors', value)}
                  min={1}
                  max={VALIDATION_LIMITS.THREAD_COLORS_MAX}
                  step={1}
                />
                <p className="text-xs text-[var(--color-text-muted)] italic">No color selection needed — count only</p>
              </div>

              {/* Stitches */}
              <div className="space-y-2">
                <NumberInput
                  label="Stitches"
                  value={inputs.stitches}
                  onChange={value => onInputChange('stitches', value)}
                  min={1}
                  max={100000}
                  step={100}
                />
                <Slider
                  value={inputs.stitches}
                  onChange={value => onInputChange('stitches', value)}
                  min={100}
                  max={50000}
                  step={100}
                  showTooltip
                  showValue={false}
                  formatValue={v => v.toLocaleString()}
                  marks={[
                    { value: 5000, label: '5K' },
                    { value: 25000, label: '25K' },
                    { value: 50000, label: '50K' },
                  ]}
                />
              </div>
            </div>
          ) : (
            // =====================================================
            // FUSING & SUPPLEMENTARY PARAMETERS
            // =====================================================
            <div className="space-y-5">
              {/* Product Category */}
              <div className="relative z-50">
                <Select
                  label="Product Category"
                  options={fusingCategoryOptions}
                  value={inputs.fusingProductCategory}
                  onChange={value => onInputChange('fusingProductCategory', value)}
                />
              </div>

              {/* Fusing Time Per Piece (seconds) */}
              <div className="space-y-2">
                <NumberInput
                  label="Fusing Time / Piece (seconds)"
                  value={inputs.fusingTimePerPiece}
                  onChange={value => onInputChange('fusingTimePerPiece', value)}
                  min={1}
                  max={300}
                  step={1}
                />
                <Slider
                  value={inputs.fusingTimePerPiece}
                  onChange={value => onInputChange('fusingTimePerPiece', value)}
                  min={5}
                  max={120}
                  step={1}
                  showTooltip
                  showValue={false}
                  formatValue={v => `${v}s`}
                />
              </div>

              {/* Working Hours */}
              <NumberInput
                label="Working Hours / Day"
                value={inputs.workingHoursPerDay}
                onChange={value => onInputChange('workingHoursPerDay', value)}
                min={1}
                max={24}
                step={0.5}
              />

              {/* Daily Quantity */}
              <div className="space-y-2">
                <NumberInput
                  label="Daily Quantity Required"
                  value={inputs.fusingDailyQuantity}
                  onChange={value => onInputChange('fusingDailyQuantity', value)}
                  min={1}
                  max={100000}
                  step={100}
                />
                <Slider
                  value={inputs.fusingDailyQuantity}
                  onChange={value => onInputChange('fusingDailyQuantity', value)}
                  min={100}
                  max={10000}
                  step={100}
                  showTooltip
                  showValue={false}
                />
              </div>

              {/* Efficiency */}
              <Slider
                label="Efficiency"
                value={inputs.efficiencyFactor * 100}
                onChange={value => onInputChange('efficiencyFactor', value / 100)}
                min={50}
                max={100}
                step={1}
                formatValue={v => `${v}%`}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 80, label: '80%' },
                  { value: 100, label: '100%' },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputsPanel.displayName = 'InputsPanel';
