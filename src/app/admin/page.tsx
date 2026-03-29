'use client';

/**
 * 後台管理 Dashboard 頁面
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetDashboardStats } from '@/lib/admin-api';
import type { DashboardStats, DashboardPeriod } from '@/types/admin';

const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
  { label: '今日', value: 'today' },
  { label: '近 7 天', value: '7d' },
  { label: '近 30 天', value: '30d' },
  { label: '全部', value: 'all' },
];

function formatCurrency(amount: number) {
  return `NT$${amount.toLocaleString('zh-TW')}`;
}

function TrendBadge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className='text-zinc-500 text-xs flex items-center gap-1'>
        <Minus size={12} /> —
      </span>
    );
  }
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        'text-xs flex items-center gap-1',
        isPositive ? 'text-green-400' : 'text-red-400',
      )}
    >
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isPositive ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse'>
      <div className='h-4 bg-zinc-800 rounded w-20 mb-4' />
      <div className='h-8 bg-zinc-800 rounded w-32 mb-2' />
      <div className='h-3 bg-zinc-800 rounded w-24' />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('30d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    adminGetDashboardStats(period)
      .then(setStats)
      .catch(() => setError('無法載入資料，請重試'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-6'
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-white'>Dashboard</h1>
        <div className='flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1'>
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded text-sm transition-colors',
                period === opt.value ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className='bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats ? (
          <>
            {/* 營收 */}
            <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-zinc-400 text-sm'>營收</span>
                <DollarSign size={18} className='text-blue-400' />
              </div>
              <div className='text-2xl font-bold text-white mb-1'>
                {formatCurrency(stats.revenue.total)}
              </div>
              <TrendBadge value={stats.revenue.trend_percentage} />
            </div>

            {/* 訂單 */}
            <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-zinc-400 text-sm'>訂單</span>
                <ShoppingCart size={18} className='text-blue-400' />
              </div>
              <div className='text-2xl font-bold text-white mb-1'>{stats.orders.total}</div>
              <div className='flex items-center gap-2 flex-wrap'>
                <TrendBadge value={stats.orders.trend_percentage} />
                <span className='text-zinc-500 text-xs'>
                  待處理 {stats.orders.pending_count} · 處理中 {stats.orders.processing_count}
                </span>
              </div>
            </div>

            {/* 會員 */}
            <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-zinc-400 text-sm'>會員</span>
                <Users size={18} className='text-blue-400' />
              </div>
              <div className='text-2xl font-bold text-white mb-1'>{stats.members.total}</div>
              <div className='flex items-center gap-2'>
                <TrendBadge value={stats.members.trend_percentage} />
                <span className='text-zinc-500 text-xs'>新增 {stats.members.new_count}</span>
              </div>
            </div>

            {/* 庫存警示 */}
            <Link
              href='/admin/products?low_stock=1'
              className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors block'
            >
              <div className='flex items-center justify-between mb-3'>
                <span className='text-zinc-400 text-sm'>庫存警示</span>
                <Package size={18} className='text-yellow-400' />
              </div>
              <div className='text-2xl font-bold text-yellow-400 mb-1'>查看</div>
              <span className='text-zinc-500 text-xs'>低庫存商品</span>
            </Link>
          </>
        ) : null}
      </div>

      {/* Top Products */}
      {!loading && stats && stats.top_products.length > 0 && (
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl'>
          <div className='px-6 py-4 border-b border-zinc-800'>
            <h2 className='text-base font-semibold text-white'>熱銷商品</h2>
          </div>
          <div className='px-6 py-2'>
            {/* Table Header */}
            <div className='grid grid-cols-3 gap-4 py-2 text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800'>
              <span>商品名稱</span>
              <span className='text-right'>銷售數量</span>
              <span className='text-right'>銷售金額</span>
            </div>
            {stats.top_products.map((product, idx) => (
              <div
                key={product.product_id}
                className='grid grid-cols-3 gap-4 py-3 text-sm border-b border-zinc-800/50 last:border-0'
              >
                <div className='flex items-center gap-2'>
                  <span className='text-zinc-600 w-5 text-right'>{idx + 1}</span>
                  <span className='text-white truncate'>{product.product_name}</span>
                </div>
                <span className='text-zinc-300 text-right'>{product.total_quantity}</span>
                <span className='text-zinc-300 text-right'>
                  {formatCurrency(product.total_revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
