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
    className?: string;
}

export function ParametersPanel({
    inputs,
    onInputChange,
    totalArea,
    className = '',
}: ParametersPanelProps) {
    const selectedProductType = productTypes.find(pt => pt.id === inputs.productTypeId);

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

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col p-3 rounded-2xl bg-surface border border-glass-border">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">Operators</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-text-primary">{inputs.totalOperators}</span>
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
            <div className="card-float p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Package size={14} className="text-secondary" />
                    Product Type
                </label>

                <div className="grid grid-cols-2 gap-2">
                    {productTypes.map((pt) => (
                        <motion.button
                            key={pt.id}
                            onClick={() => onInputChange('productTypeId', pt.id)}
                            className={`
                p-3 rounded-xl text-left transition-all border-2
                ${inputs.productTypeId === pt.id
                                    ? 'bg-primary/10 border-primary shadow-md'
                                    : 'bg-surface border-transparent hover:border-glass-border hover:bg-white'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{pt.icon}</span>
                                <span className="text-xs font-bold text-text-primary">{pt.code}</span>
                            </div>
                            <div className="text-[10px] text-text-muted leading-tight">{pt.name}</div>
                            <div className="text-[9px] text-text-muted mt-1">
                                ×{pt.spaceModifier.toFixed(2)} space
                            </div>
                        </motion.button>
                    ))}
                </div>

                {selectedProductType && (
                    <div className="mt-3 p-2 rounded-lg bg-surface text-[10px] text-text-muted">
                        <strong>Departments:</strong> {selectedProductType.departments.length} required
                    </div>
                )}
            </div>

            {/* Total Operators - P3-PG-FLOOR-002 */}
            <div className="card-float p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Users size={14} className="text-primary" />
                    Total Operators
                </label>

                <div className="flex gap-2 items-center mb-2">
                    <NumberInput
                        label=""
                        value={inputs.totalOperators}
                        onChange={(v) => onInputChange('totalOperators', v)}
                        min={10}
                        max={10000}
                        step={10}
                        size="sm"
                        className="w-full"
                    />
                </div>

                <Slider
                    value={inputs.totalOperators}
                    onChange={(v) => onInputChange('totalOperators', v)}
                    min={10}
                    max={2000}
                    step={10}
                    marks={[
                        { value: 10, label: '10' },
                        { value: 500, label: '500' },
                        { value: 1000, label: '1K' },
                        { value: 2000, label: '2K' },
                    ]}
                />
            </div>

            {/* Working Hours - P3-PG-FLOOR-004 */}
            <div className="card-float p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Clock size={14} className="text-accent" />
                    Working Hours/Day
                </label>

                <div className="flex gap-2 items-center">
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
                </div>

                <div className="flex gap-2 mt-3">
                    {[8, 10, 12, 16].map((hours) => (
                        <button
                            key={hours}
                            onClick={() => onInputChange('workingHours', hours)}
                            className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${inputs.workingHours === hours
                                    ? 'bg-accent text-white'
                                    : 'bg-surface text-text-secondary hover:bg-glass-heavy'
                                }
              `}
                        >
                            {hours}h
                        </button>
                    ))}
                </div>
            </div>

            {/* Building Floors - P3-PG-FLOOR-005 */}
            <div className="card-float p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Layers size={14} className="text-success" />
                    Building Floors
                </label>

                {/* Floor Stack Visual */}
                <div className="flex items-end justify-center gap-1 h-20 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const floorNum = i + 1;
                        const isActive = floorNum <= inputs.buildingFloors;
                        return (
                            <motion.button
                                key={i}
                                onClick={() => onInputChange('buildingFloors', floorNum)}
                                className={`
                  w-10 rounded-t-lg transition-all flex items-center justify-center
                  ${isActive
                                        ? 'bg-success text-white shadow-md'
                                        : 'bg-surface text-text-muted hover:bg-glass-heavy'
                                    }
                `}
                                style={{ height: `${20 + i * 12}px` }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-xs font-bold">{floorNum}</span>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="text-center text-xs text-text-muted">
                    {inputs.buildingFloors} {inputs.buildingFloors === 1 ? 'floor' : 'floors'}
                </div>
            </div>

            {/* Floor Dimensions - P3-PG-FLOOR-006 */}
            <div className="card-float p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Ruler size={14} className="text-warning" />
                    Floor Dimensions (m)
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className="text-[10px] text-text-muted uppercase tracking-wide block mb-1">Width</span>
                        <div className="flex items-center gap-2">
                            <NumberInput
                                label=""
                                value={inputs.floorWidth}
                                onChange={(v) => onInputChange('floorWidth', v)}
                                min={20}
                                max={500}
                                step={5}
                                size="sm"
                                className="flex-1 min-w-0"
                            />
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-text-muted uppercase tracking-wide block mb-1">Height</span>
                        <div className="flex items-center gap-2">
                            <NumberInput
                                label=""
                                value={inputs.floorHeight}
                                onChange={(v) => onInputChange('floorHeight', v)}
                                min={20}
                                max={500}
                                step={5}
                                size="sm"
                                className="flex-1 min-w-0"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-3 p-2 rounded-lg bg-surface text-xs text-text-muted text-center">
                    Floor Area: <strong>{(inputs.floorWidth * inputs.floorHeight).toLocaleString()} m²</strong>
                </div>
            </div>
        </motion.div>
    );
}
