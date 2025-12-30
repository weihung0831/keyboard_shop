import type { Product } from './product';

// ==================== API 回應型別 ====================

/**
 * 購物車項目中的商品資訊（API 回應格式）
 */
export interface CartProductInfo {
  /** 商品 ID */
  id: number;
  /** 商品名稱 */
  name: string;
  /** 商品 slug */
  slug: string;
  /** 商品 SKU */
  sku: string;
  /** 商品價格 */
  price: number;
  /** 庫存數量 */
  stock: number;
  /** 是否上架 */
  is_active: boolean;
  /** 主圖 URL */
  primary_image: string | null;
}

/**
 * API 購物車項目（來自後端）
 */
export interface ApiCartItem {
  /** 項目 ID */
  id: number;
  /** 商品資訊 */
  product: CartProductInfo | null;
  /** 數量 */
  quantity: number;
  /** 加入時的價格（快照） */
  price: number;
  /** 小計 */
  subtotal: number;
  /** 建立時間 */
  created_at: string;
  /** 更新時間 */
  updated_at: string;
}

/**
 * API 購物車資料（來自後端）
 */
export interface ApiCart {
  /** 購物車 ID */
  id: number;
  /** 購物車項目列表 */
  items: ApiCartItem[];
  /** 總項目數（商品數量加總） */
  total_items: number;
  /** 總金額 */
  total_amount: number;
  /** 建立時間 */
  created_at: string;
  /** 更新時間 */
  updated_at: string;
}

/**
 * 購物車 API 回應
 */
export interface CartApiResponse {
  /** 訊息 */
  message: string;
  /** 購物車資料 */
  data: ApiCart;
}

/**
 * 加入購物車請求資料
 */
export interface AddToCartRequest {
  /** 商品 ID */
  product_id: number;
  /** 數量 */
  quantity: number;
}

/**
 * 更新購物車項目請求資料
 */
export interface UpdateCartItemRequest {
  /** 數量 */
  quantity: number;
}

/**
 * 合併購物車請求資料
 */
export interface MergeCartRequest {
  /** 訪客 Session ID */
  session_id: string;
}

// ==================== 前端 Context 型別 ====================

/**
 * 購物車項目介面（前端使用）
 */
export interface CartItem {
  /** 項目 ID（後端） */
  id?: number;
  /** 商品資訊 */
  product: Product;
  /** 商品數量 */
  quantity: number;
  /** 加入購物車的時間戳記 */
  addedAt: number;
  /** 加入時的價格（快照） */
  price?: number;
  /** 小計 */
  subtotal?: number;
}

/**
 * 購物車狀態介面
 */
export interface CartState {
  /** 購物車 ID（後端） */
  cartId?: number;
  /** 購物車項目列表 */
  items: CartItem[];
  /** 是否開啟購物車側邊欄 */
  isOpen: boolean;
  /** 總項目數量 */
  totalItems: number;
  /** 總價格 */
  totalPrice: number;
  /** 是否正在載入（可選，預設 false） */
  isLoading?: boolean;
  /** 是否已同步（與後端，可選，預設 false） */
  isSynced?: boolean;
}

/**
 * 購物車操作介面（向後相容版本）
 */
export interface CartActions {
  /** 加入商品到購物車 */
  addToCart: (product: Product, quantity?: number) => void | Promise<void>;
  /** 從購物車移除商品 */
  removeFromCart: (productId: number) => void | Promise<void>;
  /** 更新商品數量 */
  updateQuantity: (productId: number, quantity: number) => void | Promise<void>;
  /** 清空購物車 */
  clearCart: () => void | Promise<void>;
  /** 開啟購物車側邊欄 */
  openCart: () => void;
  /** 關閉購物車側邊欄 */
  closeCart: () => void;
  /** 切換購物車側邊欄狀態 */
  toggleCart: () => void;
  /** 同步購物車（從後端，可選） */
  syncCart?: () => Promise<void>;
  /** 合併購物車（登入後呼叫，可選） */
  mergeCart?: (sessionId: string) => Promise<void>;
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

/**
 * 購物車錯誤訊息
 */
export const CART_ERROR_MESSAGES = {
  ADD_FAILED: '加入購物車失敗，請稍後再試',
  UPDATE_FAILED: '更新數量失敗，請稍後再試',
  REMOVE_FAILED: '移除商品失敗，請稍後再試',
  CLEAR_FAILED: '清空購物車失敗，請稍後再試',
  SYNC_FAILED: '同步購物車失敗，請稍後再試',
  MERGE_FAILED: '合併購物車失敗，請稍後再試',
  OUT_OF_STOCK: '商品庫存不足',
  PRODUCT_INACTIVE: '商品已下架',
} as const;

/**
 * 購物車 Session ID 儲存鍵
 */
export const CART_SESSION_KEY = 'keyboard_shop_cart_session';
