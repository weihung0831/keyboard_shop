'use client';
import { cn } from '@/lib/utils';
import { IconMenu2, IconX, IconShoppingCart, IconUser, IconSearch } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import React, { useState } from 'react';

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
        <button className='flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'>
          <IconSearch size={24} />
        </button>
        <button className='flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'>
          <IconUser size={24} />
        </button>
        <button className='relative flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'>
          <IconShoppingCart size={24} />
          <span className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-sm text-white flex items-center justify-center'>
            0
          </span>
        </button>
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems }: { navItems: { name: string; link: string }[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        key={String(open)}
        className='fixed top-0 left-0 right-0 z-[60] flex w-full flex-col items-center justify-between bg-white py-2 lg:hidden dark:bg-black'
      >
        <div className='flex w-full flex-row items-center justify-between px-4'>
          <Logo />
          <div className='flex items-center space-x-1'>
            <button className='flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'>
              <IconSearch size={22} />
            </button>
            <button className='flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'>
              <IconUser size={22} />
            </button>
            <button className='relative flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-white transition-colors'>
              <IconShoppingCart size={22} />
              <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-sm text-white flex items-center justify-center'>
                0
              </span>
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
