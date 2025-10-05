'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import productsData from '@/data/products.json';
import { cn } from '@/lib/utils';
import Product3DViewer from '@/components/ui/product-3d-viewer';
import { useCart } from '@/contexts/CartContext';
import { IconShoppingCart, IconPlus, IconMinus, IconHeart } from '@tabler/icons-react';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { addToCart } = useCart();

  // 數量狀態管理
  const [quantity, setQuantity] = useState(1);

  const products = productsData as Product[];
  const product = products.find(p => p.id === parseInt(resolvedParams.id));

  if (!product) {
    notFound();
  }

  const handleBackClick = () => {
    router.push('/products');
  };

  /**
   * 增加數量
   */
  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99)); // 最大99個
  };

  /**
   * 減少數量
   */
  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)); // 最小1個
  };

  /**
   * 直接設置數量
   */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  /**
   * 加入購物車
   */
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  /**
   * 立即購買
   */
  const handleBuyNow = () => {
    addToCart(product, quantity);
    // 跳轉到結帳頁面
    router.push('/checkout');
  };

  return (
    <div className='min-h-screen bg-black'>
      <div className='container mx-auto px-4 py-24'>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackClick}
          className='mb-8 flex items-center text-blue-400 hover:text-blue-300 transition-colors'
        >
          <svg className='mr-2 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          返回商品列表
        </motion.button>

        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-4'
          >
            {/* 3D 產品查看器 */}
            <Product3DViewer
              imageSrc={product.image}
              imageAlt={product.name}
              inStock={product.inStock}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            {/* Category */}
            <div>
              <span className='inline-block rounded-full bg-purple-500/80 px-3 py-1 text-sm font-medium text-white border border-purple-400'>
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className='text-3xl font-bold text-white'>{product.name}</h1>

            {/* Price */}
            <div className='text-3xl font-bold text-blue-400'>
              NT$ {product.price.toLocaleString()}
            </div>

            {/* Description */}
            <p className='text-lg text-zinc-300 leading-relaxed'>{product.description}</p>

            {/* Specifications */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>產品規格</h3>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='rounded-lg bg-zinc-900/90 p-4 border border-zinc-600 backdrop-blur-sm'>
                  <dt className='text-sm font-medium text-zinc-400'>軸體類型</dt>
                  <dd className='mt-1 text-lg font-semibold text-white'>{product.switches}</dd>
                </div>
                <div className='rounded-lg bg-zinc-900/90 p-4 border border-zinc-600 backdrop-blur-sm'>
                  <dt className='text-sm font-medium text-zinc-400'>鍵盤配列</dt>
                  <dd className='mt-1 text-lg font-semibold text-white'>{product.layout}</dd>
                </div>
                <div className='rounded-lg bg-zinc-900/90 p-4 border border-zinc-600 backdrop-blur-sm'>
                  <dt className='text-sm font-medium text-zinc-400'>連接方式</dt>
                  <dd className='mt-1 text-lg font-semibold text-white'>
                    {product.wireless ? '無線' : '有線'}
                  </dd>
                </div>
                <div className='rounded-lg bg-zinc-900/90 p-4 border border-zinc-600 backdrop-blur-sm'>
                  <dt className='text-sm font-medium text-zinc-400'>庫存狀態</dt>
                  <dd className='mt-1 text-lg font-semibold text-white'>
                    {product.inStock ? '有庫存' : '缺貨中'}
                  </dd>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>產品特色</h3>
              <div className='grid gap-2'>
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-center rounded-lg bg-zinc-900/90 p-3 border border-zinc-600 backdrop-blur-sm'
                  >
                    <svg
                      className='mr-3 h-5 w-5 text-green-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span className='text-zinc-200'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 數量選擇 */}
            <div className='space-y-3'>
              <h4 className='text-lg font-medium text-white'>選擇數量</h4>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center rounded-lg border border-zinc-600 bg-zinc-800'>
                  <button
                    onClick={decreaseQuantity}
                    disabled={!product.inStock || quantity <= 1}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center transition-colors',
                      product.inStock && quantity > 1
                        ? 'text-zinc-200 hover:text-white hover:bg-zinc-700'
                        : 'text-zinc-500 cursor-not-allowed',
                    )}
                    aria-label='減少數量'
                  >
                    <IconMinus className='h-4 w-4' />
                  </button>

                  <input
                    type='number'
                    value={quantity}
                    onChange={handleQuantityChange}
                    min='1'
                    max='99'
                    disabled={!product.inStock}
                    className={cn(
                      'w-16 bg-transparent text-center text-lg font-medium text-white border-none focus:outline-none',
                      !product.inStock && 'text-zinc-500',
                    )}
                  />

                  <button
                    onClick={increaseQuantity}
                    disabled={!product.inStock || quantity >= 99}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center transition-colors',
                      product.inStock && quantity < 99
                        ? 'text-zinc-200 hover:text-white hover:bg-zinc-700'
                        : 'text-zinc-500 cursor-not-allowed',
                    )}
                    aria-label='增加數量'
                  >
                    <IconPlus className='h-4 w-4' />
                  </button>
                </div>

                {/* 總價顯示 */}
                <div className='flex-1'>
                  <div className='text-sm text-zinc-400'>小計</div>
                  <div className='text-2xl font-bold text-blue-400'>
                    NT$ {(product.price * quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              {/* 立即購買 */}
              <motion.button
                whileHover={{ scale: product.inStock ? 1.02 : 1 }}
                whileTap={{ scale: product.inStock ? 0.98 : 1 }}
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className={cn(
                  'flex w-full items-center justify-center space-x-2 rounded-lg px-6 py-4 text-lg font-semibold transition-all duration-200',
                  product.inStock
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-blue-500/25'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed border border-zinc-600',
                )}
              >
                <IconShoppingCart className='h-5 w-5' />
                <span>{product.inStock ? '立即購買' : '暫時缺貨'}</span>
              </motion.button>

              {/* 加入購物車 */}
              <motion.button
                whileHover={{ scale: product.inStock ? 1.02 : 1 }}
                whileTap={{ scale: product.inStock ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  'flex w-full items-center justify-center space-x-2 rounded-lg border px-6 py-4 text-lg font-semibold transition-all duration-200',
                  product.inStock
                    ? 'border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50 shadow-lg'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed',
                )}
              >
                <IconShoppingCart className='h-5 w-5' />
                <span>{product.inStock ? '加入購物車' : '缺貨中'}</span>
              </motion.button>

              {/* 加入願望清單 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex w-full items-center justify-center space-x-2 rounded-lg border border-zinc-600 bg-transparent px-6 py-3 text-base font-medium text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500/50'
              >
                <IconHeart className='h-5 w-5' />
                <span>加入願望清單</span>
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className='rounded-lg bg-blue-900/20 p-4 border border-blue-600'>
              <div className='flex items-start space-x-3'>
                <svg
                  className='mt-1 h-5 w-5 text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <div>
                  <h4 className='font-medium text-blue-300'>購買資訊</h4>
                  <p className='mt-1 text-sm text-blue-200'>
                    • 全台免運費（訂單滿 NT$2,000）
                    <br />
                    • 7 天鑑賞期無條件退換貨
                    <br />• 原廠一年保固服務
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
