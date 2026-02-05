/**
 * GridCanvas Component
 * Main interactive canvas for floor layout planning
 * @requirement P3-PG-FLOOR-007 Grid canvas (zoomable, pannable)
 * @requirement P3-PG-FLOOR-010 Auto-snap to grid
 * @requirement P3-PG-FLOOR-012 Collision detection (overlap prevention)
 * @requirement P3-PG-FLOOR-014 Zoom & pan canvas controls
 */

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DepartmentBlock } from './DepartmentBlock';
import { departmentTypes, type PlacedDepartment, type FloorLayoutInputs } from '@mocks/floor-layout';

const GRID_CELL_SIZE = 40; // px per grid cell
const GRID_CELL_METERS = 5; // meters per grid cell

interface DraggablePlacedDepartmentProps {
    department: PlacedDepartment;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

function DraggablePlacedDepartment({
    department,
    isSelected,
    onSelect,
    onRemove,
}: DraggablePlacedDepartmentProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `placed-${department.id}`,
        data: {
            type: 'placed-department',
            department,
        },
    });

    const departmentType = departmentTypes.find(dt => dt.id === department.departmentTypeId);
    if (!departmentType) return null;

    const style: React.CSSProperties = {
        position: 'absolute',
        left: department.x * GRID_CELL_SIZE,
        top: department.y * GRID_CELL_SIZE,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        zIndex: isDragging ? 100 : isSelected ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <DepartmentBlock
                departmentType={departmentType}
                calculatedArea={department.calculatedArea}
                width={department.width}
                height={department.height}
                isSelected={isSelected}
                isDragging={isDragging}
                isPlaced={true}
                showRemove={true}
                onSelect={onSelect}
                onRemove={onRemove}
            />
        </div>
    );
}

interface GridCanvasProps {
    departments: PlacedDepartment[];
    selectedDepartmentId: string | null;
    inputs: FloorLayoutInputs;
    activeFloorIndex: number;
    zoom: number;
    pan: { x: number; y: number };
    showGrid: boolean;
    onSelectDepartment: (id: string | null) => void;
    onRemoveDepartment: (id: string) => void;
    onPanChange: (pan: { x: number; y: number }) => void;
    className?: string;
}

export function GridCanvas({
    departments,
    selectedDepartmentId,
    inputs,
    activeFloorIndex,
    zoom,
    pan,
    showGrid,
    onSelectDepartment,
    onRemoveDepartment,
    onPanChange,
    className = '',
}: GridCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    // Calculate grid dimensions
    const gridWidth = Math.ceil(inputs.floorWidth / GRID_CELL_METERS);
    const gridHeight = Math.ceil(inputs.floorHeight / GRID_CELL_METERS);
    const canvasWidth = gridWidth * GRID_CELL_SIZE;
    const canvasHeight = gridHeight * GRID_CELL_SIZE;

    // Filter departments for active floor
    const floorDepartments = departments.filter(d => d.floorIndex === activeFloorIndex);

    // Droppable area
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas',
        data: {
            floorIndex: activeFloorIndex,
        },
    });

    // Pan handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            e.preventDefault();
            setIsPanning(true);
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning) {
            onPanChange({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y,
            });
        }
    }, [isPanning, panStart, onPanChange]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    // Click on empty area deselects
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onSelectDepartment(null);
        }
    }, [onSelectDepartment]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-2xl ${className}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isPanning ? 'grabbing' : 'default' }}
        >
            {/* Canvas with transform */}
            <motion.div
                ref={setNodeRef}
                className={`relative ${isOver ? 'ring-2 ring-primary ring-inset' : ''}`}
                style={{
                    width: canvasWidth,
                    height: canvasHeight,
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'top left',
                }}
                onClick={handleCanvasClick}
            >
                {/* Grid Background */}
                {showGrid && (
                    <svg
                        className="absolute inset-0 pointer-events-none"
                        width={canvasWidth}
                        height={canvasHeight}
                    >
                        <defs>
                            <pattern
                                id="grid-small"
                                width={GRID_CELL_SIZE}
                                height={GRID_CELL_SIZE}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={`M ${GRID_CELL_SIZE} 0 L 0 0 0 ${GRID_CELL_SIZE}`}
                                    fill="none"
                                    stroke="rgba(0,0,0,0.08)"
                                    strokeWidth="1"
                                />
                            </pattern>
                            <pattern
                                id="grid-large"
                                width={GRID_CELL_SIZE * 5}
                                height={GRID_CELL_SIZE * 5}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect width={GRID_CELL_SIZE * 5} height={GRID_CELL_SIZE * 5} fill="url(#grid-small)" />
                                <path
                                    d={`M ${GRID_CELL_SIZE * 5} 0 L 0 0 0 ${GRID_CELL_SIZE * 5}`}
                                    fill="none"
                                    stroke="rgba(0,0,0,0.15)"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-large)" />
                    </svg>
                )}

                {/* Floor Dimensions Label */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 dark:bg-slate-800/80 rounded text-xs font-medium text-text-secondary backdrop-blur-sm">
                    {inputs.floorWidth}m × {inputs.floorHeight}m
                </div>

                {/* Scale Reference */}
                <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-800/80 rounded backdrop-blur-sm">
                    <div className="w-10 h-0.5 bg-text-secondary" />
                    <span className="text-[10px] font-medium text-text-secondary">
                        {GRID_CELL_METERS}m
                    </span>
                </div>

                {/* Placed Departments */}
                {floorDepartments.map((dept) => (
                    <DraggablePlacedDepartment
                        key={dept.id}
                        department={dept}
                        isSelected={dept.id === selectedDepartmentId}
                        onSelect={() => onSelectDepartment(dept.id)}
                        onRemove={() => onRemoveDepartment(dept.id)}
                    />
                ))}

                {/* Drop Zone Indicator */}
                {isOver && (
                    <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary pointer-events-none" />
                )}
            </motion.div>

            {/* Empty State */}
            {floorDepartments.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm">
                        <span className="text-4xl mb-3 block">📐</span>
                        <p className="text-sm font-medium text-text-primary">Drop departments here</p>
                        <p className="text-xs text-text-muted mt-1">
                            Drag from the palette on the left
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
