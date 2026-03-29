/**
 * 後台管理 API 服務層
 * 所有 Admin API 請求都透過此模組
 */

import api from './api';
import type {
  DashboardStats,
  DashboardPeriod,
  AdminProduct,
  AdminProductFormData,
  BatchToggleRequest,
  AdminOrder,
  AdminOrdersQueryParams,
  AdminUser,
  AdminUserDetail,
  AdminUsersQueryParams,
  AdminCategory,
  AdminCategoryFormData,
  ContactMessage,
  SystemSetting,
  AdminListResponse,
  AdminSingleResponse,
  UserRole,
} from '@/types/admin';
import type { OrderStatus } from '@/types/order';

// ==================== Dashboard API ====================

export const adminGetDashboardStats = async (
  period: DashboardPeriod = '30d',
): Promise<DashboardStats> => {
  const response = await api.get<AdminSingleResponse<DashboardStats>>('/admin/dashboard/stats', {
    params: { period },
  });
  return response.data.data;
};

// ==================== Product API ====================

export const adminGetProducts = async (
  params?: Record<string, unknown>,
): Promise<AdminListResponse<AdminProduct>> => {
  const response = await api.get<AdminListResponse<AdminProduct>>('/admin/products', { params });
  return response.data;
};

export const adminGetProduct = async (id: number): Promise<AdminProduct> => {
  const response = await api.get<AdminSingleResponse<AdminProduct>>(`/admin/products/${id}`);
  return response.data.data;
};

export const adminCreateProduct = async (data: AdminProductFormData): Promise<AdminProduct> => {
  const response = await api.post<AdminSingleResponse<AdminProduct>>('/admin/products', data);
  return response.data.data;
};

export const adminUpdateProduct = async (
  id: number,
  data: AdminProductFormData,
): Promise<AdminProduct> => {
  const response = await api.put<AdminSingleResponse<AdminProduct>>(`/admin/products/${id}`, data);
  return response.data.data;
};

export const adminDeleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/admin/products/${id}`);
};

export const adminBatchToggleProducts = async (data: BatchToggleRequest): Promise<void> => {
  await api.post('/admin/products/batch-toggle', data);
};

export const adminGetLowStockProducts = async (
  threshold = 10,
): Promise<AdminListResponse<AdminProduct>> => {
  const response = await api.get<AdminListResponse<AdminProduct>>('/admin/products/low-stock', {
    params: { threshold },
  });
  return response.data;
};

// ==================== Product Images API ====================

export const adminUploadProductImages = async (productId: number, files: File[]): Promise<void> => {
  const formData = new FormData();
  files.forEach(file => formData.append('images[]', file));
  await api.post(`/admin/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const adminDeleteProductImage = async (
  productId: number,
  imageId: number,
): Promise<void> => {
  await api.delete(`/admin/products/${productId}/images/${imageId}`);
};

// ==================== Product Specifications API ====================

export const adminGetProductSpecs = async (
  productId: number,
): Promise<{ id: number; spec_name: string; spec_value: string; sort_order: number }[]> => {
  const response = await api.get<
    AdminSingleResponse<{ id: number; spec_name: string; spec_value: string; sort_order: number }[]>
  >(`/admin/products/${productId}/specs`);
  return response.data.data;
};

export const adminCreateProductSpec = async (
  productId: number,
  data: { spec_name: string; spec_value: string; sort_order?: number },
): Promise<void> => {
  await api.post(`/admin/products/${productId}/specs`, data);
};

export const adminUpdateProductSpec = async (
  productId: number,
  specId: number,
  data: { spec_name: string; spec_value: string; sort_order?: number },
): Promise<void> => {
  await api.put(`/admin/products/${productId}/specs/${specId}`, data);
};

export const adminDeleteProductSpec = async (productId: number, specId: number): Promise<void> => {
  await api.delete(`/admin/products/${productId}/specs/${specId}`);
};

// ==================== Order API ====================

export const adminGetOrders = async (
  params?: AdminOrdersQueryParams,
): Promise<AdminListResponse<AdminOrder>> => {
  const response = await api.get<AdminListResponse<AdminOrder>>('/admin/orders', { params });
  return response.data;
};

export const adminGetOrder = async (id: number): Promise<AdminOrder> => {
  const response = await api.get<AdminSingleResponse<AdminOrder>>(`/admin/orders/${id}`);
  return response.data.data;
};

export const adminUpdateOrderStatus = async (
  id: number,
  status: OrderStatus,
): Promise<AdminOrder> => {
  const response = await api.patch<AdminSingleResponse<AdminOrder>>(`/admin/orders/${id}/status`, {
    status,
  });
  return response.data.data;
};

// ==================== User API ====================

export const adminGetUsers = async (
  params?: AdminUsersQueryParams,
): Promise<AdminListResponse<AdminUser>> => {
  const response = await api.get<AdminListResponse<AdminUser>>('/admin/users', { params });
  return response.data;
};

export const adminGetUser = async (id: number): Promise<AdminUserDetail> => {
  const response = await api.get<AdminSingleResponse<AdminUserDetail>>(`/admin/users/${id}`);
  return response.data.data;
};

export const adminUpdateUserRole = async (id: number, role: UserRole): Promise<void> => {
  await api.patch(`/admin/users/${id}/role`, { role });
};

export const adminDeleteUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

// ==================== Category API ====================

export const adminGetCategories = async (
  params?: Record<string, unknown>,
): Promise<AdminListResponse<AdminCategory>> => {
  const response = await api.get<AdminListResponse<AdminCategory>>('/admin/categories', {
    params,
  });
  return response.data;
};

export const adminCreateCategory = async (data: AdminCategoryFormData): Promise<AdminCategory> => {
  const response = await api.post<AdminSingleResponse<AdminCategory>>('/admin/categories', data);
  return response.data.data;
};

export const adminUpdateCategory = async (
  id: number,
  data: AdminCategoryFormData,
): Promise<AdminCategory> => {
  const response = await api.put<AdminSingleResponse<AdminCategory>>(
    `/admin/categories/${id}`,
    data,
  );
  return response.data.data;
};

export const adminDeleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};

// ==================== Contact Messages API ====================

export const adminGetMessages = async (
  params?: Record<string, unknown>,
): Promise<AdminListResponse<ContactMessage>> => {
  const response = await api.get<AdminListResponse<ContactMessage>>('/admin/messages', { params });
  return response.data;
};

export const adminGetMessage = async (id: number): Promise<ContactMessage> => {
  const response = await api.get<AdminSingleResponse<ContactMessage>>(`/admin/messages/${id}`);
  return response.data.data;
};

export const adminDeleteMessage = async (id: number): Promise<void> => {
  await api.delete(`/admin/messages/${id}`);
};

// ==================== Settings API ====================

export const adminGetSettings = async (group?: string): Promise<SystemSetting[]> => {
  const response = await api.get<AdminSingleResponse<SystemSetting[]>>('/admin/settings', {
    params: group ? { group } : undefined,
  });
  return response.data.data;
};

export const adminUpdateSetting = async (
  key: string,
  value: string | number | boolean,
): Promise<void> => {
  await api.put('/admin/settings', { key, value });
};

export const adminBatchUpdateSettings = async (
  settings: { key: string; value: string | number | boolean }[],
): Promise<void> => {
  await api.put('/admin/settings/batch', { settings });
};
