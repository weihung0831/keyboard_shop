'use client';

/**
 * 登入頁面
 * 提供使用者登入表單與安全警告
 */

import React, { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-black flex items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        {/* Logo / 網站標題 */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-block'>
            <h1 className='text-3xl font-bold text-white mb-2'>Axis Keys</h1>
          </Link>
          <p className='text-zinc-400'>登入您的帳號</p>
        </div>

        {/* 登入表單卡片 */}
        <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-8 shadow-lg'>
          <Suspense
            fallback={
              <div className='text-center py-8'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent'></div>
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* 還沒有帳號連結 */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-zinc-400'>
              還沒有帳號?{' '}
              <Link href='/register' className='text-blue-500 hover:text-blue-400 font-medium'>
                立即註冊
              </Link>
            </p>
          </div>
        </div>

        {/* 安全警告 */}
        <div className='mt-6 flex items-start gap-2 px-4'>
          <p className='text-xs text-zinc-500'>⚠️ 此為展示專案,請勿使用真實密碼。</p>
        </div>
      </motion.div>
    </div>
  );
}
