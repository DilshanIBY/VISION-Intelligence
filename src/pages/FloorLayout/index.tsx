/**
 * FloorLayoutPage
 * Visual drag-and-drop factory floor planning with automatic space calculations
 * @requirement P3-PG-FLOOR-001 to P3-PG-FLOOR-019
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  Grid3X3,
  Save,
  RotateCcw,
  Download,
  LayoutTemplate,
  Presentation,
  Check,
  Edit3,
  AlertTriangle,
} from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

// Floor Layout Components
import {
  ParametersPanel,
  DepartmentPalette,
  DepartmentBlock,
  GridCanvas,
  CanvasControls,
  FloorTabs,
  FlowArrows,
  ValidationOverlay,
  LayoutTemplates,
  ExportPanel,
  MeasurementTool,
  RightSidebar,
  type ExportOptions,
} from '@components/floor-layout';

// Mock Data
import {
  defaultFloorLayoutInputs,
  calculateDepartmentAreas,
  validateLayout,
  departmentTypes,
  mockPlacedDepartments,
  type FloorLayoutInputs,
  type PlacedDepartment,
  type CalculatedDepartmentArea,
  type ValidationWarning,
  type LayoutTemplate as LayoutTemplateType,
} from '@mocks/floor-layout';


export function FloorLayoutPage() {
  // Global UI State
  const {
    isDashboardEditing: isEditing,
    setDashboardEditing: setIsEditing,
    isPresentationMode,
    setPresentationMode,
  } = useUI();

  // Layout Parameters State
  const [inputs, setInputs] = useState<FloorLayoutInputs>(defaultFloorLayoutInputs);

  // Placed Departments State
  const [departments, setDepartments] = useState<PlacedDepartment[]>(mockPlacedDepartments);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  // Canvas State
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [showGrid, setShowGrid] = useState(true);
  const [showFlowArrows, setShowFlowArrows] = useState(true);

  // UI State
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'none' | 'export' | 'validation'>('none');
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Drag State
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<CalculatedDepartmentArea | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Calculate department areas based on inputs
  const calculatedAreas = useMemo(
    () => calculateDepartmentAreas(inputs),
    [inputs]
  );

  // Calculate total area
  const totalArea = useMemo(
    () => calculatedAreas.reduce((sum, d) => sum + d.calculatedArea, 0),
    [calculatedAreas]
  );

  // Get placed department type IDs
  const placedDepartmentIds = useMemo(
    () => departments.map(d => d.departmentTypeId),
    [departments]
  );

  // Validate layout
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  useEffect(() => {
    const newWarnings = validateLayout(departments, inputs);
    setWarnings(newWarnings);
  }, [departments, inputs]);

  // Exit presentation mode on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPresentationMode) setPresentationMode(false);
        if (isMeasuring) setIsMeasuring(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, isMeasuring, setPresentationMode]);

  // Input change handler
  const handleInputChange = useCallback(<K extends keyof FloorLayoutInputs>(
    key: K,
    value: FloorLayoutInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  // Reset layout
  const handleReset = useCallback(() => {
    setInputs(defaultFloorLayoutInputs);
    setDepartments([]);
    setSelectedDepartmentId(null);
    setActiveFloorIndex(0);
    setZoom(1);
    setPan({ x: 20, y: 20 });
  }, []);

  // Remove department
  const handleRemoveDepartment = useCallback((id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    if (selectedDepartmentId === id) setSelectedDepartmentId(null);
  }, [selectedDepartmentId]);

  // Zoom controls
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(2, z + 0.25)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.25, z - 0.25)), []);
  const handleFitToScreen = useCallback(() => {
    setZoom(0.8);
    setPan({ x: 20, y: 20 });
  }, []);
  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 20, y: 20 });
  }, []);

  // Floor management
  const handleAddFloor = useCallback(() => {
    if (inputs.buildingFloors < 10) {
      setInputs(prev => ({ ...prev, buildingFloors: prev.buildingFloors + 1 }));
    }
  }, [inputs.buildingFloors]);

  const handleRemoveFloor = useCallback((index: number) => {
    if (inputs.buildingFloors > 1) {
      setDepartments(prev => prev.filter(d => d.floorIndex !== index));
      setInputs(prev => ({ ...prev, buildingFloors: prev.buildingFloors - 1 }));
      if (activeFloorIndex >= index && activeFloorIndex > 0) {
        setActiveFloorIndex(activeFloorIndex - 1);
      }
    }
  }, [inputs.buildingFloors, activeFloorIndex]);

  // Template selection
  const handleSelectTemplate = useCallback((template: LayoutTemplateType) => {
    // Apply template inputs
    setInputs(prev => ({ ...prev, ...template.inputs }));

    // Apply template departments
    const newDepartments: PlacedDepartment[] = template.departments.map((d, i) => {
      const areaInfo = calculateDepartmentAreas({ ...inputs, ...template.inputs })
        .find(a => a.departmentTypeId === d.departmentTypeId);

      return {
        ...d,
        id: `dept-${Date.now()}-${i}`,
        calculatedArea: areaInfo?.calculatedArea || 100,
      };
    });

    setDepartments(newDepartments);
    setActiveFloorIndex(0);
  }, [inputs]);

  // Export handler
  const handleExport = useCallback((format: 'png' | 'pdf', options: ExportOptions) => {
    console.log('Export:', format, options);
    // Mock export - in production would generate actual file
  }, []);

  // Dismiss warning
  const handleDismissWarning = useCallback((id: string) => {
    setWarnings(prev => prev.filter(w => w.id !== id));
  }, []);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);

    if (active.data.current?.type === 'department') {
      const deptTypeId = active.data.current.departmentTypeId;
      const deptArea = calculatedAreas.find(d => d.departmentTypeId === deptTypeId);
      setActiveDragData(deptArea || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setActiveDragData(null);

    if (!over || over.id !== 'canvas') return;

    // Handle dropping from palette
    if (active.data.current?.type === 'department') {
      const deptTypeId = active.data.current.departmentTypeId as string;
      const areaInfo = calculatedAreas.find(d => d.departmentTypeId === deptTypeId);

      if (areaInfo && !placedDepartmentIds.includes(deptTypeId)) {
        const newDept: PlacedDepartment = {
          id: `dept-${Date.now()}`,
          departmentTypeId: deptTypeId,
          floorIndex: activeFloorIndex,
          x: 2, // Default position with some offset
          y: 2,
          width: areaInfo.gridWidth,
          height: areaInfo.gridHeight,
          calculatedArea: areaInfo.calculatedArea,
        };

        setDepartments(prev => [...prev, newDept]);
        setSelectedDepartmentId(newDept.id);
      }
    }

    // Handle moving placed department
    if (active.data.current?.type === 'placed-department') {
      // In a full implementation, we'd calculate the new position based on drop coordinates
      // For this prototype, we keep it simple
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
                  <div className="w-10 h-10 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark,#d97706)] flex items-center justify-center text-white shadow-md">
                    <Grid3X3 size={20} />
                  </div>
                  Floor Layout Planner
                </h2>
                <span className="text-xs text-text-muted mt-1 font-medium pl-14">
                  Visual layout editor • {isEditing ? 'Editing' : 'View Mode'}
                </span>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleReset}
                  className="h-10 px-4 rounded-full flex items-center justify-center gap-2 bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title="Reset layout"
                >
                  <RotateCcw size={16} />
                  Reset
                </motion.button>

                <motion.button
                  onClick={() => setShowTemplates(true)}
                  className="h-10 px-4 rounded-full flex items-center justify-center gap-2 bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title="Use template"
                >
                  <LayoutTemplate size={16} />
                  Templates
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
                  onClick={() => setPresentationMode(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Presentation Mode"
                >
                  <Presentation size={18} />
                </motion.button>

                <motion.button
                  onClick={() => setActiveSidebar('export')}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Export"
                >
                  <Download size={18} />
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
              onClick={() => setPresentationMode(false)}
              className="px-4 py-2 rounded-full text-sm font-medium
                bg-glass-heavy text-text-primary hover:bg-surface border border-glass-border shadow-float transition-all backdrop-blur-md"
            >
              Exit Presentation
            </button>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
          {/* Left Sidebar - Parameters & Palette */}
          {!isPresentationMode && (
            <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 pb-4 max-h-full scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent">
              <ParametersPanel
                inputs={inputs}
                onInputChange={handleInputChange}
                totalArea={totalArea}
              />

              <DepartmentPalette
                departments={calculatedAreas}
                placedDepartmentIds={placedDepartmentIds}
              />
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Floor Tabs & Tools */}
            <div className="flex items-center justify-between">
              <FloorTabs
                totalFloors={inputs.buildingFloors}
                activeFloorIndex={activeFloorIndex}
                onFloorChange={setActiveFloorIndex}
                onAddFloor={handleAddFloor}
                onRemoveFloor={handleRemoveFloor}
              />

              {!isPresentationMode && (
                <div className="flex items-center gap-2">
                  {/* Validation Trigger */}
                  <motion.button
                    onClick={() => setActiveSidebar('validation')}
                    className={`
                      h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border
                      ${warnings.length > 0
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-surface text-text-secondary border-transparent hover:bg-white'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle size={16} className={warnings.length > 0 ? "text-amber-600" : "text-text-muted"} />
                    {warnings.length > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-amber-200 text-amber-800 text-xs font-bold">
                        {warnings.length}
                      </span>
                    )}
                  </motion.button>

                  <MeasurementTool
                    isActive={isMeasuring}
                    onToggle={() => setIsMeasuring(!isMeasuring)}
                    zoom={zoom}
                    pan={pan}
                  />

                  <motion.button
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Save Layout"
                  >
                    <Save size={18} />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Canvas Container */}
            <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border border-glass-border bg-dots-pattern">
              <GridCanvas
                departments={departments}
                selectedDepartmentId={selectedDepartmentId}
                inputs={inputs}
                activeFloorIndex={activeFloorIndex}
                zoom={zoom}
                pan={pan}
                showGrid={showGrid}
                onSelectDepartment={setSelectedDepartmentId}
                onRemoveDepartment={handleRemoveDepartment}
                onPanChange={setPan}
                className="absolute inset-0"
              />

              {/* Flow Arrows */}
              <FlowArrows
                departments={departments}
                activeFloorIndex={activeFloorIndex}
                visible={showFlowArrows}
              />

              {/* Canvas Controls */}
              {!isPresentationMode && (
                <CanvasControls
                  zoom={zoom}
                  showGrid={showGrid}
                  showFlowArrows={showFlowArrows}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onFitToScreen={handleFitToScreen}
                  onResetView={handleResetView}
                  onToggleGrid={() => setShowGrid(!showGrid)}
                  onToggleFlowArrows={() => setShowFlowArrows(!showFlowArrows)}
                  className="absolute bottom-4 left-4"
                />
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <LayoutTemplates
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Right Sidebar (Export & Validation) */}
        <RightSidebar
          isOpen={activeSidebar !== 'none'}
          onClose={() => setActiveSidebar('none')}
          title={activeSidebar === 'export' ? 'Export Layout' : 'Validation Issues'}
        >
          {activeSidebar === 'export' && (
            <ExportPanel
              onExport={handleExport}
            />
          )}

          {activeSidebar === 'validation' && (
            <ValidationOverlay
              warnings={warnings}
              onDismiss={handleDismissWarning}
            />
          )}
        </RightSidebar>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDragId && activeDragData && (
            <DepartmentBlock
              departmentType={departmentTypes.find(dt => dt.id === activeDragData.departmentTypeId)!}
              calculatedArea={activeDragData.calculatedArea}
              width={activeDragData.gridWidth}
              height={activeDragData.gridHeight}
              isDragging={true}
            />
          )}
        </DragOverlay>
      </motion.div>
    </DndContext>
  );
}
