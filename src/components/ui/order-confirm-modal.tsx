'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconAlertCircle } from '@tabler/icons-react';

interface OrderConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderSummary: {
    itemCount: number;
    totalPrice: number;
    shippingFee: number;
    finalTotal: number;
    recipientName: string;
    shippingMethod: string;
  };
  isSubmitting?: boolean;
}

export function OrderConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  orderSummary,
  isSubmitting = false,
}: OrderConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm'
            onClick={onClose}
          />

          {/* 對話框 */}
          <div className='fixed inset-0 z-[101] flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className='w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden'
              onClick={e => e.stopPropagation()}
            >
              {/* 標題列 */}
              <div className='flex items-center justify-between p-6 border-b border-zinc-700'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20'>
                    <IconAlertCircle className='w-6 h-6 text-yellow-500' />
                  </div>
                  <h2 className='text-xl font-semibold text-white'>確認訂單</h2>
                </div>
                <button
                  onClick={onClose}
                  className='flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'
                  aria-label='關閉'
                >
                  <IconX className='w-5 h-5' />
                </button>
              </div>

              {/* 內容區 */}
              <div className='p-6 space-y-4'>
                <p className='text-zinc-300'>請確認以下訂單資訊無誤後送出訂單</p>

                {/* 訂單摘要 */}
                <div className='bg-zinc-800/50 rounded-lg p-4 space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-zinc-400'>收件人</span>
                    <span className='text-white font-medium'>{orderSummary.recipientName}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-zinc-400'>運送方式</span>
                    <span className='text-white'>{orderSummary.shippingMethod}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-zinc-400'>商品數量</span>
                    <span className='text-white'>{orderSummary.itemCount} 件</span>
                  </div>

                  <div className='border-t border-zinc-700 pt-3 space-y-2'>
                    <div className='flex justify-between text-sm text-zinc-400'>
                      <span>商品小計</span>
                      <span>NT$ {orderSummary.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between text-sm text-zinc-400'>
                      <span>運費</span>
                      <span className={orderSummary.shippingFee === 0 ? 'text-green-500' : ''}>
                        {orderSummary.shippingFee === 0
                          ? '免費'
                          : `NT$ ${orderSummary.shippingFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className='flex justify-between text-lg font-bold pt-2 border-t border-zinc-700'>
                      <span className='text-white'>訂單總計</span>
                      <span className='text-blue-400'>
                        NT$ {orderSummary.finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 提示訊息 */}
                <div className='flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg'>
                  <IconAlertCircle className='w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5' />
                  <p className='text-sm text-blue-300'>送出訂單後，我們會將確認信寄送至您的信箱</p>
                </div>
              </div>

              {/* 按鈕區 */}
              <div className='flex gap-3 p-6 border-t border-zinc-700 bg-zinc-800/30'>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className='flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  取消
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className='flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? '處理中...' : '確認送出'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
