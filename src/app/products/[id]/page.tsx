'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import productsData from '@/data/products.json';
import { cn } from '@/lib/utils';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const products = productsData as Product[];
  const product = products.find(p => p.id === parseInt(resolvedParams.id));

  if (!product) {
    notFound();
  }

  const handleBackClick = () => {
    router.push('/products');
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
            {/* Main Image */}
            <div className='relative aspect-square overflow-hidden rounded-xl bg-zinc-800 shadow-lg border border-zinc-600'>
              <Image src={product.image} alt={product.name} fill className='object-cover' />
              {/* Stock Status Badge */}
              <div className='absolute top-4 right-4'>
                {product.inStock ? (
                  <span className='rounded-full bg-green-500/80 px-3 py-1 text-sm font-medium text-white border border-green-400'>
                    現貨供應
                  </span>
                ) : (
                  <span className='rounded-full bg-red-500/80 px-3 py-1 text-sm font-medium text-white border border-red-400'>
                    暫時缺貨
                  </span>
                )}
              </div>
            </div>
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

            {/* Action Buttons */}
            <div className='space-y-4'>
              <button
                disabled={!product.inStock}
                className={cn(
                  'w-full rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-200',
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed border border-zinc-600',
                )}
              >
                {product.inStock ? '立即購買' : '暫時缺貨'}
              </button>

              <button className='w-full rounded-lg border border-zinc-600 px-6 py-3 text-lg font-semibold text-zinc-300 transition-all duration-200 hover:bg-zinc-800 shadow-lg'>
                加入願望清單
              </button>
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
