/**
 * localStorage 操作工具函式
 *
 * ⚠️ 安全警告：此密碼處理方式僅供前端展示專案使用
 * Base64 編碼並非加密,不適用於生產環境
 */

import type {
  StoredUser,
  CurrentUser,
  RegisterFormData,
  UpdateProfileFormData,
  OrderSummary,
} from '@/types/member';
import { STORAGE_KEYS } from '@/types/member';

// ==================== 密碼處理 (僅供展示) ====================

/**
 * 將密碼編碼為 Base64 (⚠️ 非加密,僅供展示)
 */
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 編碼
};

/**
 * 驗證密碼
 */
const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

// ==================== 使用者操作 ====================

/**
 * 註冊新使用者
 */
export const registerUser = (data: RegisterFormData): CurrentUser => {
  // 1. 檢查 Email 是否已存在
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as StoredUser[];
  const existingUser = users.find((u: StoredUser) => u.email === data.email);

  if (existingUser) {
    throw new Error('此 Email 已被註冊');
  }

  // 2. 生成 UUID 和密碼 hash
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: data.email,
    passwordHash: hashPassword(data.password), // Base64 編碼
    name: data.name,
    phone: data.phone,
    createdAt: new Date().toISOString(),
  };

  // 3. 存入 USERS
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // 4. 建立 CurrentUser 並存入
  const currentUser: CurrentUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    phone: newUser.phone,
    address: '',
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

  // 5. 返回使用者資料
  return currentUser;
};

/**
 * 使用者登入
 */
export const loginUser = (email: string, password: string): CurrentUser => {
  // 1. 從 USERS 查找會員
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as StoredUser[];
  const user = users.find((u: StoredUser) => u.email === email);

  if (!user) {
    throw new Error('帳號不存在');
  }

  // 2. 驗證密碼
  if (!verifyPassword(password, user.passwordHash)) {
    throw new Error('密碼錯誤');
  }

  // 3. 存入 CURRENT_USER
  const currentUser: CurrentUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    address: '',
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

  // 4. 返回會員資料
  return currentUser;
};

/**
 * 使用者登出
 */
export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * 取得當前登入使用者
 */
export const getCurrentUser = (): CurrentUser | null => {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson) as CurrentUser;
  } catch {
    return null;
  }
};

/**
 * 更新個人資料
 */
export const updateProfile = (userId: string, data: UpdateProfileFormData): CurrentUser => {
  // 1. 更新 USERS 中的會員資料
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as StoredUser[];
  const userIndex = users.findIndex((u: StoredUser) => u.id === userId);

  if (userIndex === -1) {
    throw new Error('使用者不存在');
  }

  users[userIndex] = {
    ...users[userIndex],
    name: data.name,
    phone: data.phone,
  };

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // 2. 更新 CURRENT_USER
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.id === userId) {
    const updatedCurrentUser: CurrentUser = {
      ...currentUser,
      name: data.name,
      phone: data.phone,
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedCurrentUser));

    return updatedCurrentUser;
  }

  throw new Error('當前使用者不存在');
};

// ==================== 訂單操作 ====================

/**
 * 儲存的訂單資料結構 (與結帳頁面一致)
 */
interface StoredOrder {
  id: string;
  userId: string;
  orderNumber: string;
  orderDate: string;
  finalTotal: number;
  status: string;
}

/**
 * 取得使用者訂單列表
 */
export const getUserOrders = (userId: string): OrderSummary[] => {
  try {
    const ordersJson = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!ordersJson) {
      return [];
    }

    const allOrders = JSON.parse(ordersJson) as StoredOrder[];
    // 篩選該使用者的訂單
    const userOrders = allOrders.filter(order => order.userId === userId);

    // 轉換為簡化格式並依日期倒序排列
    return userOrders
      .map(
        (order): OrderSummary => ({
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.orderDate,
          total: order.finalTotal,
          status: order.status || '處理中',
        }),
      )
      .sort((a, b) => {
        // 依日期倒序排列 (最新的在前)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error('讀取訂單失敗:', error);
    return [];
  }
};

// ==================== 工具函式 ====================

/**
 * 檢查 Email 是否已註冊
 */
export const isEmailRegistered = (email: string): boolean => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]') as StoredUser[];
  return users.some((u: StoredUser) => u.email === email);
};
