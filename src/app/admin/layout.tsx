'use client';

/**
 * 後台管理佈局
 * 登入頁不顯示側邊欄，其餘頁面使用 admin 路由守衛 + 側邊欄
 */

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading, isAdmin } = useAdminGuard();

  // 後台登入頁不需要側邊欄和 guard
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-zinc-400 text-sm'>載入中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className='lg:hidden min-h-screen bg-black flex items-center justify-center p-6'>
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-zinc-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25'
              />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-white mb-2'>請使用電腦瀏覽器</h2>
          <p className='text-zinc-400 text-sm leading-relaxed'>
            後台管理系統需要較大的螢幕才能正常操作
          </p>
        </div>
      </div>
      <div className='hidden lg:block min-h-screen bg-black'>
        <AdminSidebar />
        <main className='ml-60 min-h-screen p-6'>{children}</main>
      </div>
    </>
  );
}
