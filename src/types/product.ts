/**
 * 產品分類型別
 */
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

/**
 * 產品圖片型別
 */
export interface ProductImage {
  id: number;
  product_id?: number;
  url: string;
  image_url?: string; // 相容舊格式
  is_primary: boolean;
  sort_order: number;
}

/**
 * 產品型別（API 回應格式）
 */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string | null;
  sku: string;
  specifications: Record<string, string> | null;
  price: number;
  original_price: number | null;
  stock: number;
  is_active: boolean;
  category: ProductCategory;
  images: ProductImage[];
  primary_image: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 產品卡片 Props（前端元件使用）
 */
export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

/**
 * API 分頁資訊
 */
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * 產品列表 API 回應
 */
export interface ProductsApiResponse {
  message: string;
  data: Product[];
  meta: PaginationMeta;
}

/**
 * 分類列表 API 回應
 */
export interface CategoriesApiResponse {
  message: string;
  data: ProductCategory[];
}

/**
 * 產品列表查詢參數
 */
export interface ProductsQueryParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  search?: string;
  keyword?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'price_asc' | 'price_desc' | 'created_at_asc' | 'created_at_desc';
}

/**
 * 搜尋建議項目
 */
export interface SearchSuggestion {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  price: number;
}

/**
 * 搜尋建議 API 回應
 */
export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}
