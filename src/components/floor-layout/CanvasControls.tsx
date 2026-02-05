/**
 * CanvasControls Component
 * Floating control buttons for zoom/pan
 * @requirement P3-PG-FLOOR-014 Zoom & pan canvas controls
 */

import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Grid3X3, RotateCcw, Crosshair } from 'lucide-react';

interface CanvasControlsProps {
    zoom: number;
    showGrid: boolean;
    showFlowArrows: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitToScreen: () => void;
    onResetView: () => void;
    onToggleGrid: () => void;
    onToggleFlowArrows: () => void;
    className?: string;
}

export function CanvasControls({
    zoom,
    showGrid,
    showFlowArrows,
    onZoomIn,
    onZoomOut,
    onFitToScreen,
    onResetView,
    onToggleGrid,
    onToggleFlowArrows,
    className = '',
}: CanvasControlsProps) {
    const zoomPercentage = Math.round(zoom * 100);

    return (
        <motion.div
            className={`flex flex-col gap-1 p-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-float border border-glass-border ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {/* Zoom In */}
            <ControlButton
                icon={<ZoomIn size={16} />}
                onClick={onZoomIn}
                title="Zoom In"
                disabled={zoom >= 2}
            />

            {/* Zoom Level Display */}
            <div className="px-2 py-1 text-center">
                <span className="text-[10px] font-bold text-text-primary">
                    {zoomPercentage}%
                </span>
            </div>

            {/* Zoom Out */}
            <ControlButton
                icon={<ZoomOut size={16} />}
                onClick={onZoomOut}
                title="Zoom Out"
                disabled={zoom <= 0.25}
            />

            <div className="h-px bg-glass-border my-1" />

            {/* Fit to Screen */}
            <ControlButton
                icon={<Maximize2 size={16} />}
                onClick={onFitToScreen}
                title="Fit to Screen"
            />

            {/* Reset View */}
            <ControlButton
                icon={<RotateCcw size={16} />}
                onClick={onResetView}
                title="Reset View"
            />

            <div className="h-px bg-glass-border my-1" />

            {/* Toggle Grid */}
            <ControlButton
                icon={<Grid3X3 size={16} />}
                onClick={onToggleGrid}
                title={showGrid ? 'Hide Grid' : 'Show Grid'}
                isActive={showGrid}
            />

            {/* Toggle Flow Arrows */}
            <ControlButton
                icon={<Crosshair size={16} />}
                onClick={onToggleFlowArrows}
                title={showFlowArrows ? 'Hide Flow' : 'Show Flow'}
                isActive={showFlowArrows}
            />
        </motion.div>
    );
}

interface ControlButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    disabled?: boolean;
    isActive?: boolean;
}

function ControlButton({ icon, onClick, title, disabled, isActive }: ControlButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-9 h-9 flex items-center justify-center rounded-xl transition-all
        ${disabled
                    ? 'opacity-30 cursor-not-allowed'
                    : isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-secondary hover:bg-surface hover:text-primary'
                }
      `}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            title={title}
        >
            {icon}
        </motion.button>
    );
}
