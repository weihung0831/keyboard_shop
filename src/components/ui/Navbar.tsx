'use client';
import { cn } from '@/lib/utils';
import { IconMenu2, IconX, IconShoppingCart, IconUser, IconSearch } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';
import productsData from '@/data/products.json';

export function SimpleNavbarWithHoverEffects() {
  return <Navbar />;
}

const Navbar = () => {
  const navItems = [
    { name: '產品', link: '/products' },
    { name: '關於我們', link: '/about' },
    { name: '常見問題', link: '/faq' },
    { name: '聯絡我們', link: '/contact' },
  ];

  return (
    <div className='w-full'>
      <DesktopNav navItems={navItems} />
      <MobileNav navItems={navItems} />
    </div>
  );
};

const DesktopNav = ({ navItems }: { navItems: { name: string; link: string }[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { totalItems, toggleCart } = useCart();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const router = useRouter();

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  // 搜尋功能
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const products = productsData as Product[];
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.switches.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(filtered.slice(0, 5)); // 最多顯示 5 個結果
  }, [searchQuery]);

  // 點擊外部關閉搜尋
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <motion.div
      onMouseLeave={() => {
        setHovered(null);
      }}
      className={cn(
        'fixed z-[60] hidden w-full flex-row items-center justify-between self-start bg-white px-8 py-4 lg:flex dark:bg-black',
        'inset-x-0 top-0',
      )}
    >
      <Logo />
      <div className='hidden flex-1 flex-row items-center justify-center space-x-2 text-lg font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2'>
        {navItems.map((navItem, idx: number) => (
          <Link
            onMouseEnter={() => setHovered(idx)}
            className='relative px-4 py-2 text-neutral-600 dark:text-neutral-300'
            key={`link=${idx}`}
            href={navItem.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId='hovered'
                className='absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-gray-800'
              />
            )}
            <span className='relative z-20'>{navItem.name}</span>
          </Link>
        ))}
      </div>
      <div className='flex items-center space-x-2'>
        {/* 搜尋功能區域 */}
        <div className='relative' ref={searchRef}>
          <button
            onClick={handleSearchClick}
            className='flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'
            aria-label='搜尋產品'
          >
            <IconSearch size={24} />
          </button>

          {/* 搜尋輸入框 */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='absolute right-0 top-12 w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50'
              >
                <div className='p-4'>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder='搜尋鍵盤名稱、軸體、分類...'
                    className='w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white placeholder-neutral-500'
                    autoFocus
                  />
                </div>

                {/* 搜尋結果 */}
                {searchQuery && (
                  <div className='max-h-96 overflow-y-auto'>
                    {searchResults.length > 0 ? (
                      <div className='border-t border-zinc-200 dark:border-zinc-700'>
                        {searchResults.map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className='w-full px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left flex items-center space-x-3'
                          >
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                                {product.name}
                              </p>
                              <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
                                {product.category} • {product.switches}
                              </p>
                            </div>
                            <p className='text-sm font-semibold text-blue-600 dark:text-blue-400'>
                              NT$ {product.price.toLocaleString()}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className='px-4 py-8 text-center text-neutral-500 dark:text-neutral-400'>
                        找不到符合的產品
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='relative'>
          <button
            onClick={handleUserIconClick}
            className='flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'
            aria-label={isAuthenticated ? '會員選單' : '登入'}
          >
            <IconUser size={24} />
          </button>

          {/* 會員下拉選單 */}
          {isAuthenticated && showUserMenu && (
            <div className='absolute right-0 top-12 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50'>
              <div className='px-4 py-3 border-b border-zinc-700'>
                <p className='text-sm font-medium text-white'>{currentUser?.name}</p>
                <p className='text-xs text-zinc-400 truncate'>{currentUser?.email}</p>
              </div>
              <div className='py-2'>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push('/member/dashboard');
                  }}
                  className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors'
                >
                  會員專區
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push('/member/wishlist');
                  }}
                  className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors'
                >
                  願望清單
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push('/member/profile');
                  }}
                  className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors'
                >
                  個人資料
                </button>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors'
                >
                  登出
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={toggleCart}
          className='relative flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'
          aria-label={`購物車，目前有 ${totalItems} 個商品`}
        >
          <IconShoppingCart size={24} />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-sm text-white flex items-center justify-center font-medium shadow-lg'
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems }: { navItems: { name: string; link: string }[] }) => {
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { totalItems, toggleCart } = useCart();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const router = useRouter();

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setOpen(false);
    router.push('/');
  };

  // 搜尋功能
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const products = productsData as Product[];
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.switches.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery]);

  // 點擊外部關閉搜尋
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <>
      <motion.div
        key={String(open)}
        className='fixed top-0 left-0 right-0 z-[60] flex w-full flex-col items-center justify-between bg-white py-2 lg:hidden dark:bg-black'
      >
        <div className='flex w-full flex-row items-center justify-between px-4'>
          <Logo />
          <div className='flex items-center space-x-1'>
            {/* 手機版搜尋按鈕 */}
            <div className='relative' ref={searchRef}>
              <button
                onClick={handleSearchClick}
                className='flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'
                aria-label='搜尋產品'
              >
                <IconSearch size={22} />
              </button>

              {/* 手機版搜尋輸入框 */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute right-0 top-12 w-screen max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50'
                  >
                    <div className='p-4'>
                      <input
                        type='text'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder='搜尋鍵盤...'
                        className='w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white placeholder-neutral-500 text-sm'
                        autoFocus
                      />
                    </div>

                    {/* 搜尋結果 */}
                    {searchQuery && (
                      <div className='max-h-80 overflow-y-auto'>
                        {searchResults.length > 0 ? (
                          <div className='border-t border-zinc-200 dark:border-zinc-700'>
                            {searchResults.map(product => (
                              <button
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                                className='w-full px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left'
                              >
                                <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                                  {product.name}
                                </p>
                                <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
                                  {product.category} • {product.switches}
                                </p>
                                <p className='text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1'>
                                  NT$ {product.price.toLocaleString()}
                                </p>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className='px-4 py-8 text-center text-neutral-500 dark:text-neutral-400 text-sm'>
                            找不到符合的產品
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className='relative'>
              <button
                onClick={handleUserIconClick}
                className='flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'
                aria-label={isAuthenticated ? '會員選單' : '登入'}
              >
                <IconUser size={22} />
              </button>

              {/* 會員下拉選單 (手機版) */}
              {isAuthenticated && showUserMenu && (
                <div className='absolute right-0 top-12 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50'>
                  <div className='px-4 py-3 border-b border-zinc-700'>
                    <p className='text-sm font-medium text-white'>{currentUser?.name}</p>
                    <p className='text-xs text-zinc-400 truncate'>{currentUser?.email}</p>
                  </div>
                  <div className='py-2'>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/member/dashboard');
                      }}
                      className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors'
                    >
                      會員專區
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/member/wishlist');
                      }}
                      className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors'
                    >
                      願望清單
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/member/profile');
                      }}
                      className='w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors'
                    >
                      個人資料
                    </button>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors'
                    >
                      登出
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleCart}
              className='relative flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'
              aria-label={`購物車，目前有 ${totalItems} 個商品`}
            >
              <IconShoppingCart size={22} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium shadow-lg'
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </button>
            {/* 行動版選單開關按鈕，根據開啟狀態顯示X或漢堡圖示 */}
            {open ? (
              <IconX className='text-black dark:text-white ml-2' onClick={() => setOpen(!open)} />
            ) : (
              <IconMenu2
                className='text-black dark:text-white ml-2'
                onClick={() => setOpen(!open)}
              />
            )}
          </div>
        </div>

        {/* 行動版選單展開區域，含淡入淡出動畫效果 */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-x-0 top-16 z-20 flex w-full flex-col items-start justify-start gap-4 bg-white py-8 dark:bg-black'
            >
              {navItems.map((navItem, idx: number) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  onClick={() => setOpen(false)}
                  className='relative text-lg text-neutral-600 dark:text-neutral-300 px-4 w-full'
                >
                  <motion.span className='block'>{navItem.name} </motion.span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const Logo = () => {
  return (
    <Link
      href='/'
      className='relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-base font-normal text-black'
    >
      <div className='relative flex h-10 w-10 items-center justify-center'>
        <div className='absolute inset-0 rounded-lg bg-gradient-to-b from-gray-300 to-gray-500 shadow-lg dark:from-gray-600 dark:to-gray-800'></div>
        <div className='absolute inset-1 rounded-md bg-gradient-to-b from-white to-gray-100 dark:from-gray-700 dark:to-gray-900'></div>
        <span className='relative z-10 font-bold text-xl text-gray-800 dark:text-white'>AK</span>
      </div>
      <span className='font-medium text-2xl text-black dark:text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text transition-all duration-300'>
        Axis Keys
      </span>
    </Link>
  );
};
