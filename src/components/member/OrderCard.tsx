/**
 * 訂單卡片元件
 * 顯示訂單基本資訊
 */

import React from 'react';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}

export function OrderCard({ orderNumber, date, total, status }: OrderCardProps) {
  // 訂單狀態對應的顏色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case '處理中':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case '已出貨':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case '待處理':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case '已取消':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30';
    }
  };

  return (
    <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-colors'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        {/* 左側資訊 */}
        <div className='flex-1 space-y-3'>
          {/* 訂單號 */}
          <div className='flex items-center gap-2'>
            <Package className='text-zinc-400' size={18} />
            <span className='text-sm text-zinc-400'>訂單編號:</span>
            <span className='text-white font-medium'>{orderNumber}</span>
          </div>

          {/* 日期 */}
          <div className='flex items-center gap-2'>
            <Calendar className='text-zinc-400' size={18} />
            <span className='text-sm text-zinc-400'>訂單日期:</span>
            <span className='text-white'>{date}</span>
          </div>

          {/* 總額 */}
          <div className='flex items-center gap-2'>
            <CreditCard className='text-zinc-400' size={18} />
            <span className='text-sm text-zinc-400'>訂單金額:</span>
            <span className='text-white font-semibold'>NT$ {total.toLocaleString()}</span>
          </div>
        </div>

        {/* 右側狀態 */}
        <div className='flex items-center justify-end'>
          <span
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium border',
              getStatusColor(status),
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
