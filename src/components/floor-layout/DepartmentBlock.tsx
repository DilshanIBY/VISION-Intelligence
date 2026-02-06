/**
 * DepartmentBlock Component
 * Individual department block with icon, color, and size display
 * @requirement P3-PG-FLOOR-009 Department blocks with icons/colors
 */

import { motion } from 'framer-motion';
import { Move, X } from 'lucide-react';
import type { DepartmentType } from '@mocks/floor-layout';

export interface DepartmentBlockProps {
    departmentType: DepartmentType;
    calculatedArea: number;
    width: number;
    height: number;
    isSelected?: boolean;
    isDragging?: boolean;
    isPlaced?: boolean;
    showRemove?: boolean;
    onSelect?: () => void;
    onRemove?: () => void;
    className?: string;
    style?: React.CSSProperties;
    operatorCount?: number;
}

export function DepartmentBlock({
    departmentType,
    calculatedArea,
    width,
    height,
    isSelected = false,
    isDragging = false,
    isPlaced = false,
    showRemove = false,
    onSelect,
    onRemove,
    className = '',
    style,
    operatorCount,
}: DepartmentBlockProps) {
    const gridCellSize = 40; // px per grid cell

    return (
        <motion.div
            onClick={onSelect}
            className={`
        relative flex flex-col items-center justify-center gap-1
        rounded-[var(--radius-lg)] cursor-pointer select-none
        border-2 transition-all
        ${isSelected
                    ? 'border-white shadow-[0_0_0_2px_rgba(255,255,255,0.5),0_0_20px_rgba(59,130,246,0.5)] z-10'
                    : 'border-transparent hover:border-white/30'
                }
        ${isDragging ? 'opacity-80 scale-105 shadow-2xl z-50' : ''}
        ${className}
      `}
            style={{
                backgroundColor: departmentType.color,
                filter: isPlaced ? 'saturate(0.6) brightness(1.1)' : 'none', // Low contrast for placed items
                width: isPlaced ? width * gridCellSize : 'auto',
                height: isPlaced ? height * gridCellSize : 'auto',
                minWidth: isPlaced ? undefined : 80,
                minHeight: isPlaced ? undefined : 80,
                ...style,
            }}
            whileHover={{ scale: isPlaced ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            {/* Drag Handle (for placed departments) */}
            {isPlaced && isSelected && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
                    <Move size={12} className="text-slate-600" />
                </div>
            )}

            {/* Remove Button */}
            {showRemove && isSelected && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                    <X size={12} className="text-white" />
                </button>
            )}

            {/* Icon */}
            <span className="text-2xl" role="img" aria-label={departmentType.name}>
                {departmentType.icon}
            </span>

            {/* Name */}
            <span className="text-xs font-bold text-white drop-shadow-md text-center px-2 leading-tight">
                {departmentType.name}
            </span>

            {/* Area */}
            <span className="text-[10px] font-semibold text-white/80 drop-shadow-sm leading-none">
                {calculatedArea} m²
                {operatorCount !== undefined && (
                    <span className="block text-[9px] opacity-75 font-normal mt-0.5">
                        ~{operatorCount} ops
                    </span>
                )}
            </span>

            {/* Size indicator for placed blocks */}
            {isPlaced && isSelected && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/90 rounded text-[10px] text-white font-medium whitespace-nowrap">
                    {width}×{height} cells
                </div>
            )}
        </motion.div>
    );
}
