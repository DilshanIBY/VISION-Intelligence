/**
 * GridCanvas Component
 * Main interactive canvas for floor layout planning
 * @requirement P3-PG-FLOOR-007 Grid canvas (zoomable, pannable)
 * @requirement P3-PG-FLOOR-010 Auto-snap to grid
 * @requirement P3-PG-FLOOR-012 Collision detection (overlap prevention)
 * @requirement P3-PG-FLOOR-014 Zoom & pan canvas controls
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DepartmentBlock } from './DepartmentBlock';
import { departmentTypes, type PlacedDepartment, type FloorLayoutInputs } from '@mocks/floor-layout';
import type { CanvasObject } from '@/types/canvas';

const GRID_CELL_SIZE = 40; // px per grid cell
const GRID_CELL_METERS = 5; // meters per grid cell

interface DraggablePlacedDepartmentProps {
    department: PlacedDepartment;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onUpdate: (updates: Partial<PlacedDepartment>) => void;
    operatorCount?: number;
}

function DraggablePlacedDepartment({
    department,
    isSelected,
    onSelect,
    onRemove,
    onUpdate,
    operatorCount,
}: DraggablePlacedDepartmentProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `placed-${department.id}`,
        data: {
            type: 'placed-department',
            department,
        },
        disabled: false
    });

    const departmentType = departmentTypes.find(dt => dt.id === department.departmentTypeId);
    if (!departmentType) return null;

    const style: React.CSSProperties = {
        position: 'absolute',
        left: department.x * GRID_CELL_SIZE,
        top: department.y * GRID_CELL_SIZE,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        zIndex: isDragging ? 20 : isSelected ? 10 : 1, // Increased z-index to help with drag visibility
    };

    // Resize logic ...
    const handleResizeStart = (e: React.PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = department.width;
        const startHeight = department.height;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            const newWidth = Math.max(1, startWidth + Math.round(deltaX / GRID_CELL_SIZE));
            const newHeight = Math.max(1, startHeight + Math.round(deltaY / GRID_CELL_SIZE));
            if (newWidth !== department.width || newHeight !== department.height) {
                onUpdate({ width: newWidth, height: newHeight });
            }
        };
        const handlePointerUp = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="group">
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
                operatorCount={operatorCount}
            />
            {isSelected && !isDragging && (
                <>
                    <div className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full cursor-nwse-resize z-50 shadow-sm" onPointerDown={handleResizeStart} />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {department.width}x{department.height} ({department.calculatedArea}m²)
                    </div>
                </>
            )}
        </div>
    );
}

// --- Color Picker Component ---
const COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#d946ef', // Pink
    '#64748b', // Slate
    'transparent' // None (for border only schemas if needed, or default)
];

// --- CanvasObjectItem Component ---
interface CanvasObjectItemProps {
    object: CanvasObject;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onUpdate: (updates: Partial<CanvasObject>) => void;
}

function CanvasObjectItem({
    object,
    isSelected,
    onSelect,
    onRemove,
    onUpdate,
}: CanvasObjectItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `obj-${object.id}`,
        data: {
            type: 'canvas-object',
            object,
        },
        disabled: false
    });

    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const style: React.CSSProperties = {
        position: 'absolute',
        left: object.x,
        top: object.y,
        width: object.width,
        height: object.height,
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        zIndex: isDragging ? 100 : isSelected ? 10 : 2,
    };

    // Auto-focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Resize Handler
    const handleResizeStart = (e: React.PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = object.width;
        const startH = object.height;
        const startP = object.startPoint ? { ...object.startPoint } : null;
        const endP = object.endPoint ? { ...object.endPoint } : null;
        const originX = object.x;
        const originY = object.y;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            const newW = Math.max(20, startW + deltaX);
            const newH = Math.max(20, startH + deltaY);

            const updates: Partial<CanvasObject> = {
                width: newW,
                height: newH
            };

            // Scale Arrow Points
            if ((object.type === 'arrow' || object.type === 'curved-arrow') && startP && endP) {
                // Calculate scale factors
                const scaleX = newW / startW;
                const scaleY = newH / startH;

                // Relativize, scale, and absolutize
                const relSx = startP.x - originX;
                const relSy = startP.y - originY;
                const relEx = endP.x - originX;
                const relEy = endP.y - originY;

                updates.startPoint = {
                    x: originX + relSx * scaleX,
                    y: originY + relSy * scaleY
                };
                updates.endPoint = {
                    x: originX + relEx * scaleX,
                    y: originY + relEy * scaleY
                };
            }

            onUpdate(updates);
        };
        const handlePointerUp = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (object.type === 'text' || object.type === 'note') {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleColorSelect = (color: string) => {
        onUpdate({ color });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onDoubleClick={handleDoubleClick}
            className={`group pointer-events-auto ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
            {/* Toolbar - Only when selected and not dragging */}
            {isSelected && !isDragging && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                    {/* Color Picker (for all objects now including text) */}
                    {(object.type === 'rect' || object.type === 'circle' || object.type === 'note' || object.type === 'arrow' || object.type === 'curved-arrow' || object.type === 'text') && (
                        <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={(e) => { e.stopPropagation(); handleColorSelect(c); }}
                                    className={`w-4 h-4 rounded-full border border-slate-300 transition-transform hover:scale-110 ${object.color === c ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    )}

                    {/* Delete */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Delete"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {/* Render Content based on type */}
            {object.type === 'rect' && (
                <div
                    className="w-full h-full border-2 border-slate-400 rounded transition-colors"
                    style={{ backgroundColor: object.color || 'rgba(226, 232, 240, 0.5)' }}
                />
            )}
            {object.type === 'circle' && (
                <div
                    className="w-full h-full border-2 border-slate-400 rounded-full transition-colors"
                    style={{ backgroundColor: object.color || 'rgba(226, 232, 240, 0.5)' }}
                />
            )}

            {object.type === 'text' && (
                <div
                    className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
                >
                    {isEditing ? (
                        <textarea
                            ref={inputRef}
                            value={object.content}
                            onChange={(e) => onUpdate({ content: e.target.value })}
                            onBlur={handleBlur}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleBlur(); }}
                            className="w-full h-full bg-transparent resize-none outline-none text-center font-bold"
                            style={{ fontSize: 'inherit', fontFamily: 'inherit', color: object.color || 'inherit' }}
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center text-center break-words whitespace-pre-wrap pointer-events-none select-none font-bold text-text-primary"
                            style={{ color: object.color || 'inherit' }}
                        >
                            {object.content || 'Double click to edit'}
                        </div>
                    )}
                </div>
            )}

            {object.type === 'note' && (
                <div
                    className="w-full h-full flex items-center justify-center p-2 overflow-hidden shadow-sm font-handwriting transition-colors"
                    style={{
                        backgroundColor: object.color || '#fef9c3',
                        borderColor: '#fde047',
                        borderWidth: 1
                    }}
                >
                    {isEditing ? (
                        <textarea
                            ref={inputRef}
                            value={object.content}
                            onChange={(e) => onUpdate({ content: e.target.value })}
                            onBlur={handleBlur}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleBlur(); }}
                            className="w-full h-full bg-transparent resize-none outline-none text-center"
                            style={{ fontSize: 'inherit', fontFamily: 'inherit' }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-center break-words whitespace-pre-wrap pointer-events-none select-none">
                            {object.content || 'Note'}
                        </div>
                    )}
                </div>
            )}

            {(object.type === 'arrow' || object.type === 'curved-arrow') && (
                <svg className="w-full h-full pointer-events-none overflow-visible" viewBox={`0 0 ${object.width} ${object.height}`} style={{ overflow: 'visible' }}>
                    <defs>
                        <marker
                            id={`arrowhead-${object.id}`}
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" fill={object.color || "#64748b"} />
                        </marker>
                    </defs>
                    <path
                        d={(() => {
                            if (object.startPoint && object.endPoint) {
                                // Calculate relative points from the bounding box top-left
                                const sx = object.startPoint.x - object.x;
                                const sy = object.startPoint.y - object.y;
                                const ex = object.endPoint.x - object.x;
                                const ey = object.endPoint.y - object.y;

                                if (object.type === 'curved-arrow') {
                                    // Control points for simple S-curve
                                    const cx1 = sx + (ex - sx) * 0.5;
                                    const cy1 = sy;
                                    const cx2 = ex - (ex - sx) * 0.5;
                                    const cy2 = ey;

                                    return `M ${sx},${sy} C ${cx1},${cy1} ${cx2},${cy2} ${ex},${ey}`;
                                }
                                return `M ${sx},${sy} L ${ex},${ey}`;
                            }
                            // Fallback for old arrows or during drag creation (if points not set yet)
                            return object.type === 'curved-arrow'
                                ? `M 0,${object.height} C ${object.width * 0.25},${object.height} ${object.width * 0.75},0 ${object.width},0`
                                : `M 0,${object.height / 2} L ${object.width},${object.height / 2}`
                        })()}
                        stroke={object.color || "#64748b"}
                        strokeWidth="4"
                        fill="none"
                        markerEnd={`url(#arrowhead-${object.id})`}
                        vectorEffect="non-scaling-stroke"
                        style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))' }}
                    />
                </svg>
            )}

            {/* Resize Handles - Only when selected */}
            {isSelected && !isDragging && (
                <div
                    className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize z-50 shadow-sm"
                    onPointerDown={handleResizeStart}
                />
            )}
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
    onUpdateDepartment: (id: string, updates: Partial<PlacedDepartment>) => void;

    // Canvas Objects
    canvasObjects: CanvasObject[];
    selectedObjectId: string | null;
    onAddObject: (obj: CanvasObject) => void;
    onUpdateObject: (id: string, updates: Partial<CanvasObject>) => void;
    onRemoveObject: (id: string) => void;
    onSelectObject: (id: string | null) => void;

    onPanChange: (pan: { x: number; y: number }) => void;
    onZoomChange: (zoom: number, epicenter?: { x: number; y: number }) => void;
    activeTool: 'select' | 'pan' | 'shape-rect' | 'shape-circle' | 'text' | 'note' | 'arrow' | 'curved-arrow';
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
    onUpdateDepartment,
    canvasObjects,
    selectedObjectId,
    onAddObject,
    onUpdateObject,
    onRemoveObject,
    onSelectObject,
    onPanChange,
    onZoomChange,
    activeTool,
    className = '',
}: GridCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [isSpacePressed, setIsSpacePressed] = useState(false);

    // Creation State
    const [creationStart, setCreationStart] = useState<{ x: number, y: number } | null>(null);
    const [tempObject, setTempObject] = useState<Partial<CanvasObject> | null>(null);

    // Track Space key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') {
                e.preventDefault();
                setIsSpacePressed(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') setIsSpacePressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

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

    // Helper: Find object or department at position
    const findTargetAtPosition = (x: number, y: number) => {
        // Check Canvas Objects (Reverse order for z-index)
        for (let i = canvasObjects.length - 1; i >= 0; i--) {
            const obj = canvasObjects[i];
            if (obj.floorIndex === activeFloorIndex && x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height) {
                // Don't connect to other arrows
                if (obj.type !== 'arrow' && obj.type !== 'curved-arrow') return { type: 'object', id: obj.id, cx: obj.x + obj.width / 2, cy: obj.y + obj.height / 2 };
            }
        }
        // Check Departments
        for (const dept of floorDepartments) {
            const left = dept.x * GRID_CELL_SIZE;
            const top = dept.y * GRID_CELL_SIZE;
            const right = left + dept.width * GRID_CELL_SIZE;
            const bottom = top + dept.height * GRID_CELL_SIZE;

            if (x >= left && x <= right && y >= top && y <= bottom) {
                return { type: 'department', id: dept.id, cx: left + (dept.width * GRID_CELL_SIZE) / 2, cy: top + (dept.height * GRID_CELL_SIZE) / 2 };
            }
        }
        return null;
    };


    // Wheel Zoom interaction
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            // Calculate cursor position relative to canvas
            const cursorX = e.clientX - rect.left;
            const cursorY = e.clientY - rect.top;

            // Direction
            const delta = -e.deltaY;
            const scaleFactor = delta > 0 ? 1.1 : 0.9;
            const newZoom = Math.min(Math.max(zoom * scaleFactor, 0.1), 3);

            // Adjust pan to zoom towards cursor
            // Logic: The point under the cursor (cursorX, cursorY) should remain at the same screen position.
            // canvasX = (cursorX - pan.x) / zoom
            // newPan.x = cursorX - canvasX * newZoom
            const canvasX = (cursorX - pan.x) / zoom;
            const canvasY = (cursorY - pan.y) / zoom;

            const newPanX = cursorX - canvasX * newZoom;
            const newPanY = cursorY - canvasY * newZoom;

            onZoomChange(newZoom);
            onPanChange({ x: newPanX, y: newPanY });
        } else {
            // Pan on wheel (Figma style)
            // e.deltaX/Y are usually pixels.
            // Pan direction is opposite to scroll usually? Or same?
            // Space+Drag moves the CANVAS. Scroll moves the VIEW.
            // If I scroll down, view moves down, so canvas moves UP?
            // Actually usually scroll up/down just moves the viewport.
            // pan.y -= e.deltaY

            e.preventDefault(); // Stop browser scroll
            const panSpeed = 1.0; // Basic 1:1

            onPanChange({
                x: pan.x - e.deltaX * panSpeed,
                y: pan.y - e.deltaY * panSpeed
            });
        }
    }, [zoom, pan, onZoomChange, onPanChange]);

    // Pan handlers
    const canPan = activeTool === 'pan' || isSpacePressed;
    const isCreating = ['shape-rect', 'shape-circle', 'text', 'note', 'arrow', 'curved-arrow'].includes(activeTool);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (canPan || e.button === 1 || (e.button === 0 && e.altKey)) {
            e.preventDefault();
            setIsPanning(true);
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
            return;
        }

        if (isCreating && e.button === 0) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = (e.clientX - rect.left - pan.x) / zoom;
            const y = (e.clientY - rect.top - pan.y) / zoom;

            setCreationStart({ x, y });
            setTempObject({
                x, y, width: 1, height: 1,
                type: activeTool === 'shape-rect' ? 'rect' :
                    activeTool === 'shape-circle' ? 'circle' :
                        activeTool === 'note' ? 'note' :
                            (activeTool === 'arrow' || activeTool === 'curved-arrow') ? activeTool : 'text'
            });
        }
    }, [pan, canPan, isCreating, activeTool, zoom]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning) {
            onPanChange({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y,
            });
        }

        if (creationStart && tempObject) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const currentX = (e.clientX - rect.left - pan.x) / zoom;
            const currentY = (e.clientY - rect.top - pan.y) / zoom;

            const w = currentX - creationStart.x;
            const h = currentY - creationStart.y;

            setTempObject(prev => ({
                ...prev,
                width: Math.abs(w),
                height: Math.abs(h),
                x: w < 0 ? currentX : creationStart.x,
                y: h < 0 ? currentY : creationStart.y
            }));
        }
    }, [isPanning, panStart, onPanChange, creationStart, tempObject, zoom, pan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);

        if (creationStart && tempObject) {
            // Finalize creation
            const w = tempObject.width ?? 0;
            const h = tempObject.height ?? 0;

            // Connection Detection for Arrows
            let startObjId: string | undefined;
            let endObjId: string | undefined;
            let startPoint = { x: tempObject.x!, y: tempObject.y! }; // Default
            let endPoint = { x: tempObject.x! + w, y: tempObject.y! + h }; // Default

            if (activeTool === 'arrow' || activeTool === 'curved-arrow') {
                // Determine actual start/end based on drag direction
                const isDraggedRight = tempObject.x === creationStart.x;
                const isDraggedDown = tempObject.y === creationStart.y;

                const p1 = { x: creationStart.x, y: creationStart.y };
                const p2 = { x: isDraggedRight ? tempObject.x! + w : tempObject.x!, y: isDraggedDown ? tempObject.y! + h : tempObject.y! };

                // If dragging left, p2 is start (left), p1 is end (right)? 
                // No, Creation Start is always where user pressed DOWN. So that's the SOURCE.
                startPoint = p1;
                endPoint = p2;

                // Snap to objects
                const startTarget = findTargetAtPosition(startPoint.x, startPoint.y);
                if (startTarget) {
                    startObjId = startTarget.id.toString();
                    startPoint = { x: startTarget.cx, y: startTarget.cy };
                }

                const endTarget = findTargetAtPosition(endPoint.x, endPoint.y);
                if (endTarget) {
                    endObjId = endTarget.id.toString();
                    endPoint = { x: endTarget.cx, y: endTarget.cy };
                }

                // Recalculate Bounding Box to include both points + padding
                const minX = Math.min(startPoint.x, endPoint.x) - 20;
                const minY = Math.min(startPoint.y, endPoint.y) - 20;
                const maxX = Math.max(startPoint.x, endPoint.x) + 20;
                const maxY = Math.max(startPoint.y, endPoint.y) + 20;

                tempObject.x = minX;
                tempObject.y = minY;
                tempObject.width = maxX - minX;
                tempObject.height = maxY - minY;
            }

            if ((w > 5 && h > 5) || (activeTool === 'text' || activeTool === 'note' || activeTool === 'arrow' || activeTool === 'curved-arrow')) {
                const isClick = w <= 5 && h <= 5;

                onAddObject({
                    id: `obj-${Date.now()}`,
                    type: tempObject.type as any,
                    x: tempObject.x!,
                    y: tempObject.y!,
                    width: (isClick && (activeTool === 'arrow' || activeTool === 'curved-arrow')) ? 100 : (activeTool === 'note' && isClick) ? 150 : isClick ? 200 : tempObject.width!,
                    height: (isClick && (activeTool === 'arrow' || activeTool === 'curved-arrow')) ? 40 : (activeTool === 'note' && isClick) ? 150 : isClick ? 50 : tempObject.height!,
                    floorIndex: activeFloorIndex,
                    content: activeTool === 'text' ? 'Double click to edit' : (activeTool === 'arrow' || activeTool === 'curved-arrow') ? '' : 'New Note',
                    startObjectId: startObjId,
                    endObjectId: endObjId,
                    startPoint: (activeTool === 'arrow' || activeTool === 'curved-arrow') ? startPoint : undefined,
                    endPoint: (activeTool === 'arrow' || activeTool === 'curved-arrow') ? endPoint : undefined
                });
            }
            setCreationStart(null);
            setTempObject(null);
        }
    }, [creationStart, tempObject, onAddObject, activeFloorIndex, activeTool, canvasObjects, floorDepartments]); // Added dependencies

    // Click on empty area deselects
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isCreating && !isPanning) {
            onSelectDepartment(null);
            onSelectObject(null);
        }
    }, [onSelectDepartment, onSelectObject, isCreating, isPanning]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-2xl select-none ${className}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                cursor: isPanning ? 'grabbing' : canPan ? 'grab' : isCreating ? 'crosshair' : 'default',
                touchAction: 'none'
            }}
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
                {floorDepartments.map((dept) => {
                    // Calculate estimated operators based on area and type
                    // Simplified logic: Area / Density
                    let density = 10; // Default m2 per person
                    if (dept.departmentTypeId === 'sewing') density = 6;
                    if (dept.departmentTypeId === 'warehouse') density = 100; // Low density
                    if (dept.departmentTypeId === 'cutting') density = 15;
                    if (dept.departmentTypeId === 'packing') density = 12;

                    const estOperators = Math.round(dept.calculatedArea / density);

                    return (
                        <DraggablePlacedDepartment
                            key={dept.id}
                            department={dept}
                            isSelected={dept.id === selectedDepartmentId}
                            onSelect={() => onSelectDepartment(dept.id)}
                            onRemove={() => onRemoveDepartment(dept.id)}
                            onUpdate={(updates) => onUpdateDepartment(dept.id, updates)}
                            operatorCount={estOperators}
                        />
                    );
                })}

                {/* Canvas Objects */}
                {canvasObjects.filter(o => o.floorIndex === activeFloorIndex).map(obj => (
                    <CanvasObjectItem
                        key={obj.id}
                        object={obj}
                        isSelected={obj.id === selectedObjectId}
                        onSelect={() => onSelectObject(obj.id)}
                        onRemove={() => onRemoveObject(obj.id)}
                        onUpdate={(updates) => onUpdateObject(obj.id, updates)}
                    />
                ))}

                {/* Temp Object */}
                {tempObject && (
                    <div style={{
                        position: 'absolute',
                        left: tempObject.x,
                        top: tempObject.y,
                        width: tempObject.width,
                        height: tempObject.height,
                        border: '1px dashed blue',
                        backgroundColor: 'rgba(0,0,255,0.1)'
                    }} />
                )}

                {/* Drop Zone Indicator */}
                {isOver && (
                    <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary pointer-events-none" />
                )}
            </motion.div>

            {/* Empty State */}
            {floorDepartments.length === 0 && canvasObjects.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center p-6 bg-white/80 dark:bg-slate-800/80 rounded-2xl backdrop-blur-sm">
                        <span className="text-4xl mb-3 block">📐</span>
                        <p className="text-sm font-medium text-text-primary">Start Designing</p>
                        <p className="text-xs text-text-muted mt-1">
                            Drag departments or use tools
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
