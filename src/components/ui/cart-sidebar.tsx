'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  IconX,
  IconShoppingCart,
  IconPlus,
  IconMinus,
  IconTrash,
  IconCreditCard,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';

/**
 * 購物車項目元件Props
 */
interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

/**
 * 購物車項目元件
 */
function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

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

        {/* 數量控制和價格 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              disabled={!product.inStock}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                product.inStock
                  ? 'border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed',
              )}
              aria-label='減少數量'
            >
              <IconMinus className='h-4 w-4' />
            </button>

            <span className='flex h-8 w-12 items-center justify-center rounded-md border border-zinc-600 bg-zinc-800 text-sm text-white'>
              {quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              disabled={!product.inStock}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                product.inStock
                  ? 'border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed',
              )}
              aria-label='增加數量'
            >
              <IconPlus className='h-4 w-4' />
            </button>
          </div>

          <div className='text-right'>
            <div className='text-sm font-medium text-blue-400'>
              NT$ {itemTotal.toLocaleString()}
            </div>
            <div className='text-xs text-zinc-400'>單價 NT$ {product.price.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* 移除按鈕 */}
      <button
        onClick={() => onRemove(product.id)}
        className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-zinc-600 bg-zinc-700 text-zinc-300 transition-colors hover:bg-red-600 hover:border-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30'
        aria-label={`移除 ${product.name}`}
      >
        <IconTrash className='h-4 w-4' />
      </button>
    </motion.div>
  );
}

/**
 * 空購物車狀態元件
 */
function EmptyCart() {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800'>
        <IconShoppingCart className='h-8 w-8 text-zinc-400' />
      </div>
      <h3 className='mb-2 text-lg font-medium text-white'>購物車是空的</h3>
      <p className='text-center text-sm text-zinc-400'>開始購物，將喜歡的鍵盤加入購物車吧！</p>
    </div>
  );
}

/**
 * 購物車側邊欄元件
 */
export function CartSidebar() {
  const router = useRouter();
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    router.push('/checkout');
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm'
            onClick={closeCart}
          />

          {/* 側邊欄 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-zinc-900 shadow-2xl border-l border-zinc-700'
          >
            {/* 標題欄 */}
            <div className='flex items-center justify-between border-b border-zinc-700 px-6 py-4'>
              <div className='flex items-center space-x-2'>
                <IconShoppingCart className='h-6 w-6 text-blue-400' />
                <h2 className='text-lg font-semibold text-white'>購物車 ({totalItems})</h2>
              </div>
              <button
                onClick={closeCart}
                className='flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                aria-label='關閉購物車'
              >
                <IconX className='h-5 w-5' />
              </button>
            </div>

            {/* 購物車內容 */}
            <div className='flex-1 overflow-hidden'>
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className='flex h-full flex-col'>
                  {/* 商品列表 */}
                  <div className='flex-1 overflow-y-auto p-6'>
                    <div className='space-y-4'>
                      <AnimatePresence mode='popLayout'>
                        {items.map(item => (
                          <CartItemComponent
                            key={item.product.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeFromCart}
                          />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* 清空購物車按鈕 */}
                    {items.length > 0 && (
                      <motion.button
                        layout
                        onClick={clearCart}
                        className='mt-6 w-full rounded-lg border border-red-600 bg-red-600/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500/30'
                      >
                        清空購物車
                      </motion.button>
                    )}
                  </div>

                  {/* 總計和結帳區域 */}
                  <motion.div layout className='border-t border-zinc-700 bg-zinc-800/50 p-6'>
                    {/* 總計 */}
                    <div className='mb-4 space-y-2'>
                      <div className='flex justify-between text-sm text-zinc-300'>
                        <span>商品總數</span>
                        <span>{totalItems} 個</span>
                      </div>
                      <div className='flex justify-between text-lg font-semibold text-white'>
                        <span>總計</span>
                        <span className='text-blue-400'>NT$ {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 結帳按鈕 */}
                    <button
                      onClick={handleCheckout}
                      className={cn(
                        'flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                        items.length > 0
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                          : 'bg-zinc-700 text-zinc-400 cursor-not-allowed',
                      )}
                      disabled={items.length === 0}
                    >
                      <IconCreditCard className='h-5 w-5' />
                      <span>{items.length > 0 ? '前往結帳' : '購物車是空的'}</span>
                    </button>

                    {/* 安全提示 */}
                    <p className='mt-3 text-center text-xs text-zinc-400'>安全結帳 • SSL加密保護</p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
