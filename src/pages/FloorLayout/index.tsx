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
import { useUI } from '@/contexts/UIContextDefinition';

// Floor Layout Components
import {
  ParametersPanel,
  ToolsPanel,
  FloatingPalette,
  DepartmentBlock,
  GridCanvas,
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
  productTypes,
  type FloorLayoutInputs,
  type PlacedDepartment,
  type CalculatedDepartmentArea,
  type ValidationWarning,
  type LayoutTemplate as LayoutTemplateType,
} from '@mocks/floor-layout';
import type { CanvasObject } from '@/types/canvas';

// Operator density (m² per operator) for each department type
// Based on PRD §3.2.4 and typical factory configurations
const OPERATOR_DENSITY: Record<string, number> = {
  sewing: 6, // PRD: operators × 6 m²
  warehouse: 100, // Low operator density, mostly storage
  cutting: 15, // Fewer operators, larger equipment
  finishing: 10, // Quality check and pressing stations
  packing: 12, // Packing stations
  embroidery: 30, // Machine operators, 1 per ~30m²
  utilities: 0, // No direct operators
  washing: 20, // Machine operators
  sublimation: 25, // Machine operators
};

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
  const [departments, setDepartments] = useState<PlacedDepartment[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  // Canvas Objects (Shapes, Text)
  const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

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
  const [activeTool, setActiveTool] = useState<
    'select' | 'pan' | 'shape-rect' | 'shape-circle' | 'text' | 'note' | 'arrow' | 'curved-arrow'
  >('select');

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
  const calculatedAreas = useMemo(() => calculateDepartmentAreas(inputs), [inputs]);

  // Calculate total area (target/palette area)
  const totalArea = useMemo(
    () => calculatedAreas.reduce((sum, d) => sum + d.calculatedArea, 0),
    [calculatedAreas]
  );

  // Calculate actual total area from placed departments (for live updates)
  const actualTotalArea = useMemo(
    () => departments.reduce((sum, d) => sum + d.calculatedArea, 0),
    [departments]
  );

  // Initial Fit to Screen
  useEffect(() => {
    // Estimate container width (approximate or use ResizeObserver for precision)
    // Sidebar 320px + padding etc. -> Window Width - 340px?
    // Let's just set a reasonable default zoom based on floor width for now.
    // If floor is 250m wide -> 2000px. If screen is 1920, available is ~1500. Zoom ~0.75.
    const containerWidth = window.innerWidth - 380; // Minus sidebar and padding
    const floorWidthPx = inputs.floorWidth * (40 / 5); // 8px per meter
    const initialZoom = Math.min(Math.max(containerWidth / floorWidthPx, 0.2), 1.5);
    setZoom(initialZoom);
    // Center it horizontally? Pan defaulting to 20, 20 is okay.
  }, [inputs.floorWidth]); // Run once on mount or when floor width changes drastically (optional)

  // Operator density (m² per operator) for each department type
  // Based on PRD §3.2.4 and typical factory configurations

  // Calculate Actual Operators from ALL Placed Departments
  // Each department contributes operators based on its area and density
  const actualTotalOperators = useMemo(() => {
    const productType = productTypes.find(pt => pt.id === inputs.productTypeId);
    const spaceModifier = productType?.spaceModifier || 1;

    return departments.reduce((sum, dept) => {
      const density = OPERATOR_DENSITY[dept.departmentTypeId] || 10;
      if (density === 0) return sum; // Skip departments with no operators (utilities)
      // Reverse calculation: operators = area / (density × spaceModifier)
      return sum + Math.round(dept.calculatedArea / (density * spaceModifier));
    }, 0);
  }, [departments, inputs.productTypeId]);

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
  const handleInputChange = useCallback(
    <K extends keyof FloorLayoutInputs>(key: K, value: FloorLayoutInputs[K]) => {
      setInputs(prev => ({ ...prev, [key]: value }));
    },
    []
  );

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
  const handleRemoveDepartment = useCallback(
    (id: string) => {
      setDepartments(prev => prev.filter(d => d.id !== id));
      if (selectedDepartmentId === id) setSelectedDepartmentId(null);
    },
    [selectedDepartmentId]
  );

  // Update department (resize/move)
  const handleUpdateDepartment = useCallback((id: string, updates: Partial<PlacedDepartment>) => {
    // 1. Update Departments
    let updatedDept: PlacedDepartment | undefined;

    setDepartments(prev =>
      prev.map(d => {
        if (d.id !== id) return d;
        const updated = { ...d, ...updates };
        // Recalculate area if dimensions changed
        if (updates.width || updates.height) {
          updated.calculatedArea = updated.width * updated.height * 25; // 5x5m = 25m2 per cell
        }
        updatedDept = updated;
        return updated;
      })
    );

    // 2. Update Connected Arrows (in CanvasObjects)
    if (
      updatedDept &&
      (updates.x !== undefined ||
        updates.y !== undefined ||
        updates.width !== undefined ||
        updates.height !== undefined)
    ) {
      const GRID_CELL_SIZE = 40; // Hardcoded matches GridCanvas
      const center = {
        x: updatedDept.x * GRID_CELL_SIZE + (updatedDept.width * GRID_CELL_SIZE) / 2,
        y: updatedDept.y * GRID_CELL_SIZE + (updatedDept.height * GRID_CELL_SIZE) / 2,
      };

      setCanvasObjects(prev =>
        prev.map(obj => {
          if (
            (obj.type === 'arrow' || obj.type === 'curved-arrow') &&
            (obj.startObjectId === id || obj.endObjectId === id)
          ) {
            let startPoint = obj.startPoint;
            let endPoint = obj.endPoint;

            if (obj.startObjectId === id) startPoint = center;
            if (obj.endObjectId === id) endPoint = center;

            if (startPoint && endPoint) {
              const minX = Math.min(startPoint.x, endPoint.x) - 20;
              const minY = Math.min(startPoint.y, endPoint.y) - 20;
              const maxX = Math.max(startPoint.x, endPoint.x) + 20;
              const maxY = Math.max(startPoint.y, endPoint.y) + 20;

              return {
                ...obj,
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
                startPoint,
                endPoint,
              };
            }
          }
          return obj;
        })
      );
    }
  }, []);

  // Canvas Object Handlers
  const handleAddObject = useCallback((obj: CanvasObject) => {
    setCanvasObjects(prev => [...prev, obj]);
    setSelectedObjectId(obj.id);
    setActiveTool('select'); // Switch back to select after creation
  }, []);

  const handleUpdateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    setCanvasObjects(prev => {
      const nextObjects = prev.map(o => (o.id === id ? { ...o, ...updates } : o));
      const target = nextObjects.find(o => o.id === id);

      // Update connected arrows if position/dimensions changed
      if (
        target &&
        (updates.x !== undefined ||
          updates.y !== undefined ||
          updates.width !== undefined ||
          updates.height !== undefined)
      ) {
        return nextObjects.map(obj => {
          if (
            (obj.type === 'arrow' || obj.type === 'curved-arrow') &&
            (obj.startObjectId === id || obj.endObjectId === id)
          ) {
            let startPoint = obj.startPoint;
            let endPoint = obj.endPoint;

            const targetCenter = {
              x: target.x + target.width / 2,
              y: target.y + target.height / 2,
            };

            if (obj.startObjectId === id) startPoint = targetCenter;
            if (obj.endObjectId === id) endPoint = targetCenter;

            if (startPoint && endPoint) {
              const minX = Math.min(startPoint.x, endPoint.x) - 20;
              const minY = Math.min(startPoint.y, endPoint.y) - 20;
              const maxX = Math.max(startPoint.x, endPoint.x) + 20;
              const maxY = Math.max(startPoint.y, endPoint.y) + 20;

              return {
                ...obj,
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
                startPoint,
                endPoint,
              };
            }
          }
          return obj;
        });
      }
      return nextObjects;
    });
  }, []);

  const handleRemoveObject = useCallback(
    (id: string) => {
      setCanvasObjects(prev => prev.filter(o => o.id !== id));
      if (selectedObjectId === id) setSelectedObjectId(null);
    },
    [selectedObjectId]
  );

  const onDragEndObject = useCallback(
    (obj: CanvasObject, dx: number, dy: number) => {
      const updates: Partial<CanvasObject> = {
        x: Math.round(obj.x + dx),
        y: Math.round(obj.y + dy),
      };

      // If arrow, also shift endpoints
      if ((obj.type === 'arrow' || obj.type === 'curved-arrow') && obj.startPoint && obj.endPoint) {
        updates.startPoint = {
          x: obj.startPoint.x + dx,
          y: obj.startPoint.y + dy,
        };
        updates.endPoint = {
          x: obj.endPoint.x + dx,
          y: obj.endPoint.y + dy,
        };
      }

      handleUpdateObject(obj.id, updates);
    },
    [handleUpdateObject]
  );

  // Zoom controls
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(2, z + 0.25)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.25, z - 0.25)), []);
  const handleFitToScreen = useCallback(() => {
    setZoom(0.8);
    setPan({ x: 20, y: 20 });
  }, []);

  const handleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  // Floor management
  const handleAddFloor = useCallback(() => {
    if (inputs.buildingFloors < 10) {
      setInputs(prev => ({ ...prev, buildingFloors: prev.buildingFloors + 1 }));
    }
  }, [inputs.buildingFloors]);

  const handleRemoveFloor = useCallback(
    (index: number) => {
      if (inputs.buildingFloors > 1) {
        setDepartments(prev => prev.filter(d => d.floorIndex !== index));
        setInputs(prev => ({ ...prev, buildingFloors: prev.buildingFloors - 1 }));
        if (activeFloorIndex >= index && activeFloorIndex > 0) {
          setActiveFloorIndex(activeFloorIndex - 1);
        }
      }
    },
    [inputs.buildingFloors, activeFloorIndex]
  );

  // Template selection
  const handleSelectTemplate = useCallback(
    (template: LayoutTemplateType) => {
      // Apply template inputs
      setInputs(prev => ({ ...prev, ...template.inputs }));

      // Apply template departments
      const newDepartments: PlacedDepartment[] = template.departments.map((d, i) => {
        const areaInfo = calculateDepartmentAreas({ ...inputs, ...template.inputs }).find(
          a => a.departmentTypeId === d.departmentTypeId
        );

        return {
          ...d,
          id: `dept-${Date.now()}-${i}`,
          calculatedArea: areaInfo?.calculatedArea || 100,
        };
      });

      setDepartments(newDepartments);
      setActiveFloorIndex(0);
    },
    [inputs]
  );

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
    const { active, over, delta } = event;
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
    // Handle Canvas Object Move
    if (active.data.current?.type === 'canvas-object') {
      const result = active.data.current.object as CanvasObject; // Need to ensure data structure match

      const floorWidthPx = inputs.floorWidth * (40 / 5); // 8px per meter -> 40px / 5m
      const floorHeightPx = inputs.floorHeight * (40 / 5);

      const newX = Math.round(result.x + delta.x / zoom);
      const newY = Math.round(result.y + delta.y / zoom);

      const maxX = floorWidthPx - result.width;
      const maxY = floorHeightPx - result.height;

      onDragEndObject(
        result,
        Math.max(0, Math.min(newX, maxX)) - result.x,
        Math.max(0, Math.min(newY, maxY)) - result.y
      );
      return;
    }

    // Handle Placed Department Move
    if (active.data.current?.type === 'placed-department') {
      const dept = active.data.current.department as PlacedDepartment;

      // Calculate delta in grid units, accounting for zoom
      const deltaGridX = Math.round(delta.x / zoom / 40);
      const deltaGridY = Math.round(delta.y / zoom / 40);

      if (deltaGridX !== 0 || deltaGridY !== 0) {
        // We need to capture the NEW position to update arrows
        const movedDeptId = dept.id;
        let newCenter = { x: 0, y: 0 };
        let didMove = false;

        setDepartments(prev =>
          prev.map(d => {
            if (d.id !== dept.id) return d;

            const newX = d.x + deltaGridX;
            const newY = d.y + deltaGridY;

            // Constrain to positive coordinates (canvas bounds) and Floor Width/Height
            const deptWidthCells = d.width;
            const deptHeightCells = d.height;
            // Grid width in cells = floorWidth / 5
            const floorWidthCells = Math.round(inputs.floorWidth / 5);
            const floorHeightCells = Math.round(inputs.floorHeight / 5);

            const maxX = floorWidthCells - deptWidthCells;
            const maxY = floorHeightCells - deptHeightCells;

            const finalX = Math.max(0, Math.min(newX, maxX));
            const finalY = Math.max(0, Math.min(newY, maxY));

            // Calculate center for arrow updates
            const GRID_CELL_SIZE = 40;
            newCenter = {
              x: finalX * GRID_CELL_SIZE + (d.width * GRID_CELL_SIZE) / 2,
              y: finalY * GRID_CELL_SIZE + (d.height * GRID_CELL_SIZE) / 2,
            };
            didMove = true;

            return {
              ...d,
              x: finalX,
              y: finalY,
            };
          })
        );

        // Update Arrows if department moved
        if (didMove) {
          setCanvasObjects(prev =>
            prev.map(obj => {
              if (
                (obj.type === 'arrow' || obj.type === 'curved-arrow') &&
                (obj.startObjectId === movedDeptId || obj.endObjectId === movedDeptId)
              ) {
                let startPoint = obj.startPoint;
                let endPoint = obj.endPoint;

                if (obj.startObjectId === movedDeptId) startPoint = newCenter;
                if (obj.endObjectId === movedDeptId) endPoint = newCenter;

                if (startPoint && endPoint) {
                  const minX = Math.min(startPoint.x, endPoint.x) - 20;
                  const minY = Math.min(startPoint.y, endPoint.y) - 20;
                  const maxX = Math.max(startPoint.x, endPoint.x) + 20;
                  const maxY = Math.max(startPoint.y, endPoint.y) + 20;

                  return {
                    ...obj,
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                    startPoint,
                    endPoint,
                  };
                }
              }
              return obj;
            })
          );
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                    ${
                      isEditing
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
          {/* Left Sidebar - Parameters Only */}
          <div className="w-44 flex-shrink-0 flex flex-col gap-4 overflow-y-auto overflow-x-hidden pr-1 pb-4 max-h-full scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent z-10">
            <ParametersPanel
              inputs={inputs}
              onInputChange={handleInputChange}
              totalArea={totalArea}
              actualTotalArea={actualTotalArea}
              actualTotalOperators={actualTotalOperators}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col gap-3 min-w-0 relative">
            {/* Floor Tabs & Tools */}
            <div className="flex items-center justify-between z-10">
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
                      ${
                        warnings.length > 0
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-surface text-text-secondary border-transparent hover:bg-white'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle
                      size={16}
                      className={warnings.length > 0 ? 'text-amber-600' : 'text-text-muted'}
                    />
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
                    hiddenControl={true}
                  />

                  <motion.button
                    className="h-9 w-9 rounded-lg flex items-center justify-center bg-primary text-white shadow-md hover:bg-primary/90 transition-all border border-transparent"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Save Layout"
                  >
                    <Save size={18} />
                  </motion.button>
                </div>
              )}
            </div>

            {/* 3-COLUMN LAYOUT CONTAINER */}
            <div className="flex-1 flex min-h-0 bg-surface/50 rounded-2xl overflow-hidden border border-glass-border isolation-isolate transform-gpu">
              {/* LEFT COLUMN: Department Sidebar */}
              <div className="w-64 flex-shrink-0 flex flex-col border-r border-glass-border bg-surface/30 backdrop-blur-sm z-10">
                <FloatingPalette
                  departments={calculatedAreas}
                  placedDepartmentIds={placedDepartmentIds}
                  className="h-full w-full p-2"
                />
              </div>

              {/* MIDDLE COLUMN: Canvas area */}
              <div className="flex-1 relative min-w-0 bg-dots-pattern overflow-hidden">
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
                  onUpdateDepartment={handleUpdateDepartment}
                  canvasObjects={canvasObjects}
                  selectedObjectId={selectedObjectId}
                  onAddObject={handleAddObject}
                  onUpdateObject={handleUpdateObject}
                  onRemoveObject={handleRemoveObject}
                  onSelectObject={setSelectedObjectId}
                  onPanChange={setPan}
                  onZoomChange={setZoom}
                  activeTool={activeTool}
                  className="absolute inset-0"
                />

                {/* Flow Arrows Layer */}
                <FlowArrows
                  departments={departments}
                  activeFloorIndex={activeFloorIndex}
                  visible={showFlowArrows}
                />
              </div>

              {/* RIGHT COLUMN: Tools Sidebar */}
              <div className="w-24 flex-shrink-0 flex flex-col border-l border-glass-border bg-surface/30 backdrop-blur-sm z-10 p-2 pb-4 items-center">
                <ToolsPanel
                  activeTool={activeTool}
                  onToolChange={setActiveTool}
                  zoom={zoom}
                  showGrid={showGrid}
                  showFlowArrows={showFlowArrows}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onFitToScreen={handleFitToScreen}
                  onToggleFullScreen={handleFullScreen}
                  onToggleGrid={() => setShowGrid(!showGrid)}
                  onToggleFlowArrows={() => setShowFlowArrows(!showFlowArrows)}
                  isMeasuring={isMeasuring}
                  onToggleMeasure={() => setIsMeasuring(!isMeasuring)}
                  className="static transform-none"
                />
              </div>
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
          {activeSidebar === 'export' && <ExportPanel onExport={handleExport} />}

          {activeSidebar === 'validation' && (
            <ValidationOverlay warnings={warnings} onDismiss={handleDismissWarning} />
          )}
        </RightSidebar>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDragId && activeDragData && (
            <DepartmentBlock
              departmentType={
                departmentTypes.find(dt => dt.id === activeDragData.departmentTypeId)!
              }
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
