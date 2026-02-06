/**
 * ParametersPanel Component
 * Left sidebar with all floor layout input parameters
 * @requirement P3-PG-FLOOR-002 Total Operators slider + input
 * @requirement P3-PG-FLOOR-003 Product Type visual card select
 * @requirement P3-PG-FLOOR-004 Working Hours time picker
 * @requirement P3-PG-FLOOR-005 Building Floors stack visual
 * @requirement P3-PG-FLOOR-006 Floor Dimensions input
 */

import { motion } from 'framer-motion';
import { Layers, Ruler, Users, Clock, Package } from 'lucide-react';
import { NumberInput } from '@components/ui/inputs/NumberInput';
import { Slider } from '@components/ui/inputs/Slider';
import { productTypes, type FloorLayoutInputs } from '@mocks/floor-layout';

interface ParametersPanelProps {
    inputs: FloorLayoutInputs;
    onInputChange: <K extends keyof FloorLayoutInputs>(key: K, value: FloorLayoutInputs[K]) => void;
    totalArea: number;
    actualTotalOperators?: number;
    className?: string;
}

export function ParametersPanel({
    inputs,
    onInputChange,
    totalArea,
    actualTotalOperators,
    className = '',
}: ParametersPanelProps) {


    return (
        <motion.div
            className={`flex flex-col gap-4 ${className}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            {/* Header - Summary Stats (Read-Only) */}
            <div className="px-2 py-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <Layers size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">Floor Layout</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col p-3 rounded-2xl bg-surface border border-glass-border">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Operators</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-text-primary">
                                {actualTotalOperators !== undefined ? actualTotalOperators : inputs.totalOperators}
                            </span>
                            {actualTotalOperators !== undefined && (
                                <span className="text-xs text-text-muted">/ {inputs.totalOperators}</span>
                            )}
                            <Users size={12} className="text-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col p-3 rounded-2xl bg-surface border border-glass-border">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Total Area</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-text-primary">{totalArea.toLocaleString()}</span>
                            <span className="text-xs text-text-muted">m²</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Type - P3-PG-FLOOR-003 */}
            <div className="card-float p-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
                    <Package size={14} className="text-secondary" />
                    Product Type
                </label>

                <div className="grid grid-cols-1 gap-1.5">
                    {productTypes.map((pt) => (
                        <motion.button
                            key={pt.id}
                            onClick={() => onInputChange('productTypeId', pt.id)}
                            className={`
                                p-2 rounded-lg text-left transition-all border
                                ${inputs.productTypeId === pt.id
                                    ? 'bg-primary/5 border-primary/50 shadow-sm'
                                    : 'bg-surface border-transparent hover:border-glass-border hover:bg-white'
                                }
                            `}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-base">{pt.icon}</span>
                                <span className="text-[10px] bg-surface/50 px-1.5 py-0.5 rounded border border-glass-border text-text-muted">
                                    x{pt.spaceModifier.toFixed(2)}
                                </span>
                            </div>
                            <div className="font-medium text-xs text-text-primary">{pt.name}</div>
                            <div className="text-[10px] text-text-muted">{pt.code}</div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Total Operators - P3-PG-FLOOR-002 */}
            <div className="card-float p-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
                    <Users size={14} className="text-primary" />
                    Operators
                </label>

                <div className="mb-2">
                    <NumberInput
                        label=""
                        value={inputs.totalOperators}
                        onChange={(v) => onInputChange('totalOperators', v)}
                        min={10}
                        max={10000}
                        step={10}
                        size="sm"
                        className="w-full text-sm"
                    />
                </div>

                <Slider
                    value={inputs.totalOperators}
                    onChange={(v) => onInputChange('totalOperators', v)}
                    min={10}
                    max={2000}
                    step={10}
                    marks={[
                        { value: 10, label: '' },
                        { value: 500, label: '' },
                        { value: 1000, label: '' },
                        { value: 1500, label: '' },
                        { value: 2000, label: '' },
                    ]}
                />
            </div>

            {/* Working Hours - P3-PG-FLOOR-004 */}
            <div className="card-float p-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
                    <Clock size={14} className="text-accent" />
                    Work Hours
                </label>

                <div className="flex flex-col gap-2">
                    <NumberInput
                        label=""
                        value={inputs.workingHours}
                        onChange={(v) => onInputChange('workingHours', v)}
                        min={1}
                        max={24}
                        step={0.5}
                        size="sm"
                        className="w-full"
                    />
                    <div className="grid grid-cols-4 gap-1">
                        {[8, 10, 12, 16].map((hours) => (
                            <button
                                key={hours}
                                onClick={() => onInputChange('workingHours', hours)}
                                className={`
                                    py-1 rounded-md text-[10px] font-medium transition-all border border-transparent
                                    ${inputs.workingHours === hours
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'bg-surface text-text-secondary hover:bg-glass-heavy border-glass-border'
                                    }
                                `}
                            >
                                {hours}h
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Building Floors - P3-PG-FLOOR-005 */}
            <div className="card-float p-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
                    <Layers size={14} className="text-success" />
                    Floors
                </label>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-surface p-1 rounded-lg border border-glass-border">
                        <button
                            onClick={() => inputs.buildingFloors > 1 && onInputChange('buildingFloors', inputs.buildingFloors - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-glass-heavy text-text-secondary disabled:opacity-30"
                            disabled={inputs.buildingFloors <= 1}
                        >
                            -
                        </button>
                        <span className="text-xs font-bold text-text-primary">
                            {inputs.buildingFloors} <span className="text-[10px] font-normal text-text-muted">floors</span>
                        </span>
                        <button
                            onClick={() => onInputChange('buildingFloors', inputs.buildingFloors + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-glass-heavy text-text-secondary disabled:opacity-30"
                            disabled={inputs.buildingFloors >= 50}
                        >
                            +
                        </button>
                    </div>

                    {/* Compact Stack Visual */}
                    <div className="flex gap-0.5 h-8 w-full overflow-hidden">
                        {Array.from({ length: Math.min(inputs.buildingFloors, 12) }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm ${i === inputs.buildingFloors - 1 ? 'bg-success' : 'bg-success/30'}`}
                            />
                        ))}
                        {inputs.buildingFloors > 12 && (
                            <div className="flex items-center justify-center w-6 text-[9px] text-text-muted">
                                +{inputs.buildingFloors - 12}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floor Dimensions - P3-PG-FLOOR-006 */}
            <div className="card-float p-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-primary mb-2">
                    <Ruler size={14} className="text-warning" />
                    Area
                </label>

                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 gap-2">
                        <NumberInput
                            label="width"
                            value={inputs.floorWidth}
                            onChange={(v) => onInputChange('floorWidth', v)}
                            min={20}
                            max={500}
                            step={5}
                            size="sm"
                            className="w-full"
                        />
                        <NumberInput
                            label="height"
                            value={inputs.floorHeight}
                            onChange={(v) => onInputChange('floorHeight', v)}
                            min={20}
                            max={500}
                            step={5}
                            size="sm"
                            className="w-full"
                        />
                    </div>
                    <div className="text-[10px] text-center text-text-muted bg-surface/50 rounded py-1">
                        Total Area: <strong>{(inputs.floorWidth * inputs.floorHeight).toLocaleString()} m²</strong>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
