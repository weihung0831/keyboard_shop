'use client';

/**
 * 訂單歷史頁面
 * 顯示會員所有訂單記錄
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { OrderCard } from '@/components/member/OrderCard';
import { getUserOrders } from '@/lib/storage';
import type { OrderSummary } from '@/types/member';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // 模擬載入延遲
      setTimeout(() => {
        const userOrders = getUserOrders(currentUser.id);
        setOrders(userOrders);
        setIsLoading(false);
      }, 500);
    }
  }, [currentUser]);

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
            ) : orders.length === 0 ? (
              // 空狀態
              <div className='text-center py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4'>
                  <Package className='text-zinc-500' size={32} />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>目前沒有訂單記錄</h3>
                <p className='text-zinc-400 mb-6'>您還沒有任何訂單,開始選購商品吧!</p>
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
                  <OrderCard
                    key={order.id}
                    orderNumber={order.orderNumber}
                    date={order.date}
                    total={order.total}
                    status={order.status}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
