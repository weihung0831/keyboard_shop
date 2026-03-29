'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetUser, adminUpdateUserRole } from '@/lib/admin-api';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { AdminUserDetail, UserRole } from '@/types/admin';
import { USER_ROLE_LABELS, USER_ROLE_BADGE_CLASSES } from '@/types/admin';
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from '@/types/order';

const CARD = 'bg-zinc-900 border border-zinc-800 rounded-xl p-6';
const ROLE_OPTIONS: UserRole[] = ['user', 'admin', 'super_admin'];

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isSuperAdmin, currentUser } = useAdminGuard();

  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [updatingRole, setUpdatingRole] = useState(false);
  const [pendingRoleConfirm, setPendingRoleConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminGetUser(Number(id));
        setUser(data);
        setSelectedRole(data.role);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleRoleUpdate = () => {
    if (!user) return;
    setPendingRoleConfirm(true);
  };

  const confirmRoleUpdate = async () => {
    if (!user) return;
    setPendingRoleConfirm(false);
    setUpdatingRole(true);
    try {
      await adminUpdateUserRole(user.id, selectedRole);
      setUser(prev => (prev ? { ...prev, role: selectedRole } : prev));
    } catch {
      // silent
    } finally {
      setUpdatingRole(false);
    }
  };

  const isSelf = currentUser?.id === user?.id;

  if (isLoading) {
    return <div className='py-20 text-center text-zinc-500 text-sm'>載入中...</div>;
  }

  if (!user) {
    return <div className='py-20 text-center text-zinc-500 text-sm'>找不到會員</div>;
  }

  const byStatus = user.order_stats.by_status;

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
        <h1 className='text-xl font-bold text-white'>{user.name}</h1>
        <span
          className={cn(
            'px-2 py-0.5 rounded-full text-xs border',
            USER_ROLE_BADGE_CLASSES[user.role],
          )}
        >
          {USER_ROLE_LABELS[user.role]}
        </span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left */}
        <div className='space-y-6'>
          {/* User Info */}
          <div className={CARD}>
            <h2 className='text-sm font-semibold text-white mb-4'>會員資料</h2>
            <div className='space-y-3 text-sm'>
              <div>
                <p className='text-zinc-500 text-xs mb-0.5'>姓名</p>
                <p className='text-zinc-200'>{user.name}</p>
              </div>
              <div>
                <p className='text-zinc-500 text-xs mb-0.5'>Email</p>
                <p className='text-zinc-200 break-all'>{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className='text-zinc-500 text-xs mb-0.5'>電話</p>
                  <p className='text-zinc-200'>{user.phone}</p>
                </div>
              )}
              {user.address && (
                <div>
                  <p className='text-zinc-500 text-xs mb-0.5'>地址</p>
                  <p className='text-zinc-200'>{user.address}</p>
                </div>
              )}
              <div>
                <p className='text-zinc-500 text-xs mb-0.5'>註冊時間</p>
                <p className='text-zinc-200'>{new Date(user.created_at).toLocaleString('zh-TW')}</p>
              </div>
            </div>
          </div>

          {/* Role Management */}
          {isSuperAdmin && !isSelf && (
            <div className={CARD}>
              <h2 className='text-sm font-semibold text-white mb-4'>角色管理</h2>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as UserRole)}
                className='w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none mb-3'
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r} value={r}>
                    {USER_ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
              <button
                disabled={updatingRole || selectedRole === user.role}
                onClick={handleRoleUpdate}
                className='w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50'
              >
                {updatingRole ? '更新中...' : '儲存角色'}
              </button>
            </div>
          )}
        </div>

        {/* Right */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Stats */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <div className={cn(CARD, 'text-center')}>
              <p className='text-2xl font-bold text-white'>{user.order_stats.total_count}</p>
              <p className='text-zinc-500 text-xs mt-1'>總訂單數</p>
            </div>
            <div className={cn(CARD, 'text-center')}>
              <p className='text-2xl font-bold text-blue-400'>
                NT$ {user.order_stats.total_spent.toLocaleString()}
              </p>
              <p className='text-zinc-500 text-xs mt-1'>累計消費</p>
            </div>
            {Object.entries(byStatus)
              .slice(0, 2)
              .map(([status, count]) => (
                <div key={status} className={cn(CARD, 'text-center')}>
                  <p className='text-2xl font-bold text-white'>{count}</p>
                  <p className='text-zinc-500 text-xs mt-1'>
                    {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status}
                  </p>
                </div>
              ))}
          </div>

          {/* Recent Orders */}
          <div className={CARD}>
            <h2 className='text-sm font-semibold text-white mb-4'>最近訂單</h2>
            {user.recent_orders.length === 0 ? (
              <p className='text-zinc-500 text-sm'>尚無訂單</p>
            ) : (
              <div className='space-y-0'>
                <div className='grid grid-cols-[1.5fr_1fr_80px_80px] text-xs text-zinc-500 pb-2 border-b border-zinc-800 mb-1'>
                  <span>訂單編號</span>
                  <span>金額</span>
                  <span>狀態</span>
                  <span>日期</span>
                </div>
                {user.recent_orders.slice(0, 10).map(order => (
                  <div
                    key={order.id}
                    className='grid grid-cols-[1.5fr_1fr_80px_80px] py-2.5 border-b border-zinc-800/60 last:border-0 text-sm items-center'
                  >
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className='font-mono text-blue-400 hover:text-blue-300 text-xs'
                    >
                      {order.order_number}
                    </Link>
                    <span className='text-zinc-300 text-xs'>
                      NT$ {order.total_amount.toLocaleString()}
                    </span>
                    <span>
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-full text-xs border',
                          ORDER_STATUS_BADGE_CLASSES[order.status],
                        )}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </span>
                    <span className='text-zinc-500 text-xs'>
                      {new Date(order.created_at).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {pendingRoleConfirm && user && (
        <ConfirmModal
          title='變更會員角色'
          message={`確定要將 ${user.name} 的角色改為「${USER_ROLE_LABELS[selectedRole]}」嗎？`}
          confirmText='確定變更'
          onConfirm={confirmRoleUpdate}
          onCancel={() => setPendingRoleConfirm(false)}
        />
      )}
    </div>
  );
}
