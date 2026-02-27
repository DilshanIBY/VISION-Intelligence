/**
 * ExportPanel Component
 * Export options for PNG/PDF
 * @requirement P3-PG-FLOOR-015 Export layout (PNG/PDF)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileImage, FileText, FileSpreadsheet, Settings, Check, Loader2 } from 'lucide-react';

interface ExportPanelProps {
  onExport: (format: 'png' | 'pdf' | 'excel', options: ExportOptions) => void;
  className?: string;
}

export interface ExportOptions {
  quality: 'standard' | 'high' | 'print';
  includeGrid: boolean;
  includeFlowArrows: boolean;
  includeValidation: boolean;
}

const qualitySettings = {
  standard: { label: 'Standard', dpi: 72, description: 'Screen display' },
  high: { label: 'High', dpi: 150, description: 'Presentations' },
  print: { label: 'Print', dpi: 300, description: 'Professional print' },
};

export function ExportPanel({ onExport, className = '' }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'pdf' | 'excel'>('png');
  const [options, setOptions] = useState<ExportOptions>({
    quality: 'high',
    includeGrid: true,
    includeFlowArrows: true,
    includeValidation: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export delay (mock)
    await new Promise(resolve => setTimeout(resolve, 1500));
    onExport(selectedFormat, options);
    setIsExporting(false);
    // onClose() logic moved to parent calling
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Format Selection */}
      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
          Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          <FormatButton
            icon={<FileImage size={24} />}
            label="PNG"
            description="Image file"
            isSelected={selectedFormat === 'png'}
            onClick={() => setSelectedFormat('png')}
          />
          <FormatButton
            icon={<FileText size={24} />}
            label="PDF"
            description="Document"
            isSelected={selectedFormat === 'pdf'}
            onClick={() => setSelectedFormat('pdf')}
          />
          <FormatButton
            icon={<FileSpreadsheet size={24} />}
            label="Excel"
            description="Spreadsheet"
            isSelected={selectedFormat === 'excel'}
            onClick={() => setSelectedFormat('excel')}
          />
        </div>
      </div>

      {/* Quality Selection */}
      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
          Quality
        </label>
        <div className="space-y-2">
          {(Object.keys(qualitySettings) as Array<keyof typeof qualitySettings>).map(key => (
            <button
              key={key}
              onClick={() => setOptions({ ...options, quality: key })}
              className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                          ${options.quality === key
                  ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20 dark:border-primary-light'
                  : 'bg-white border-2 border-transparent hover:border-glass-border hover:bg-glass dark:bg-slate-800/50 dark:hover:bg-slate-800'
                }
                        `}
            >
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">
                  {qualitySettings[key].label}
                </div>
                <div className="text-xs text-text-muted">
                  {qualitySettings[key].dpi} DPI • {qualitySettings[key].description}
                </div>
              </div>
              {options.quality === key && <Check size={18} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Include Options */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
          <Settings size={14} />
          Include
        </label>
        <div className="space-y-2">
          <ToggleOption
            label="Grid Lines"
            checked={options.includeGrid}
            onChange={v => setOptions({ ...options, includeGrid: v })}
          />
          <ToggleOption
            label="Flow Arrows"
            checked={options.includeFlowArrows}
            onChange={v => setOptions({ ...options, includeFlowArrows: v })}
          />
          <ToggleOption
            label="Validation Status"
            checked={options.includeValidation}
            onChange={v => setOptions({ ...options, includeValidation: v })}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 mt-6 border-t border-glass-border">
        <motion.button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExporting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download size={20} />
              Export {selectedFormat.toUpperCase()}
            </>
          )}
        </motion.button>
        <p className="text-[10px] text-text-muted text-center mt-3">
          Mock export - no actual file generated
        </p>
      </div>
    </div>
  );
}

interface FormatButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function FormatButton({ icon, label, description, isSelected, onClick }: FormatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 p-4 rounded-xl transition-all
        ${isSelected
          ? 'bg-primary/10 border-2 border-primary dark:bg-primary/20 dark:border-primary-light'
          : 'bg-white border-2 border-transparent hover:border-glass-border hover:bg-glass dark:bg-slate-800/50 dark:hover:bg-slate-800'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isSelected ? 'text-primary' : 'text-text-secondary'}>{icon}</div>
      <span className="text-sm font-semibold text-text-primary">{label}</span>
      <span className="text-[10px] text-text-muted">{description}</span>
    </motion.button>
  );
}

interface ToggleOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ label, checked, onChange }: ToggleOptionProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
    >
      <span className="text-sm text-text-primary">{label}</span>
      <div
        className={`
          w-10 h-6 rounded-full p-1 transition-colors
          ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}
        `}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}
