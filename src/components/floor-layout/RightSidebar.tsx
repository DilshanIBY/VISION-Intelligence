/**
 * RightSidebar Component
 * Generic slide-over sidebar for Floor Layout tools
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function RightSidebar({
    isOpen,
    onClose,
    title,
    children,
    className = '',
}: RightSidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.aside
                        className={`fixed right-0 top-0 bottom-0 w-80 bg-surface shadow-2xl z-50 flex flex-col border-l border-glass-border ${className}`}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border bg-surface/50">
                            <h2 className="font-semibold text-text-primary text-lg">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-text-muted hover:bg-glass hover:text-text-primary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {children}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
