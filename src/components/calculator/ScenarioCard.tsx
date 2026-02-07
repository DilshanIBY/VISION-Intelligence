/**
 * ScenarioCard - What-If scenario comparison card with delta indicators
 * @requirement P3-PG-CALC-017, P3-PG-CALC-018
 */

import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Star, X, Edit2, Check } from 'lucide-react';
import type { Scenario, CalculatorOutputs } from '@mocks/calculator';

export interface ScenarioCardProps {
  scenario: Scenario;
  baseline?: CalculatorOutputs;
  onRemove?: () => void;
  onRename?: (newName: string) => void;
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
}

interface DeltaDisplay {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  formatted: string;
}

function calculateDelta(current: number, baseline: number): DeltaDisplay {
  const diff = current - baseline;
  const percentage = baseline !== 0 ? (diff / baseline) * 100 : 0;

  return {
    value: diff,
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
    formatted: diff === 0 ? '—' : `${diff > 0 ? '+' : ''}${percentage.toFixed(0)}%`,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const ScenarioCard = forwardRef<HTMLDivElement, ScenarioCardProps>(
  (
    { scenario, baseline, onRemove, onRename, onSelect, isSelected = false, className = '' },
    ref
  ) => {
    const { outputs, isBaseline, name } = scenario;

    const machineDelta = baseline
      ? calculateDelta(outputs.machinesRequired, baseline.machinesRequired)
      : null;
    const costDelta = baseline ? calculateDelta(outputs.costEstimate, baseline.costEstimate) : null;
    const daysDelta = baseline
      ? calculateDelta(outputs.totalProductionDays, baseline.totalProductionDays)
      : null;

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);

    useEffect(() => setTempName(name), [name]);

    const handleSaveName = (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      if (tempName.trim() && onRename) {
        onRename(tempName);
      } else {
        setTempName(name); // Revert if empty
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSaveName(e);
      if (e.key === 'Escape') {
        e.stopPropagation();
        setTempName(name);
        setIsEditing(false);
      }
    };

    const DeltaIndicator = ({
      delta,
      inverseColor = false,
    }: {
      delta: DeltaDisplay;
      inverseColor?: boolean;
    }) => {
      if (delta.direction === 'neutral') {
        return <Minus size={12} className="text-[var(--color-text-muted)]" />;
      }

      // For cost/days, down is good (green), up is bad (red)
      // For utilization, up is good, down is bad - use inverseColor
      const isGood = inverseColor ? delta.direction === 'up' : delta.direction === 'down';

      return (
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${isGood ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
        >
          {delta.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta.formatted}
        </span>
      );
    };

    return (
      <motion.div
        ref={ref}
        onClick={onSelect}
        className={`
          relative p-4 rounded-[var(--radius-xl)] cursor-pointer
          transition-all duration-200
          ${
            isBaseline
              ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white'
              : isSelected
                ? 'bg-[var(--color-surface)] border-2 border-[var(--color-primary)] shadow-lg'
                : 'bg-[var(--color-glass)] border border-[var(--color-glass-border)] hover:border-[var(--color-primary)] hover:shadow-md'
          }
          ${className}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Remove button for non-baseline scenarios */}
        {!isBaseline && onRemove && (
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--color-glass)] hover:bg-[var(--color-error)] hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
        )}

        {/* Baseline indicator */}
        {isBaseline && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-medium opacity-80">
            <Star size={12} fill="currentColor" />
            Base
          </div>
        )}

        {/* Scenario name */}
        {isEditing ? (
          <div className="mb-3 flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => handleSaveName()}
              autoFocus
              className="w-full text-sm font-semibold bg-white/20 text-[var(--color-text-primary)] rounded px-1 py-0.5 outline-none border border-[var(--color-primary)] placeholder-white/50"
            />
            <button
              onClick={handleSaveName}
              className="p-1 hover:bg-white/20 rounded-full text-[var(--color-success)]"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div className="group flex items-center justify-start gap-2 mb-3 pr-6">
            <h4
              className={`text-sm font-semibold ${isBaseline ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
            >
              {name}
            </h4>
            {!isBaseline && onRename && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--color-surface)] rounded-full transition-all text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                title="Rename"
              >
                <Edit2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="space-y-2">
          {/* Machines Required */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${isBaseline ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}
            >
              Machines
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${isBaseline ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
              >
                {outputs.machinesRequired}
              </span>
              {machineDelta && !isBaseline && <DeltaIndicator delta={machineDelta} />}
            </div>
          </div>

          {/* Cost */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${isBaseline ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}
            >
              Cost
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${isBaseline ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
              >
                {formatCurrency(outputs.costEstimate)}
              </span>
              {costDelta && !isBaseline && <DeltaIndicator delta={costDelta} />}
            </div>
          </div>

          {/* Days */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${isBaseline ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}
            >
              Days
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${isBaseline ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
              >
                {outputs.totalProductionDays}
              </span>
              {daysDelta && !isBaseline && <DeltaIndicator delta={daysDelta} />}
            </div>
          </div>

          {/* Utilization */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${isBaseline ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}
            >
              Utilization
            </span>
            <span
              className={`text-sm font-semibold ${isBaseline ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
            >
              {Math.round(outputs.utilizationRate * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

ScenarioCard.displayName = 'ScenarioCard';
