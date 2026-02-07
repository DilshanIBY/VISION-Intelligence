/**
 * InputsPanel - Left panel containing all calculator input controls
 * @requirement P3-PG-CALC-002 to P3-PG-CALC-010
 */

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Palette, Gauge } from 'lucide-react';

// UI Components
import { Select } from '@components/ui/inputs/Select';
import { NumberInput } from '@components/ui/inputs/NumberInput';
import { Slider } from '@components/ui/inputs/Slider';
import { DatePicker } from '@components/ui/inputs/DatePicker';
import { TimePicker } from '@components/ui/inputs/TimePicker';
import { ColorPicker } from '@components/ui/inputs/ColorPicker';

// Calculator Components
import { HeadCountSelector } from './HeadCountSelector';
import { SpeedPresets } from './SpeedPresets';
import { ValidationWarnings } from './ValidationWarnings';

// Mock Data
import {
  mockMachineTypes,
  mockThreadColors,
  type CalculatorInputs,
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
    const [activeTab, setActiveTab] = useState<'basic' | 'embroidery'>('basic');

    // Convert machine types to Select options
    const machineOptions = mockMachineTypes.map(mt => ({
      value: mt.id,
      label: mt.name,
      group: mt.category.charAt(0).toUpperCase() + mt.category.slice(1),
    }));

    // Convert thread colors to ColorPicker format
    const threadColorOptions = mockThreadColors.map(tc => ({
      value: tc.hex,
      label: tc.name,
    }));

    return (
      <div
        ref={ref}
        className={`flex flex-col bg-[var(--color-glass)] backdrop-blur-md rounded-[var(--radius-2xl)] border border-[var(--color-glass-border)] overflow-hidden ${className}`}
      >
        {/* Panel Header with Tabs */}
        <div className="flex-none p-4 border-b border-[var(--color-glass-border)]">
          <div className="flex gap-2">
            <motion.button
              onClick={() => setActiveTab('basic')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-lg)] text-sm font-medium
                transition-all duration-200
                ${
                  activeTab === 'basic'
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]'
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              <Settings2 size={16} />
              Basic
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('embroidery')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-lg)] text-sm font-medium
                transition-all duration-200
                ${
                  activeTab === 'embroidery'
                    ? 'bg-[var(--color-secondary)] text-white shadow-md'
                    : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]'
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              <Palette size={16} />
              Embroidery
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--color-text-muted)]/20 hover:scrollbar-thumb-[var(--color-primary)]/50">
          {/* Validation Warnings */}
          <ValidationWarnings warnings={warnings} onDismiss={onDismissWarning} />

          {activeTab === 'basic' ? (
            // Basic Parameters
            <div className="space-y-5">
              {/* Machine Type - P3-PG-CALC-002 */}
              {/* Machine Type - P3-PG-CALC-002 */}
              <div className="relative z-50">
                <Select
                  label="Machine Type"
                  placeholder="Search machine..."
                  options={machineOptions}
                  value={inputs.machineTypeId}
                  onChange={value => onInputChange('machineTypeId', value)}
                  searchable
                />
              </div>

              {/* Target Quantity - P3-PG-CALC-003 */}
              {/* Target Quantity - P3-PG-CALC-003 */}
              <div className="space-y-2 relative z-40">
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

              {/* Working Hours/Day - P3-PG-CALC-004 */}
              <div className="relative z-30">
                <TimePicker
                  label="Working Hours/Day"
                  value={`${Math.floor(inputs.workingHoursPerDay)}:${Math.round(
                    (inputs.workingHoursPerDay % 1) * 60
                  )
                    .toString()
                    .padStart(2, '0')}`}
                  onChange={time => {
                    const [hours, minutes] = time.split(':').map(Number);
                    onInputChange('workingHoursPerDay', hours + minutes / 60);
                  }}
                />
              </div>

              {/* Deadline - P3-PG-CALC-005 */}
              {/* Deadline - P3-PG-CALC-005 */}
              <div className="relative z-20">
                <DatePicker
                  label="Production Deadline"
                  value={new Date(inputs.deadline)}
                  onChange={date => {
                    if (date) onInputChange('deadline', date.toISOString());
                  }}
                  minDate={new Date()}
                />
              </div>

              {/* Efficiency Factor - P3-PG-CALC-006 */}
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
          ) : (
            // Embroidery Parameters
            <div className="space-y-5">
              {/* Punch Count - P3-PG-CALC-007 */}
              <div className="space-y-2">
                <NumberInput
                  label="Punch Count (Stitches)"
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
                {/* Visual scale indicator */}
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

              {/* Thread Colors - P3-PG-CALC-008 */}
              <div className="space-y-2 relative z-40">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Thread Colors
                  </label>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {inputs.threadColors} colors
                  </span>
                </div>
                <ColorPicker
                  colors={threadColorOptions}
                  value={inputs.selectedThreadColors || []}
                  onChange={colors => {
                    onInputChange('selectedThreadColors', colors);
                    onInputChange('threadColors', colors.length);
                  }}
                  maxSelection={VALIDATION_LIMITS.THREAD_COLORS_MAX}
                />
                <Slider
                  value={inputs.threadColors}
                  min={1}
                  max={VALIDATION_LIMITS.THREAD_COLORS_MAX}
                  step={1}
                  onChange={val => {
                    onInputChange('threadColors', val);
                    // Update selected colors array to match count
                    const current = inputs.selectedThreadColors || [];
                    let newColors = [...current];
                    if (val < current.length) {
                      newColors = newColors.slice(0, val);
                    } else if (val > current.length) {
                      // Add colors from palette that aren't already selected
                      const available = threadColorOptions
                        .map(o => o.value)
                        .filter(c => !current.includes(c));
                      newColors = [...newColors, ...available.slice(0, val - current.length)];
                    }
                    onInputChange('selectedThreadColors', newColors);
                  }}
                  showValue={false}
                />
              </div>

              {/* Head Count - P3-PG-CALC-009 */}
              <HeadCountSelector
                value={inputs.headCount}
                onChange={count => onInputChange('headCount', count)}
                min={VALIDATION_LIMITS.HEAD_COUNT_MIN}
                max={VALIDATION_LIMITS.HEAD_COUNT_MAX}
              />

              {/* Machine Speed - P3-PG-CALC-010 */}
              <SpeedPresets
                value={inputs.machineSpeed}
                onChange={speed => onInputChange('machineSpeed', speed)}
                min={VALIDATION_LIMITS.MACHINE_SPEED_MIN}
                max={VALIDATION_LIMITS.MACHINE_SPEED_MAX}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputsPanel.displayName = 'InputsPanel';
