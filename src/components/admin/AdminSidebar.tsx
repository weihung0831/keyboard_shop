'use client';

/**
 * 後台管理側邊欄元件
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminGetMessages } from '@/lib/admin-api';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: '商品管理', href: '/admin/products', icon: Package },
  { name: '訂單管理', href: '/admin/orders', icon: ShoppingCart },
  { name: '會員管理', href: '/admin/users', icon: Users },
  { name: '分類管理', href: '/admin/categories', icon: FolderTree },
  { name: '客服訊息', href: '/admin/messages', icon: MessageSquare },
  { name: '系統設定', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    adminGetMessages({ is_read: 'false', per_page: 1 })
      .then(res => setUnreadCount(res.meta.total))
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <aside className='fixed left-0 top-0 z-40 h-screen w-60 bg-zinc-950 border-r border-zinc-800 flex flex-col'>
      {/* Logo */}
      <div className='flex items-center gap-2 px-5 py-5 border-b border-zinc-800'>
        <span className='text-lg font-bold text-white'>Axis Keys</span>
        <span className='text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded'>Admin</span>
      </div>

      {/* Nav */}
      <nav className='flex-1 overflow-y-auto px-3 py-4 space-y-1'>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60',
              )}
            >
              <Icon size={18} />
              <span className='flex-1'>{item.name}</span>
              {item.href === '/admin/messages' && unreadCount > 0 && (
                <span className='bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center'>
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className='px-3 py-4 border-t border-zinc-800'>
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 transition-colors w-full'
        >
          <LogOut size={18} />
          <span>登出</span>
        </button>
      </div>
    </aside>
  );
}
