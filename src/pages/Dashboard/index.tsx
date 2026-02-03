import { LayoutDashboard } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="card-float p-12 max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-2xl)] bg-[var(--color-primary)] flex items-center justify-center text-white">
          <LayoutDashboard size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Dashboard</h2>
        <p className="text-[var(--color-text-secondary)]">
          Your central hub for KPIs, widgets, and quick insights. Coming in Phase 3.
        </p>
      </div>
    </div>
  );
}
