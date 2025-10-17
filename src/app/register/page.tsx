'use client';

/**
 * 註冊頁面
 * 提供使用者註冊表單與安全警告
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
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
          <p className='text-zinc-400'>建立新帳號</p>
        </div>

        {/* 註冊表單卡片 */}
        <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-8 shadow-lg'>
          <RegisterForm />

          {/* 已有帳號連結 */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-zinc-400'>
              已有帳號?{' '}
              <Link href='/login' className='text-blue-500 hover:text-blue-400 font-medium'>
                立即登入
              </Link>
            </p>
          </div>
        </div>

        {/* 安全警告 */}
        <div className='mt-6 flex items-start gap-2 px-4'>
          <p className='text-xs text-zinc-500'>
            ⚠️ 此為展示專案,請勿使用真實密碼。密碼僅以 Base64
            編碼儲存於瀏覽器本地,不適用於生產環境。
          </p>
        </div>
      </motion.div>
    </div>
  );
}
