/**
 * API 服務層
 * 使用 axios 與後端 Laravel API 進行通訊
 */

import type { AxiosError } from 'axios';
import axios from 'axios';
import type {
  RegisterFormData,
  LoginFormData,
  UpdateProfileFormData,
  ChangePasswordFormData,
  CurrentUser,
} from '@/types/member';
import type {
  Product,
  ProductCategory,
  ProductsApiResponse,
  CategoriesApiResponse,
  ProductsQueryParams,
  SearchSuggestion,
  SearchSuggestionsResponse,
} from '@/types/product';

// ==================== API 設定 ====================

// API 基礎路徑（預設使用線上 API）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://keyboard-shop-api.zeabur.app/api/v1';

// Token 儲存 key
const TOKEN_KEY = 'keyboard_shop_token';

// ==================== Token 管理 ====================

/**
 * 儲存 Token
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * 取得 Token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 移除 Token
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// ==================== API 錯誤處理 ====================

/**
 * API 錯誤類別
 */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// ==================== Axios 實例 ====================

/**
 * 建立 axios 實例
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor: 自動附加 Token
 */
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

/**
 * Response interceptor: 統一錯誤處理
 */
api.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message: string; errors?: Record<string, string[]> }>) => {
    const message = error.response?.data?.message || '發生錯誤，請稍後再試';
    const status = error.response?.status || 500;
    const errors = error.response?.data?.errors;

    return Promise.reject(new ApiError(message, status, errors));
  },
);

// ==================== 認證 API ====================

/**
 * API 回應格式：認證成功
 */
interface AuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
    phone: string | null;
    address: string | null;
    created_at: string;
  };
}

/**
 * 轉換 API 使用者資料為前端格式
 */
const transformUser = (user: AuthResponse['user']): CurrentUser => ({
  id: String(user.id),
  email: user.email,
  name: user.name,
  phone: user.phone || '',
  address: user.address || '',
  loginAt: new Date().toISOString(),
});

/**
 * 會員註冊
 */
export const apiRegister = async (data: RegisterFormData): Promise<CurrentUser> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
    name: data.name,
    phone: data.phone,
    address: data.address || '',
  });

  // 儲存 Token
  setToken(response.data.token);

  // 回傳使用者資料
  return transformUser(response.data.user);
};

/**
 * 會員登入
 */
export const apiLogin = async (data: LoginFormData): Promise<CurrentUser> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    email: data.email,
    password: data.password,
  });

  // 儲存 Token
  setToken(response.data.token);

  // 回傳使用者資料
  return transformUser(response.data.user);
};

/**
 * 會員登出
 */
export const apiLogout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    // 無論成功或失敗，都移除 Token
    removeToken();
  }
};

/**
 * 取得個人資料
 */
export const apiGetProfile = async (): Promise<CurrentUser> => {
  const response = await api.get<{
    message: string;
    data: AuthResponse['user'];
  }>('/user/profile');

  return transformUser(response.data.data);
};

/**
 * 更新個人資料
 */
export const apiUpdateProfile = async (data: UpdateProfileFormData): Promise<CurrentUser> => {
  const response = await api.put<{
    message: string;
    data: AuthResponse['user'];
  }>('/user/profile', {
    name: data.name,
    phone: data.phone,
    address: data.address || '',
  });

  return transformUser(response.data.data);
};

/**
 * 修改密碼
 */
export const apiChangePassword = async (data: ChangePasswordFormData): Promise<void> => {
  await api.put('/user/change-password', {
    current_password: data.currentPassword,
    new_password: data.newPassword,
    new_password_confirmation: data.confirmNewPassword,
  });
};

// ==================== 商品 API ====================

/**
 * 取得商品列表
 */
export const apiGetProducts = async (
  params?: ProductsQueryParams,
): Promise<ProductsApiResponse> => {
  const response = await api.get<ProductsApiResponse>('/products', { params });
  return response.data;
};

/**
 * 取得單一商品詳情
 */
export const apiGetProduct = async (idOrSlug: string | number): Promise<Product> => {
  const response = await api.get<{ message: string; data: Product }>(`/products/${idOrSlug}`);
  return response.data.data;
};

/**
 * 取得搜尋建議
 */
export const apiGetSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  if (query.length < 2) {
    return [];
  }
  const response = await api.get<SearchSuggestionsResponse>('/products/search/suggestions', {
    params: { q: query },
  });
  return response.data.suggestions;
};

// ==================== 分類 API ====================

/**
 * 取得分類列表
 */
export const apiGetCategories = async (): Promise<ProductCategory[]> => {
  const response = await api.get<CategoriesApiResponse>('/categories');
  return response.data.data;
};

/**
 * 取得單一分類詳情
 */
export const apiGetCategory = async (idOrSlug: string | number): Promise<ProductCategory> => {
  const response = await api.get<{ message: string; data: ProductCategory }>(
    `/categories/${idOrSlug}`,
  );
  return response.data.data;
};

export default api;
