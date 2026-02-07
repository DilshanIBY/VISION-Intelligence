import { useState, useEffect, useRef, ReactNode, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  children?: ContextMenuItem[];
}

export interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  disabled?: boolean;
  className?: string;
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ children, items, disabled = false, className = '' }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        e.preventDefault();

        const x = e.clientX;
        const y = e.clientY;

        // Adjust position to keep menu in viewport
        const menuWidth = 200;
        const menuHeight = items.length * 40;

        const adjustedX = Math.min(x, window.innerWidth - menuWidth - 8);
        const adjustedY = Math.min(y, window.innerHeight - menuHeight - 8);

        setPosition({ x: adjustedX, y: adjustedY });
        setIsOpen(true);
      },
      [disabled, items.length]
    );

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setActiveSubmenu(null);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          setActiveSubmenu(null);
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    const handleItemClick = (item: ContextMenuItem) => {
      if (item.disabled) return;
      if (item.children) {
        setActiveSubmenu(item.id);
        // Calculate submenu position
        const menuRect = menuRef.current?.getBoundingClientRect();
        if (menuRect) {
          setSubmenuPosition({
            x: menuRect.right - 4,
            y: position.y,
          });
        }
      } else {
        item.onClick?.();
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    const renderMenuItem = (item: ContextMenuItem) => (
      <motion.button
        key={item.id}
        onClick={() => handleItemClick(item)}
        onMouseEnter={() => item.children && setActiveSubmenu(item.id)}
        disabled={item.disabled}
        whileHover={{ backgroundColor: 'var(--color-glass)' }}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm
          rounded-[var(--radius-md)] transition-colors duration-100
          ${item.danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text-primary)]'}
          ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-2">
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.shortcut && (
            <span className="text-xs text-[var(--color-text-muted)]">{item.shortcut}</span>
          )}
          {item.children && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-[var(--color-text-muted)]"
            >
              <path
                d="M4.5 2.5L8 6L4.5 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </motion.button>
    );

    return (
      <>
        {/* Trigger */}
        <div
          ref={triggerRef}
          onContextMenu={handleContextMenu}
          className={`inline-block ${className}`}
        >
          {children}
        </div>

        {/* Context Menu (Portal) */}
        {createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={node => {
                  menuRef.current = node;
                  if (typeof ref === 'function') ref(node);
                  else if (ref) ref.current = node;
                }}
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.1 }}
                style={{ top: position.y, left: position.x }}
                className="fixed z-[var(--z-context-menu)] min-w-[180px] p-1 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-glass-border)] shadow-[var(--shadow-xl)]"
              >
                {items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 &&
                      items[index - 1].id.startsWith('sep-') !== item.id.startsWith('sep-') && (
                        <div className="my-1 border-t border-[var(--color-glass-border)]" />
                      )}
                    {renderMenuItem(item)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Submenu (Portal) */}
        {createPortal(
          <AnimatePresence>
            {isOpen && activeSubmenu && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.1 }}
                style={{ top: submenuPosition.y, left: submenuPosition.x }}
                className="fixed z-[calc(var(--z-context-menu)+1)] min-w-[160px] p-1 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-glass-border)] shadow-[var(--shadow-xl)]"
              >
                {items
                  .find(item => item.id === activeSubmenu)
                  ?.children?.map(subItem => renderMenuItem(subItem))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </>
    );
  }
);

ContextMenu.displayName = 'ContextMenu';
