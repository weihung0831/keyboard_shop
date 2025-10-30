'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 願望清單項目介面
 */
export interface WishlistItem {
  product: Product;
  addedAt: number;
}

/**
 * 願望清單狀態介面
 */
export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

/**
 * 願望清單通知介面
 */
export interface WishlistNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
}

/**
 * 願望清單操作介面
 */
export interface WishlistActions {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  addNotification: (notification: Omit<WishlistNotification, 'id'>) => void;
  removeNotification: (notificationId: string) => void;
}

/**
 * 擴展的願望清單狀態介面，包含通知系統
 */
interface ExtendedWishlistState extends WishlistState {
  notifications: WishlistNotification[];
}

/**
 * 願望清單操作類型
 */
type WishlistActionType =
  | { type: 'ADD_TO_WISHLIST'; product: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; productId: number }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; items: WishlistItem[] }
  | { type: 'ADD_NOTIFICATION'; notification: Omit<WishlistNotification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; notificationId: string };

type WishlistContextType = ExtendedWishlistState & WishlistActions;

/**
 * 願望清單狀態reducer
 */
const wishlistReducer = (
  state: ExtendedWishlistState,
  action: WishlistActionType,
): ExtendedWishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      // 檢查商品是否已在願望清單中
      const existingItem = state.items.find(item => item.product.id === action.product.id);

      if (existingItem) {
        // 商品已存在，不重複添加
        return state;
      }

      const newItem: WishlistItem = {
        product: action.product,
        addedAt: Date.now(),
      };

      const newItems = [...state.items, newItem];

      return {
        ...state,
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);

      return {
        ...state,
        items: newItems,
        totalItems: newItems.length,
      };
    }

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
        totalItems: 0,
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.items,
        totalItems: action.items.length,
      };

    case 'ADD_NOTIFICATION': {
      const notification = {
        ...action.notification,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      return {
        ...state,
        notifications: [...state.notifications, notification],
      };
    }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.notificationId),
      };

    default:
      return state;
  }
};

/**
 * 初始願望清單狀態
 */
const initialState: ExtendedWishlistState = {
  items: [],
  totalItems: 0,
  notifications: [],
};

/**
 * 願望清單Context
 */
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/**
 * 本地儲存鍵名
 */
const WISHLIST_STORAGE_KEY = 'axis-keys-wishlist';

/**
 * 願望清單Context Provider
 */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const auth = useAuth();

  // 從本地儲存載入願望清單資料（基於用戶 ID）
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.currentUser) {
      // 未登入時清空願望清單
      dispatch({ type: 'CLEAR_WISHLIST' });
      return;
    }

    try {
      const storageKey = `${WISHLIST_STORAGE_KEY}-${auth.currentUser.id}`;
      const savedWishlist = localStorage.getItem(storageKey);
      if (savedWishlist) {
        const parsedWishlist: WishlistItem[] = JSON.parse(savedWishlist);
        // 驗證資料結構的完整性
        const validItems = parsedWishlist.filter(item => item.product && item.addedAt);
        dispatch({ type: 'LOAD_WISHLIST', items: validItems });
      }
    } catch (error) {
      console.warn('載入願望清單資料時發生錯誤:', error);
      // 清除無效的本地儲存資料
      if (auth.currentUser) {
        const storageKey = `${WISHLIST_STORAGE_KEY}-${auth.currentUser.id}`;
        localStorage.removeItem(storageKey);
      }
    }
  }, [auth.isAuthenticated, auth.currentUser]);

  // 願望清單資料變更時保存到本地儲存（基於用戶 ID）
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.currentUser) {
      return;
    }

    try {
      const storageKey = `${WISHLIST_STORAGE_KEY}-${auth.currentUser.id}`;
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    } catch (error) {
      console.warn('保存願望清單資料時發生錯誤:', error);
    }
  }, [state.items, auth.isAuthenticated, auth.currentUser]);

  // 自動移除通知
  useEffect(() => {
    const timers = state.notifications
      .filter(notification => notification.duration && notification.duration > 0)
      .map(notification =>
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', notificationId: notification.id });
        }, notification.duration),
      );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [state.notifications]);

  /**
   * 願望清單操作方法
   */
  const actions: WishlistActions = {
    addToWishlist: (product: Product) => {
      // 檢查是否已登入
      if (!auth.isAuthenticated) {
        actions.addNotification({
          type: 'warning',
          title: '請先登入',
          message: '您需要登入才能使用願望清單功能',
          duration: 4000,
          closable: true,
        });
        return;
      }

      // 檢查是否已在願望清單中
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        actions.addNotification({
          type: 'info',
          title: '已在願望清單中',
          message: `${product.name} 已經在您的願望清單中了`,
          duration: 3000,
          closable: true,
        });
        return;
      }

      dispatch({ type: 'ADD_TO_WISHLIST', product });

      // 顯示成功通知
      actions.addNotification({
        type: 'success',
        title: '已加入願望清單',
        message: product.name,
        duration: 3000,
        closable: true,
      });
    },

    removeFromWishlist: (productId: number) => {
      const item = state.items.find(item => item.product.id === productId);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', productId });

      if (item) {
        actions.addNotification({
          type: 'info',
          title: '已從願望清單移除',
          message: item.product.name,
          duration: 3000,
          closable: true,
        });
      }
    },

    clearWishlist: () => {
      if (state.items.length > 0) {
        dispatch({ type: 'CLEAR_WISHLIST' });
        actions.addNotification({
          type: 'info',
          title: '願望清單已清空',
          duration: 2000,
          closable: true,
        });
      }
    },

    isInWishlist: (productId: number) => {
      return state.items.some(item => item.product.id === productId);
    },

    addNotification: (notification: Omit<WishlistNotification, 'id'>) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: {
          duration: 3000,
          closable: true,
          ...notification,
        },
      });
    },

    removeNotification: (notificationId: string) => {
      dispatch({ type: 'REMOVE_NOTIFICATION', notificationId });
    },
  };

  const contextValue: WishlistContextType = {
    ...state,
    ...actions,
  };

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>;
}

/**
 * 使用願望清單Context的Hook
 */
export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist必須在WishlistProvider內使用');
  }
  return context;
}
