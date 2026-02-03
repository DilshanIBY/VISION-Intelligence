import { BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="card-float p-12 max-w-md">
                <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-2xl)] bg-[var(--color-success)] flex items-center justify-center text-white">
                    <BarChart3 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                    Analytics Dashboard
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                    Presentation-ready dashboards with draggable widgets for live client meetings. Coming in
                    Phase 3.
                </p>
            </div>
        </div>
    );
}
