/**
 * DepartmentPalette Component
 * Draggable department blocks palette
 * @requirement P3-PG-FLOOR-008 Department palette (drag blocks)
 */

import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { type CalculatedDepartmentArea } from '@mocks/floor-layout';

interface DraggableDepartmentProps {
    department: CalculatedDepartmentArea;
    isOnCanvas: boolean;
}

function DraggableDepartment({ department, isOnCanvas }: DraggableDepartmentProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `palette-${department.departmentTypeId}`,
        data: {
            type: 'department',
            departmentTypeId: department.departmentTypeId,
            gridWidth: department.gridWidth,
            gridHeight: department.gridHeight,
            calculatedArea: department.calculatedArea,
        },
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        relative flex items-center gap-3 p-3 rounded-xl cursor-grab active:cursor-grabbing
        transition-all border-2
        ${isDragging
                    ? 'opacity-50 scale-95 border-primary shadow-lg z-50'
                    : 'border-transparent hover:border-glass-border hover:bg-surface'
                }
        ${isOnCanvas ? 'opacity-50' : ''}
      `}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Drag Handle */}
            <div className="text-text-muted">
                <GripVertical size={16} />
            </div>

            {/* Color & Icon */}
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: department.color }}
            >
                {department.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">
                    {department.name}
                </div>
                <div className="text-xs text-text-muted">
                    {department.calculatedArea} m² • {department.gridWidth}×{department.gridHeight}
                </div>
            </div>

            {/* Status */}
            {isOnCanvas && (
                <div className="px-2 py-1 rounded-full bg-success/10 text-success text-[10px] font-medium">
                    Placed
                </div>
            )}
        </motion.div>
    );
}

interface DepartmentPaletteProps {
    departments: CalculatedDepartmentArea[];
    placedDepartmentIds: string[];
    className?: string;
}

export function DepartmentPalette({
    departments,
    placedDepartmentIds,
    className = '',
}: DepartmentPaletteProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const placedSet = new Set(placedDepartmentIds);
    const unplacedDepartments = departments.filter(d => !placedSet.has(d.departmentTypeId));
    const placedDepartments = departments.filter(d => placedSet.has(d.departmentTypeId));

    return (
        <motion.div
            className={`card-float ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">🏗️</span>
                    <span className="text-sm font-bold text-text-primary">Departments</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        {unplacedDepartments.length} remaining
                    </span>
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="">
                    <div className="px-2 pb-4 space-y-1">
                        {/* Unplaced departments */}
                        {unplacedDepartments.length > 0 && (
                            <>
                                <div className="px-3 py-1 text-[10px] text-text-muted uppercase tracking-wide">
                                    Drag to canvas
                                </div>
                                {unplacedDepartments.map((dept) => (
                                    <DraggableDepartment
                                        key={dept.departmentTypeId}
                                        department={dept}
                                        isOnCanvas={false}
                                    />
                                ))}
                            </>
                        )}

                        {/* Placed departments */}
                        {placedDepartments.length > 0 && (
                            <>
                                <div className="px-3 py-1 mt-3 text-[10px] text-text-muted uppercase tracking-wide">
                                    On canvas
                                </div>
                                {placedDepartments.map((dept) => (
                                    <DraggableDepartment
                                        key={dept.departmentTypeId}
                                        department={dept}
                                        isOnCanvas={true}
                                    />
                                ))}
                            </>
                        )}

                        {departments.length === 0 && (
                            <div className="p-4 text-center text-sm text-text-muted">
                                No departments calculated
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
