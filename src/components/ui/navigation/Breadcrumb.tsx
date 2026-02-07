import { ReactNode, forwardRef } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  homePath?: string;
  className?: string;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, showHome = true, homePath = '/', className = '' }, ref) => {
    const Separator = separator || (
      <ChevronRight size={14} className="text-[var(--color-text-muted)]" />
    );

    const allItems = showHome
      ? [{ label: 'Home', href: homePath, icon: <Home size={14} /> }, ...items]
      : items;

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={`flex items-center gap-2 ${className}`}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && Separator}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-1.5 text-sm ${
                    isLast
                      ? 'font-medium text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </div>
          );
        })}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
