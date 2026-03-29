'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { adminGetMessage, adminDeleteMessage } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { ContactMessage } from '@/types/admin';

export default function AdminMessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      setIsLoading(true);
      try {
        const data = await adminGetMessage(id);
        setMessage(data);
      } catch {
        router.push('/admin/messages');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMessage();
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!message) return;
    try {
      await adminDeleteMessage(message.id);
      router.push('/admin/messages');
    } catch {
      setShowDelete(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20 text-sm text-zinc-500'>載入中...</div>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {/* 標題列 */}
      <div className='flex items-center justify-between'>
        <button
          onClick={() => router.push('/admin/messages')}
          className='flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white'
        >
          <ArrowLeft className='h-4 w-4' />
          返回留言列表
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className='flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20'
        >
          <Trash2 className='h-4 w-4' />
          刪除留言
        </button>
      </div>

      {/* 留言詳情卡片 */}
      <div className='rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-6'>
        {/* 狀態標籤 */}
        <div className='flex items-center gap-3'>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              message.is_read ? 'bg-zinc-500/10 text-zinc-400' : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            {message.is_read ? '已讀' : '未讀'}
          </span>
          <span className='text-xs text-zinc-500'>{formatDate(message.created_at)}</span>
        </div>

        {/* 聯絡資訊 */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <p className='mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500'>姓名</p>
            <p className='text-sm text-white'>{message.name}</p>
          </div>
          <div>
            <p className='mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500'>
              電子郵件
            </p>
            <a href={`mailto:${message.email}`} className='text-sm text-blue-400 hover:underline'>
              {message.email}
            </a>
          </div>
          {message.company && (
            <div>
              <p className='mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500'>
                公司名稱
              </p>
              <p className='text-sm text-white'>{message.company}</p>
            </div>
          )}
          {message.read_at && (
            <div>
              <p className='mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500'>
                已讀時間
              </p>
              <p className='text-sm text-zinc-400'>{formatDate(message.read_at)}</p>
            </div>
          )}
        </div>

        {/* 留言內容 */}
        <div>
          <p className='mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500'>留言內容</p>
          <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-4'>
            <p className='whitespace-pre-wrap text-sm leading-relaxed text-zinc-300'>
              {message.message}
            </p>
          </div>
        </div>
      </div>

      {/* 刪除確認 Modal */}
      {showDelete && (
        <ConfirmModal
          title='刪除留言'
          message={`確定要刪除來自「${message.name}」的留言嗎？此操作無法復原。`}
          confirmText='刪除'
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
