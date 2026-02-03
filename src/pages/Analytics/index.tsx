import { BarChart3, Filter, MoreHorizontal } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-none items-center justify-between mb-6 px-1">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Analytics Dashboard</h2>
          <span className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1.5">
            Phase 3 • Real-time Data
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
            title="Filter"
          >
            <Filter size={18} />
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-white text-text-secondary hover:text-primary border border-transparent hover:border-glass-border hover:shadow-float transition-all"
            title="More"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="card-float p-12 max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-2xl)] bg-[var(--color-success)] flex items-center justify-center text-white">
            <BarChart3 size={32} />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
            Data Insights
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Presentation-ready dashboards with draggable widgets for live client meetings.
          </p>
        </div>
      </div>
    </div>
  );
}
