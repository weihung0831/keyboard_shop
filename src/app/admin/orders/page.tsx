'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetOrders } from '@/lib/admin-api';
import type { AdminOrder, AdminOrdersQueryParams } from '@/types/admin';
import type { OrderStatus } from '@/types/order';
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from '@/types/order';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '全部狀態' },
  { value: 'pending', label: '待付款' },
  { value: 'processing', label: '處理中' },
  { value: 'shipped', label: '已出貨' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const INPUT_CLASS =
  'bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: AdminOrdersQueryParams = { page: currentPage, per_page: 15 };
      if (search) params.search = search;
      if (status) params.status = status as OrderStatus;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await adminGetOrders(params);
      setOrders(res.data);
      setTotal(res.meta.total);
      setLastPage(res.meta.last_page);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, status, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>訂單管理</h1>
          <p className='mt-1 text-sm text-zinc-400'>共 {total} 筆訂單</p>
        </div>
      </div>

      {/* Filters */}
      <div className='mb-4 flex flex-wrap gap-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <input
            className={cn(INPUT_CLASS, 'pl-9 w-56')}
            placeholder='搜尋訂單編號 / 姓名'
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <select
          className={cn(INPUT_CLASS, 'w-36')}
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          type='date'
          className={cn(INPUT_CLASS)}
          value={dateFrom}
          onChange={e => {
            setDateFrom(e.target.value);
            setCurrentPage(1);
          }}
        />
        <span className='flex items-center text-zinc-500 text-sm'>至</span>
        <input
          type='date'
          className={cn(INPUT_CLASS)}
          value={dateTo}
          onChange={e => {
            setDateTo(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={handleSearch}
          className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm'
        >
          搜尋
        </button>
      </div>

      {/* Table */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto'>
        <div className='grid grid-cols-[1.5fr_1fr_1fr_100px_60px_120px_80px] min-w-[900px] text-xs text-zinc-400 px-4 py-3 border-b border-zinc-800 bg-zinc-950'>
          <span>訂單編號</span>
          <span>會員</span>
          <span>金額</span>
          <span>狀態</span>
          <span>項目數</span>
          <span>建立時間</span>
          <span></span>
        </div>

        {isLoading ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>載入中...</div>
        ) : orders.length === 0 ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>沒有訂單資料</div>
        ) : (
          orders.map(order => (
            <div
              key={order.id}
              className='grid grid-cols-[1.5fr_1fr_1fr_100px_60px_120px_80px] min-w-[900px] px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors text-sm items-center'
            >
              <span className='font-mono text-white text-xs'>{order.order_number}</span>
              <span className='text-zinc-300'>{order.user?.name ?? '—'}</span>
              <span className='text-white'>NT$ {order.total_amount.toLocaleString()}</span>
              <span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs border',
                    ORDER_STATUS_BADGE_CLASSES[order.status],
                  )}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </span>
              <span className='text-zinc-400'>{order.items_count}</span>
              <span className='text-zinc-400 text-xs'>
                {new Date(order.created_at).toLocaleDateString('zh-TW')}
              </span>
              <span className='flex gap-6'>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className='text-zinc-400 hover:text-blue-400 transition-colors'
                  title='查看詳情'
                >
                  <Eye className='h-4 w-4' />
                </Link>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className='mt-4 flex items-center justify-center gap-2'>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className='p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          <span className='text-zinc-400 text-sm'>
            第 {currentPage} / {lastPage} 頁
          </span>
          <button
            disabled={currentPage >= lastPage}
            onClick={() => setCurrentPage(p => p + 1)}
            className='p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
      )}
    </div>
  );
}
