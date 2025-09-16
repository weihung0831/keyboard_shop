import type { Product } from './product';

/**
 * 購物車項目介面
 */
export interface CartItem {
  /** 商品資訊 */
  product: Product;
  /** 商品數量 */
  quantity: number;
  /** 加入購物車的時間戳記 */
  addedAt: number;
}

/**
 * 購物車狀態介面
 */
export interface CartState {
  /** 購物車項目列表 */
  items: CartItem[];
  /** 是否開啟購物車側邊欄 */
  isOpen: boolean;
  /** 總項目數量 */
  totalItems: number;
  /** 總價格 */
  totalPrice: number;
}

/**
 * 購物車操作介面
 */
export interface CartActions {
  /** 加入商品到購物車 */
  addToCart: (product: Product, quantity?: number) => void;
  /** 從購物車移除商品 */
  removeFromCart: (productId: number) => void;
  /** 更新商品數量 */
  updateQuantity: (productId: number, quantity: number) => void;
  /** 清空購物車 */
  clearCart: () => void;
  /** 開啟購物車側邊欄 */
  openCart: () => void;
  /** 關閉購物車側邊欄 */
  closeCart: () => void;
  /** 切換購物車側邊欄狀態 */
  toggleCart: () => void;
}

/**
 * 購物車Context的完整介面
 */
export interface CartContextType extends CartState, CartActions {}

/**
 * 購物車通知類型
 */
export interface CartNotification {
  /** 通知ID */
  id: string;
  /** 通知類型 */
  type: 'success' | 'info' | 'warning' | 'error';
  /** 通知標題 */
  title: string;
  /** 通知訊息 */
  message?: string;
  /** 顯示時長 (毫秒) */
  duration?: number;
  /** 是否可手動關閉 */
  closable?: boolean;
}
