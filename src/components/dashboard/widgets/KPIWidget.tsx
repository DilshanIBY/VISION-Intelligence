/**
 * KPI Widget Component
 * Displays a single KPI metric using StatCard
 */

import { Folder, Settings, Gauge, DollarSign, LayoutGrid, Calendar } from 'lucide-react';
import { StatCard } from '../../ui/display/StatCard';
import { KPIData } from '../../../types/dashboard';

interface KPIWidgetProps {
    data: KPIData;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
}

const iconMap: Record<string, React.ReactNode> = {
    folder: <Folder size={20} />,
    settings: <Settings size={20} />,
    gauge: <Gauge size={20} />,
    dollar: <DollarSign size={20} />,
    grid: <LayoutGrid size={20} />,
    calendar: <Calendar size={20} />,
};

export function KPIWidget({ data, variant = 'default', size = 'sm' }: KPIWidgetProps) {
    const formatValue = (value: number, unit: string): string => {
        if (unit === '$') {
            return `$${value.toLocaleString()}`;
        }
        if (unit === '%') {
            return `${value}%`;
        }
        return value.toLocaleString() + (unit ? ` ${unit}` : '');
    };

    return (
        <StatCard
            title={data.title}
            value={formatValue(data.value, data.unit)}
            icon={data.icon ? iconMap[data.icon] : undefined}
            trend={data.trend}
            variant={variant}
            size={size}
            className="h-full"
        />
    );
}
