/**
 * LayoutTemplates Component
 * Pre-built layout templates modal
 * @requirement P3-PG-FLOOR-016 Templates (pre-built layouts)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Users } from 'lucide-react';
import { layoutTemplates, type LayoutTemplate } from '@mocks/floor-layout';

interface LayoutTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LayoutTemplate) => void;
  className?: string;
}

export function LayoutTemplates({ isOpen, onClose, onSelectTemplate }: LayoutTemplatesProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
                <div>
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <span className="text-2xl">📐</span>
                    Layout Templates
                  </h2>
                  <p className="text-sm text-text-muted mt-0.5">
                    Choose a pre-built layout to get started quickly
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Templates Grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar">
                {layoutTemplates.map(template => (
                  <motion.button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="group relative flex flex-col items-center p-6 rounded-2xl border-2 border-glass-border hover:border-primary bg-surface hover:bg-primary/5 transition-all text-left"
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                      <span className="text-4xl">{template.thumbnail}</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-text-primary text-center">
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-text-muted text-center mt-1">
                      {template.description}
                    </p>

                    {/* Operator Range */}
                    <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm">
                      <Users size={12} className="text-primary" />
                      <span className="text-xs font-medium text-text-secondary">
                        {template.operatorRange}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                      <span>
                        {template.inputs.buildingFloors || 1} floor
                        {(template.inputs.buildingFloors || 1) > 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span>{template.departments.length} depts</span>
                    </div>

                    {/* Select Indicator */}
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check size={14} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-glass-border bg-surface/50">
                <p className="text-xs text-text-muted text-center">
                  Templates provide a starting point. You can customize after applying.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
