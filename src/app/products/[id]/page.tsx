'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { apiGetProduct } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  IconShoppingCart,
  IconPlus,
  IconMinus,
  IconHeart,
  IconHeartFilled,
  IconLoader2,
} from '@tabler/icons-react';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // 產品資料狀態
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 數量狀態管理
  const [quantity, setQuantity] = useState(1);

  // 目前選擇的圖片索引
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 載入產品資料
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGetProduct(resolvedParams.id);
        setProduct(data);
      } catch (err) {
        console.error('載入產品失敗:', err);
        setError('無法載入產品資料');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  // 從 specifications 取得規格資訊
  const specs = product?.specifications || {};
  const switches = specs['軸體'] || specs.switches || '-';
  const layout = specs['配置'] || specs.layout || '-';
  const connection = specs['連接方式'] || specs.connection || '-';

  // 取得產品圖片
  const productImages = product?.images || [];
  const currentImage =
    productImages[selectedImageIndex]?.url || product?.primary_image || '/placeholder.png';

  // 判斷是否有庫存
  const inStock = (product?.stock || 0) > 0;

  const handleBackClick = () => {
    router.push('/products');
  };

  /**
   * 增加數量
   */
  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  /**
   * 減少數量
   */
  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
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
    if (product) {
      addToCart(product, quantity);
    }
  };

  /**
   * 立即購買
   */
  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
  };

  /**
   * 切換願望清單狀態
   */
  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Loading 狀態
  if (loading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <IconLoader2 className='h-12 w-12 text-blue-400 animate-spin mx-auto mb-4' />
          <p className='text-zinc-400'>載入產品資料中...</p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error || !product) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-400 mb-4'>{error || '找不到此產品'}</p>
          <button
            onClick={handleBackClick}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors'
          >
            返回商品列表
          </button>
        </div>
      </div>
    );
  }

  // 檢查商品是否在願望清單中
  const inWishlist = isInWishlist(product.id);

  // 從 specifications 取得更多規格用於顯示
  const displaySpecs = [
    { label: '軸體類型', value: switches },
    { label: '鍵盤配列', value: layout },
    { label: '連接方式', value: connection },
    { label: '庫存狀態', value: inStock ? `有庫存 (${product.stock})` : '缺貨中' },
  ];

  // 額外規格（從 specifications 中過濾）
  const additionalSpecs = Object.entries(specs).filter(
    ([key]) => !['軸體', '配置', '連接方式', 'switches', 'layout', 'connection'].includes(key),
  );

  return (
    <div className='min-h-screen bg-black'>
      <div className='w-full px-4 sm:px-6 lg:px-8 py-24 mx-auto max-w-7xl box-border'>
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

        <div className='grid gap-8 lg:grid-cols-2 w-full'>
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-4 w-full min-w-0'
          >
            {/* 主圖片 */}
            <div className='relative aspect-square overflow-hidden rounded-xl bg-zinc-900 border border-zinc-700'>
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 50vw'
                priority
              />
              {/* Stock Badge */}
              <div className='absolute top-4 right-4'>
                {inStock ? (
                  <span className='rounded-full bg-green-500/80 px-3 py-1 text-sm font-medium text-white border border-green-400'>
                    現貨
                  </span>
                ) : (
                  <span className='rounded-full bg-red-500/80 px-3 py-1 text-sm font-medium text-white border border-red-400'>
                    缺貨
                  </span>
                )}
              </div>
            </div>

            {/* 縮圖列表 */}
            {productImages.length > 1 && (
              <div className='flex gap-2 overflow-x-auto pb-2'>
                {productImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                      selectedImageIndex === index
                        ? 'border-blue-500'
                        : 'border-zinc-700 hover:border-zinc-500',
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} - 圖片 ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes='80px'
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6 w-full min-w-0'
          >
            {/* Category */}
            <div>
              <span className='inline-block rounded-full bg-purple-500/80 px-3 py-1 text-sm font-medium text-white border border-purple-400'>
                {product.category?.name || '未分類'}
              </span>
            </div>

            {/* Product Name */}
            <h1 className='text-2xl sm:text-3xl font-bold text-white break-words'>
              {product.name}
            </h1>

            {/* Price */}
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              <span className='text-2xl sm:text-3xl font-bold text-blue-400'>
                NT$ {product.price.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span className='text-lg sm:text-xl text-zinc-500 line-through'>
                    NT$ {product.original_price.toLocaleString()}
                  </span>
                  <span className='rounded-full bg-red-500/80 px-2 py-1 text-xs font-medium text-white'>
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className='text-lg text-zinc-300 leading-relaxed'>{product.description}</p>

            {/* Specifications */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>產品規格</h3>
              <div className='grid gap-3 sm:grid-cols-2'>
                {displaySpecs.map((spec, index) => (
                  <div
                    key={index}
                    className='rounded-lg bg-zinc-900/90 p-4 border border-zinc-600 backdrop-blur-sm'
                  >
                    <dt className='text-sm font-medium text-zinc-400'>{spec.label}</dt>
                    <dd className='mt-1 text-lg font-semibold text-white'>{spec.value}</dd>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Specifications */}
            {additionalSpecs.length > 0 && (
              <div className='space-y-4'>
                <h3 className='text-xl font-semibold text-white'>詳細規格</h3>
                <div className='grid gap-2'>
                  {additionalSpecs.map(([key, value], index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between gap-4 rounded-lg bg-zinc-900/90 p-3 border border-zinc-600 backdrop-blur-sm'
                    >
                      <span className='text-zinc-400 flex-shrink-0'>{key}</span>
                      <span className='text-zinc-200 text-right break-words min-w-0'>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 數量選擇 */}
            <div className='space-y-3'>
              <h4 className='text-lg font-medium text-white'>選擇數量</h4>
              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center rounded-lg border border-zinc-600 bg-zinc-800'>
                  <button
                    onClick={decreaseQuantity}
                    disabled={!inStock || quantity <= 1}
                    className={cn(
                      'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center transition-colors',
                      inStock && quantity > 1
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
                    disabled={!inStock}
                    className={cn(
                      'w-12 sm:w-16 bg-transparent text-center text-lg font-medium text-white border-none focus:outline-none',
                      !inStock && 'text-zinc-500',
                    )}
                  />

                  <button
                    onClick={increaseQuantity}
                    disabled={!inStock || quantity >= 99}
                    className={cn(
                      'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center transition-colors',
                      inStock && quantity < 99
                        ? 'text-zinc-200 hover:text-white hover:bg-zinc-700'
                        : 'text-zinc-500 cursor-not-allowed',
                    )}
                    aria-label='增加數量'
                  >
                    <IconPlus className='h-4 w-4' />
                  </button>
                </div>

                {/* 總價顯示 */}
                <div className='flex-1 min-w-0'>
                  <div className='text-sm text-zinc-400'>小計</div>
                  <div className='text-xl sm:text-2xl font-bold text-blue-400'>
                    NT$ {(product.price * quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              {/* 立即購買 */}
              <motion.button
                whileHover={{ scale: inStock ? 1.02 : 1 }}
                whileTap={{ scale: inStock ? 0.98 : 1 }}
                onClick={handleBuyNow}
                disabled={!inStock}
                className={cn(
                  'flex w-full items-center justify-center space-x-2 rounded-lg px-6 py-4 text-lg font-semibold transition-all duration-200',
                  inStock
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-blue-500/25'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed border border-zinc-600',
                )}
              >
                <IconShoppingCart className='h-5 w-5' />
                <span>{inStock ? '立即購買' : '暫時缺貨'}</span>
              </motion.button>

              {/* 加入購物車 */}
              <motion.button
                whileHover={{ scale: inStock ? 1.02 : 1 }}
                whileTap={{ scale: inStock ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                  'flex w-full items-center justify-center space-x-2 rounded-lg border px-6 py-4 text-lg font-semibold transition-all duration-200',
                  inStock
                    ? 'border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/50 shadow-lg'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed',
                )}
              >
                <IconShoppingCart className='h-5 w-5' />
                <span>{inStock ? '加入購物車' : '缺貨中'}</span>
              </motion.button>

              {/* 加入願望清單 - 僅登入用戶可見 */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleWishlist}
                  className={cn(
                    'flex w-full items-center justify-center space-x-2 rounded-lg border px-6 py-3 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/50',
                    inWishlist
                      ? 'border-pink-500 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
                      : 'border-zinc-600 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100',
                  )}
                >
                  {inWishlist ? (
                    <IconHeartFilled className='h-5 w-5' />
                  ) : (
                    <IconHeart className='h-5 w-5' />
                  )}
                  <span>{inWishlist ? '已在願望清單' : '加入願望清單'}</span>
                </motion.button>
              )}
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

            {/* Product Content (HTML) */}
            {product.content && (
              <div className='space-y-4 overflow-hidden'>
                <h3 className='text-xl font-semibold text-white'>產品介紹</h3>
                <div
                  className='rounded-lg bg-zinc-900/90 p-4 sm:p-6 border border-zinc-600 overflow-x-auto [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-blue-400 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:first:mt-0 [&_p]:text-zinc-300 [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:break-words [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_li]:text-zinc-300 [&_li]:break-words'
                  dangerouslySetInnerHTML={{ __html: product.content }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
