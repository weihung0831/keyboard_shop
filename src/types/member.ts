/**
 * 會員系統型別定義
 *
 * ⚠️ 安全警告：此為展示專案,密碼使用 Base64 編碼(非加密)
 * 不適用於生產環境,請勿使用真實密碼
 */

// ==================== localStorage Keys ====================

export const STORAGE_KEYS = {
  USERS: 'keyboard_shop_users', // 所有註冊會員資料
  CURRENT_USER: 'keyboard_shop_current_user', // 當前登入會員
  ORDERS: 'keyboard_shop_orders', // 訂單資料(模擬)
} as const;

// ==================== 使用者資料結構 ====================

/**
 * 儲存於 localStorage 的使用者資料
 */
export interface StoredUser {
  id: string; // UUID
  email: string;
  passwordHash: string; // 使用 Base64 編碼(btoa) - 僅供展示用途
  name: string;
  phone: string;
  createdAt: string; // ISO 8601 格式
}

/**
 * 當前登入使用者資料
 */
export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  loginAt: string; // 登入時間
}

// ==================== 表單資料結構 ====================

/**
 * 註冊表單資料
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
}

/**
 * 登入表單資料
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 個人資料更新表單資料
 */
export interface UpdateProfileFormData {
  name: string;
  phone: string;
}

// ==================== 錯誤訊息 ====================

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: '請輸入 Email',
  EMAIL_INVALID: '請輸入有效的 Email 格式',
  EMAIL_EXISTS: '此 Email 已被註冊',
  EMAIL_NOT_FOUND: '帳號不存在',

  PASSWORD_REQUIRED: '請輸入密碼',
  PASSWORD_MIN_LENGTH: '密碼至少需要 8 個字元',
  PASSWORD_INCORRECT: '密碼錯誤',

  CONFIRM_PASSWORD_REQUIRED: '請確認密碼',
  CONFIRM_PASSWORD_MISMATCH: '密碼不一致',

  NAME_REQUIRED: '請輸入姓名',
  NAME_MIN_LENGTH: '姓名至少需要 2 個字元',

  PHONE_REQUIRED: '請輸入電話號碼',
  PHONE_INVALID: '請輸入有效的台灣手機號碼 (例: 0912-345-678)',

  UNKNOWN_ERROR: '發生未知錯誤,請稍後再試',
} as const;

// ==================== 密碼強度 ====================

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  label: string;
  color: string;
}

// ==================== 訂單資料結構 ====================

/**
 * 訂單簡化資訊 (用於列表顯示)
 */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
}
