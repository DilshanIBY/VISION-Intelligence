import { Calculator } from 'lucide-react';

export function MachineryCalculatorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="card-float p-12 max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-2xl)] bg-[var(--color-secondary)] flex items-center justify-center text-white">
          <Calculator size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          Machinery Calculator
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Calculate machine requirements including embroidery operations with What-If scenarios.
          Coming in Phase 3.
        </p>
      </div>
    </div>
  );
}
