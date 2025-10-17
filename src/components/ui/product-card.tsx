'use client';

import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IconShoppingCart } from '@tabler/icons-react';
import { useCart } from '@/contexts/CartContext';

export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCart();

  /**
   * 處理加入購物車按鈕點擊事件
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發卡片點擊事件
    addToCart(product, 1);
  };

  /**
   * 處理卡片點擊事件
   */
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-zinc-600 bg-zinc-900/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-zinc-500',
        'hover:shadow-blue-500/10',
        'h-[520px] flex flex-col', // Fixed height with flex layout (increased for button)
      )}
    >
      {/* Product Image - Fixed height */}
      <div
        className='relative h-48 overflow-hidden rounded-t-xl bg-zinc-800 flex-shrink-0 cursor-pointer'
        onClick={handleCardClick}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />
        {/* Stock Status Badge */}
        <div className='absolute top-3 right-3'>
          {product.inStock ? (
            <span className='rounded-full bg-green-500/80 px-2 py-1 text-xs font-medium text-white border border-green-400'>
              現貨
            </span>
          ) : (
            <span className='rounded-full bg-red-500/80 px-2 py-1 text-xs font-medium text-white border border-red-400'>
              缺貨
            </span>
          )}
        </div>
        {/* Category Badge */}
        <div className='absolute top-3 left-3'>
          <span className='rounded-full bg-purple-500/80 px-2 py-1 text-xs font-medium text-white border border-purple-400'>
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info - Flex grow to fill remaining space */}
      <div className='flex flex-col flex-grow p-6'>
        {/* Product Name - Fixed height with clamping */}
        <h3
          className='mb-2 text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors h-14 flex items-start cursor-pointer'
          onClick={handleCardClick}
        >
          <span className='line-clamp-2'>{product.name}</span>
        </h3>

        {/* Product Description - Fixed height with clamping */}
        <div className='mb-3 h-10 flex items-start cursor-pointer' onClick={handleCardClick}>
          <p className='text-sm text-zinc-300 line-clamp-2'>{product.description}</p>
        </div>

        {/* Product Features - Fixed height */}
        <div className='mb-3 h-8 flex items-start'>
          <div className='flex flex-wrap gap-1'>
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className='rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-200 border border-zinc-600 whitespace-nowrap'
              >
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className='rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-200 border border-zinc-600'>
                +{product.features.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Switch Type and Layout - Fixed height */}
        <div className='mb-4 h-12 flex items-start'>
          <div className='grid grid-cols-2 gap-2 text-sm w-full'>
            <div className='min-h-0'>
              <span className='text-zinc-400'>軸體：</span>
              <span className='text-zinc-200 block truncate'>{product.switches}</span>
            </div>
            <div className='min-h-0'>
              <span className='text-zinc-400'>配列：</span>
              <span className='text-zinc-200 block truncate'>{product.layout}</span>
            </div>
          </div>
        </div>

        {/* Spacer to push price to bottom */}
        <div className='flex-grow'></div>

        {/* Price and Action Button - Fixed at bottom */}
        <div className='flex items-center justify-between mt-auto'>
          <div className='text-xl font-bold text-blue-400'>
            NT$ {product.price.toLocaleString()}
          </div>
          {product.wireless && (
            <div className='flex items-center text-sm text-zinc-300'>
              <svg
                className='mr-1 h-4 w-4 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0'
                />
              </svg>
              無線
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className='mt-4'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
              product.inStock
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 hover:from-blue-500 hover:to-purple-500'
                : 'bg-zinc-700 text-zinc-400 cursor-not-allowed shadow-none',
            )}
            aria-label={
              product.inStock ? `加入 ${product.name} 到購物車` : `${product.name} 目前缺貨`
            }
          >
            <IconShoppingCart className='h-4 w-4' />
            <span>{product.inStock ? '加入購物車' : '缺貨'}</span>
          </motion.button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none' />
    </div>
  );
};
