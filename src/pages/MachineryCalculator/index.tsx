import { Calculator, Download, Share2 } from 'lucide-react';

export function MachineryCalculatorPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-none items-center justify-between mb-6 px-1">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Machinery Calculator</h2>
          <span className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1.5">
            Phase 3 • Estimation Module
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
            title="Export"
          >
            <Download size={18} />
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
            title="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-h-0 overflow-hidden">
        <div className="card-float w-full h-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-2xl)] bg-[var(--color-secondary)] flex items-center justify-center text-white">
            <Calculator size={32} />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
            Calculator Module
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Calculate machine requirements including embroidery operations with What-If scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}
