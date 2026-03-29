'use client';

/**
 * Admin 路由守衛 Hook
 * 保護後台管理頁面,非管理員自動重導向至後台登入頁
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/types/admin';

export function useAdminGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  const isAdmin = isAdminRole(currentUser?.role);
  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => {
    // 不攔截後台登入頁本身
    if (pathname === '/admin/login') return;

    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, router, pathname]);

  return { isLoading, isAdmin, isSuperAdmin, currentUser };
}
