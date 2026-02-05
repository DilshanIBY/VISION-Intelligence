/**
 * MachineryCalculatorPage
 * Calculate machine requirements with What-If scenarios
 * @requirement P3-PG-CALC-001 to P3-PG-CALC-019
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Download,
  Share2,
  Plus,
  RotateCcw,
  Presentation,
  Check,
  Edit3
} from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

// Calculator Components
import { InputsPanel } from '@components/calculator/InputsPanel';
import { OutputsPanel } from '@components/calculator/OutputsPanel';
import { ScenarioCard } from '@components/calculator/ScenarioCard';

// Mock Data & Functions
import {
  defaultCalculatorInputs,
  mockScenarios,
  calculateMockResults,
  type CalculatorInputs,
  type CalculatorOutputs,
  type Scenario,
  type ValidationWarning,
} from '@mocks/calculator';
import { validateThreadColorImpact } from '@/types/validation/calculation-schemas';

export function MachineryCalculatorPage() {
  // Global UI State
  const {
    isDashboardEditing: isEditing,
    setDashboardEditing: setIsEditing,
    isPresentationMode,
    setPresentationMode: setIsPresentationMode
  } = useUI();

  // State
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultCalculatorInputs);
  const [outputs, setOutputs] = useState<CalculatorOutputs>(() => calculateMockResults(defaultCalculatorInputs));
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  // Recalculate when inputs change
  useEffect(() => {
    const newOutputs = calculateMockResults(inputs);
    setOutputs(newOutputs);

    // Check validation rules
    const newWarnings: ValidationWarning[] = [];
    const threadWarning = validateThreadColorImpact(inputs.threadColors);
    if (threadWarning.warning) {
      newWarnings.push({
        id: 'thread-colors',
        severity: 'warning',
        message: threadWarning.message!,
        field: 'threadColors',
      });
    }
    setWarnings(newWarnings);
  }, [inputs]);

  // Exit presentation mode on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, setIsPresentationMode]);

  // Input change handler
  const handleInputChange = useCallback(<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  // Dismiss warning handler
  const handleDismissWarning = useCallback((id: string) => {
    setWarnings(prev => prev.filter(w => w.id !== id));
  }, []);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setInputs(defaultCalculatorInputs);
  }, []);

  // Save current as scenario
  const handleSaveScenario = useCallback(() => {
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length}`,
      isBaseline: false,
      inputs: { ...inputs },
      outputs: { ...outputs },
    };
    setScenarios(prev => [...prev, newScenario]);
  }, [inputs, outputs, scenarios.length]);

  // Remove scenario
  const handleRemoveScenario = useCallback((id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
    if (selectedScenarioId === id) setSelectedScenarioId(null);
  }, [selectedScenarioId]);

  // Select scenario
  const handleSelectScenario = useCallback((scenario: Scenario) => {
    setSelectedScenarioId(scenario.id);
    if (scenario.inputs) {
      setInputs(prev => ({ ...prev, ...scenario.inputs }));
    }
  }, []);

  // Rename scenario
  const handleRenameScenario = useCallback((id: string, newName: string) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  }, []);

  const baselineOutputs = scenarios.find(s => s.isBaseline)?.outputs;

  return (
    <motion.div
      className={`h-full flex flex-col ${isPresentationMode ? 'fixed inset-0 z-50 bg-[var(--color-bg)]' : ''}`}
      animate={isPresentationMode ? { padding: 24 } : { padding: 0 }}
    >
      {/* Page Header */}
      <AnimatePresence>
        {!isPresentationMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-none items-center justify-between mb-4 px-1"
          >
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] flex items-center justify-center text-white shadow-md">
                  <Calculator size={20} />
                </div>
                Machinery Calculator
              </h2>
              <span className="text-xs text-text-muted mt-1 font-medium pl-14">
                Calculate machine requirements • {isEditing ? 'Editing Layout' : 'View Mode'}
              </span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleReset}
                className="h-10 px-4 rounded-full flex items-center justify-center gap-2 bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Reset to defaults"
              >
                <RotateCcw size={16} />
                Reset
              </motion.button>

              <div className="w-px h-6 bg-glass-border mx-1" />

              {/* Edit Mode Toggle */}
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all border border-transparent
                  ${isEditing
                    ? 'bg-text-primary text-bg shadow-lg hover:scale-105'
                    : 'bg-surface hover:bg-white text-text-secondary hover:text-primary hover:border-glass-border hover:shadow-float'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isEditing ? "Done Editing" : "Edit Layout"}
              >
                {isEditing ? <Check size={18} /> : <Edit3 size={18} />}
              </motion.button>

              {/* Presentation Mode */}
              <motion.button
                onClick={() => setIsPresentationMode(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Presentation Mode"
              >
                <Presentation size={18} />
              </motion.button>

              <div className="w-px h-6 bg-glass-border mx-1" />

              <motion.button
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Export"
              >
                <Download size={18} />
              </motion.button>
              <motion.button
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Share"
              >
                <Share2 size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presentation Mode Exit Button */}
      {isPresentationMode && (
        <motion.div
          className="absolute top-6 right-6 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setIsPresentationMode(false)}
            className="px-4 py-2 rounded-full text-sm font-medium
              bg-glass-heavy text-text-primary hover:bg-surface border border-glass-border shadow-float transition-all backdrop-blur-md"
          >
            Exit Presentation
          </button>
        </motion.div>
      )}

      {/* Main Content - Scrollable container for page content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4">
        {/* Two-panel layout */}
        <div className="flex gap-4">
          {/* Left: Inputs Panel (40%) */}
          <InputsPanel
            inputs={inputs}
            onInputChange={handleInputChange}
            warnings={warnings}
            onDismissWarning={handleDismissWarning}
            className="w-[40%] flex-shrink-0 self-start sticky top-0 z-30"
          />

          {/* Right: Outputs Panel (60%) */}
          <div className="flex-1 flex flex-col gap-4">
            <OutputsPanel
              outputs={outputs}
              deadline={inputs.deadline}
              className="w-full"
            />
          </div>
        </div>

        {/* What-If Playground */}
        <div className="flex-none mt-4 p-4 bg-[var(--color-glass)] backdrop-blur-md rounded-[var(--radius-2xl)] border border-[var(--color-glass-border)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              What-If Scenarios
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">
              {scenarios.length} scenarios compared
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                baseline={baselineOutputs}
                onSelect={() => handleSelectScenario(scenario)}
                onRemove={scenario.isBaseline ? undefined : () => handleRemoveScenario(scenario.id)}
                onRename={(newName) => handleRenameScenario(scenario.id, newName)}
                isSelected={selectedScenarioId === scenario.id}
                className="flex-shrink-0 w-48"
              />
            ))}

            {/* Add Scenario Button */}
            <motion.button
              onClick={handleSaveScenario}
              className="flex-shrink-0 w-48 p-4 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-glass-border)] hover:border-[var(--color-primary)] flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={24} />
              <span className="text-sm font-medium">Save Current</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
