import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Fabric Shortage Alert',
    message: 'Cotton 100% stock is below safety level for order #8821.',
    time: '10 min ago',
    read: false,
    type: 'warning',
  },
  {
    id: '2',
    title: 'Production Target Met',
    message: 'Line 3 has achieved 100% efficiency for the morning shift.',
    time: '1 hour ago',
    read: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'System Update',
    message: 'VISION Intelligence has been updated to v0.1.42.',
    time: '2 hours ago',
    read: true,
    type: 'info',
  },
  {
    id: '4',
    title: 'New Comment',
    message: 'Sanjeewa commented on the "Summer 2026" layout Plan.',
    time: 'Yesterday',
    read: true,
    type: 'info',
  },
];

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export function NotificationPopover({ isOpen, onClose, onMarkAllRead }: NotificationPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute top-16 right-0 z-50">
          {/* Backdrop for click outside */}
          <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

          {/* Popover */}
          <motion.div
            className="relative z-50 w-80 md:w-96 bg-surface dark:bg-slate-800 rounded-2xl shadow-2xl border border-glass-border overflow-hidden flex flex-col max-h-[500px]"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border bg-surface/50 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary" />
                <h3 className="font-bold text-text-primary text-sm">Notifications</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                  2
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onMarkAllRead}
                  className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar p-2">
              {MOCK_NOTIFICATIONS.length > 0 ? (
                <div className="space-y-1">
                  {MOCK_NOTIFICATIONS.map(notification => (
                    <div
                      key={notification.id}
                      className={`
                        p-3 rounded-xl transition-all cursor-pointer group relative flex gap-3
                        ${notification.read
                          ? 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                          : 'bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20'
                        }
                      `}
                    >
                      <div
                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-transparent' : 'bg-primary'}`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4
                            className={`text-sm ${notification.read ? 'font-medium' : 'font-bold'} text-text-primary truncate`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-text-muted flex-shrink-0 ml-2">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <Bell size={32} className="opacity-20 mb-3" />
                  <p className="text-sm">No new notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-glass-border bg-surface/50 dark:bg-white/5">
              <button className="w-full py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
                <span>View All Notifications</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
