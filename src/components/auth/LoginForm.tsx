'use client';

/**
 * 登入表單元件
 * 包含完整的表單驗證、密碼顯示/隱藏切換、失焦後即時驗證策略
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import type { LoginFormData } from '@/types/member';
import { loginFormSchema } from '@/lib/validators';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onTouched', // 失焦時觸發驗證
  });

  // 處理欄位失焦後即時驗證
  const handleBlur = async (fieldName: keyof LoginFormData) => {
    await trigger(fieldName);
  };

  // 提交表單
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await login(data);

      // 登入成功後重導向
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        router.push('/member/dashboard');
      }
    } catch (error) {
      // 處理 API 錯誤
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('登入失敗，請稍後再試');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enter 鍵送出表單 (form 的 onSubmit 已處理,這裡不需額外處理)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      {/* 伺服器錯誤訊息 */}
      {serverError && (
        <div className='rounded-lg bg-red-500/10 border border-red-500 px-4 py-3 text-sm text-red-500'>
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-zinc-300 mb-2'>
          Email <span className='text-red-500'>*</span>
        </label>
        <input
          type='email'
          id='email'
          autoComplete='email'
          {...register('email')}
          onBlur={() => handleBlur('email')}
          className={cn(
            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : touchedFields.email
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
          )}
          placeholder='example@email.com'
        />
        {errors.email && <p className='mt-1 text-sm text-red-500'>{errors.email.message}</p>}
      </div>

      {/* 密碼 */}
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-zinc-300 mb-2'>
          密碼 <span className='text-red-500'>*</span>
        </label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            autoComplete='current-password'
            {...register('password')}
            onBlur={() => handleBlur('password')}
            className={cn(
              'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 pr-12 text-white',
              'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
              errors.password
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                : touchedFields.password
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                  : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
            )}
            placeholder='請輸入密碼'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300'
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p className='mt-1 text-sm text-red-500'>{errors.password.message}</p>}
      </div>

      {/* 登入按鈕 */}
      <button
        type='submit'
        disabled={isSubmitting}
        className={cn(
          'w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white',
          'transition-colors shadow-lg shadow-blue-500/25',
          isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 active:bg-blue-800',
        )}
      >
        {isSubmitting ? '登入中...' : '登入'}
      </button>
    </form>
  );
}
