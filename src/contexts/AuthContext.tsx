'use client';

/**
 * 驗證上下文 (Authentication Context)
 * 管理使用者登入狀態與相關操作
 * 使用 Laravel API 進行認證
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CurrentUser, RegisterFormData, LoginFormData } from '@/types/member';
import { apiRegister, apiLogin, apiLogout, apiGetProfile, getToken, removeToken } from '@/lib/api';

// ==================== Context 型別定義 ====================

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ==================== Context 建立 ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== Provider 元件 ====================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化：檢查 Token 並取得使用者資料
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (token) {
        try {
          // 有 Token，嘗試取得使用者資料
          const user = await apiGetProfile();
          setCurrentUser(user);
        } catch {
          // Token 無效，清除
          removeToken();
          setCurrentUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 註冊（呼叫 API）
  const register = useCallback(async (data: RegisterFormData) => {
    const user = await apiRegister(data);
    setCurrentUser(user);
  }, []);

  // 登入（呼叫 API）
  const login = useCallback(async (data: LoginFormData) => {
    const user = await apiLogin(data);
    setCurrentUser(user);
  }, []);

  // 登出（呼叫 API）
  const logout = useCallback(async () => {
    await apiLogout();
    setCurrentUser(null);
  }, []);

  // 重新整理使用者資料（從 API 取得）
  const refreshUser = useCallback(async () => {
    try {
      const user = await apiGetProfile();
      setCurrentUser(user);
    } catch {
      // 取得失敗，清除登入狀態
      removeToken();
      setCurrentUser(null);
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ==================== Custom Hook ====================

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內使用');
  }

  return context;
}
