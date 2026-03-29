'use client';

/**
 * 後台管理登入頁面
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });

      // 登入後檢查角色（從 localStorage 讀取）
      const token = localStorage.getItem('keyboard_shop_token');
      if (!token) {
        setError('登入失敗');
        return;
      }

      // 導向後台，layout 會檢查角色
      router.push('/admin');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('登入失敗，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <div className='w-full max-w-sm'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 mb-4'>
            <div className='relative flex h-10 w-10 items-center justify-center'>
              <div className='absolute inset-0 rounded-lg bg-gradient-to-b from-gray-600 to-gray-800 shadow-lg' />
              <div className='absolute inset-1 rounded-md bg-gradient-to-b from-gray-700 to-gray-900' />
              <span className='relative z-10 font-bold text-xl text-white'>AK</span>
            </div>
            <span className='text-xl font-bold text-white'>Axis Keys</span>
            <span className='text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded'>Admin</span>
          </div>
          <p className='text-zinc-400 text-sm'>後台管理系統</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4'
        >
          {error && (
            <div className='bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg'>
              {error}
            </div>
          )}

          <div>
            <label className='text-sm text-zinc-400 mb-1 block'>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none'
              placeholder='admin@example.com'
              required
              autoFocus
            />
          </div>

          <div>
            <label className='text-sm text-zinc-400 mb-1 block'>密碼</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none'
              placeholder='請輸入密碼'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors'
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  );
}
