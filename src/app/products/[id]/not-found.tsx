'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductNotFound() {
  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  // Animation configs for motion.div elements
  const floatingAnimation = {
    y: [0, -15, 0],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const,
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1] as const,
    },
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='container mx-auto px-4 py-16'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='text-center max-w-2xl mx-auto'
        >
          {/* 404 Illustration with Keyboard */}
          <motion.div animate={floatingAnimation} className='mb-8'>
            <div className='relative mx-auto w-64 h-64'>
              {/* Large 404 Text with gradient */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <motion.span
                  animate={pulseAnimation}
                  className='text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent opacity-30'
                >
                  404
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div variants={itemVariants} className='mb-10'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>找不到這款鍵盤</h1>
            <p className='text-lg md:text-xl text-zinc-300 mb-2 leading-relaxed'>
              很抱歉，您要尋找的商品不存在或已經下架
            </p>
            <p className='text-base text-zinc-400'>不過別擔心！我們有許多其他優質的鍵盤等您發現</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className='space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center'
          >
            <Link
              href='/products'
              className='group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105'
            >
              <svg
                className='mr-3 h-5 w-5 group-hover:animate-pulse'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
              </svg>
              瀏覽所有鍵盤
            </Link>

            <Link
              href='/'
              className='group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-xl font-semibold hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105'
            >
              <svg
                className='mr-3 h-5 w-5 group-hover:animate-pulse'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
              回到首頁
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
