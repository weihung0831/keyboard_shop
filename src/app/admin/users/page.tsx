'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetUsers, adminDeleteUser } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { AdminUser, AdminUsersQueryParams, UserRole } from '@/types/admin';
import { USER_ROLE_LABELS, USER_ROLE_BADGE_CLASSES } from '@/types/admin';

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '全部角色' },
  { value: 'user', label: '一般會員' },
  { value: 'admin', label: '管理員' },
  { value: 'super_admin', label: '超級管理員' },
];

const INPUT_CLASS =
  'bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: AdminUsersQueryParams = { page: currentPage, per_page: 15 };
      if (search) params.search = search;
      if (role) params.role = role as UserRole;

      const res = await adminGetUsers(params);
      setUsers(res.data);
      setTotal(res.meta.total);
      setLastPage(res.meta.last_page);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: AdminUser) => {
    try {
      await adminDeleteUser(user.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>會員管理</h1>
          <p className='mt-1 text-sm text-zinc-400'>共 {total} 位會員</p>
        </div>
      </div>

      {/* Filters */}
      <div className='mb-4 flex flex-wrap gap-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <input
            className={cn(INPUT_CLASS, 'pl-9 w-56')}
            placeholder='搜尋姓名 / Email'
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setCurrentPage(1);
            }}
          />
        </div>
        <select
          className={cn(INPUT_CLASS, 'w-36')}
          value={role}
          onChange={e => {
            setRole(e.target.value);
            setCurrentPage(1);
          }}
        >
          {ROLE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setCurrentPage(1)}
          className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm'
        >
          搜尋
        </button>
      </div>

      {/* Table */}
      {deleteTarget && (
        <ConfirmModal
          title='刪除會員'
          message={
            deleteTarget.orders_count > 0
              ? `此會員有 ${deleteTarget.orders_count} 筆訂單，無法刪除。`
              : `確定要刪除「${deleteTarget.name}」嗎？此操作無法復原。`
          }
          confirmText={deleteTarget.orders_count > 0 ? undefined : '刪除'}
          danger
          onConfirm={() =>
            deleteTarget.orders_count > 0 ? setDeleteTarget(null) : handleDelete(deleteTarget)
          }
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto'>
        <div className='grid grid-cols-[1.5fr_2fr_100px_80px_120px_60px] text-xs text-zinc-400 px-4 py-3 border-b border-zinc-800 bg-zinc-950'>
          <span>姓名</span>
          <span>Email</span>
          <span>角色</span>
          <span>訂單數</span>
          <span>註冊時間</span>
          <span></span>
        </div>

        {isLoading ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>載入中...</div>
        ) : users.length === 0 ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>沒有會員資料</div>
        ) : (
          users.map(user => (
            <div
              key={user.id}
              className='grid grid-cols-[1.5fr_2fr_100px_80px_120px_60px] px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors text-sm items-center'
            >
              <span className='text-white'>{user.name}</span>
              <span className='text-zinc-400 text-xs truncate'>{user.email}</span>
              <span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs border',
                    USER_ROLE_BADGE_CLASSES[user.role],
                  )}
                >
                  {USER_ROLE_LABELS[user.role]}
                </span>
              </span>
              <span className='text-zinc-400'>{user.orders_count}</span>
              <span className='text-zinc-400 text-xs'>
                {new Date(user.created_at).toLocaleDateString('zh-TW')}
              </span>
              <span className='flex gap-6'>
                <Link
                  href={`/admin/users/${user.id}`}
                  className='text-zinc-400 hover:text-blue-400 transition-colors'
                  title='查看詳情'
                >
                  <Eye className='h-4 w-4' />
                </Link>
                <button
                  onClick={() => setDeleteTarget(user)}
                  className='text-zinc-400 hover:text-red-400 transition-colors'
                  title='刪除'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
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
