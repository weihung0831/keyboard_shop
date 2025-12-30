import type { PaginationMeta } from './product';

// ==================== 訂單狀態 ====================

/**
 * 訂單狀態
 */
export type OrderStatus =
  | 'pending' // 待付款
  | 'processing' // 處理中
  | 'shipped' // 已出貨
  | 'completed' // 已完成
  | 'cancelled'; // 已取消

/**
 * 訂單狀態標籤對應
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '待付款',
  processing: '處理中',
  shipped: '已出貨',
  completed: '已完成',
  cancelled: '已取消',
};

/**
 * 訂單狀態顏色對應（用於 UI 顯示）
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'yellow',
  processing: 'blue',
  shipped: 'indigo',
  completed: 'green',
  cancelled: 'red',
};

// ==================== 配送方式 ====================

/**
 * 配送方式
 */
export type ShippingMethod = 'standard' | 'express' | 'store_pickup';

/**
 * 配送方式標籤對應
 */
export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  standard: '標準配送',
  express: '快速配送',
  store_pickup: '門市取貨',
};

/**
 * 配送方式運費對應
 */
export const SHIPPING_METHOD_FEES: Record<ShippingMethod, number> = {
  standard: 60,
  express: 150,
  store_pickup: 0,
};

// ==================== 訂單項目 ====================

/**
 * 訂單項目（API 回應格式）
 */
export interface OrderItem {
  /** 項目 ID */
  id: number;
  /** 商品 ID */
  product_id: number;
  /** 商品名稱（快照） */
  product_name: string;
  /** 商品 SKU（快照） */
  product_sku: string;
  /** 數量 */
  quantity: number;
  /** 單價（快照） */
  price: number;
  /** 小計 */
  subtotal: number;
}

// ==================== 訂單 ====================

/**
 * 訂單時間軸事件
 */
export interface OrderTimelineEvent {
  /** 事件狀態 */
  status: OrderStatus;
  /** 事件標籤 */
  label: string;
  /** 事件時間 */
  time: string | null;
  /** 是否為當前狀態 */
  is_current: boolean;
  /** 是否已完成 */
  is_completed: boolean;
}

/**
 * 訂單資料（API 回應格式）
 */
export interface Order {
  /** 訂單 ID */
  id: number;
  /** 訂單編號 */
  order_number: string;
  /** 訂單狀態 */
  status: OrderStatus;
  /** 訂單狀態標籤 */
  status_label: string;
  /** 訂單項目 */
  items: OrderItem[];
  /** 項目數量（商品種類數） */
  items_count: number;
  /** 商品小計 */
  subtotal: number;
  /** 運費 */
  shipping_fee: number;
  /** 訂單總金額 */
  total_amount: number;
  /** 收件人姓名 */
  shipping_name: string;
  /** 收件人電話 */
  shipping_phone: string;
  /** 收件人 Email */
  shipping_email: string;
  /** 收件人郵遞區號 */
  shipping_postal_code: string;
  /** 收件人縣市 */
  shipping_city: string;
  /** 收件人地址 */
  shipping_address: string;
  /** 配送方式 */
  shipping_method: ShippingMethod;
  /** 備註 */
  notes: string | null;
  /** 建立時間 */
  created_at: string;
  /** 更新時間 */
  updated_at: string;
  /** 付款時間 */
  paid_at: string | null;
  /** 出貨時間 */
  shipped_at: string | null;
  /** 完成時間 */
  completed_at: string | null;
  /** 取消時間 */
  cancelled_at: string | null;
  /** 時間軸（可選） */
  timeline?: OrderTimelineEvent[];
}

// ==================== API 請求/回應型別 ====================

/**
 * 建立訂單請求資料
 */
export interface CreateOrderRequest {
  /** 收件人姓名 */
  shipping_name: string;
  /** 收件人電話 */
  shipping_phone: string;
  /** 收件人 Email */
  shipping_email: string;
  /** 收件人郵遞區號 */
  shipping_postal_code: string;
  /** 收件人縣市 */
  shipping_city: string;
  /** 收件人地址 */
  shipping_address: string;
  /** 配送方式 */
  shipping_method: ShippingMethod;
  /** 備註（選填） */
  notes?: string;
}

/**
 * 訂單列表查詢參數
 */
export interface OrdersQueryParams {
  /** 頁碼 */
  page?: number;
  /** 每頁筆數 */
  per_page?: number;
  /** 訂單狀態篩選 */
  status?: OrderStatus;
  /** 開始日期 */
  start_date?: string;
  /** 結束日期 */
  end_date?: string;
}

/**
 * 訂單統計資料
 */
export interface OrderStats {
  /** 總訂單數 */
  total_orders: number;
  /** 待付款訂單數 */
  pending_orders: number;
  /** 處理中訂單數 */
  processing_orders: number;
  /** 已完成訂單數 */
  completed_orders: number;
  /** 已取消訂單數 */
  cancelled_orders: number;
  /** 總消費金額 */
  total_spent: number;
}

/**
 * 訂單列表 API 回應
 */
export interface OrdersApiResponse {
  /** 訊息 */
  message: string;
  /** 訂單列表 */
  data: Order[];
  /** 分頁資訊 */
  meta: PaginationMeta;
}

/**
 * 單一訂單 API 回應
 */
export interface OrderApiResponse {
  /** 訊息 */
  message: string;
  /** 訂單資料 */
  data: Order;
}

/**
 * 訂單統計 API 回應
 */
export interface OrderStatsApiResponse {
  /** 訊息 */
  message: string;
  /** 統計資料 */
  data: OrderStats;
}

/**
 * 取消訂單 API 回應
 */
export interface CancelOrderApiResponse {
  /** 訊息 */
  message: string;
  /** 訂單資料（部分） */
  data: {
    id: number;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    cancelled_at: string;
  };
}

// ==================== 前端表單型別 ====================

/**
 * 結帳表單資料
 */
export interface CheckoutFormData {
  /** 收件人姓名 */
  name: string;
  /** 收件人電話 */
  phone: string;
  /** 收件人 Email */
  email: string;
  /** 收件人郵遞區號 */
  postalCode: string;
  /** 收件人縣市 */
  city: string;
  /** 收件人地址 */
  address: string;
  /** 配送方式 */
  shippingMethod: ShippingMethod;
  /** 備註 */
  notes: string;
}

/**
 * 結帳表單驗證錯誤
 */
export interface CheckoutFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  postalCode?: string;
  city?: string;
  address?: string;
  shippingMethod?: string;
}

// ==================== 錯誤訊息 ====================

/**
 * 訂單錯誤訊息
 */
export const ORDER_ERROR_MESSAGES = {
  CREATE_FAILED: '建立訂單失敗，請稍後再試',
  FETCH_FAILED: '取得訂單失敗，請稍後再試',
  CANCEL_FAILED: '取消訂單失敗，請稍後再試',
  NOT_FOUND: '訂單不存在',
  CANNOT_CANCEL: '無法取消此訂單',
  CART_EMPTY: '購物車是空的',
  OUT_OF_STOCK: '部分商品庫存不足',
  VALIDATION_FAILED: '請檢查表單填寫是否正確',
} as const;

/**
 * 結帳表單驗證訊息
 */
export const CHECKOUT_VALIDATION_MESSAGES = {
  NAME_REQUIRED: '請輸入收件人姓名',
  NAME_MIN_LENGTH: '姓名至少需要 2 個字元',
  PHONE_REQUIRED: '請輸入收件人電話',
  PHONE_INVALID: '請輸入有效的台灣手機號碼 (例: 0912345678)',
  EMAIL_REQUIRED: '請輸入收件人 Email',
  EMAIL_INVALID: '請輸入有效的 Email 格式',
  POSTAL_CODE_REQUIRED: '請輸入郵遞區號',
  POSTAL_CODE_INVALID: '請輸入 3-5 碼的郵遞區號',
  CITY_REQUIRED: '請選擇縣市',
  ADDRESS_REQUIRED: '請輸入收件地址',
  ADDRESS_MIN_LENGTH: '地址至少需要 5 個字元',
  SHIPPING_METHOD_REQUIRED: '請選擇配送方式',
} as const;

/**
 * 台灣縣市列表
 */
export const TAIWAN_CITIES = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
  '基隆市',
  '新竹市',
  '嘉義市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
] as const;

export type TaiwanCity = (typeof TAIWAN_CITIES)[number];
