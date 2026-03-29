'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetMessages, adminDeleteMessage } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { ContactMessage } from '@/types/admin';

type FilterType = 'all' | 'unread' | 'read';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'unread', label: '未讀' },
  { value: 'read', label: '已讀' },
];

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('all');
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page: currentPage, per_page: 15 };
      if (filter === 'unread') params.is_read = false;
      if (filter === 'read') params.is_read = true;

      const res = await adminGetMessages(params);
      setMessages(res.data);
      setTotal(res.meta.total);
      setLastPage(res.meta.last_page);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter]);

  // 另外抓取未讀數量（不受篩選影響）
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await adminGetMessages({ is_read: false, per_page: 1 });
      setUnreadCount(res.meta.total);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteMessage(deleteTarget.id);
      setDeleteTarget(null);
      fetchMessages();
      fetchUnreadCount();
    } catch {
      // silent
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='space-y-6'>
      {/* 標題 */}
      <div className='flex items-center gap-3'>
        <h1 className='text-2xl font-bold text-white'>客服訊息</h1>
        {unreadCount > 0 && (
          <span className='rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white'>
            {unreadCount} 則未讀
          </span>
        )}
      </div>

      {/* 篩選 */}
      <div className='flex gap-2'>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleFilterChange(opt.value)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              filter === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 表格 */}
      <div className='overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-zinc-800'>
              <th className='px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500'>
                姓名
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500'>
                Email
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500'>
                留言摘要
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500'>
                狀態
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500'>
                時間
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-500'>
                操作
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-zinc-800'>
            {isLoading ? (
              <tr>
                <td colSpan={6} className='px-4 py-8 text-center text-sm text-zinc-500'>
                  載入中...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-4 py-8 text-center text-sm text-zinc-500'>
                  目前沒有留言
                </td>
              </tr>
            ) : (
              messages.map(msg => (
                <tr
                  key={msg.id}
                  onClick={() => router.push(`/admin/messages/${msg.id}`)}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-zinc-800/50',
                    !msg.is_read && 'bg-blue-500/5',
                  )}
                >
                  <td className='px-4 py-3 text-sm font-medium text-white'>{msg.name}</td>
                  <td className='px-4 py-3 text-sm text-zinc-400'>{msg.email}</td>
                  <td className='max-w-xs px-4 py-3 text-sm text-zinc-400'>
                    <span className='block truncate'>
                      {msg.message.length > 60 ? `${msg.message.slice(0, 60)}...` : msg.message}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        msg.is_read
                          ? 'bg-zinc-500/10 text-zinc-400'
                          : 'bg-blue-500/10 text-blue-400',
                      )}
                    >
                      {msg.is_read ? '已讀' : '未讀'}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-4 py-3 text-sm text-zinc-500'>
                    {formatDate(msg.created_at)}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-6' onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => router.push(`/admin/messages/${msg.id}`)}
                        className='text-zinc-400 transition-colors hover:text-blue-400'
                        title='查看詳情'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(msg)}
                        className='text-zinc-400 transition-colors hover:text-red-400'
                        title='刪除'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分頁 */}
      {lastPage > 1 && (
        <div className='flex items-center justify-between text-sm text-zinc-500'>
          <span>共 {total} 筆留言</span>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className='rounded-lg border border-zinc-700 p-1.5 transition-colors hover:text-white disabled:opacity-40'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            <span className='text-white'>
              {currentPage} / {lastPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
              className='rounded-lg border border-zinc-700 p-1.5 transition-colors hover:text-white disabled:opacity-40'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}

      {/* 刪除確認 Modal */}
      {deleteTarget && (
        <ConfirmModal
          title='刪除留言'
          message={`確定要刪除來自「${deleteTarget.name}」的留言嗎？此操作無法復原。`}
          confirmText='刪除'
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
