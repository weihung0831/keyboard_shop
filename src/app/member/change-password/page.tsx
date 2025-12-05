'use client';

/**
 * 修改密碼頁面
 * 會員可在此修改登入密碼
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { apiChangePassword, ApiError } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordFormSchema, checkPasswordStrength } from '@/lib/validators';
import type { ChangePasswordFormData } from '@/types/member';
import { Lock, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthGuard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // 監聽新密碼以顯示密碼強度
  const newPassword = watch('newPassword');
  const passwordStrength = checkPasswordStrength(newPassword || '');

  // 提交表單
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true);

      // 呼叫 API 修改密碼
      await apiChangePassword(data);

      // 顯示成功訊息
      setShowSuccessMessage(true);

      // 清空表單
      reset();

      // 3 秒後跳轉回個人資料頁
      setTimeout(() => {
        router.push('/member/profile');
      }, 3000);
    } catch (error) {
      console.error('修改密碼失敗:', error);

      if (error instanceof ApiError) {
        // 處理後端回傳的錯誤
        if (error.errors) {
          // 設定欄位錯誤
          if (error.errors.current_password) {
            setError('currentPassword', {
              message: error.errors.current_password[0],
            });
          }
          if (error.errors.new_password) {
            setError('newPassword', {
              message: error.errors.new_password[0],
            });
          }
        } else {
          // 一般錯誤訊息（如密碼錯誤）
          setError('currentPassword', {
            message: error.message,
          });
        }
      } else {
        alert('修改密碼失敗，請稍後再試');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className='min-h-screen bg-black pt-24'>
      <div className='container mx-auto px-4 py-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-lg mx-auto'
        >
          {/* 返回連結 */}
          <Link
            href='/member/profile'
            className='inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6'
          >
            <ArrowLeft size={18} />
            返回個人資料
          </Link>

          {/* 頁面標題 */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-white mb-2'>修改密碼</h1>
            <p className='text-zinc-400'>為了帳號安全，建議定期更換密碼</p>
          </div>

          {/* 成功訊息 */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-6 flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500'
            >
              <Check size={20} />
              <span>密碼修改成功！即將跳轉至個人資料頁面...</span>
            </motion.div>
          )}

          {/* 修改密碼表單 */}
          <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 lg:p-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* 目前密碼 */}
              <div>
                <label className='block text-sm font-medium text-zinc-300 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Lock size={18} />
                    目前密碼
                  </div>
                </label>
                <div className='relative'>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...register('currentPassword')}
                    className={cn(
                      'w-full px-4 py-3 pr-12 bg-zinc-800 border rounded-lg text-white transition-colors',
                      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
                      errors.currentPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-zinc-600',
                    )}
                    placeholder='請輸入目前密碼'
                  />
                  <button
                    type='button'
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors'
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className='mt-1 text-sm text-red-500'>{errors.currentPassword.message}</p>
                )}
              </div>

              {/* 新密碼 */}
              <div>
                <label className='block text-sm font-medium text-zinc-300 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Lock size={18} />
                    新密碼
                  </div>
                </label>
                <div className='relative'>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    className={cn(
                      'w-full px-4 py-3 pr-12 bg-zinc-800 border rounded-lg text-white transition-colors',
                      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
                      errors.newPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-zinc-600',
                    )}
                    placeholder='請輸入新密碼（至少 8 個字元）'
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors'
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className='mt-1 text-sm text-red-500'>{errors.newPassword.message}</p>
                )}

                {/* 密碼強度指示器 */}
                {newPassword && (
                  <div className='mt-2'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden'>
                        <div
                          className={cn(
                            'h-full transition-all duration-300',
                            passwordStrength.strength === 'weak' && 'w-1/3 bg-red-500',
                            passwordStrength.strength === 'medium' && 'w-2/3 bg-yellow-500',
                            passwordStrength.strength === 'strong' && 'w-full bg-green-500',
                          )}
                        />
                      </div>
                      <span className={cn('text-xs', passwordStrength.color)}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 確認新密碼 */}
              <div>
                <label className='block text-sm font-medium text-zinc-300 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Lock size={18} />
                    確認新密碼
                  </div>
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmNewPassword')}
                    className={cn(
                      'w-full px-4 py-3 pr-12 bg-zinc-800 border rounded-lg text-white transition-colors',
                      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
                      errors.confirmNewPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-zinc-600',
                    )}
                    placeholder='請再次輸入新密碼'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors'
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <p className='mt-1 text-sm text-red-500'>{errors.confirmNewPassword.message}</p>
                )}
              </div>

              {/* 提交按鈕 */}
              <button
                type='submit'
                disabled={isSubmitting || showSuccessMessage}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                  isSubmitting || showSuccessMessage
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700',
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                    <span>處理中...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>確認修改密碼</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 密碼安全提示 */}
          <div className='mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg'>
            <h3 className='text-sm font-medium text-zinc-300 mb-2'>密碼安全建議</h3>
            <ul className='text-xs text-zinc-500 space-y-1'>
              <li>• 使用至少 8 個字元</li>
              <li>• 混合使用大小寫字母、數字和特殊符號</li>
              <li>• 避免使用個人資訊（如生日、姓名）</li>
              <li>• 不要與其他網站使用相同密碼</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
