/**
 * Dashboard Page
 * Main dashboard with draggable widgets, widget palette, and presentation mode
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  Presentation,
  Edit3,
  Check,
  RotateCcw,
  Download,
} from 'lucide-react';

import { DashboardGrid, WidgetPalette } from '../../components/dashboard';
import { defaultDashboardWidgets } from '../../mocks/dashboard';
import { DashboardWidget, WidgetType, widgetLibrary } from '../../types/dashboard';

// Local storage key for saving dashboard layout
const STORAGE_KEY = 'apparel-dashboard-layout';

export function DashboardPage() {
  // State
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved layout on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWidgets(parsed);
      } catch {
        setWidgets(defaultDashboardWidgets);
      }
    } else {
      setWidgets(defaultDashboardWidgets);
    }
  }, []);

  // Handle layout changes
  const handleLayoutChange = useCallback((updatedWidgets: DashboardWidget[]) => {
    setWidgets(updatedWidgets);
    setHasChanges(true);
  }, []);

  // Add new widget
  const handleAddWidget = useCallback((type: WidgetType) => {
    const widgetDef = widgetLibrary.find((w) => w.type === type);
    if (!widgetDef) return;

    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: widgetDef.name,
      x: 0,
      y: Infinity, // Will be placed at the bottom
      w: widgetDef.defaultSize.w,
      h: widgetDef.defaultSize.h,
      config: {},
    };

    setWidgets((prev) => [...prev, newWidget]);
    setHasChanges(true);
  }, []);

  // Remove widget
  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setHasChanges(true);
  }, []);

  // Save layout
  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    setHasChanges(false);
    setIsEditing(false);
  }, [widgets]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setWidgets(defaultDashboardWidgets);
    setHasChanges(true);
  }, []);

  // Toggle presentation mode
  const handlePresentationMode = useCallback(() => {
    setIsPresentationMode((prev) => !prev);
    if (!isPresentationMode) {
      setIsEditing(false);
    }
  }, [isPresentationMode]);

  // Exit presentation mode on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresentationMode) {
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode]);

  return (
    <>
      <motion.div
        className={`h-full flex flex-col ${isPresentationMode ? 'fixed inset-0 z-50 bg-[var(--color-bg)]' : ''}`}
        animate={isPresentationMode ? { padding: 24 } : { padding: 0 }}
      >
        {/* Toolbar */}
        <AnimatePresence>
          {!isPresentationMode && (
            <motion.div
              className="flex items-center justify-between mb-4 px-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Dashboard
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {widgets.length} widgets • {isEditing ? 'Editing mode' : 'View mode'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Reset button */}
                {isEditing && (
                  <motion.button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)] text-sm
                      text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] transition-colors"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    title="Reset to defaults"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </motion.button>
                )}

                {/* Add widget button */}
                {isEditing && (
                  <motion.button
                    onClick={() => setIsPaletteOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)] text-sm
                      bg-[var(--color-glass)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Plus size={16} />
                    Add Widget
                  </motion.button>
                )}

                {/* Save button */}
                {isEditing && hasChanges && (
                  <motion.button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium
                      bg-[var(--color-success)] text-white hover:opacity-90 transition-opacity"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Save size={16} />
                    Save Layout
                  </motion.button>
                )}

                {/* Edit toggle */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium transition-colors
                    ${isEditing
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-glass)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white'
                    }`}
                >
                  {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                  {isEditing ? 'Done' : 'Edit'}
                </button>

                {/* Presentation mode */}
                <button
                  onClick={handlePresentationMode}
                  className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium
                    bg-[var(--color-glass)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                  title="Presentation mode (Esc to exit)"
                >
                  <Presentation size={16} />
                  Present
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presentation mode header */}
        {isPresentationMode && (
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                APPAREL Dashboard
              </h1>
              <p className="text-[var(--color-text-muted)]">
                Press <kbd className="px-2 py-0.5 rounded bg-[var(--color-glass)] text-xs">Esc</kbd> to exit presentation mode
              </p>
            </div>
            <button
              onClick={() => setIsPresentationMode(false)}
              className="px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium
                bg-[var(--color-glass)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Exit
            </button>
          </motion.div>
        )}

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-auto">
          {widgets.length > 0 ? (
            <DashboardGrid
              widgets={widgets}
              columns={4}
              rowHeight={120}
              isEditing={isEditing}
              onLayoutChange={handleLayoutChange}
              onRemoveWidget={handleRemoveWidget}
            />
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 mb-4 rounded-[var(--radius-2xl)] bg-[var(--color-glass)] flex items-center justify-center">
                <Download size={32} className="text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                No widgets yet
              </h3>
              <p className="text-[var(--color-text-muted)] mb-4 max-w-sm">
                Click "Edit" then "Add Widget" to start building your dashboard
              </p>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsPaletteOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-lg)] text-sm font-medium
                  bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Add Your First Widget
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Widget Palette */}
      <WidgetPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </>
  );
}
