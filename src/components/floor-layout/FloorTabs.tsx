import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
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
    // We maintain a local order state for the tabs
    // Initialize with 0...totalFloors-1
    const [order, setOrder] = useState<number[]>([]);

    // Sync order when totalFloors changes
    useEffect(() => {
        setOrder(prev => {
            const newOrder = Array.from({ length: totalFloors }, (_, i) => i);
            // Try to preserve existing order if possible, but for now simple sync is safer
            // or merge: keep existing, add new at end, remove missing
            const existing = new Set(prev);
            const preserved = prev.filter(i => i < totalFloors);
            const added = newOrder.filter(i => !existing.has(i));
            return [...preserved, ...added];
        });
    }, [totalFloors]);

    const getFloorLabel = (index: number): string => {
        if (index === 0) return 'Ground';
        if (index === 1) return '1st';
        if (index === 2) return '2nd';
        if (index === 3) return '3rd';
        return `${index}th`;
    };

    return (
        <div className={`flex items-center gap-2 flex-1 min-w-0 justify-start ${className}`}>
            {/* Scroll Container */}
            <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-glass-border pb-1 px-1 min-w-0 flex items-center gap-1.5">
                <Reorder.Group
                    axis="x"
                    values={order}
                    onReorder={setOrder}
                    className="flex items-center gap-1.5 shrink-0"
                >
                    {order.map((floorIndex) => (
                        <Reorder.Item
                            key={floorIndex}
                            value={floorIndex}
                            className="relative flex items-center"
                        >
                            <motion.button
                                onClick={() => onFloorChange(floorIndex)}
                                className={`
                                    relative group flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all select-none
                                    ${activeFloorIndex === floorIndex
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-surface text-text-secondary hover:bg-glass-heavy hover:text-text-primary'
                                    }
                                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Drag Handle */}
                                <span className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100">
                                    {floorIndex === 0 ? '🏠' : '🏢'}
                                </span>

                                <span className="whitespace-nowrap">{getFloorLabel(floorIndex)} Floor</span>

                                {onRemoveFloor && floorIndex > 0 && totalFloors > 1 && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFloor(floorIndex);
                                        }}
                                        className="ml-1 p-0.5 rounded-full hover:bg-white/20"
                                    >
                                        <X size={12} />
                                    </div>
                                )}
                            </motion.button>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {/* Add Floor Button - Scrolls with tabs */}
                {onAddFloor && totalFloors < 50 && (
                    <motion.button
                        onClick={onAddFloor}
                        className="flex-none w-9 h-9 rounded-xl flex items-center justify-center bg-surface text-text-muted hover:bg-glass-heavy hover:text-primary transition-all border border-dashed border-glass-border hover:border-primary shadow-sm shrink-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Add Floor"
                    >
                        <Plus size={16} />
                    </motion.button>
                )}
            </div>
        </div>
    );
}
