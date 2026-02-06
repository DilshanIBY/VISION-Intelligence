import { motion } from 'framer-motion';
import {
    MousePointer2, Hand, Square, Circle,
    Type, StickyNote, ArrowRight, CornerUpRight,
    Undo2, Redo2,
    ZoomIn, ZoomOut, Maximize2, Expand,
    Grid3X3, Crosshair, Ruler
} from 'lucide-react';

interface ToolsPanelProps {
    activeTool: 'select' | 'pan' | 'shape-rect' | 'shape-circle' | 'text' | 'note' | 'arrow' | 'curved-arrow';
    onToolChange: (tool: 'select' | 'pan' | 'shape-rect' | 'shape-circle' | 'text' | 'note' | 'arrow' | 'curved-arrow') => void;
    zoom: number;
    showGrid: boolean;
    showFlowArrows: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitToScreen: () => void;
    onToggleFullScreen: () => void;
    onToggleGrid: () => void;
    onToggleFlowArrows: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    isMeasuring: boolean;
    onToggleMeasure: () => void;
    className?: string;
}

export function ToolsPanel({
    activeTool,
    onToolChange,
    zoom,
    showGrid,
    showFlowArrows,
    onZoomIn,
    onZoomOut,
    onFitToScreen,
    onToggleFullScreen,
    onToggleGrid,
    onToggleFlowArrows,
    onUndo,
    onRedo,
    isMeasuring,
    onToggleMeasure,
    className = ''
}: ToolsPanelProps) {

    return (
        <motion.div
            className={`flex flex-col h-full gap-2 ${className}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            {/* Main Tools Card (No Scroll) */}
            <div className="flex-1 min-h-0 -mx-2 px-2 pb-2">
                <div className="grid grid-cols-2 gap-1 p-1.5 bg-surface/90 backdrop-blur-md rounded-xl shadow-sm border border-glass-border">
                    {/* Creation Tools */}
                    <ToolButton
                        icon={<MousePointer2 size={18} />}
                        isActive={activeTool === 'select'}
                        onClick={() => onToolChange('select')}
                        title="Select (V)"
                    />
                    <ToolButton
                        icon={<Hand size={18} />}
                        isActive={activeTool === 'pan'}
                        onClick={() => onToolChange('pan')}
                        title="Pan Tool (H or Space)"
                    />

                    <div className="col-span-2 h-px bg-glass-border my-0.5 mx-2 opacity-50" />

                    <ToolButton
                        icon={<Square size={18} />}
                        isActive={activeTool === 'shape-rect'}
                        onClick={() => onToolChange('shape-rect')}
                        title="Rectangle (R)"
                    />
                    <ToolButton
                        icon={<Circle size={18} />}
                        isActive={activeTool === 'shape-circle'}
                        onClick={() => onToolChange('shape-circle')}
                        title="Circle (O)"
                    />
                    <ToolButton
                        icon={<ArrowRight size={18} />}
                        isActive={activeTool === 'arrow'}
                        onClick={() => onToolChange('arrow')}
                        title="Straight Arrow (A)"
                    />
                    <ToolButton
                        icon={<CornerUpRight size={18} />}
                        isActive={activeTool === 'curved-arrow'}
                        onClick={() => onToolChange('curved-arrow')}
                        title="Curved Arrow (C)"
                    />
                    <ToolButton
                        icon={<Type size={18} />}
                        isActive={activeTool === 'text'}
                        onClick={() => onToolChange('text')}
                        title="Text (T)"
                    />
                    <ToolButton
                        icon={<StickyNote size={18} />}
                        isActive={activeTool === 'note'}
                        onClick={() => onToolChange('note')}
                        title="Sticky Note (S)"
                    />

                    <div className="col-span-2 h-px bg-glass-border my-0.5 mx-2 opacity-50" />

                    {/* View Controls */}
                    <ToolButton
                        icon={<ZoomIn size={18} />}
                        onClick={onZoomIn}
                        title="Zoom In"
                        disabled={zoom >= 3}
                    />
                    <ToolButton
                        icon={<ZoomOut size={18} />}
                        onClick={onZoomOut}
                        title="Zoom Out"
                        disabled={zoom <= 0.1}
                    />
                    <ToolButton
                        icon={<Maximize2 size={18} />}
                        onClick={onFitToScreen}
                        title="Fit to Screen (Shift+1)"
                    />
                    <ToolButton
                        icon={<Ruler size={18} />}
                        isActive={isMeasuring}
                        onClick={onToggleMeasure}
                        title="Measurement Tool"
                    />

                    <div className="col-span-2 h-px bg-glass-border my-0.5 mx-2 opacity-50" />

                    <ToolButton
                        icon={<Grid3X3 size={18} />}
                        onClick={onToggleGrid}
                        isActive={showGrid}
                        title="Toggle Grid"
                    />
                    <ToolButton
                        icon={<Crosshair size={18} />}
                        onClick={onToggleFlowArrows}
                        isActive={showFlowArrows}
                        title="Toggle Flow Arrows"
                    />

                    <div className="col-span-2 h-px bg-glass-border my-0.5 mx-2 opacity-50" />

                    {/* History Controls (Moved Inside) */}
                    <ToolButton
                        icon={<Undo2 size={18} />}
                        onClick={onUndo || (() => { })}
                        title="Undo (Ctrl+Z)"
                        disabled={!onUndo}
                    />
                    <ToolButton
                        icon={<Redo2 size={18} />}
                        onClick={onRedo || (() => { })}
                        title="Redo (Ctrl+Y)"
                        disabled={!onRedo}
                    />
                </div>
            </div>
        </motion.div>
    );
}

interface ToolButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title?: string;
}

function ToolButton({ icon, onClick, isActive, disabled, title }: ToolButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-transparent
                ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-black/5 hover:text-primary'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}
            `}
        >
            {icon}
        </button>
    );
}
