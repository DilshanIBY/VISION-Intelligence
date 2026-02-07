/**
 * Dashboard Page
 * Main dashboard with draggable widgets, widget palette, and presentation mode
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, RotateCcw, Download, Edit3, Check, Presentation } from 'lucide-react';
import { useUI } from '../../contexts/UIContextDefinition';

import { DashboardGrid, WidgetPalette } from '../../components/dashboard';
import { defaultDashboardWidgets } from '../../mocks/dashboard';
import { DashboardWidget, WidgetType, widgetLibrary } from '../../types/dashboard';
import { RightSidebar, ExportPanel, ExportOptions } from '../../components/floor-layout';

// Local storage key for saving dashboard layout
const STORAGE_KEY = 'apparel-dashboard-layout';

export function DashboardPage() {
  // Global UI State
  const {
    isDashboardEditing: isEditing,
    setDashboardEditing: setIsEditing,
    isPresentationMode,
    setPresentationMode: setIsPresentationMode,
  } = useUI();

  // Local State
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'none' | 'export'>('none');

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
    const widgetDef = widgetLibrary.find(w => w.type === type);
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

    setWidgets(prev => [...prev, newWidget]);
    setHasChanges(true);
  }, []);

  // Remove widget
  const handleRemoveWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    setHasChanges(true);
  }, []);

  // Save layout
  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    setHasChanges(false);
    setIsEditing(false);
  }, [widgets, setIsEditing]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setWidgets(defaultDashboardWidgets);
    setHasChanges(true);
  }, []);

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

  const handleExport = useCallback((format: 'png' | 'pdf', options: ExportOptions) => {
    console.log('Exporting Dashboard:', format, options);
    // Mock export logic
    setActiveSidebar('none');
  }, []);

  return (
    <>
      <motion.div
        className={`h-full flex flex-col ${isPresentationMode ? 'fixed inset-0 z-50 bg-[var(--color-bg)]' : ''}`}
        animate={isPresentationMode ? { padding: 24 } : { padding: 0 }}
      >
        {/* Editing Action Bar - Visible when Editing */}
        {/* Dashboard Header - Hidden in Presentation Mode */}
        {!isPresentationMode && (
          <div className="flex flex-none items-center justify-between mb-6 px-1">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h2>
              <span className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isEditing ? 'bg-warning animate-pulse' : 'bg-success'}`}
                ></span>
                {widgets.length} widgets • {isEditing ? 'Editing Layout' : 'View mode'}
              </span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  <button
                    onClick={() => setIsPaletteOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                            bg-primary text-white hover:bg-primary-hover shadow-glow-primary transition-all mr-2"
                  >
                    <Plus size={16} />
                    Add Widget
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-2 rounded-full bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border transition-all"
                    title="Reset Layout"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    onClick={handleSave}
                    className={`p-2 rounded-full transition-all border border-transparent ${hasChanges ? 'bg-surface text-success hover:bg-white' : 'text-text-muted opacity-50'}`}
                    title="Save Layout"
                  >
                    <Save size={18} />
                  </button>

                  <div className="w-px h-6 bg-glass-border mx-1" />
                </>
              )}

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
                title={isEditing ? 'Done Editing' : 'Edit Layout'}
              >
                {isEditing ? <Check size={18} /> : <Edit3 size={18} />}
              </motion.button>

              <motion.button
                onClick={() => setActiveSidebar('export')}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all border border-transparent
                  ${activeSidebar === 'export'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-surface hover:bg-white text-text-secondary hover:text-primary hover:border-glass-border hover:shadow-float'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Export"
              >
                <Download size={18} />
              </motion.button>

              <motion.button
                onClick={() => setIsPresentationMode(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Presentation Mode"
              >
                <Presentation size={18} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Presentation mode header - Simplified for Full Screen */}
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

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-auto">
          {widgets.length > 0 ? (
            <DashboardGrid
              widgets={widgets}
              columns={4}
              rowHeight={10}
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

      {/* Export Sidebar */}
      <RightSidebar
        isOpen={activeSidebar === 'export'}
        onClose={() => setActiveSidebar('none')}
        title="Export Dashboard"
      >
        <ExportPanel onExport={handleExport} />
      </RightSidebar>
    </>
  );
}
