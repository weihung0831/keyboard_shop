'use client';

/**
 * 會員專區側邊欄元件
 * 提供會員功能導覽
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: '首頁',
      href: '/member/dashboard',
      icon: Home,
    },
    {
      name: '訂單查詢',
      href: '/member/orders',
      icon: ShoppingBag,
    },
    {
      name: '個人資料',
      href: '/member/profile',
      icon: User,
    },
  ];

  return (
    <div className='w-64 bg-zinc-900/90 backdrop-blur-sm border-r border-zinc-700 min-h-screen p-6'>
      {/* 導覽選單 */}
      <nav className='space-y-2'>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
              )}
            >
              <Icon size={20} />
              <span className='font-medium'>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 登出按鈕 */}
      <button
        onClick={onLogout}
        className='flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors w-full mt-6'
      >
        <LogOut size={20} />
        <span className='font-medium'>登出</span>
      </button>
    </div>
  );
}
