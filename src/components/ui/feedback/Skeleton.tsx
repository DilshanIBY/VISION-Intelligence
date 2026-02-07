/**
 * Skeleton Loading Components
 * Animated placeholder components for loading states
 * @requirement P3-ST-001
 */

import { type HTMLAttributes, forwardRef } from 'react';

// =====================================================
// Base Skeleton
// =====================================================

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Animation type */
  animation?: 'shimmer' | 'pulse' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', animation = 'shimmer', ...props }, ref) => {
    const animationClass = {
      shimmer: 'skeleton-shimmer',
      pulse: 'animate-pulse',
      none: '',
    }[animation];

    return (
      <div
        ref={ref}
        className={`
                    bg-[var(--color-glass)] 
                    rounded-lg
                    ${animationClass}
                    ${className}
                `}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// =====================================================
// Skeleton Text
// =====================================================

interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of lines */
  lines?: number;
  /** Width of last line (percentage) */
  lastLineWidth?: string;
  /** Line height */
  lineHeight?: string;
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, lastLineWidth = '60%', lineHeight = '1rem', className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            style={{
              height: lineHeight,
              width: i === lines - 1 ? lastLineWidth : '100%',
            }}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = 'SkeletonText';

// =====================================================
// Skeleton Card
// =====================================================

interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Show header section */
  showHeader?: boolean;
  /** Show image/media section */
  showMedia?: boolean;
  /** Number of content lines */
  contentLines?: number;
}

export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ showHeader = true, showMedia = false, contentLines = 3, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
                    bg-[var(--color-surface)] 
                    rounded-2xl 
                    p-4 
                    shadow-[var(--shadow-float)]
                    ${className}
                `}
        {...props}
      >
        {showHeader && (
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        )}

        {showMedia && <Skeleton className="w-full h-40 rounded-xl mb-4" />}

        <SkeletonText lines={contentLines} />
      </div>
    );
  }
);
SkeletonCard.displayName = 'SkeletonCard';

// =====================================================
// Skeleton Table
// =====================================================

interface SkeletonTableProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Show header row */
  showHeader?: boolean;
}

export const SkeletonTable = forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, showHeader = true, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`space-y-2 ${className}`} {...props}>
        {showHeader && (
          <div className="flex gap-4 pb-2 border-b border-[var(--color-glass-border)]">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-4 flex-1" />
            ))}
          </div>
        )}

        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4 py-2">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }
);
SkeletonTable.displayName = 'SkeletonTable';

// =====================================================
// Skeleton Chart
// =====================================================

interface SkeletonChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Chart type hint for shape */
  type?: 'bar' | 'line' | 'gauge' | 'pie';
}

export const SkeletonChart = forwardRef<HTMLDivElement, SkeletonChartProps>(
  ({ type = 'bar', className = '', ...props }, ref) => {
    const renderChartSkeleton = () => {
      switch (type) {
        case 'bar':
          return (
            <div className="flex items-end gap-2 h-32">
              {[60, 80, 40, 90, 50, 70].map((height, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          );
        case 'line':
          return <Skeleton className="w-full h-32 rounded-xl" />;
        case 'gauge':
          return (
            <div className="flex justify-center">
              <Skeleton className="w-32 h-16 rounded-t-full" />
            </div>
          );
        case 'pie':
          return (
            <div className="flex justify-center">
              <Skeleton className="w-32 h-32 rounded-full" />
            </div>
          );
        default:
          return <Skeleton className="w-full h-32 rounded-xl" />;
      }
    };

    return (
      <div ref={ref} className={className} {...props}>
        {renderChartSkeleton()}
      </div>
    );
  }
);
SkeletonChart.displayName = 'SkeletonChart';

// =====================================================
// Skeleton Stat Card
// =====================================================

export const SkeletonStatCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
                    bg-[var(--color-surface)] 
                    rounded-2xl 
                    p-4 
                    shadow-[var(--shadow-float)]
                    ${className}
                `}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }
);
SkeletonStatCard.displayName = 'SkeletonStatCard';

export default Skeleton;
