'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetOrder, adminUpdateOrderStatus } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { AdminOrder } from '@/types/admin';
import type { OrderStatus } from '@/types/order';
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from '@/types/order';

const NEXT_STATUSES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['completed', 'cancelled'],
};

const CARD = 'bg-zinc-900 border border-zinc-800 rounded-xl p-6';

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminGetOrder(Number(id));
        setOrder(data);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    setPendingStatus(newStatus);
  };

  const confirmStatusChange = async () => {
    if (!order || !pendingStatus) return;
    setUpdating(true);
    setPendingStatus(null);
    try {
      const updated = await adminUpdateOrderStatus(order.id, pendingStatus);
      setOrder(updated);
    } catch {
      // silent
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return <div className='py-20 text-center text-zinc-500 text-sm'>載入中...</div>;
  }

  if (!order) {
    return <div className='py-20 text-center text-zinc-500 text-sm'>找不到訂單</div>;
  }

  const nextStatuses = NEXT_STATUSES[order.status] ?? [];

  return (
    <div>
      {/* Header */}
      <div className='mb-6 flex items-center gap-4'>
        <button
          onClick={() => router.back()}
          className='p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
        >
          <ArrowLeft className='h-4 w-4' />
        </button>
        <div className='flex items-center gap-3'>
          <h1 className='text-xl font-bold text-white font-mono'>{order.order_number}</h1>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs border',
              ORDER_STATUS_BADGE_CLASSES[order.status],
            )}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left column */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Items */}
          <div className={CARD}>
            <h2 className='text-sm font-semibold text-white mb-4 flex items-center gap-2'>
              <Package className='h-4 w-4 text-blue-400' /> 訂購商品
            </h2>
            <div className='space-y-3'>
              {(order.items ?? []).map(item => (
                <div
                  key={item.id}
                  className='flex items-center justify-between py-2 border-b border-zinc-800 last:border-0'
                >
                  <div>
                    <p className='text-white text-sm'>{item.product_name}</p>
                    <p className='text-zinc-500 text-xs'>SKU: {item.product_sku}</p>
                  </div>
                  <div className='text-right text-sm'>
                    <p className='text-zinc-300'>x {item.quantity}</p>
                    <p className='text-zinc-400 text-xs'>NT$ {item.price.toLocaleString()} / 件</p>
                    <p className='text-white font-medium'>NT$ {item.subtotal.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 pt-3 border-t border-zinc-800 space-y-1 text-sm'>
              <div className='flex justify-between text-zinc-400'>
                <span>商品小計</span>
                <span>NT$ {order.subtotal.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-zinc-400'>
                <span>運費</span>
                <span>NT$ {order.shipping_fee.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-white font-semibold pt-2 border-t border-zinc-800'>
                <span>總計</span>
                <span>NT$ {order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className={CARD}>
              <h2 className='text-sm font-semibold text-white mb-4'>訂單時間軸</h2>
              <div className='space-y-3'>
                {order.timeline.map((event, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <div
                      className={cn(
                        'mt-0.5 h-2.5 w-2.5 rounded-full border-2 flex-shrink-0',
                        event.is_current
                          ? 'border-blue-500 bg-blue-500'
                          : event.is_completed
                            ? 'border-green-500 bg-green-500'
                            : 'border-zinc-600 bg-transparent',
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          'text-sm',
                          event.is_current
                            ? 'text-white font-medium'
                            : event.is_completed
                              ? 'text-zinc-300'
                              : 'text-zinc-500',
                        )}
                      >
                        {event.label}
                      </p>
                      {event.time && (
                        <p className='text-xs text-zinc-500'>
                          {new Date(event.time).toLocaleString('zh-TW')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          {/* Status Actions */}
          {nextStatuses.length > 0 && (
            <div className={CARD}>
              <h2 className='text-sm font-semibold text-white mb-3'>更新狀態</h2>
              <div className='space-y-2'>
                {nextStatuses.map(s => (
                  <button
                    key={s}
                    disabled={updating}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50',
                      s === 'cancelled'
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white',
                    )}
                  >
                    {ORDER_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Info */}
          <div className={CARD}>
            <h2 className='text-sm font-semibold text-white mb-3'>會員資訊</h2>
            <div className='space-y-2 text-sm'>
              <div>
                <span className='text-zinc-500'>姓名：</span>
                <span className='text-zinc-300'>{order.user?.name ?? '訪客'}</span>
              </div>
              <div>
                <span className='text-zinc-500'>Email：</span>
                <span className='text-zinc-300'>{order.user?.email ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className={CARD}>
            <h2 className='text-sm font-semibold text-white mb-3'>收件資訊</h2>
            <div className='space-y-2 text-sm'>
              <div>
                <span className='text-zinc-500'>收件人：</span>
                <span className='text-zinc-300'>{order.shipping_name}</span>
              </div>
              <div>
                <span className='text-zinc-500'>電話：</span>
                <span className='text-zinc-300'>{order.shipping_phone}</span>
              </div>
              <div>
                <span className='text-zinc-500'>Email：</span>
                <span className='text-zinc-300'>{order.shipping_email}</span>
              </div>
              <div>
                <span className='text-zinc-500'>地址：</span>
                <span className='text-zinc-300'>
                  {order.shipping_city} {order.shipping_address}
                </span>
              </div>
              <div>
                <span className='text-zinc-500'>配送：</span>
                <span className='text-zinc-300'>{order.shipping_method}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div className={CARD}>
              <h2 className='text-sm font-semibold text-white mb-3'>付款資訊</h2>
              <div className='space-y-2 text-sm'>
                <div>
                  <span className='text-zinc-500'>方式：</span>
                  <span className='text-zinc-300'>{order.payment.method}</span>
                </div>
                <div>
                  <span className='text-zinc-500'>狀態：</span>
                  <span className='text-zinc-300'>{order.payment.status}</span>
                </div>
                {order.paid_at && (
                  <div>
                    <span className='text-zinc-500'>付款時間：</span>
                    <span className='text-zinc-300'>
                      {new Date(order.paid_at).toLocaleString('zh-TW')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {order.notes && (
            <div className={CARD}>
              <h2 className='text-sm font-semibold text-white mb-2'>備註</h2>
              <p className='text-zinc-400 text-sm'>{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {pendingStatus && (
        <ConfirmModal
          title='更新訂單狀態'
          message={`確定要將狀態更新為「${ORDER_STATUS_LABELS[pendingStatus]}」嗎？`}
          confirmText='確定更新'
          danger={pendingStatus === 'cancelled'}
          onConfirm={confirmStatusChange}
          onCancel={() => setPendingStatus(null)}
        />
      )}
    </div>
  );
}
