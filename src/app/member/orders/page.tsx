'use client';

/**
 * 訂單歷史頁面
 * 顯示會員所有訂單記錄
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useOrders } from '@/hooks/useOrders';
import { Package, AlertCircle } from 'lucide-react';
import type { Order } from '@/types/order';

/**
 * 訂單卡片元件
 */
function OrderCard({ order }: { order: Order }) {
  // 狀態顏色對應
  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    processing: 'text-blue-400 bg-blue-400/10',
    shipped: 'text-indigo-400 bg-indigo-400/10',
    completed: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  const statusColor = statusColors[order.status] || 'text-zinc-400 bg-zinc-400/10';

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Link href={`/member/orders/${order.id}`}>
      <div className='flex items-center justify-between p-4 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <span className='text-white font-medium'>#{order.order_number}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {order.status_label}
            </span>
          </div>
          <div className='text-sm text-zinc-400'>
            {formatDate(order.created_at)} · {order.items_count} 件商品
          </div>
        </div>
        <div className='text-right'>
          <div className='text-blue-400 font-semibold'>
            NT$ {order.total_amount.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const { orders, isLoading, error, fetchOrders } = useOrders();

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, fetchOrders]);

  if (authLoading) {
    return null; // Layout 已處理 loading 畫面
  }

  return (
    <div className='min-h-screen bg-black pt-24'>
      <div className='container mx-auto px-4 py-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 頁面標題 */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-white mb-2'>我的訂單</h1>
            <p className='text-zinc-400'>查看您的所有訂單記錄</p>
          </div>

          {/* 訂單列表 */}
          <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6'>
            {isLoading ? (
              // Loading 狀態
              <div className='text-center py-12'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4'></div>
                <p className='text-zinc-400'>載入中...</p>
              </div>
            ) : error ? (
              // 錯誤狀態
              <div className='text-center py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4'>
                  <AlertCircle className='text-red-400' size={32} />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>載入失敗</h3>
                <p className='text-zinc-400 mb-6'>{error}</p>
                <button
                  onClick={() => fetchOrders()}
                  className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  重試
                </button>
              </div>
            ) : orders.length === 0 ? (
              // 空狀態
              <div className='text-center py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4'>
                  <Package className='text-zinc-500' size={32} />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>目前沒有訂單記錄</h3>
                <p className='text-zinc-400 mb-6'>您還沒有任何訂單，開始選購商品吧！</p>
                <Link
                  href='/products'
                  className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  開始購物
                </Link>
              </div>
            ) : (
              // 訂單列表
              <div className='space-y-4'>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
