/**
 * FloorTabs Component
 * Tab bar for multi-floor navigation
 * @requirement P3-PG-FLOOR-005 Building Floors stack visual
 * @requirement P3-PG-FLOOR-013 Multi-floor view (tabs or 3D isometric)
 */

import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface FloorTabsProps {
    totalFloors: number;
    activeFloorIndex: number;
    onFloorChange: (index: number) => void;
    onAddFloor?: () => void;
    onRemoveFloor?: (index: number) => void;
    className?: string;
}

export function FloorTabs({
    totalFloors,
    activeFloorIndex,
    onFloorChange,
    onAddFloor,
    onRemoveFloor,
    className = '',
}: FloorTabsProps) {
    const getFloorLabel = (index: number): string => {
        if (index === 0) return 'Ground';
        if (index === 1) return '1st';
        if (index === 2) return '2nd';
        if (index === 3) return '3rd';
        return `${index}th`;
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {/* Floor Tabs */}
            {Array.from({ length: totalFloors }).map((_, index) => (
                <motion.div
                    role="button"
                    tabIndex={0}
                    key={index}
                    onClick={() => onFloorChange(index)}
                    className={`
            relative group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
            ${activeFloorIndex === index
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-surface text-text-secondary hover:bg-glass-heavy hover:text-text-primary'
                        }
          `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Floor Icon */}
                    <span className="text-base">
                        {index === 0 ? '🏠' : '🏢'}
                    </span>

                    {/* Floor Label */}
                    <span>{getFloorLabel(index)} Floor</span>

                    {/* Remove Button (only for non-ground floors) */}
                    {onRemoveFloor && index > 0 && totalFloors > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFloor(index);
                            }}
                            className={`
                absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity
                ${activeFloorIndex === index
                                    ? 'bg-white/20 text-white hover:bg-white/30'
                                    : 'bg-red-100 text-red-500 hover:bg-red-200'
                                }
              `}
                        >
                            <X size={12} />
                        </button>
                    )}
                </motion.div>
            ))}

            {/* Add Floor Button */}
            {onAddFloor && totalFloors < 10 && (
                <motion.button
                    onClick={onAddFloor}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface text-text-muted hover:bg-glass-heavy hover:text-primary transition-all border-2 border-dashed border-glass-border hover:border-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Add Floor"
                >
                    <Plus size={18} />
                </motion.button>
            )}
        </div>
    );
}
