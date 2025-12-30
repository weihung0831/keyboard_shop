'use client';

/**
 * 訂單詳情頁面
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useOrders } from '@/hooks/useOrders';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { OrderTimelineEvent } from '@/types/order';

/**
 * 訂單時間軸元件
 */
function OrderTimeline({ timeline }: { timeline: OrderTimelineEvent[] }) {
  const getIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    const iconClass = isCompleted
      ? 'text-green-400'
      : isCurrent
        ? 'text-blue-400'
        : 'text-zinc-500';

    switch (status) {
      case 'pending':
        return <Clock className={iconClass} size={20} />;
      case 'processing':
        return <Package className={iconClass} size={20} />;
      case 'shipped':
        return <Truck className={iconClass} size={20} />;
      case 'completed':
        return <CheckCircle className={iconClass} size={20} />;
      case 'cancelled':
        return <XCircle className={iconClass} size={20} />;
      default:
        return <Clock className={iconClass} size={20} />;
    }
  };

  return (
    <div className='space-y-4'>
      {timeline.map((event, index) => (
        <div key={event.status} className='flex items-start gap-4'>
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              event.is_completed
                ? 'bg-green-400/10'
                : event.is_current
                  ? 'bg-blue-400/10'
                  : 'bg-zinc-700/50'
            }`}
          >
            {getIcon(event.status, event.is_completed, event.is_current)}
          </div>
          <div className='flex-1'>
            <div
              className={`font-medium ${
                event.is_completed || event.is_current ? 'text-white' : 'text-zinc-500'
              }`}
            >
              {event.label}
            </div>
            {event.time && <div className='text-sm text-zinc-400'>{event.time}</div>}
          </div>
          {index < timeline.length - 1 && (
            <div className='absolute left-5 top-10 w-0.5 h-8 bg-zinc-700' />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const { currentUser } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const { currentOrder, isLoading, error, fetchOrder, cancelOrder, clearCurrentOrder } =
    useOrders();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const orderId = Number(params.id);

  useEffect(() => {
    if (currentUser && orderId) {
      fetchOrder(orderId);
    }
    return () => clearCurrentOrder();
  }, [currentUser, orderId, fetchOrder, clearCurrentOrder]);

  // 開啟取消訂單 Modal
  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  // 確認取消訂單
  const confirmCancelOrder = async () => {
    if (!currentOrder) return;

    setIsCancelling(true);
    const success = await cancelOrder(currentOrder.id);
    setIsCancelling(false);
    setShowCancelModal(false);

    if (success) {
      fetchOrder(orderId);
    }
  };

  if (authLoading) {
    return null;
  }

  // 格式化日期時間
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 狀態顏色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400 bg-yellow-400/10',
      processing: 'text-blue-400 bg-blue-400/10',
      shipped: 'text-indigo-400 bg-indigo-400/10',
      completed: 'text-green-400 bg-green-400/10',
      cancelled: 'text-red-400 bg-red-400/10',
    };
    return colors[status] || 'text-zinc-400 bg-zinc-400/10';
  };

  // 配送方式名稱
  const getShippingMethodName = (method: string) => {
    const methods: Record<string, string> = {
      standard: '標準宅配',
      express: '快速宅配',
      store_pickup: '門市取貨',
    };
    return methods[method] || method;
  };

  return (
    <div className='min-h-screen bg-black pt-24'>
      <div className='container mx-auto px-4 py-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 返回按鈕 */}
          <Link
            href='/member/orders'
            className='inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6'
          >
            <ArrowLeft size={20} />
            返回訂單列表
          </Link>

          {isLoading ? (
            // Loading 狀態
            <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-12'>
              <div className='text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4'></div>
                <p className='text-zinc-400'>載入中...</p>
              </div>
            </div>
          ) : error ? (
            // 錯誤狀態
            <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-12'>
              <div className='text-center'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4'>
                  <AlertCircle className='text-red-400' size={32} />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>載入失敗</h3>
                <p className='text-zinc-400 mb-6'>{error}</p>
                <button
                  onClick={() => fetchOrder(orderId)}
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  重試
                </button>
              </div>
            </div>
          ) : !currentOrder ? (
            // 訂單不存在
            <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-12'>
              <div className='text-center'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4'>
                  <Package className='text-zinc-500' size={32} />
                </div>
                <h3 className='text-lg font-medium text-white mb-2'>找不到訂單</h3>
                <p className='text-zinc-400 mb-6'>此訂單不存在或您無權查看</p>
                <Link
                  href='/member/orders'
                  className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  返回訂單列表
                </Link>
              </div>
            </div>
          ) : (
            // 訂單詳情
            <div className='grid lg:grid-cols-3 gap-6'>
              {/* 左側：訂單資訊 */}
              <div className='lg:col-span-2 space-y-6'>
                {/* 訂單標題 */}
                <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h1 className='text-2xl font-bold text-white mb-2'>
                        訂單 #{currentOrder.order_number}
                      </h1>
                      <p className='text-zinc-400'>{formatDateTime(currentOrder.created_at)}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}
                    >
                      {currentOrder.status_label}
                    </span>
                  </div>

                  {/* 取消訂單按鈕 */}
                  {currentOrder.status === 'pending' && (
                    <button
                      onClick={handleCancelOrder}
                      className='px-4 py-2 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors'
                    >
                      取消訂單
                    </button>
                  )}
                </div>

                {/* 訂單商品 */}
                <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6'>
                  <h2 className='text-lg font-semibold text-white mb-4'>訂單商品</h2>
                  <div className='space-y-4'>
                    {currentOrder.items.map(item => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg'
                      >
                        <div className='flex-1'>
                          <div className='text-white font-medium'>{item.product_name}</div>
                          <div className='text-sm text-zinc-400'>SKU: {item.product_sku}</div>
                        </div>
                        <div className='text-right'>
                          <div className='text-zinc-300'>
                            NT$ {item.price.toLocaleString()} × {item.quantity}
                          </div>
                          <div className='text-blue-400 font-semibold'>
                            NT$ {item.subtotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 金額明細 */}
                  <div className='mt-6 pt-6 border-t border-zinc-700 space-y-2'>
                    <div className='flex justify-between text-zinc-300'>
                      <span>商品小計</span>
                      <span>NT$ {currentOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between text-zinc-300'>
                      <span>運費（{getShippingMethodName(currentOrder.shipping_method)}）</span>
                      <span>
                        {currentOrder.shipping_fee === 0
                          ? '免費'
                          : `NT$ ${currentOrder.shipping_fee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className='flex justify-between text-lg font-bold text-white pt-2 border-t border-zinc-600'>
                      <span>訂單總計</span>
                      <span className='text-blue-400'>
                        NT$ {currentOrder.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 收件資訊 */}
                <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6'>
                  <h2 className='text-lg font-semibold text-white mb-4'>收件資訊</h2>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 text-zinc-300'>
                      <MapPin size={18} className='text-zinc-500' />
                      <span>
                        {currentOrder.shipping_postal_code} {currentOrder.shipping_city}{' '}
                        {currentOrder.shipping_address}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-zinc-300'>
                      <Phone size={18} className='text-zinc-500' />
                      <span>
                        {currentOrder.shipping_name} / {currentOrder.shipping_phone}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-zinc-300'>
                      <Mail size={18} className='text-zinc-500' />
                      <span>{currentOrder.shipping_email}</span>
                    </div>
                    {currentOrder.notes && (
                      <div className='mt-4 p-4 bg-zinc-800/50 rounded-lg'>
                        <div className='text-sm text-zinc-400 mb-1'>備註</div>
                        <div className='text-zinc-300'>{currentOrder.notes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 右側：訂單時間軸 */}
              <div className='lg:col-span-1'>
                <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 sticky top-24'>
                  <h2 className='text-lg font-semibold text-white mb-4'>訂單進度</h2>
                  {currentOrder.timeline && currentOrder.timeline.length > 0 ? (
                    <OrderTimeline timeline={currentOrder.timeline} />
                  ) : (
                    <div className='text-zinc-400 text-center py-4'>暫無進度資訊</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 取消訂單確認 Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'
            onClick={() => !isCancelling && setShowCancelModal(false)}
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
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className='absolute top-4 right-4 p-1 text-zinc-400 hover:text-white transition-colors disabled:opacity-50'
              >
                <X size={20} />
              </button>

              {/* Modal 內容 */}
              <div className='p-6'>
                {/* 圖示 */}
                <div className='flex justify-center mb-4'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10'>
                    <AlertTriangle className='h-8 w-8 text-red-500' />
                  </div>
                </div>

                {/* 標題和說明 */}
                <div className='text-center mb-6'>
                  <h3 className='text-xl font-semibold text-white mb-2'>取消訂單</h3>
                  <p className='text-zinc-400'>
                    確定要取消訂單{' '}
                    <span className='text-white font-medium'>#{currentOrder?.order_number}</span>{' '}
                    嗎？
                  </p>
                  <p className='text-zinc-500 text-sm mt-2'>此操作無法復原</p>
                </div>

                {/* 按鈕 */}
                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={isCancelling}
                    className='flex-1 px-4 py-3 rounded-lg border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50'
                  >
                    返回
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    disabled={isCancelling}
                    className='flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                  >
                    {isCancelling ? (
                      <>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent' />
                        處理中...
                      </>
                    ) : (
                      '確定取消'
                    )}
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
