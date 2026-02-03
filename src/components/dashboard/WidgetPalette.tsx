/**
 * Widget Palette Component
 * Sidebar/drawer for adding new widgets to dashboard
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Gauge, BarChart3, TrendingUp, Calendar, LayoutGrid, DollarSign, Columns3 } from 'lucide-react';
import { widgetLibrary, WidgetType } from '../../types/dashboard';

interface WidgetPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onAddWidget: (type: WidgetType) => void;
}

const iconMap: Record<string, React.ReactNode> = {
    hash: <Hash size={20} />,
    gauge: <Gauge size={20} />,
    'bar-chart-3': <BarChart3 size={20} />,
    'trending-up': <TrendingUp size={20} />,
    calendar: <Calendar size={20} />,
    'layout-grid': <LayoutGrid size={20} />,
    'dollar-sign': <DollarSign size={20} />,
    'columns-3': <Columns3 size={20} />,
};

export function WidgetPalette({ isOpen, onClose, onAddWidget }: WidgetPaletteProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/20 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        className="fixed right-0 top-0 bottom-0 w-80 bg-[var(--color-surface)] shadow-2xl z-50 flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-glass-border)]">
                            <h2 className="font-semibold text-[var(--color-text-primary)]">Add Widget</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Widget list */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {widgetLibrary.map((widget, index) => (
                                <motion.button
                                    key={widget.type}
                                    onClick={() => {
                                        onAddWidget(widget.type);
                                        onClose();
                                    }}
                                    className="w-full flex items-start gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-glass)] hover:bg-[var(--color-primary)] hover:text-white group transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white group-hover:bg-white group-hover:text-[var(--color-primary)] flex items-center justify-center transition-colors">
                                        {iconMap[widget.icon] || <Hash size={20} />}
                                    </div>

                                    <div className="flex-1 text-left">
                                        <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-white transition-colors">
                                            {widget.name}
                                        </h3>
                                        <p className="text-xs text-[var(--color-text-muted)] group-hover:text-white/70 mt-0.5 transition-colors">
                                            {widget.description}
                                        </p>
                                        <div className="text-xs text-[var(--color-text-muted)] group-hover:text-white/60 mt-1 transition-colors">
                                            Size: {widget.defaultSize.w}×{widget.defaultSize.h}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer hint */}
                        <div className="px-5 py-3 border-t border-[var(--color-glass-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] text-center">
                                Click a widget to add it to your dashboard
                            </p>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
