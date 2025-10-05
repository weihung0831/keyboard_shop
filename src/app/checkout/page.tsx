'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { OrderConfirmModal } from '@/components/ui/order-confirm-modal';

/**
 * 收件資訊表單資料介面
 */
interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

/**
 * 運送方式選項
 */
const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: '標準宅配',
    description: '3-5 個工作天送達',
    price: 0,
  },
  {
    id: 'express',
    name: '快速宅配',
    description: '1-2 個工作天送達',
    price: 150,
  },
  {
    id: 'convenience',
    name: '超商取貨',
    description: '3-5 個工作天送達，可至超商取貨',
    price: 60,
  },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  // 表單狀態
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [selectedShipping, setSelectedShipping] = useState<string>(SHIPPING_METHODS[0].id);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 如果購物車是空的，重新導向到商品頁面
  if (items.length === 0) {
    return (
      <div className='min-h-screen bg-black'>
        <div className='container mx-auto px-4 py-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-2xl mx-auto text-center'
          >
            <div className='mb-8 h-32 w-32 mx-auto rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-600'>
              <svg
                className='h-16 w-16 text-zinc-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
            </div>
            <h1 className='text-3xl font-bold text-white mb-4'>購物車是空的</h1>
            <p className='text-zinc-300 mb-8'>請先將商品加入購物車後再進行結帳</p>
            <button
              onClick={() => router.push('/products')}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25'
            >
              前往選購商品
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // 計算運費
  const shippingMethod = SHIPPING_METHODS.find(method => method.id === selectedShipping);
  const shippingFee: number = shippingMethod?.price || 0;
  const finalTotal: number = totalPrice + shippingFee;

  // 表單欄位更新
  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    // 清除該欄位的錯誤訊息
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};

    if (!shippingInfo.name.trim()) {
      newErrors.name = '請輸入收件人姓名';
    }

    if (!shippingInfo.phone.trim()) {
      newErrors.phone = '請輸入聯絡電話';
    } else if (!/^09\d{8}$/.test(shippingInfo.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = '請輸入有效的手機號碼（格式：09xxxxxxxx）';
    }

    if (!shippingInfo.email.trim()) {
      newErrors.email = '請輸入電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = '請輸入有效的電子郵件格式';
    }

    if (!shippingInfo.city.trim()) {
      newErrors.city = '請輸入城市';
    }

    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = '請輸入郵遞區號';
    } else if (!/^\d{3,5}$/.test(shippingInfo.postalCode)) {
      newErrors.postalCode = '請輸入有效的郵遞區號';
    }

    if (!shippingInfo.address.trim()) {
      newErrors.address = '請輸入詳細地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 生成訂單編號
  const generateOrderNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD${timestamp}${random}`;
  };

  // 點擊確認訂單按鈕
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 打開確認對話框
    setShowConfirmModal(true);
  };

  // 實際提交訂單
  const handleConfirmOrder = async () => {
    setIsSubmitting(true);

    // 模擬 API 呼叫
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 生成訂單編號
      const orderNumber = generateOrderNumber();

      // 準備訂單資料
      const orderData = {
        orderNumber,
        shippingInfo,
        shippingMethod: {
          id: selectedShipping,
          name: shippingMethod?.name || '',
          price: shippingFee,
          estimatedDays: shippingMethod?.description || '',
        },
        items,
        totalPrice,
        shippingFee,
        finalTotal,
        orderDate: new Date().toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // 將訂單資料存入 localStorage（確保寫入完成）
      try {
        localStorage.setItem('last-order-data', JSON.stringify(orderData));
      } catch (e) {
        console.error('無法存入 localStorage:', e);
      }

      // 關閉確認對話框
      setShowConfirmModal(false);

      // 先導向到訂單完成頁面
      router.push('/checkout/success');

      // 延遲清空購物車，確保頁面導航完成
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (error) {
      console.error('訂單提交失敗:', error);
      alert('訂單提交失敗，請稍後再試');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-black'>
      <div className='container mx-auto px-4 py-24'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-6xl mx-auto'
        >
          <h1 className='text-3xl font-bold text-white mb-8'>結帳</h1>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* 左側：表單區域 */}
            <div className='lg:col-span-2'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* 收件資訊 */}
                <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 shadow-lg'>
                  <h2 className='text-xl font-semibold text-white mb-4'>收件資訊</h2>

                  <div className='space-y-4'>
                    {/* 姓名 */}
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-zinc-300 mb-2'
                      >
                        收件人姓名 <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        id='name'
                        value={shippingInfo.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        className={cn(
                          'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
                          'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
                          errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                            : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
                        )}
                        placeholder='請輸入收件人姓名'
                      />
                      {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
                    </div>

                    {/* 電話和電子郵件 */}
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='phone'
                          className='block text-sm font-medium text-zinc-300 mb-2'
                        >
                          聯絡電話 <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='tel'
                          id='phone'
                          value={shippingInfo.phone}
                          onChange={e => handleInputChange('phone', e.target.value)}
                          className={cn(
                            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
                            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
                            errors.phone
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                              : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
                          )}
                          placeholder='0912345678'
                        />
                        {errors.phone && (
                          <p className='mt-1 text-sm text-red-500'>{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor='email'
                          className='block text-sm font-medium text-zinc-300 mb-2'
                        >
                          電子郵件 <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='email'
                          id='email'
                          value={shippingInfo.email}
                          onChange={e => handleInputChange('email', e.target.value)}
                          className={cn(
                            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
                            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                              : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
                          )}
                          placeholder='example@email.com'
                        />
                        {errors.email && (
                          <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* 城市和郵遞區號 */}
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='city'
                          className='block text-sm font-medium text-zinc-300 mb-2'
                        >
                          城市 <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          id='city'
                          value={shippingInfo.city}
                          onChange={e => handleInputChange('city', e.target.value)}
                          className={cn(
                            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
                            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
                            errors.city
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                              : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
                          )}
                          placeholder='台北市'
                        />
                        {errors.city && <p className='mt-1 text-sm text-red-500'>{errors.city}</p>}
                      </div>

                      <div>
                        <label
                          htmlFor='postalCode'
                          className='block text-sm font-medium text-zinc-300 mb-2'
                        >
                          郵遞區號 <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          id='postalCode'
                          value={shippingInfo.postalCode}
                          onChange={e => handleInputChange('postalCode', e.target.value)}
                          className={cn(
                            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
                            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
                            errors.postalCode
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                              : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
                          )}
                          placeholder='100'
                        />
                        {errors.postalCode && (
                          <p className='mt-1 text-sm text-red-500'>{errors.postalCode}</p>
                        )}
                      </div>
                    </div>

                    {/* 詳細地址 */}
                    <div>
                      <label
                        htmlFor='address'
                        className='block text-sm font-medium text-zinc-300 mb-2'
                      >
                        詳細地址 <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        id='address'
                        value={shippingInfo.address}
                        onChange={e => handleInputChange('address', e.target.value)}
                        className={cn(
                          'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
                          'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
                          errors.address
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                            : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
                        )}
                        placeholder='請輸入詳細地址（街道、巷弄、門牌號碼）'
                      />
                      {errors.address && (
                        <p className='mt-1 text-sm text-red-500'>{errors.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 運送方式 */}
                <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 shadow-lg'>
                  <h2 className='text-xl font-semibold text-white mb-4'>運送方式</h2>

                  <div className='space-y-3'>
                    {SHIPPING_METHODS.map(method => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all',
                          selectedShipping === method.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600',
                        )}
                      >
                        <input
                          type='radio'
                          name='shipping'
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={e => setSelectedShipping(e.target.value)}
                          className='mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-2'
                        />
                        <div className='ml-3 flex-1'>
                          <div className='flex items-center justify-between'>
                            <span className='text-white font-medium'>{method.name}</span>
                            <span className='text-blue-400 font-semibold'>
                              {method.price === 0 ? '免費' : `NT$ ${method.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className='text-sm text-zinc-400 mt-1'>{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 提交按鈕 */}
                <div className='flex gap-4'>
                  <button
                    type='button'
                    onClick={() => router.back()}
                    className='flex-1 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-600'
                  >
                    返回
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={cn(
                      'flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/25',
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700',
                    )}
                  >
                    {isSubmitting ? '處理中...' : '確認訂單'}
                  </button>
                </div>
              </form>
            </div>

            {/* 右側：訂單摘要 */}
            <div className='lg:col-span-1'>
              <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 shadow-lg sticky top-24'>
                <h2 className='text-xl font-semibold text-white mb-4'>訂單摘要</h2>

                {/* 商品列表 */}
                <div className='space-y-4 mb-4 max-h-64 overflow-y-auto'>
                  {items.map(item => (
                    <div key={item.product.id} className='flex gap-3'>
                      <div className='relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className='h-full w-full object-cover'
                        />
                        <div className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold'>
                          {item.quantity}
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-medium text-white truncate'>
                          {item.product.name}
                        </h3>
                        <p className='text-sm text-zinc-400'>
                          NT$ {item.product.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className='text-sm font-semibold text-white'>
                        NT$ {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 費用明細 */}
                <div className='border-t border-zinc-700 pt-4 space-y-2'>
                  <div className='flex justify-between text-sm text-zinc-300'>
                    <span>小計</span>
                    <span>NT$ {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between text-sm text-zinc-300'>
                    <span>運費</span>
                    <span className={shippingFee === 0 ? 'text-green-500' : ''}>
                      {shippingFee === 0 ? '免費' : `NT$ ${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className='border-t border-zinc-700 pt-2 mt-2'>
                    <div className='flex justify-between text-lg font-bold text-white'>
                      <span>總計</span>
                      <span className='text-blue-400'>NT$ {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 訂單確認對話框 */}
        <OrderConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmOrder}
          orderSummary={{
            itemCount: totalItems,
            totalPrice,
            shippingFee,
            finalTotal,
            recipientName: shippingInfo.name,
            shippingMethod: shippingMethod?.name || '',
          }}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
