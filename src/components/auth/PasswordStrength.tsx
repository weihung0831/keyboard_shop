/**
 * 密碼強度指示器元件
 * 即時顯示密碼強度等級
 */

import React from 'react';
import { checkPasswordStrength } from '@/lib/validators';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { strength, label, color } = checkPasswordStrength(password);

  // 如果沒有輸入密碼,不顯示
  if (!password) {
    return null;
  }

  // 強度等級對應的進度條寬度
  const widthMap = {
    weak: 'w-1/3',
    medium: 'w-2/3',
    strong: 'w-full',
  };

  // 強度等級對應的背景色
  const colorMap = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  return (
    <div className={cn('mt-2', className)}>
      {/* 進度條 */}
      <div className='h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden'>
        <div
          className={cn(
            'h-full transition-all duration-300',
            widthMap[strength],
            colorMap[strength],
          )}
        />
      </div>

      {/* 強度文字 */}
      <p className={cn('text-sm mt-1', color)}>密碼強度: {label}</p>
    </div>
  );
}
