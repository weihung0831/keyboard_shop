'use client';

/**
 * 個人資料頁面
 * 會員可查看與編輯基本個人資料
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { updateProfile } from '@/lib/storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileFormSchema } from '@/lib/validators';
import type { UpdateProfileFormData } from '@/types/member';
import { User, Mail, Phone, Edit2, Save, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { currentUser, refreshUser } = useAuth();
  const { isLoading: authLoading } = useAuthGuard();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
    },
  });

  // 進入編輯模式
  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
    });
  };

  // 取消編輯
  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
    });
  };

  // 儲存個人資料
  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!currentUser) return;

    try {
      setIsSaving(true);
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新個人資料
      updateProfile(currentUser.id, data);

      // 重新整理使用者資料
      refreshUser();

      // 顯示成功訊息
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // 離開編輯模式
      setIsEditing(false);
    } catch (error) {
      console.error('更新個人資料失敗:', error);
      alert(error instanceof Error ? error.message : '更新失敗，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return null; // Layout 已處理 loading 畫面
  }

  return (
    <div className='min-h-screen bg-black pt-24'>
      <div className='container mx-auto px-4 py-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 頁面標題 */}
          <div className='mb-8 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>個人資料</h1>
              <p className='text-zinc-400'>管理您的個人資訊</p>
            </div>

            {/* 編輯/取消按鈕 */}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                <Edit2 size={18} />
                編輯資料
              </button>
            )}
          </div>

          {/* 成功訊息 */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='mb-6 flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500'
            >
              <Check size={20} />
              <span>個人資料已成功更新</span>
            </motion.div>
          )}

          {/* 個人資料表單 */}
          <div className='bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 lg:p-8'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Email (唯讀) */}
              <div>
                <label className='block text-sm font-medium text-zinc-300 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Mail size={18} />
                    Email
                  </div>
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    value={currentUser?.email || ''}
                    disabled
                    className='w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-400 cursor-not-allowed'
                  />
                  <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500'>
                    不可修改
                  </span>
                </div>
              </div>

              {/* 姓名 */}
              <div>
                <label className='block text-sm font-medium text-zinc-300 mb-2'>
                  <div className='flex items-center gap-2'>
                    <User size={18} />
                    姓名
                  </div>
                </label>
                <input
                  type='text'
                  {...register('name')}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-colors',
                    isEditing
                      ? 'bg-zinc-800 border-zinc-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 cursor-not-allowed',
                    errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
                  )}
                />
                {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
              </div>

              {/* 電話 */}
              <div>
                <label className='block text-sm font-medium text-zinc-300 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Phone size={18} />
                    電話
                  </div>
                </label>
                <input
                  type='tel'
                  {...register('phone')}
                  disabled={!isEditing}
                  placeholder='0912-345-678'
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-colors',
                    isEditing
                      ? 'bg-zinc-800 border-zinc-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 cursor-not-allowed',
                    errors.phone && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
                  )}
                />
                {errors.phone && (
                  <p className='mt-1 text-sm text-red-500'>{errors.phone.message}</p>
                )}
              </div>

              {/* 編輯模式的按鈕 */}
              {isEditing && (
                <div className='flex gap-3 pt-4'>
                  <button
                    type='submit'
                    disabled={!isDirty || isSaving}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors',
                      !isDirty || isSaving
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700',
                    )}
                  >
                    {isSaving ? (
                      <>
                        <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                        <span>儲存中...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>儲存變更</span>
                      </>
                    )}
                  </button>

                  <button
                    type='button'
                    onClick={handleCancel}
                    disabled={isSaving}
                    className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <X size={18} />
                    取消
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* 提示訊息 */}
          <div className='mt-6 px-4'>
            <p className='text-xs text-zinc-500'>
              ⚠️ 此為展示專案，資料儲存於瀏覽器本地。清除瀏覽器資料將會遺失所有資訊。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
