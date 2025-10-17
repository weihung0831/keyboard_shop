/**
 * 表單驗證規則 (使用 Zod)
 */

import { z } from 'zod';
import { ERROR_MESSAGES } from '@/types/member';

// ==================== 通用驗證規則 ====================

/**
 * Email 驗證規則
 */
export const emailSchema = z
  .string()
  .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
  .email(ERROR_MESSAGES.EMAIL_INVALID);

/**
 * 密碼驗證規則 (至少 8 字元)
 */
export const passwordSchema = z
  .string()
  .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED)
  .min(8, ERROR_MESSAGES.PASSWORD_MIN_LENGTH);

/**
 * 姓名驗證規則
 */
export const nameSchema = z
  .string()
  .min(1, ERROR_MESSAGES.NAME_REQUIRED)
  .min(2, ERROR_MESSAGES.NAME_MIN_LENGTH);

/**
 * 電話驗證規則 (台灣手機號碼格式)
 */
export const phoneSchema = z
  .string()
  .min(1, ERROR_MESSAGES.PHONE_REQUIRED)
  .refine(
    value => {
      // 移除所有空白和連字號
      const cleaned = value.replace(/[-\s]/g, '');
      // 驗證格式: 09 開頭,共 10 碼數字
      return /^09\d{8}$/.test(cleaned);
    },
    {
      message: ERROR_MESSAGES.PHONE_INVALID,
    },
  );

// ==================== 表單 Schema ====================

/**
 * 註冊表單驗證 Schema
 */
export const registerFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
    name: nameSchema,
    phone: phoneSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.CONFIRM_PASSWORD_MISMATCH,
    path: ['confirmPassword'], // 錯誤訊息顯示在 confirmPassword 欄位
  });

/**
 * 登入表單驗證 Schema
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, ERROR_MESSAGES.PASSWORD_REQUIRED),
});

/**
 * 個人資料更新表單驗證 Schema
 */
export const updateProfileFormSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
});

// ==================== 密碼強度檢查 ====================

/**
 * 檢查密碼強度
 */
export const checkPasswordStrength = (password: string) => {
  if (!password) {
    return {
      strength: 'weak' as const,
      label: '弱',
      color: 'text-red-500',
    };
  }

  let score = 0;

  // 長度檢查
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 包含小寫字母
  if (/[a-z]/.test(password)) score++;

  // 包含大寫字母
  if (/[A-Z]/.test(password)) score++;

  // 包含數字
  if (/\d/.test(password)) score++;

  // 包含特殊字元
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  // 評分轉換為強度等級
  if (score <= 2) {
    return {
      strength: 'weak' as const,
      label: '弱',
      color: 'text-red-500',
    };
  } else if (score <= 4) {
    return {
      strength: 'medium' as const,
      label: '中',
      color: 'text-yellow-500',
    };
  } else {
    return {
      strength: 'strong' as const,
      label: '強',
      color: 'text-green-500',
    };
  }
};
