import { useState, forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';

export interface TableColumn<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    searchable?: boolean;
    searchKeys?: (keyof T)[];
    pageSize?: number;
    selectable?: boolean;
    onRowClick?: (row: T, index: number) => void;
    emptyMessage?: string;
    className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

function DataTableInner<T extends Record<string, unknown>>(
    {
        data,
        columns,
        searchable = false,
        searchKeys = [],
        pageSize = 10,
        selectable = false,
        onRowClick,
        emptyMessage = 'No data available',
        className = '',
    }: DataTableProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    // Filter data by search
    const filteredData = useMemo(() => {
        if (!searchQuery || searchKeys.length === 0) return data;

        return data.filter((row) =>
            searchKeys.some((key) => {
                const value = row[key];
                return String(value).toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, searchKeys]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortKey || !sortDirection) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey as keyof T];
            const bVal = b[sortKey as keyof T];

            if (aVal === bVal) return 0;
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            const comparison = aVal < bVal ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredData, sortKey, sortDirection]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            if (sortDirection === 'asc') setSortDirection('desc');
            else if (sortDirection === 'desc') {
                setSortKey(null);
                setSortDirection(null);
            }
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const toggleRowSelection = (index: number) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedRows(newSelected);
    };

    const toggleAllSelection = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map((_, i) => i)));
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortKey !== columnKey) return <ChevronsUpDown size={14} className="opacity-30" />;
        if (sortDirection === 'asc') return <ChevronUp size={14} />;
        return <ChevronDown size={14} />;
    };

    return (
        <div ref={ref} className={`overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-glass-border)] bg-[var(--color-surface)] ${className}`}>
            {/* Search Bar */}
            {searchable && (
                <div className="p-3 border-b border-[var(--color-glass-border)]">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 py-2 rounded-[var(--radius-lg)] bg-[var(--color-glass)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[var(--color-glass)]">
                            {selectable && (
                                <th className="px-4 py-3 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                        onChange={toggleAllSelection}
                                        className="rounded"
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`
                    px-4 py-3 text-xs font-semibold uppercase tracking-wider
                    text-[var(--color-text-muted)]
                    ${col.sortable ? 'cursor-pointer hover:text-[var(--color-text-primary)]' : ''}
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        <span>{col.header}</span>
                                        {col.sortable && <SortIcon columnKey={String(col.key)} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="px-4 py-12 text-center text-[var(--color-text-muted)]"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className={`
                    border-t border-[var(--color-glass-border)]
                    ${onRowClick ? 'cursor-pointer hover:bg-[var(--color-glass)]' : ''}
                    ${selectedRows.has(index) ? 'bg-[var(--color-primary)]/10' : ''}
                  `}
                                    onClick={() => onRowClick?.(row, index)}
                                >
                                    {selectable && (
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(index)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    toggleRowSelection(index);
                                                }}
                                                className="rounded"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => {
                                        const value = row[col.key as keyof T];
                                        return (
                                            <td
                                                key={String(col.key)}
                                                className={`
                          px-4 py-3 text-sm text-[var(--color-text-primary)]
                          ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                        `}
                                            >
                                                {col.render ? col.render(value, row, index) : String(value ?? '')}
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-glass-border)]">
                    <span className="text-sm text-[var(--color-text-muted)]">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </span>
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`
                  px-3 py-1 text-sm rounded-[var(--radius-md)] transition-colors
                  ${page === currentPage
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'hover:bg-[var(--color-glass)] text-[var(--color-text-secondary)]'
                                    }
                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export const DataTable = forwardRef(DataTableInner) as <T extends Record<string, unknown>>(
    props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;
