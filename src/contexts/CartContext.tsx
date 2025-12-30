'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { Product } from '@/types/product';
import type { CartState, CartActions, CartItem, CartNotification, ApiCart } from '@/types/cart';
import {
  apiGetCart,
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  apiMergeCart,
  clearSessionId,
} from '@/lib/api';

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
  | { type: 'SYNC_FROM_API'; cart: ApiCart }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_SYNCED'; isSynced: boolean }
  | { type: 'ADD_NOTIFICATION'; notification: Omit<CartNotification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; notificationId: string };

/**
 * 擴展的購物車狀態介面，包含通知系統
 */
interface ExtendedCartState extends CartState {
  notifications: CartNotification[];
  isLoading: boolean;
  isSynced: boolean;
}

/**
 * 擴展的購物車操作介面，包含通知系統和 API 操作
 */
interface ExtendedCartActions extends CartActions {
  addNotification: (notification: Omit<CartNotification, 'id'>) => void;
  removeNotification: (notificationId: string) => void;
  syncCart: () => Promise<void>;
  mergeCart: (sessionId: string) => Promise<void>;
}

type ExtendedCartContextType = ExtendedCartState & ExtendedCartActions;

/**
 * 計算購物車統計資料
 */
const calculateCartStats = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0,
  );
  return { totalItems, totalPrice };
};

/**
 * 將 API 購物車資料轉換為前端格式
 */
const transformApiCartToItems = (cart: ApiCart): CartItem[] => {
  return cart.items
    .filter(item => item.product !== null)
    .map(item => ({
      id: item.id,
      product: {
        id: item.product!.id,
        name: item.product!.name,
        slug: item.product!.slug,
        description: '',
        content: null,
        sku: item.product!.sku,
        specifications: null,
        price: item.product!.price,
        original_price: null,
        stock: item.product!.stock,
        is_active: item.product!.is_active,
        category: {
          id: 0,
          name: '',
          slug: '',
          description: null,
          is_active: true,
          sort_order: 0,
          created_at: '',
          updated_at: '',
        },
        images: [],
        primary_image: item.product!.primary_image,
        created_at: '',
        updated_at: '',
      },
      quantity: item.quantity,
      addedAt: new Date(item.created_at).getTime(),
      price: item.price,
      subtotal: item.subtotal,
    }));
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
          price: action.product.price,
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
        cartId: undefined,
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

    case 'SYNC_FROM_API': {
      const items = transformApiCartToItems(action.cart);
      return {
        ...state,
        cartId: action.cart.id,
        items,
        totalItems: action.cart.total_items,
        totalPrice: action.cart.total_amount,
        isSynced: true,
        isLoading: false,
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'SET_SYNCED':
      return {
        ...state,
        isSynced: action.isSynced,
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
 * 初始購物車狀態
 */
const initialState: ExtendedCartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
  notifications: [],
  isLoading: false,
  isSynced: false,
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

  /**
   * 從 API 同步購物車
   */
  const syncCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      const cart = await apiGetCart();
      dispatch({ type: 'SYNC_FROM_API', cart });
    } catch (error) {
      console.warn('同步購物車失敗:', error);
      dispatch({ type: 'SET_LOADING', isLoading: false });
      // 失敗時使用本地儲存的資料
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart: CartItem[] = JSON.parse(savedCart);
          const validItems = parsedCart.filter(
            item => item.product && typeof item.quantity === 'number' && item.quantity > 0,
          );
          dispatch({ type: 'LOAD_CART', items: validItems });
        }
      } catch (localError) {
        console.warn('載入本地購物車資料失敗:', localError);
      }
    }
  }, []);

  /**
   * 合併購物車（登入後呼叫）
   */
  const mergeCart = useCallback(
    async (sessionId: string) => {
      try {
        dispatch({ type: 'SET_LOADING', isLoading: true });
        const cart = await apiMergeCart(sessionId);
        dispatch({ type: 'SYNC_FROM_API', cart });
        // 合併後清除 Session ID
        clearSessionId();
      } catch (error) {
        console.warn('合併購物車失敗:', error);
        dispatch({ type: 'SET_LOADING', isLoading: false });
        // 合併失敗時，重新同步
        await syncCart();
      }
    },
    [syncCart],
  );

  // 初始化時同步購物車
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // 購物車資料變更時保存到本地儲存（作為備份）
  useEffect(() => {
    if (state.items.length > 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch (error) {
        console.warn('保存購物車資料時發生錯誤:', error);
      }
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
   * 加入通知
   */
  const addNotification = useCallback((notification: Omit<CartNotification, 'id'>) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      notification: {
        duration: 3000,
        closable: true,
        ...notification,
      },
    });
  }, []);

  /**
   * 移除通知
   */
  const removeNotification = useCallback((notificationId: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', notificationId });
  }, []);

  /**
   * 加入購物車
   */
  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      // 檢查商品是否有庫存
      if (product.stock <= 0) {
        addNotification({
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
        addNotification({
          type: 'error',
          title: '數量錯誤',
          message: '商品數量必須大於0',
          duration: 3000,
          closable: true,
        });
        return;
      }

      try {
        dispatch({ type: 'SET_LOADING', isLoading: true });
        const cart = await apiAddToCart({ product_id: product.id, quantity });
        dispatch({ type: 'SYNC_FROM_API', cart });

        addNotification({
          type: 'success',
          title: '已加入購物車',
          message: `${product.name} × ${quantity}`,
          duration: 3000,
          closable: true,
        });
      } catch (error) {
        console.error('加入購物車失敗:', error);
        dispatch({ type: 'SET_LOADING', isLoading: false });

        // API 失敗時，使用本地更新
        dispatch({ type: 'ADD_TO_CART', product, quantity });
        dispatch({ type: 'SET_SYNCED', isSynced: false });

        addNotification({
          type: 'warning',
          title: '已加入購物車（離線模式）',
          message: `${product.name} × ${quantity}`,
          duration: 3000,
          closable: true,
        });
      }
    },
    [addNotification],
  );

  /**
   * 從購物車移除商品
   */
  const removeFromCart = useCallback(
    async (productId: number) => {
      const item = state.items.find(item => item.product.id === productId);
      if (!item) return;

      try {
        dispatch({ type: 'SET_LOADING', isLoading: true });

        if (item.id) {
          const cart = await apiRemoveCartItem(item.id);
          dispatch({ type: 'SYNC_FROM_API', cart });
        } else {
          dispatch({ type: 'REMOVE_FROM_CART', productId });
          dispatch({ type: 'SET_LOADING', isLoading: false });
        }

        addNotification({
          type: 'info',
          title: '已從購物車移除',
          message: item.product.name,
          duration: 3000,
          closable: true,
        });
      } catch (error) {
        console.error('移除購物車項目失敗:', error);
        dispatch({ type: 'SET_LOADING', isLoading: false });

        // API 失敗時，使用本地更新
        dispatch({ type: 'REMOVE_FROM_CART', productId });
        dispatch({ type: 'SET_SYNCED', isSynced: false });

        addNotification({
          type: 'info',
          title: '已從購物車移除',
          message: item.product.name,
          duration: 3000,
          closable: true,
        });
      }
    },
    [state.items, addNotification],
  );

  /**
   * 更新商品數量
   */
  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const item = state.items.find(item => item.product.id === productId);
      if (!item) return;

      try {
        dispatch({ type: 'SET_LOADING', isLoading: true });

        if (item.id) {
          const cart = await apiUpdateCartItem(item.id, { quantity });
          dispatch({ type: 'SYNC_FROM_API', cart });
        } else {
          dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
          dispatch({ type: 'SET_LOADING', isLoading: false });
        }
      } catch (error) {
        console.error('更新購物車項目數量失敗:', error);
        dispatch({ type: 'SET_LOADING', isLoading: false });

        // API 失敗時，使用本地更新
        dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
        dispatch({ type: 'SET_SYNCED', isSynced: false });
      }
    },
    [state.items, removeFromCart],
  );

  /**
   * 清空購物車
   */
  const clearCart = useCallback(async () => {
    if (state.items.length === 0) return;

    try {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      await apiClearCart();
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_LOADING', isLoading: false });
      dispatch({ type: 'SET_SYNCED', isSynced: true });

      // 清除本地儲存
      localStorage.removeItem(CART_STORAGE_KEY);

      addNotification({
        type: 'info',
        title: '購物車已清空',
        duration: 2000,
        closable: true,
      });
    } catch (error) {
      console.error('清空購物車失敗:', error);
      dispatch({ type: 'SET_LOADING', isLoading: false });

      // API 失敗時，使用本地更新
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_SYNCED', isSynced: false });
      localStorage.removeItem(CART_STORAGE_KEY);

      addNotification({
        type: 'info',
        title: '購物車已清空',
        duration: 2000,
        closable: true,
      });
    }
  }, [state.items.length, addNotification]);

  /**
   * 開啟購物車側邊欄
   */
  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  /**
   * 關閉購物車側邊欄
   */
  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  /**
   * 切換購物車側邊欄狀態
   */
  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  /**
   * Context 值
   */
  const contextValue: ExtendedCartContextType = useMemo(
    () => ({
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      syncCart,
      mergeCart,
      addNotification,
      removeNotification,
    }),
    [
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      syncCart,
      mergeCart,
      addNotification,
      removeNotification,
    ],
  );

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
