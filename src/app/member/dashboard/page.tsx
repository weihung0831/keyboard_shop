'use client';

/**
 * 會員專區首頁
 * 顯示會員基本資訊、快速功能連結、最近訂單
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useOrders } from '@/hooks/useOrders';
import { ShoppingBag, User, Package, Calendar, CreditCard, Heart, Lock } from 'lucide-react';

export default function MemberDashboardPage() {
  const { currentUser } = useAuth();
  const { isLoading } = useAuthGuard();
  const { totalItems: wishlistTotalItems } = useWishlist();
  const { orders: recentOrders, isLoading: isLoadingOrders, fetchOrders } = useOrders();

  // 從 API 載入最近的 3 筆訂單
  useEffect(() => {
    if (currentUser) {
      fetchOrders({ per_page: 3 });
    }
  }, [currentUser, fetchOrders]);

  if (isLoading) {
    return null; // Layout 已處理 loading 畫面
  }

  return (
    <div className='min-h-screen bg-black pt-24'>
      {/* 內容區域 */}
      <div className='container mx-auto px-4 py-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 歡迎訊息 */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-white mb-2'>歡迎回來, {currentUser?.name}!</h1>
            <p className='text-zinc-400'>{currentUser?.email}</p>
          </div>

          {/* 快速功能區 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            <Link
              href='/member/orders'
              className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-blue-500 transition-colors'
            >
              <ShoppingBag className='text-blue-500 mb-3' size={32} />
              <h3 className='text-white font-medium'>訂單查詢</h3>
              <p className='text-sm text-zinc-400 mt-1'>查看您的訂單記錄</p>
            </Link>
            <Link
              href='/member/wishlist'
              className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-pink-500 transition-colors group'
            >
              <div className='flex items-center justify-between mb-3'>
                <Heart
                  className='text-pink-500 group-hover:text-pink-400 transition-colors'
                  size={32}
                />
                {wishlistTotalItems > 0 && (
                  <span className='inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-pink-500 text-white text-xs font-medium'>
                    {wishlistTotalItems}
                  </span>
                )}
              </div>
              <h3 className='text-white font-medium'>願望清單</h3>
              <p className='text-sm text-zinc-400 mt-1'>
                {wishlistTotalItems > 0 ? `${wishlistTotalItems} 個收藏商品` : '管理您的收藏商品'}
              </p>
            </Link>
            <Link
              href='/member/profile'
              className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-blue-500 transition-colors'
            >
              <User className='text-blue-500 mb-3' size={32} />
              <h3 className='text-white font-medium'>個人資料</h3>
              <p className='text-sm text-zinc-400 mt-1'>管理您的個人資訊</p>
            </Link>
            <Link
              href='/member/change-password'
              className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-amber-500 transition-colors'
            >
              <Lock className='text-amber-500 mb-3' size={32} />
              <h3 className='text-white font-medium'>修改密碼</h3>
              <p className='text-sm text-zinc-400 mt-1'>更新您的登入密碼</p>
            </Link>
          </div>

          {/* 最近訂單區域 */}
          <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-white'>最近訂單</h2>
              {recentOrders.length > 0 && (
                <Link
                  href='/member/orders'
                  className='text-sm text-blue-500 hover:text-blue-400 transition-colors'
                >
                  查看全部 →
                </Link>
              )}
            </div>

            {isLoadingOrders ? (
              // Loading 狀態
              <div className='text-center py-12'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4'></div>
                <p className='text-zinc-400'>載入中...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              // 空狀態
              <div className='text-center py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4'>
                  <Package className='text-zinc-500' size={32} />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>尚無訂單</h3>
                <p className='text-zinc-400 mb-6'>您還沒有任何訂單記錄</p>
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
                {recentOrders.map(order => (
                  <Link
                    key={order.id}
                    href={`/member/orders/${order.id}`}
                    className='block bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors'
                  >
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                      {/* 左側訂單資訊 */}
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <Package className='text-zinc-400' size={16} />
                          <span className='text-sm text-zinc-400'>訂單編號:</span>
                          <span className='text-white font-medium'>{order.order_number}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='text-zinc-400' size={16} />
                          <span className='text-sm text-zinc-400'>日期:</span>
                          <span className='text-white'>
                            {new Date(order.created_at).toLocaleDateString('zh-TW')}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <CreditCard className='text-zinc-400' size={16} />
                          <span className='text-sm text-zinc-400'>金額:</span>
                          <span className='text-white font-semibold'>
                            NT$ {order.total_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* 右側狀態 */}
                      <div className='flex items-center justify-end'>
                        <span className='px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-500 border border-blue-500/30'>
                          {order.status_label}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
