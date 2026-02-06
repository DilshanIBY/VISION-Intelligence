/**
 * MeasurementTool Component
 * Distance and area measurement overlay
 * @requirement P3-PG-FLOOR-017 Measurement tool
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, X, Trash2 } from 'lucide-react';

const GRID_CELL_SIZE = 40;
const GRID_CELL_METERS = 5;

interface Point {
    x: number; // grid units
    y: number;
}

interface Measurement {
    id: string;
    start: Point;
    end: Point;
    distance: number; // meters
}

interface MeasurementToolProps {
    isActive: boolean;
    onToggle: () => void;
    zoom: number;
    pan: { x: number; y: number };
    hiddenControl?: boolean;
    className?: string;
}

export function MeasurementTool({
    isActive,
    onToggle,
    zoom,
    pan,
    hiddenControl = false,
    className = '',
}: MeasurementToolProps) {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [currentStart, setCurrentStart] = useState<Point | null>(null);
    const [mousePos, setMousePos] = useState<Point | null>(null);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (!isActive) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - pan.x) / zoom / GRID_CELL_SIZE;
        const y = (e.clientY - rect.top - pan.y) / zoom / GRID_CELL_SIZE;
        const gridPoint = { x: Math.round(x), y: Math.round(y) };

        if (!currentStart) {
            setCurrentStart(gridPoint);
        } else {
            const dx = (gridPoint.x - currentStart.x) * GRID_CELL_METERS;
            const dy = (gridPoint.y - currentStart.y) * GRID_CELL_METERS;
            const distance = Math.sqrt(dx * dx + dy * dy);

            setMeasurements(prev => [...prev, {
                id: `m-${Date.now()}`,
                start: currentStart,
                end: gridPoint,
                distance: Math.round(distance * 10) / 10,
            }]);
            setCurrentStart(null);
        }
    }, [isActive, currentStart, zoom, pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isActive || !currentStart) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - pan.x) / zoom / GRID_CELL_SIZE;
        const y = (e.clientY - rect.top - pan.y) / zoom / GRID_CELL_SIZE;
        setMousePos({ x: Math.round(x), y: Math.round(y) });
    }, [isActive, currentStart, zoom, pan]);

    const clearMeasurements = useCallback(() => {
        setMeasurements([]);
        setCurrentStart(null);
        setMousePos(null);
    }, []);

    const removeMeasurement = useCallback((id: string) => {
        setMeasurements(prev => prev.filter(m => m.id !== id));
    }, []);

    return (
        <>
            {/* Tool Toggle Button */}
            {!hiddenControl && (
                <motion.button
                    onClick={onToggle}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all
            ${isActive
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-surface text-text-secondary hover:bg-glass-heavy hover:text-primary'
                        }
            ${className}
            `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Ruler size={16} />
                    {isActive ? '' : ''}
                </motion.button>
            )}

            {/* Instructions when active */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium shadow-lg z-30"
                    >
                        {currentStart ? 'Click to set end point' : 'Click to set start point'}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Measurement Lines SVG Overlay */}
            <svg
                className="absolute inset-0 pointer-events-none z-20"
                style={{ overflow: 'visible' }}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
            >
                {/* Existing measurements */}
                {measurements.map((m) => (
                    <MeasurementLine
                        key={m.id}
                        measurement={m}
                        zoom={zoom}
                        pan={pan}
                        onRemove={() => removeMeasurement(m.id)}
                    />
                ))}

                {/* Current drawing line */}
                {currentStart && mousePos && (
                    <g style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                        <line
                            x1={currentStart.x * GRID_CELL_SIZE}
                            y1={currentStart.y * GRID_CELL_SIZE}
                            x2={mousePos.x * GRID_CELL_SIZE}
                            y2={mousePos.y * GRID_CELL_SIZE}
                            stroke="#F59E0B"
                            strokeWidth={2 / zoom}
                            strokeDasharray={`${4 / zoom} ${4 / zoom}`}
                        />
                        <circle
                            cx={currentStart.x * GRID_CELL_SIZE}
                            cy={currentStart.y * GRID_CELL_SIZE}
                            r={6 / zoom}
                            fill="#F59E0B"
                        />
                        <circle
                            cx={mousePos.x * GRID_CELL_SIZE}
                            cy={mousePos.y * GRID_CELL_SIZE}
                            r={6 / zoom}
                            fill="#F59E0B"
                            opacity={0.5}
                        />
                    </g>
                )}
            </svg>

            {/* Measurements List */}
            <AnimatePresence>
                {measurements.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute bottom-4 right-4 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-float border border-glass-border overflow-hidden z-30"
                    >
                        <div className="flex items-center justify-between px-3 py-2 border-b border-glass-border">
                            <span className="text-xs font-semibold text-text-primary">Measurements</span>
                            <button
                                onClick={clearMeasurements}
                                className="p-1 rounded hover:bg-surface transition-colors text-text-muted hover:text-red-500"
                                title="Clear all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                            {measurements.map((m, i) => (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-surface transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-accent" />
                                        <span className="text-sm font-medium text-text-primary">
                                            #{i + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-accent">
                                            {m.distance}m
                                        </span>
                                        <button
                                            onClick={() => removeMeasurement(m.id)}
                                            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
                                        >
                                            <X size={12} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

interface MeasurementLineProps {
    measurement: Measurement;
    zoom: number;
    pan: { x: number; y: number };
    onRemove: () => void;
}

function MeasurementLine({ measurement, zoom, pan }: MeasurementLineProps) {
    const { start, end, distance } = measurement;
    const midX = ((start.x + end.x) / 2) * GRID_CELL_SIZE;
    const midY = ((start.y + end.y) / 2) * GRID_CELL_SIZE;

    return (
        <g style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            {/* Line */}
            <line
                x1={start.x * GRID_CELL_SIZE}
                y1={start.y * GRID_CELL_SIZE}
                x2={end.x * GRID_CELL_SIZE}
                y2={end.y * GRID_CELL_SIZE}
                stroke="#F59E0B"
                strokeWidth={2 / zoom}
            />

            {/* End points */}
            <circle
                cx={start.x * GRID_CELL_SIZE}
                cy={start.y * GRID_CELL_SIZE}
                r={5 / zoom}
                fill="#F59E0B"
            />
            <circle
                cx={end.x * GRID_CELL_SIZE}
                cy={end.y * GRID_CELL_SIZE}
                r={5 / zoom}
                fill="#F59E0B"
            />

            {/* Distance label */}
            <g transform={`translate(${midX}, ${midY})`}>
                <rect
                    x={-20 / zoom}
                    y={-10 / zoom}
                    width={40 / zoom}
                    height={20 / zoom}
                    rx={10 / zoom}
                    fill="white"
                    stroke="#F59E0B"
                    strokeWidth={1 / zoom}
                />
                <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={10 / zoom}
                    fontWeight="bold"
                    fill="#F59E0B"
                >
                    {distance}m
                </text>
            </g>
        </g>
    );
}
