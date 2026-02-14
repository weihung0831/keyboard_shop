'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconX,
  IconCheck,
  IconInfoCircle,
  IconExclamationMark,
  IconAlertCircle,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import type { CartNotification } from '@/types/cart';

/**
 * 通知圖示對應
 */
const notificationIcons = {
  success: IconCheck,
  info: IconInfoCircle,
  warning: IconExclamationMark,
  error: IconAlertCircle,
};

/**
 * 通知樣式對應
 */
const notificationStyles = {
  success: {
    container: 'bg-green-500/10 border-green-500/20 backdrop-blur-sm',
    icon: 'text-green-400',
    title: 'text-green-100',
    message: 'text-green-200',
    closeButton: 'text-green-300 hover:text-green-100',
  },
  info: {
    container: 'bg-blue-500/10 border-blue-500/20 backdrop-blur-sm',
    icon: 'text-blue-400',
    title: 'text-blue-100',
    message: 'text-blue-200',
    closeButton: 'text-blue-300 hover:text-blue-100',
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm',
    icon: 'text-yellow-400',
    title: 'text-yellow-100',
    message: 'text-yellow-200',
    closeButton: 'text-yellow-300 hover:text-yellow-100',
  },
  error: {
    container: 'bg-red-500/10 border-red-500/20 backdrop-blur-sm',
    icon: 'text-red-400',
    title: 'text-red-100',
    message: 'text-red-200',
    closeButton: 'text-red-300 hover:text-red-100',
  },
};

/**
 * 單一通知元件Props
 */
interface NotificationItemProps {
  notification: CartNotification;
  onClose: (id: string) => void;
}

/**
 * 單一通知元件
 */
function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { type, title, message, closable, id } = notification;
  const IconComponent = notificationIcons[type];
  const styles = notificationStyles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('relative w-full max-w-sm rounded-lg border p-4 shadow-lg', styles.container)}
      role='alert'
      aria-live='polite'
    >
      <div className='flex items-start space-x-3'>
        {/* 通知圖示 */}
        <div className='flex-shrink-0'>
          <IconComponent className={cn('h-5 w-5', styles.icon)} />
        </div>

        {/* 通知內容 */}
        <div className='flex-1 min-w-0'>
          <p className={cn('text-sm font-medium', styles.title)}>{title}</p>
          {message && <p className={cn('mt-1 text-xs', styles.message)}>{message}</p>}
        </div>

        {/* 關閉按鈕 */}
        {closable && (
          <button
            type='button'
            onClick={() => onClose(id)}
            className={cn(
              'flex-shrink-0 rounded-md p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20',
              styles.closeButton,
            )}
            aria-label='關閉通知'
          >
            <IconX className='h-4 w-4' />
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 購物車通知容器元件
 */
export function CartNotifications() {
  const { notifications, removeNotification } = useCart();

  if (notifications.length === 0) return null;

  return (
    <div className='fixed top-20 right-4 z-[200] space-y-2 pointer-events-none'>
      <AnimatePresence mode='popLayout'>
        {notifications.map(notification => (
          <div key={notification.id} className='pointer-events-auto'>
            <NotificationItem notification={notification} onClose={removeNotification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * 通知Hook，用於其他元件快速顯示通知
 */
export function useNotification() {
  const { addNotification } = useCart();

  const showSuccess = (title: string, message?: string, options?: Partial<CartNotification>) => {
    addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  };

  const showInfo = (title: string, message?: string, options?: Partial<CartNotification>) => {
    addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  };

  const showWarning = (title: string, message?: string, options?: Partial<CartNotification>) => {
    addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  };

  const showError = (title: string, message?: string, options?: Partial<CartNotification>) => {
    addNotification({
      type: 'error',
      title,
      message,
      ...options,
    });
  };

  return {
    showSuccess,
    showInfo,
    showWarning,
    showError,
  };
}
