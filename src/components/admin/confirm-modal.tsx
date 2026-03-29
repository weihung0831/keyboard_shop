'use client';

/**
 * 共用確認 Modal 元件
 */

import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmText = '確定',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/60' onClick={onCancel} />
      <div className='relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl'>
        <div className='flex items-start gap-3 mb-4'>
          <div
            className={`mt-0.5 p-2 rounded-full ${danger ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}
          >
            <AlertTriangle className={`h-5 w-5 ${danger ? 'text-red-400' : 'text-yellow-400'}`} />
          </div>
          <div>
            <h3 className='text-white font-semibold'>{title}</h3>
            <p className='text-sm text-zinc-400 mt-1 whitespace-pre-line'>{message}</p>
          </div>
        </div>
        <div className='flex justify-end gap-3 pt-2'>
          <button
            onClick={onCancel}
            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm ${
              danger
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
