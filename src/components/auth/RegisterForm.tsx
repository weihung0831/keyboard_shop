'use client';

/**
 * 註冊表單元件
 * 包含完整的表單驗證、密碼強度指示器、失焦後即時驗證策略
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import type { RegisterFormData } from '@/types/member';
import { registerFormSchema } from '@/lib/validators';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordStrength } from './PasswordStrength';
import { cn } from '@/lib/utils';

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onTouched', // 失焦時觸發驗證
  });

  // 監聽密碼欄位以顯示強度指示器
  const password = watch('password');

  // 處理欄位失焦後即時驗證
  const handleBlur = async (fieldName: keyof RegisterFormData) => {
    await trigger(fieldName);
  };

  // 提交表單
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await registerUser(data);
      // 註冊成功後自動登入並跳轉至會員專區
      router.push('/member/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('註冊失敗,請稍後再試');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            placeholder='至少 8 個字元'
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
        <PasswordStrength password={password || ''} />
      </div>

      {/* 確認密碼 */}
      <div>
        <label htmlFor='confirmPassword' className='block text-sm font-medium text-zinc-300 mb-2'>
          確認密碼 <span className='text-red-500'>*</span>
        </label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id='confirmPassword'
            {...register('confirmPassword')}
            onBlur={() => handleBlur('confirmPassword')}
            className={cn(
              'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 pr-12 text-white',
              'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
              errors.confirmPassword
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                : touchedFields.confirmPassword
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                  : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
            )}
            placeholder='請再次輸入密碼'
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300'
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='mt-1 text-sm text-red-500'>{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* 姓名 */}
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-zinc-300 mb-2'>
          姓名 <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          id='name'
          {...register('name')}
          onBlur={() => handleBlur('name')}
          className={cn(
            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
            errors.name
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : touchedFields.name
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
          )}
          placeholder='請輸入您的姓名'
        />
        {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
      </div>

      {/* 電話 */}
      <div>
        <label htmlFor='phone' className='block text-sm font-medium text-zinc-300 mb-2'>
          電話號碼 <span className='text-red-500'>*</span>
        </label>
        <input
          type='tel'
          id='phone'
          {...register('phone')}
          onBlur={() => handleBlur('phone')}
          className={cn(
            'w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white',
            'placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2',
            errors.phone
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : touchedFields.phone
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                : 'border-zinc-600 focus:border-blue-400 focus:ring-blue-500/30',
          )}
          placeholder='0912-345-678'
        />
        {errors.phone && <p className='mt-1 text-sm text-red-500'>{errors.phone.message}</p>}
      </div>

      {/* 註冊按鈕 */}
      <button
        type='submit'
        disabled={isSubmitting}
        className={cn(
          'w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white',
          'transition-colors shadow-lg shadow-blue-500/25',
          isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 active:bg-blue-800',
        )}
      >
        {isSubmitting ? '註冊中...' : '註冊'}
      </button>
    </form>
  );
}
