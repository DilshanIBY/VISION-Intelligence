import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export interface DragHandleProps {
    size?: 'sm' | 'md' | 'lg';
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    className?: string;
}

export const DragHandle = forwardRef<HTMLDivElement, DragHandleProps>(
    ({ size = 'md', orientation = 'vertical', disabled = false, className = '' }, ref) => {
        const sizes = {
            sm: { icon: 14, padding: 'p-1' },
            md: { icon: 18, padding: 'p-1.5' },
            lg: { icon: 22, padding: 'p-2' },
        };

        const { icon, padding } = sizes[size];

        return (
            <motion.div
                ref={ref}
                whileHover={disabled ? {} : { scale: 1.1 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                className={`
          flex items-center justify-center rounded-[var(--radius-md)]
          text-[var(--color-text-muted)]
          transition-colors duration-100
          ${padding}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:bg-[var(--color-glass)] hover:text-[var(--color-text-secondary)]'}
          ${className}
        `}
                style={{ transform: orientation === 'horizontal' ? 'rotate(90deg)' : 'none' }}
            >
                <GripVertical size={icon} />
            </motion.div>
        );
    }
);

DragHandle.displayName = 'DragHandle';

