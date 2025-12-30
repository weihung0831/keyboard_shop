'use client';

/**
 * 會員願望清單頁面
 * 顯示會員收藏的商品
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  IconHeart,
  IconTrash,
  IconShoppingCart,
  IconArrowLeft,
  IconAlertTriangle,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default function MemberWishlistPage() {
  const { isLoading } = useAuthGuard();
  const { items, totalItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleAddToCart = (productId: number) => {
    const item = items.find(item => item.product.id === productId);
    if (item && item.product.stock > 0) {
      addToCart(item.product, 1);
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleClearWishlist = () => {
    setShowClearModal(true);
  };

  const confirmClearWishlist = () => {
    clearWishlist();
    setShowClearModal(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className='min-h-screen bg-black pt-24'>
      <div className='container mx-auto px-4 py-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 標題欄 */}
          <div className='mb-8'>
            <button
              onClick={() => router.push('/member/dashboard')}
              className='mb-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors'
            >
              <IconArrowLeft className='mr-2 h-5 w-5' />
              返回會員專區
            </button>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10'>
                  <IconHeart className='h-6 w-6 text-pink-400' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>我的願望清單</h1>
                  <p className='text-zinc-400 mt-1'>
                    {totalItems > 0 ? `共 ${totalItems} 個商品` : '還沒有收藏商品'}
                  </p>
                </div>
              </div>
              {totalItems > 0 && (
                <button
                  onClick={handleClearWishlist}
                  className='px-4 py-2 rounded-lg border border-zinc-600 bg-transparent text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50'
                >
                  清空願望清單
                </button>
              )}
            </div>
          </div>

          {/* 願望清單內容 */}
          {items.length === 0 ? (
            // 空狀態
            <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-12'>
              <div className='flex flex-col items-center justify-center'>
                <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800'>
                  <IconHeart className='h-10 w-10 text-zinc-400' />
                </div>
                <h3 className='text-xl font-medium text-white mb-2'>願望清單是空的</h3>
                <p className='text-center text-zinc-400 mb-6'>
                  瀏覽我們的產品，將喜歡的鍵盤加入願望清單吧！
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className='px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all'
                >
                  前往購物
                </button>
              </div>
            </div>
          ) : (
            // 願望清單商品列表
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg overflow-hidden hover:border-pink-500 transition-all group'
                >
                  {/* 商品圖片 */}
                  <div
                    className='relative h-48 bg-zinc-800 cursor-pointer overflow-hidden'
                    onClick={() => handleViewProduct(item.product.id)}
                  >
                    <Image
                      src={item.product.primary_image || '/placeholder.png'}
                      alt={item.product.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                    {item.product.stock <= 0 && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
                        <span className='text-sm font-medium text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500'>
                          缺貨中
                        </span>
                      </div>
                    )}
                    {/* 移除按鈕 */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeFromWishlist(item.product.id);
                      }}
                      className='absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-zinc-600 text-pink-400 transition-all hover:bg-red-600 hover:border-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30'
                      aria-label={`從願望清單移除 ${item.product.name}`}
                    >
                      <IconTrash className='h-5 w-5' />
                    </button>
                  </div>

                  {/* 商品資訊 */}
                  <div className='p-4 space-y-3'>
                    <div
                      className='cursor-pointer'
                      onClick={() => handleViewProduct(item.product.id)}
                    >
                      <span className='inline-block text-xs font-medium text-pink-400 bg-pink-500/10 px-2 py-1 rounded mb-2'>
                        {item.product.category?.name || '未分類'}
                      </span>
                      <h3 className='text-lg font-semibold text-white line-clamp-2 hover:text-blue-400 transition-colors'>
                        {item.product.name}
                      </h3>
                      <p className='text-sm text-zinc-400 mt-1 line-clamp-2'>
                        {item.product.description}
                      </p>
                    </div>

                    {/* 價格和操作 */}
                    <div className='flex items-center justify-between pt-3 border-t border-zinc-700'>
                      <div className='text-xl font-bold text-pink-400'>
                        NT$ {item.product.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleAddToCart(item.product.id)}
                        disabled={item.product.stock <= 0}
                        className={cn(
                          'flex items-center space-x-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                          item.product.stock > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed',
                        )}
                        aria-label={`將 ${item.product.name} 加入購物車`}
                      >
                        <IconShoppingCart className='h-4 w-4' />
                        <span>{item.product.stock > 0 ? '加入購物車' : '缺貨中'}</span>
                      </button>
                    </div>

                    {/* 商品規格 */}
                    <div className='flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800'>
                      <span>{item.product.specifications?.['軸體'] || '-'}</span>
                      <span>{item.product.specifications?.['連接方式'] || '-'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 清空願望清單確認 Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'
            onClick={() => setShowClearModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className='relative w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl'
              onClick={e => e.stopPropagation()}
            >
              {/* 關閉按鈕 */}
              <button
                onClick={() => setShowClearModal(false)}
                className='absolute top-4 right-4 p-1 text-zinc-400 hover:text-white transition-colors'
              >
                <IconX size={20} />
              </button>

              {/* Modal 內容 */}
              <div className='p-6'>
                {/* 圖示 */}
                <div className='flex justify-center mb-4'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10'>
                    <IconAlertTriangle className='h-8 w-8 text-yellow-500' />
                  </div>
                </div>

                {/* 標題和說明 */}
                <div className='text-center mb-6'>
                  <h3 className='text-xl font-semibold text-white mb-2'>清空願望清單</h3>
                  <p className='text-zinc-400'>
                    確定要清空願望清單嗎？此操作將移除所有 {totalItems} 個收藏的商品，且無法復原。
                  </p>
                </div>

                {/* 按鈕 */}
                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowClearModal(false)}
                    className='flex-1 px-4 py-3 rounded-lg border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors'
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmClearWishlist}
                    className='flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors'
                  >
                    確定清空
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
