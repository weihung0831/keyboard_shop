'use client';

/**
 * 會員專區佈局
 * 使用路由守衛保護頁面
 */

import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthGuard();

  // 載入中顯示 Loading 畫面
  if (isLoading) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-white text-lg'>載入中...</div>
      </div>
    );
  }

  return <div className='min-h-screen bg-black'>{children}</div>;
}
