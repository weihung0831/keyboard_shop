'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '@/types/product';
import type { CartState, CartActions, CartItem, CartNotification } from '@/types/cart';

/**
 * 購物車操作類型
 */
type CartActionType =
  | { type: 'ADD_TO_CART'; product: Product; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] }
  | { type: 'ADD_NOTIFICATION'; notification: Omit<CartNotification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; notificationId: string };

/**
 * 擴展的購物車狀態介面，包含通知系統
 */
interface ExtendedCartState extends CartState {
  notifications: CartNotification[];
}

/**
 * 擴展的購物車操作介面，包含通知系統
 */
interface ExtendedCartActions extends CartActions {
  addNotification: (notification: Omit<CartNotification, 'id'>) => void;
  removeNotification: (notificationId: string) => void;
}

type ExtendedCartContextType = ExtendedCartState & ExtendedCartActions;

/**
 * 計算購物車統計資料
 */
const calculateCartStats = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

/**
 * 購物車狀態reducer
 */
const cartReducer = (state: ExtendedCartState, action: CartActionType): ExtendedCartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.product.id,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // 商品已存在，更新數量
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.quantity }
            : item,
        );
      } else {
        // 新商品，加入購物車
        const newItem: CartItem = {
          product: action.product,
          quantity: action.quantity,
          addedAt: Date.now(),
        };
        newItems = [...state.items, newItem];
      }

      const { totalItems, totalPrice } = calculateCartStats(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      const { totalItems, totalPrice } = calculateCartStats(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        // 如果數量為0或負數，移除商品
        return cartReducer(state, { type: 'REMOVE_FROM_CART', productId: action.productId });
      }

      const newItems = state.items.map(item =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
      );

      const { totalItems, totalPrice } = calculateCartStats(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'LOAD_CART': {
      const { totalItems, totalPrice } = calculateCartStats(action.items);
      return {
        ...state,
        items: action.items,
        totalItems,
        totalPrice,
      };
    }

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
 * 初始購物車狀態
 */
const initialState: ExtendedCartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
  notifications: [],
};

/**
 * 購物車Context
 */
const CartContext = createContext<ExtendedCartContextType | undefined>(undefined);

/**
 * 本地儲存鍵名
 */
const CART_STORAGE_KEY = 'axis-keys-cart';

/**
 * 購物車Context Provider
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 從本地儲存載入購物車資料
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        // 驗證資料結構的完整性
        const validItems = parsedCart.filter(
          item => item.product && typeof item.quantity === 'number' && item.quantity > 0,
        );
        dispatch({ type: 'LOAD_CART', items: validItems });
      }
    } catch (error) {
      console.warn('載入購物車資料時發生錯誤:', error);
      // 清除無效的本地儲存資料
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // 購物車資料變更時保存到本地儲存
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.warn('保存購物車資料時發生錯誤:', error);
    }
  }, [state.items]);

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
   * 購物車操作方法
   */
  const actions: ExtendedCartActions = {
    addToCart: (product: Product, quantity = 1) => {
      // 檢查商品是否有庫存（使用 stock 欄位判斷）
      const inStock = product.stock > 0;
      if (!inStock) {
        actions.addNotification({
          type: 'warning',
          title: '商品缺貨',
          message: `${product.name} 目前缺貨，無法加入購物車`,
          duration: 4000,
          closable: true,
        });
        return;
      }

      // 檢查數量是否有效
      if (quantity <= 0) {
        actions.addNotification({
          type: 'error',
          title: '數量錯誤',
          message: '商品數量必須大於0',
          duration: 3000,
          closable: true,
        });
        return;
      }

      dispatch({ type: 'ADD_TO_CART', product, quantity });

      // 顯示成功通知
      actions.addNotification({
        type: 'success',
        title: '已加入購物車',
        message: `${product.name} × ${quantity}`,
        duration: 3000,
        closable: true,
      });
    },

    removeFromCart: (productId: number) => {
      const item = state.items.find(item => item.product.id === productId);
      dispatch({ type: 'REMOVE_FROM_CART', productId });

      if (item) {
        actions.addNotification({
          type: 'info',
          title: '已從購物車移除',
          message: item.product.name,
          duration: 3000,
          closable: true,
        });
      }
    },

    updateQuantity: (productId: number, quantity: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    },

    clearCart: () => {
      if (state.items.length > 0) {
        dispatch({ type: 'CLEAR_CART' });
        actions.addNotification({
          type: 'info',
          title: '購物車已清空',
          duration: 2000,
          closable: true,
        });
      }
    },

    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),

    addNotification: (notification: Omit<CartNotification, 'id'>) => {
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

  const contextValue: ExtendedCartContextType = {
    ...state,
    ...actions,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

/**
 * 使用購物車Context的Hook
 */
export function useCart(): ExtendedCartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart必須在CartProvider內使用');
  }
  return context;
}
