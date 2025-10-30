'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import {
  IconHeart,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleX,
  IconX,
} from '@tabler/icons-react';

/**
 * 願望清單通知組件
 */
export default function WishlistNotifications() {
  const { notifications, removeNotification } = useWishlist();

  /**
   * 根據通知類型返回對應的圖標
   */
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <IconHeart className='h-5 w-5' />;
      case 'error':
        return <IconCircleX className='h-5 w-5' />;
      case 'warning':
        return <IconAlertTriangle className='h-5 w-5' />;
      case 'info':
        return <IconInfoCircle className='h-5 w-5' />;
      default:
        return <IconInfoCircle className='h-5 w-5' />;
    }
  };

  /**
   * 根據通知類型返回對應的樣式類名
   */
  const getTypeClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-pink-500/10 border-pink-500 text-pink-400';
      case 'error':
        return 'bg-red-500/10 border-red-500 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500 text-yellow-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500 text-blue-400';
      default:
        return 'bg-zinc-500/10 border-zinc-500 text-zinc-400';
    }
  };

  return (
    <div
      className='pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-3'
      style={{ maxWidth: '400px' }}
    >
      <AnimatePresence mode='popLayout'>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className='pointer-events-auto'
          >
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 backdrop-blur-lg shadow-2xl ${getTypeClasses(
                notification.type,
              )}`}
            >
              {/* Icon */}
              <div className='flex-shrink-0 mt-0.5'>{getIcon(notification.type)}</div>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-white'>{notification.title}</div>
                {notification.message && (
                  <div className='mt-1 text-sm opacity-90'>{notification.message}</div>
                )}
              </div>

              {/* Close Button */}
              {notification.closable && (
                <button
                  onClick={() => removeNotification(notification.id)}
                  className='flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity'
                  aria-label='關閉通知'
                >
                  <IconX className='h-4 w-4' />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
