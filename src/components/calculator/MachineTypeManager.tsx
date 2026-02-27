/**
 * MachineTypeManager - Inline component for managing project-scoped machine types
 * Provides current selection + Add/Remove capability
 * @requirement Machine Type CRUD per project (VISION consultancy requirement)
 *
 * Why: "We can't pre-define every machine type. Each factory has its own set."
 */

import { forwardRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown, Wrench, Trash2, Check } from 'lucide-react';

import {
    type MockMachineType,
    addMachineType,
    removeMachineType,
    getProjectMachineTypes,
} from '@mocks/calculator';

export interface MachineTypeManagerProps {
    value: string;
    onChange: (machineTypeId: string) => void;
    /** Filter by tab category */
    categoryFilter: 'sewing' | 'embroidery' | 'fusing';
    className?: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
    sewing: ['sewing', 'cutting', 'finishing'],
    embroidery: ['embroidery'],
    fusing: ['fusing'],
};

export const MachineTypeManager = forwardRef<HTMLDivElement, MachineTypeManagerProps>(
    ({ value, onChange, categoryFilter, className = '' }, ref) => {
        const [isDropdownOpen, setDropdownOpen] = useState(false);
        const [isAddFormOpen, setAddFormOpen] = useState(false);
        const [machineTypes, setMachineTypes] = useState<MockMachineType[]>(() => getProjectMachineTypes());

        // Add form state
        const [newName, setNewName] = useState('');
        const [newMake, setNewMake] = useState('');
        const [newModelNo, setNewModelNo] = useState('');
        const [newSMV, setNewSMV] = useState('');
        const [newCategory, setNewCategory] = useState<MockMachineType['category']>(
            categoryFilter === 'sewing' ? 'sewing' : categoryFilter
        );

        const allowedCategories = CATEGORY_MAP[categoryFilter] || ['sewing'];
        const filteredTypes = machineTypes.filter(mt => allowedCategories.includes(mt.category));
        const selectedType = machineTypes.find(mt => mt.id === value);

        const refreshList = useCallback(() => {
            setMachineTypes([...getProjectMachineTypes()]);
        }, []);

        const handleAdd = useCallback(() => {
            if (!newName.trim()) return;

            const entry = addMachineType({
                name: newName.trim(),
                make: newMake.trim() || undefined,
                modelNo: newModelNo.trim() || undefined,
                category: newCategory,
                defaultSMV: parseFloat(newSMV) || 0,
                defaultEfficiency: 0.80,
                isCustom: true,
            });

            refreshList();
            onChange(entry.id);
            setNewName('');
            setNewMake('');
            setNewModelNo('');
            setNewSMV('');
            setAddFormOpen(false);
            setDropdownOpen(false);
        }, [newName, newMake, newModelNo, newCategory, newSMV, onChange, refreshList]);

        const handleRemove = useCallback((id: string, e: React.MouseEvent) => {
            e.stopPropagation();
            removeMachineType(id);
            refreshList();
            if (value === id) {
                const remaining = getProjectMachineTypes().filter(mt => allowedCategories.includes(mt.category));
                if (remaining.length > 0) onChange(remaining[0].id);
            }
        }, [value, onChange, allowedCategories, refreshList]);

        return (
            <div ref={ref} className={`relative ${className}`}>
                {/* Label */}
                <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 flex items-center gap-1.5">
                    <Wrench size={14} />
                    Machine Type
                </label>

                {/* Selected Value Button */}
                <motion.button
                    onClick={() => {
                        setDropdownOpen(!isDropdownOpen);
                        setAddFormOpen(false);
                    }}
                    className={`
            w-full flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-lg)]
            bg-[var(--color-glass)] border border-[var(--color-glass-border)]
            text-left text-sm transition-all duration-200
            hover:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none
            ${isDropdownOpen ? 'ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]' : ''}
          `}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex-1 min-w-0">
                        <span className="text-[var(--color-text-primary)] font-medium truncate block">
                            {selectedType?.name || 'Select machine...'}
                        </span>
                        {selectedType?.make && (
                            <span className="text-xs text-[var(--color-text-muted)] truncate block">
                                {selectedType.make}{selectedType.modelNo ? ` · ${selectedType.modelNo}` : ''}
                                {selectedType.isCustom && ' · Custom'}
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-[var(--color-text-muted)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-[100] w-full mt-1 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-glass-border)] shadow-xl overflow-hidden backdrop-blur-xl"
                        >
                            {/* Machine List */}
                            <div className="max-h-56 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-[var(--color-text-muted)]/20">
                                {filteredTypes.map(mt => {
                                    const isSelected = mt.id === value;
                                    return (
                                        <motion.button
                                            key={mt.id}
                                            onClick={() => {
                                                onChange(mt.id);
                                                setDropdownOpen(false);
                                            }}
                                            className={`
                        w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-left text-sm
                        transition-colors group
                        ${isSelected
                                                    ? 'bg-[var(--color-primary)] text-white'
                                                    : 'hover:bg-[var(--color-glass)] text-[var(--color-text-primary)]'
                                                }
                      `}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <span className={`font-medium truncate block ${isSelected ? 'text-white' : ''}`}>
                                                    {mt.name}
                                                </span>
                                                {mt.make && (
                                                    <span className={`text-xs truncate block ${isSelected ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                                                        {mt.make}{mt.modelNo ? ` · ${mt.modelNo}` : ''}
                                                        {mt.isCustom && ' · Custom'}
                                                    </span>
                                                )}
                                            </div>

                                            {isSelected && <Check size={14} />}

                                            {/* Remove button for custom types */}
                                            {mt.isCustom && !isSelected && (
                                                <button
                                                    onClick={(e) => handleRemove(mt.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-all"
                                                    title="Remove machine type"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </motion.button>
                                    );
                                })}

                                {filteredTypes.length === 0 && (
                                    <p className="text-sm text-[var(--color-text-muted)] text-center py-3">
                                        No machine types for this category
                                    </p>
                                )}
                            </div>

                            {/* Add Button / Form */}
                            <div className="border-t border-[var(--color-glass-border)] p-2">
                                <AnimatePresence mode="wait">
                                    {!isAddFormOpen ? (
                                        <motion.button
                                            key="add-btn"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setAddFormOpen(true)}
                                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[var(--radius-md)]
                        text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10
                        transition-colors"
                                        >
                                            <Plus size={14} />
                                            Add Machine Type
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            key="add-form"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-2"
                                        >
                                            {/* Name (required) */}
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={e => setNewName(e.target.value)}
                                                placeholder="Machine name *"
                                                autoFocus
                                                className="w-full px-3 py-2 rounded-[var(--radius-md)] text-sm
                          bg-[var(--color-glass)] border border-[var(--color-glass-border)]
                          text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                            />

                                            {/* Make + Model row */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newMake}
                                                    onChange={e => setNewMake(e.target.value)}
                                                    placeholder="Make (brand)"
                                                    className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-sm
                            bg-[var(--color-glass)] border border-[var(--color-glass-border)]
                            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                                />
                                                <input
                                                    type="text"
                                                    value={newModelNo}
                                                    onChange={e => setNewModelNo(e.target.value)}
                                                    placeholder="Model No."
                                                    className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-sm
                            bg-[var(--color-glass)] border border-[var(--color-glass-border)]
                            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                                />
                                            </div>

                                            {/* SMV + Category row */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={newSMV}
                                                    onChange={e => setNewSMV(e.target.value)}
                                                    placeholder="Default SMV"
                                                    className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-sm
                            bg-[var(--color-glass)] border border-[var(--color-glass-border)]
                            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                                />
                                                <select
                                                    value={newCategory}
                                                    onChange={e => setNewCategory(e.target.value as MockMachineType['category'])}
                                                    className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-sm
                            bg-[var(--color-glass)] border border-[var(--color-glass-border)]
                            text-[var(--color-text-primary)]
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                                >
                                                    {allowedCategories.map(cat => (
                                                        <option key={cat} value={cat}>
                                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-1">
                                                <motion.button
                                                    onClick={handleAdd}
                                                    disabled={!newName.trim()}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[var(--radius-md)]
                            text-sm font-medium bg-[var(--color-primary)] text-white
                            hover:bg-[var(--color-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed
                            transition-colors"
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Plus size={14} />
                                                    Add
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => {
                                                        setAddFormOpen(false);
                                                        setNewName('');
                                                        setNewMake('');
                                                        setNewModelNo('');
                                                        setNewSMV('');
                                                    }}
                                                    className="px-3 py-2 rounded-[var(--radius-md)]
                            text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)]
                            transition-colors"
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <X size={14} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Click-away to close */}
                {isDropdownOpen && (
                    <div
                        className="fixed inset-0 z-[99]"
                        onClick={() => {
                            setDropdownOpen(false);
                            setAddFormOpen(false);
                        }}
                    />
                )}
            </div>
        );
    }
);

MachineTypeManager.displayName = 'MachineTypeManager';
