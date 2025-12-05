# 鍵盤商城開發規範 - 核心指引

> Next.js 前端 + Laravel API 後端 前後端分離架構
>
> **版本:** 3.0 | **最後更新:** 2025-12-03

---

## 🎯 專案概覽

### 基本資訊

- **專案架構:** 前後端分離
- **前端框架:** Next.js 15 + React 19 + TypeScript
- **後端框架:** Laravel 12 API
- **開發語言:** 繁體中文（文檔與註解）、英文（程式碼）

### 技術堆疊

| 類別         | 技術         | 版本 | 目錄   |
| ------------ | ------------ | ---- | ------ |
| **前端框架** | Next.js      | 15   | `/src` |
| **前端語言** | TypeScript   | 5    | `/src` |
| **前端樣式** | Tailwind CSS | 4    | `/src` |
| **後端框架** | Laravel      | 12   | `/api` |
| **PHP 版本** | PHP          | 8.4  | `/api` |
| **資料庫**   | MySQL        | 8    | -      |

### 專案目錄結構

```
keyboard_shop/
├── src/                    # Next.js 前端
│   ├── app/               # App Router 頁面
│   ├── components/        # React 元件
│   ├── contexts/          # React Context
│   ├── hooks/             # 自定義 Hooks
│   ├── lib/               # 工具函式 & API 服務
│   └── types/             # TypeScript 型別定義
├── api/                    # Laravel 後端
│   ├── app/Http/Controllers/
│   ├── app/Services/
│   ├── app/Repositories/
│   └── routes/api.php
└── CLAUDE.md              # 本規範文件
```

---

## 📝 核心原則（必讀）

### 前端開發原則 (Next.js)

#### 程式碼風格

- ✅ 使用 TypeScript 嚴格模式
- ✅ 使用 2 個空格縮排
- ✅ 使用單引號 `'`
- ✅ 語句結尾加分號 `;`
- ✅ 關鍵邏輯附繁體中文註解

#### API 串接規範

- ✅ 使用 axios 進行 API 請求
- ✅ API 服務統一放在 `src/lib/api.ts`
- ✅ 使用環境變數 `NEXT_PUBLIC_API_URL` 設定 API 基礎路徑
- ✅ Token 統一使用 localStorage 儲存
- ✅ 使用 axios interceptor 統一處理 Token 和錯誤
- ✅ API 回應型別必須定義在 `src/types/` 目錄

#### 元件開發規範

- ✅ 優先使用既有共用元件（`src/components/ui/`）
- ✅ Context 放在 `src/contexts/`
- ✅ 自定義 Hooks 放在 `src/hooks/`

---

### 後端開發原則 (Laravel)

#### 安全第一

- ✅ 使用 Eloquent ORM (禁止原生 SQL)
- ✅ 使用 FormRequest 驗證
- ✅ Model 必須定義 `$fillable` 或 `$guarded`

#### 分層架構

- ✅ Controller：只處理 HTTP 請求和回應
- ✅ Service：包含所有商業邏輯
- ✅ Repository：只處理資料庫操作
- ❌ 禁止在 Controller 中直接操作 Model

#### 程式碼品質

- ✅ 每行程式碼附繁體中文註解
- ✅ 使用 try-catch 錯誤處理
- ✅ 使用事務確保資料一致性
- ✅ 使用 4 個空格縮排（禁止 Tab）

---

## 🔍 命名規範速查

### 前端 (Next.js / TypeScript)

```
React 元件         → PascalCase          (ProductCard.tsx)
Hook 函式          → camelCase + use     (useAuth, useCart)
一般函式           → camelCase           (getProductList)
變數/屬性          → camelCase           (productList)
常數              → SCREAMING_SNAKE_CASE (API_BASE_URL)
型別/介面          → PascalCase          (CurrentUser, Product)
檔案名稱           → kebab-case 或 PascalCase (依類型)
```

### 後端 (Laravel / PHP)

```
類別/介面          → PascalCase          (ProductController)
方法/函式          → camelCase           (getProductList)
變數/屬性          → snake_case          ($product_list)
常數              → SCREAMING_SNAKE_CASE (MAX_COUNT)
路由路徑          → kebab-case          (/product-management)
路由參數          → snake_case          ({product_id})
資料表            → snake_case (複數)    (products)
資料欄位          → snake_case          (created_at)
PHP 類別檔案      → PascalCase.php       (ProductController.php)
```

---

## 🔗 API 串接規範

### API 端點

| 功能         | 方法 | 路徑                    | 說明             |
| ------------ | ---- | ----------------------- | ---------------- |
| 會員註冊     | POST | `/api/v1/auth/register` | 註冊新會員       |
| 會員登入     | POST | `/api/v1/auth/login`    | 登入並取得 Token |
| 會員登出     | POST | `/api/v1/auth/logout`   | 登出（需 Token） |
| 取得個人資料 | GET  | `/api/v1/user/profile`  | 需 Token         |
| 更新個人資料 | PUT  | `/api/v1/user/profile`  | 需 Token         |
| 商品列表     | GET  | `/api/v1/products`      | 支援分頁/篩選    |
| 商品詳情     | GET  | `/api/v1/products/{id}` | -                |
| 分類列表     | GET  | `/api/v1/categories`    | -                |

### API 回應格式

```typescript
// 成功回應
{
  message: string;
  data: T;
  meta?: { current_page, total, per_page, last_page };
}

// 錯誤回應
{
  message: string;
  errors?: Record<string, string[]>;
}
```

### 認證方式

- 使用 Bearer Token（Laravel Sanctum）
- Token 存放於 localStorage `keyboard_shop_token`
- 請求 Header：`Authorization: Bearer {token}`

---

## ⚡ 常用範例

### 前端 API 串接範例 (axios)

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: 自動附加 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('keyboard_shop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: 統一錯誤處理
api.interceptors.response.use(
  response => response,
  error => Promise.reject(new ApiError(error.response?.data, error.response?.status)),
);

export const apiLogin = async (data: LoginFormData): Promise<CurrentUser> => {
  const response = await api.post('/auth/login', data);
  setToken(response.data.token);
  return transformUser(response.data.user);
};
```

### 後端 Controller 範例

```php
class ProductController extends Controller
{
    private ProductService $product_service;

    public function __construct(ProductService $product_service)
    {
        $this->product_service = $product_service;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category_id', 'keyword']);
        $products = $this->product_service->getProductList($filters);

        return response()->json([
            'message' => '取得產品列表成功',
            'data' => ProductResource::collection($products),
        ]);
    }
}
```

---

**文件版本:** 3.0
**最後更新:** 2025-12-03

**變更記錄:**

- v3.0 (2025-12-03): 更新為前後端分離架構（Next.js + Laravel API）
- v2.0 (2025-11-14): 拆分為模組化文件結構
- v1.0 (2025-11-09): 初始版本
