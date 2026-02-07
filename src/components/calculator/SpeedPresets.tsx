/**
 * SpeedPresets - Quick-select buttons for machine speed with custom input
 * @requirement P3-PG-CALC-010
 */

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { embroiderySpeedPresets, type SpeedPreset } from '@mocks/calculator';

export interface SpeedPresetsProps {
  value: number;
  onChange: (speed: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export const SpeedPresets = forwardRef<HTMLDivElement, SpeedPresetsProps>(
  (
    { value, onChange, min = 100, max = 1200, label = 'Machine Speed (SPM)', className = '' },
    ref
  ) => {
    const [isCustom, setIsCustom] = useState(() => {
      return !embroiderySpeedPresets.some(p => p.value === value);
    });
    const [customValue, setCustomValue] = useState(value.toString());

    const handlePresetClick = (preset: SpeedPreset) => {
      setIsCustom(false);
      onChange(preset.value);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomValue(e.target.value);
      const num = parseInt(e.target.value, 10);
      if (!isNaN(num) && num >= min && num <= max) {
        onChange(num);
      }
    };

    const handleCustomFocus = () => {
      setIsCustom(true);
      setCustomValue(value.toString());
    };

    const selectedPreset = embroiderySpeedPresets.find(p => p.value === value);

    return (
      <div ref={ref} className={`space-y-3 ${className}`}>
        {/* Label */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <Zap size={14} />
            {label}
          </label>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {value} SPM
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="flex gap-2">
          {embroiderySpeedPresets.map(preset => {
            const isActive = !isCustom && preset.value === value;
            return (
              <motion.button
                key={preset.value}
                onClick={() => handlePresetClick(preset)}
                className={`
                  flex-1 py-2.5 px-3 rounded-[var(--radius-lg)] text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-md'
                      : 'bg-[var(--color-glass)] text-[var(--color-text-secondary)] hover:bg-[var(--color-glass-border)] hover:text-[var(--color-text-primary)]'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={preset.description}
              >
                {preset.label}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleCustomFocus}
            className={`
              px-3 py-2 rounded-[var(--radius-lg)] text-sm font-medium
              transition-all duration-200
              ${
                isCustom
                  ? 'bg-[var(--color-secondary)] text-white shadow-md'
                  : 'bg-[var(--color-glass)] text-[var(--color-text-muted)] hover:bg-[var(--color-glass-border)]'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Custom
          </motion.button>

          <div className="relative flex-1">
            <input
              type="number"
              value={isCustom ? customValue : value}
              onChange={handleCustomChange}
              onFocus={handleCustomFocus}
              min={min}
              max={max}
              className={`
                w-full px-3 py-2 rounded-[var(--radius-lg)] text-sm
                bg-[var(--color-glass)] border border-[var(--color-glass-border)]
                text-[var(--color-text-primary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200
                ${isCustom ? 'ring-2 ring-[var(--color-secondary)]' : ''}
              `}
              placeholder={`${min}-${max}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)]">
              SPM
            </span>
          </div>
        </div>

        {/* Description */}
        {selectedPreset && !isCustom && (
          <p className="text-xs text-[var(--color-text-muted)]">{selectedPreset.description}</p>
        )}
      </div>
    );
  }
);

SpeedPresets.displayName = 'SpeedPresets';
