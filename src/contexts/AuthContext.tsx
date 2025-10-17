'use client';

/**
 * 驗證上下文 (Authentication Context)
 * 管理使用者登入狀態與相關操作
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CurrentUser, RegisterFormData, LoginFormData } from '@/types/member';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '@/lib/storage';

// ==================== Context 型別定義 ====================

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
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

  // 初始化：從 localStorage 讀取登入狀態
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  // 註冊
  const register = useCallback(async (data: RegisterFormData) => {
    try {
      const user = registerUser(data);
      setCurrentUser(user);
    } catch (error) {
      throw error;
    }
  }, []);

  // 登入
  const login = useCallback(async (data: LoginFormData) => {
    try {
      const user = loginUser(data.email, data.password);
      setCurrentUser(user);
    } catch (error) {
      throw error;
    }
  }, []);

  // 登出
  const logout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
  }, []);

  // 重新整理使用者資料
  const refreshUser = useCallback(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
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
