'use client';

/**
 * 前台外殼元件
 * 在 /admin 路徑時隱藏 Navbar、Footer、CartSidebar 等前台 UI
 */

import React from 'react';
import { usePathname } from 'next/navigation';
import { SimpleNavbarWithHoverEffects } from '@/components/ui/Navbar';
import { SimpleFooterWithFourGrids } from '@/components/ui/Footer';
import { CartSidebar } from '@/components/ui/cart-sidebar';
import { CartNotifications } from '@/components/ui/cart-notifications';
import WishlistNotifications from '@/components/ui/wishlist-notifications';

export function ShopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SimpleNavbarWithHoverEffects />
      {children}
      <SimpleFooterWithFourGrids />
      <CartSidebar />
      <CartNotifications />
      <WishlistNotifications />
    </>
  );
}
