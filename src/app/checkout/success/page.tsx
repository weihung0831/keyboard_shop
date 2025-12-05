'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconCheck, IconPackage, IconTruck, IconHome } from '@tabler/icons-react';
import type { CartItem } from '@/types/cart';

/**
 * 訂單資料介面
 */
interface OrderData {
  orderNumber: string;
  shippingInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
  };
  items: CartItem[];
  totalPrice: number;
  shippingFee: number;
  finalTotal: number;
  orderDate: string;
}

const STORAGE_KEY = 'last-order-data';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // 延遲一點讀取，確保 localStorage 寫入完成
    const timer = setTimeout(() => {
      try {
        const savedOrder = localStorage.getItem(STORAGE_KEY);

        if (savedOrder) {
          const data: OrderData = JSON.parse(savedOrder);
          setOrderData(data);
          // 讀取後清除，避免重新整理時重複顯示
          localStorage.removeItem(STORAGE_KEY);
        } else {
          // 如果沒有訂單資料，導向首頁
          router.push('/');
        }
      } catch (error) {
        console.error('讀取訂單資料失敗:', error);
        router.push('/');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  if (!orderData) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-xl'>載入中...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black'>
      <div className='container mx-auto px-4 py-24'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-4xl mx-auto'
        >
          {/* 成功訊息 */}
          <div className='text-center mb-8'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-6'
            >
              <IconCheck className='w-10 h-10 text-green-500' />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='text-3xl font-bold text-white mb-2'
            >
              訂單已成功送出！
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='text-zinc-400'
            >
              感謝您的購買，我們已收到您的訂單
            </motion.p>
          </div>

          {/* 訂單編號 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 mb-6 shadow-lg'
          >
            <div className='text-center'>
              <p className='text-sm text-zinc-400 mb-2'>訂單編號</p>
              <p className='text-2xl font-bold text-blue-400 tracking-wider'>
                {orderData.orderNumber}
              </p>
              <p className='text-xs text-zinc-500 mt-2'>訂單日期：{orderData.orderDate}</p>
            </div>
          </motion.div>

          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            {/* 收件資訊 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 shadow-lg'
            >
              <div className='flex items-center gap-2 mb-4'>
                <IconPackage className='w-5 h-5 text-blue-400' />
                <h2 className='text-lg font-semibold text-white'>收件資訊</h2>
              </div>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-zinc-400'>收件人</span>
                  <span className='text-white'>{orderData.shippingInfo.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-400'>電話</span>
                  <span className='text-white'>{orderData.shippingInfo.phone}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-400'>Email</span>
                  <span className='text-white text-xs'>{orderData.shippingInfo.email}</span>
                </div>
                <div className='pt-2 border-t border-zinc-700'>
                  <p className='text-zinc-400 mb-1'>收件地址</p>
                  <p className='text-white'>
                    {orderData.shippingInfo.postalCode} {orderData.shippingInfo.city}
                    <br />
                    {orderData.shippingInfo.address}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 運送資訊 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 shadow-lg'
            >
              <div className='flex items-center gap-2 mb-4'>
                <IconTruck className='w-5 h-5 text-blue-400' />
                <h2 className='text-lg font-semibold text-white'>運送方式</h2>
              </div>
              <div className='space-y-3'>
                <div>
                  <p className='text-white font-medium'>{orderData.shippingMethod.name}</p>
                  <p className='text-sm text-zinc-400'>{orderData.shippingMethod.estimatedDays}</p>
                </div>
                <div className='pt-3 border-t border-zinc-700'>
                  <p className='text-sm text-zinc-400 mb-1'>預計送達</p>
                  <p className='text-white font-medium'>{orderData.shippingMethod.estimatedDays}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 訂單商品 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 mb-6 shadow-lg'
          >
            <h2 className='text-lg font-semibold text-white mb-4'>訂單商品</h2>
            <div className='space-y-4'>
              {orderData.items.map(item => (
                <div
                  key={item.product.id}
                  className='flex gap-4 pb-4 border-b border-zinc-700 last:border-0 last:pb-0'
                >
                  <div className='relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.primary_image || '/placeholder.png'}
                      alt={item.product.name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-white font-medium'>{item.product.name}</h3>
                    <p className='text-sm text-zinc-400'>數量：{item.quantity}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-white font-medium'>
                      NT$ {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <p className='text-xs text-zinc-400'>
                      NT$ {item.product.price.toLocaleString()} / 個
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 費用明細 */}
            <div className='mt-6 pt-6 border-t border-zinc-700 space-y-2'>
              <div className='flex justify-between text-sm text-zinc-300'>
                <span>商品小計</span>
                <span>NT$ {orderData.totalPrice.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-sm text-zinc-300'>
                <span>運費</span>
                <span className={orderData.shippingFee === 0 ? 'text-green-500' : ''}>
                  {orderData.shippingFee === 0
                    ? '免費'
                    : `NT$ ${orderData.shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className='flex justify-between text-lg font-bold text-white pt-2 border-t border-zinc-700'>
                <span>訂單總計</span>
                <span className='text-blue-400'>NT$ {orderData.finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* 後續步驟提示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className='bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6'
          >
            <h3 className='text-white font-semibold mb-3'>接下來會發生什麼？</h3>
            <ul className='space-y-2 text-sm text-zinc-300'>
              <li className='flex items-start gap-2'>
                <span className='text-blue-400 mt-0.5'>•</span>
                <span>我們會發送訂單確認信至您的電子郵件</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-400 mt-0.5'>•</span>
                <span>商品將在 1-2 個工作天內出貨</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-400 mt-0.5'>•</span>
                <span>出貨後會提供物流追蹤資訊</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-blue-400 mt-0.5'>•</span>
                <span>如有任何問題，請隨時聯繫客服</span>
              </li>
            </ul>
          </motion.div>

          {/* 操作按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className='flex gap-4'
          >
            <button
              onClick={() => router.push('/')}
              className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-600'
            >
              <IconHome className='w-5 h-5' />
              <span>返回首頁</span>
            </button>
            <button
              onClick={() => router.push('/products')}
              className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25'
            >
              繼續購物
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
