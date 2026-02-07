import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { type CalculatedDepartmentArea } from '@mocks/floor-layout';

interface FloatingPaletteProps {
  departments: CalculatedDepartmentArea[];
  placedDepartmentIds: string[];
  className?: string;
}

export function FloatingPalette({
  departments,
  placedDepartmentIds,
  className = '',
}: FloatingPaletteProps) {
  const placedSet = new Set(placedDepartmentIds);
  const unplacedDepartments = departments.filter(d => !placedSet.has(d.departmentTypeId));

  // We only show unplaced departments in this palette typically,
  // or maybe valid ones? Replicating the 'Product Type' square card look.

  return (
    <motion.div
      className={`flex flex-col gap-4 z-20 h-full ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="bg-surface/90 backdrop-blur-md rounded-2xl p-4 shadow-float border border-glass-border flex flex-col gap-4 max-h-full overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 scrollbar-thin scrollbar-thumb-glass-border">
          {unplacedDepartments.length === 0 && (
            <div className="text-center py-8 text-text-muted text-sm">All departments placed!</div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {unplacedDepartments.map(dept => (
              <DepartmentCard key={dept.departmentTypeId} department={dept} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DepartmentCard({ department }: { department: CalculatedDepartmentArea }) {
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

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
                aspect-square rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center
                cursor-grab active:cursor-grabbing border bg-surface transition-all
                ${
                  isDragging
                    ? 'opacity-50 scale-95 border-primary shadow-lg z-50'
                    : 'border-glass-border hover:border-primary/50 hover:bg-glass hover:shadow-sm'
                }
            `}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
        style={{ backgroundColor: department.color }}
      >
        {department.icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-text-primary leading-tight">{department.name}</span>
        <span className="text-[10px] text-text-muted mt-0.5">{department.calculatedArea} m²</span>
      </div>
    </div>
  );
}
