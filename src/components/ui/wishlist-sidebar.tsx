'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { IconX, IconHeart, IconTrash, IconShoppingCart } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import type { WishlistItem } from '@/contexts/WishlistContext';

/**
 * 願望清單項目元件Props
 */
interface WishlistItemComponentProps {
  item: WishlistItem;
  onRemove: (productId: number) => void;
  onAddToCart: (productId: number) => void;
}

/**
 * 願望清單項目元件
 */
function WishlistItemComponent({ item, onRemove, onAddToCart }: WishlistItemComponentProps) {
  const { product } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className='flex items-start space-x-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-4'
    >
      {/* 商品圖片 */}
      <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-zinc-700'>
        <Image src={product.image} alt={product.name} fill className='object-cover' sizes='64px' />
        {/* 缺貨遮罩 */}
        {!product.inStock && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <span className='text-xs font-medium text-red-400'>缺貨</span>
          </div>
        )}
      </div>

      {/* 商品資訊 */}
      <div className='flex-1 space-y-2'>
        <div>
          <h4 className='text-sm font-medium text-white line-clamp-2'>{product.name}</h4>
          <p className='text-xs text-zinc-400'>{product.category}</p>
        </div>

        {/* 價格和操作按鈕 */}
        <div className='flex items-center justify-between'>
          <div className='text-sm font-medium text-pink-400'>
            NT$ {product.price.toLocaleString()}
          </div>

          <button
            onClick={() => onAddToCart(product.id)}
            disabled={!product.inStock}
            className={cn(
              'flex items-center space-x-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed',
            )}
            aria-label={`將 ${product.name} 加入購物車`}
          >
            <IconShoppingCart className='h-3.5 w-3.5' />
            <span>{product.inStock ? '加入購物車' : '缺貨中'}</span>
          </button>
        </div>
      </div>

      {/* 移除按鈕 */}
      <button
        onClick={() => onRemove(product.id)}
        className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-zinc-600 bg-zinc-700 text-zinc-300 transition-colors hover:bg-red-600 hover:border-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30'
        aria-label={`從願望清單移除 ${product.name}`}
      >
        <IconTrash className='h-4 w-4' />
      </button>
    </motion.div>
  );
}

/**
 * 空願望清單狀態元件
 */
function EmptyWishlist() {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800'>
        <IconHeart className='h-8 w-8 text-zinc-400' />
      </div>
      <h3 className='mb-2 text-lg font-medium text-white'>願望清單是空的</h3>
      <p className='text-center text-sm text-zinc-400'>將喜歡的鍵盤加入願望清單，方便日後查看！</p>
    </div>
  );
}

/**
 * 願望清單側邊欄元件Props
 */
interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 願望清單側邊欄元件
 */
export function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const router = useRouter();
  const { items, totalItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    const item = items.find(item => item.product.id === productId);
    if (item && item.product.inStock) {
      addToCart(item.product, 1);
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
    onClose();
  };

  return (
    <>
      {/* 背景遮罩 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
            aria-hidden='true'
          />
        )}
      </AnimatePresence>

      {/* 側邊欄 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-zinc-700 bg-zinc-900 shadow-2xl'
          >
            {/* 標題欄 */}
            <div className='flex items-center justify-between border-b border-zinc-700 p-6'>
              <div className='flex items-center space-x-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10'>
                  <IconHeart className='h-5 w-5 text-pink-400' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-white'>願望清單</h2>
                  <p className='text-sm text-zinc-400'>
                    {totalItems > 0 ? `${totalItems} 個商品` : '還沒有收藏'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className='flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600'
                aria-label='關閉願望清單'
              >
                <IconX className='h-5 w-5 text-zinc-400' />
              </button>
            </div>

            {/* 願望清單內容 */}
            <div className='flex h-[calc(100%-80px)] flex-col'>
              {items.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <>
                  {/* 願望清單項目列表 */}
                  <div className='flex-1 overflow-y-auto p-4'>
                    <div className='space-y-4'>
                      <AnimatePresence mode='popLayout'>
                        {items.map(item => (
                          <div
                            key={item.product.id}
                            onClick={() => handleViewProduct(item.product.id)}
                            className='cursor-pointer'
                          >
                            <WishlistItemComponent
                              item={item}
                              onRemove={removeFromWishlist}
                              onAddToCart={handleAddToCart}
                            />
                          </div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* 底部操作欄 */}
                  <div className='border-t border-zinc-700 p-4 space-y-3'>
                    <button
                      onClick={() => {
                        if (window.confirm('確定要清空願望清單嗎？')) {
                          clearWishlist();
                        }
                      }}
                      className='w-full rounded-lg border border-zinc-600 bg-transparent px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50'
                    >
                      清空願望清單
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
