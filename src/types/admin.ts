/**
 * 後台管理系統型別定義
 */

import type { PaginationMeta } from './product';
import type { OrderStatus, OrderItem, OrderTimelineEvent } from './order';

// ==================== 使用者角色 ====================

export type UserRole = 'user' | 'admin' | 'super_admin';

export const isAdminRole = (role?: UserRole): boolean => role === 'admin' || role === 'super_admin';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: '一般會員',
  admin: '管理員',
  super_admin: '超級管理員',
};

export const USER_ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  user: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
  admin: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  super_admin: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
};

// ==================== Dashboard ====================

export interface DashboardStats {
  revenue: {
    total: number;
    trend_percentage: number | null;
    period_label: string;
  };
  orders: {
    total: number;
    trend_percentage: number | null;
    pending_count: number;
    processing_count: number;
  };
  members: {
    total: number;
    new_count: number;
    trend_percentage: number | null;
  };
  top_products: {
    product_id: number;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }[];
}

export type DashboardPeriod = 'today' | '7d' | '30d' | 'all';

// ==================== Admin Product ====================

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  content: string | null;
  sku: string;
  price: number;
  original_price: number | null;
  stock: number;
  is_active: boolean;
  sort_order: number;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  specifications: {
    id: number;
    spec_name: string;
    spec_value: string;
    sort_order: number;
  }[];
  images: {
    id: number;
    url: string;
    image_url?: string;
    is_primary: boolean;
    sort_order: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface AdminProductFormData {
  name: string;
  category_id: number;
  sku: string;
  price: number;
  original_price?: number | null;
  stock: number;
  slug?: string;
  description?: string;
  content?: string;
  is_active?: boolean;
  sort_order?: number;
  specifications?: { spec_name: string; spec_value: string }[];
}

export interface BatchToggleRequest {
  product_ids: number[];
  is_active: boolean;
}

// ==================== Admin Order ====================

export interface AdminOrder {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_label: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_address: string;
  shipping_method: string;
  notes: string | null;
  user: { id: number; name: string; email: string } | null;
  items?: OrderItem[];
  items_count: number;
  payment: { id: number; status: string; method: string } | null;
  timeline?: OrderTimelineEvent[];
  paid_at: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrdersQueryParams {
  page?: number;
  per_page?: number;
  status?: OrderStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
}

// ==================== Admin User ====================

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  email_verified_at: string | null;
  orders_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUserDetail extends AdminUser {
  recent_orders: AdminOrder[];
  order_stats: {
    total_count: number;
    total_spent: number;
    by_status: Record<string, number>;
  };
}

export interface AdminUsersQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: UserRole;
}

// ==================== Admin Category ====================

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

// ==================== Contact Messages ====================

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== System Settings ====================

export interface SystemSetting {
  id: number;
  key: string;
  value: string | number | boolean;
  group: string;
  description: string | null;
  updated_at: string;
}

// ==================== API Responses ====================

export interface AdminListResponse<T> {
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface AdminSingleResponse<T> {
  message: string;
  data: T;
}
