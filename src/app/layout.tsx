import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SimpleNavbarWithHoverEffects } from '@/components/ui/Navbar';
import { SimpleFooterWithFourGrids } from '@/components/ui/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartSidebar } from '@/components/ui/cart-sidebar';
import { CartNotifications } from '@/components/ui/cart-notifications';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Axis Keys',
  description: 'Axis Keys - 您的一站式鍵盤商店',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-TW' className='dark'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <SimpleNavbarWithHoverEffects />
            {children}
            <SimpleFooterWithFourGrids />
            <CartSidebar />
            <CartNotifications />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
