# 鍵盤商城 — Keyboard Shop

所有回答必須使用繁體中文。Next.js 前端 + Laravel API 後端，前後端分離架構。

## Commands

```bash
# 前端 (Next.js 15)
npm run dev                 # 開發伺服器 (Turbopack)
npm run build               # 建置
npm run start               # 啟動 production 伺服器
npm run lint                # ESLint 檢查
npm run lint:fix            # ESLint 自動修正
npm run type-check          # TypeScript 型別檢查
npm run format              # Prettier 格式化（寫入）
npm run format:check        # Prettier 格式檢查

# 後端 (Laravel 12) — 見 keyboard_shop_api 專案
```

## Tech Stack

- **前端**: Next.js 15 + React 19 + TypeScript 5 + Tailwind CSS 4 + axios
- **後端**: Laravel 12 + PHP 8.4 + MySQL 8 + Sanctum
- **開發語言**: 繁體中文（文檔/註解）、英文（程式碼）

## Architecture

```
src/                        # Next.js 前端
├── app/                    # App Router 頁面
│   ├── about/              # 關於我們
│   ├── admin/              # 後台管理頁面
│   ├── checkout/           # 結帳頁面
│   ├── contact/            # 聯絡我們
│   ├── faq/                # 常見問題
│   ├── login/              # 登入頁面
│   ├── member/             # 會員中心頁面
│   ├── products/           # 商品頁面
│   └── register/           # 註冊頁面
├── components/             # React 元件
│   ├── ui/                 # 共用 UI 元件
│   ├── auth/               # 認證相關元件
│   ├── admin/              # 後台管理元件
│   └── member/             # 會員相關元件
├── contexts/               # React Context
│   ├── AuthContext.tsx      # 認證狀態
│   ├── CartContext.tsx      # 購物車狀態
│   ├── SettingsContext.tsx  # 網站設定
│   └── WishlistContext.tsx  # 願望清單
├── data/                   # 靜態資料 (JSON)
├── hooks/                  # 自定義 Hooks
│   ├── useAdminGuard.ts    # 後台權限守衛
│   ├── useAuthGuard.ts     # 認證守衛
│   ├── useOrders.ts        # 訂單相關邏輯
│   └── use-outside-click.tsx # 點擊外部偵測
├── lib/                    # 工具函式 & API 服務
│   ├── api.ts              # axios API 服務（所有後端請求）
│   ├── admin-api.ts        # 後台管理 API 服務
│   ├── payment-utils.ts    # ECPay 付款工具
│   ├── storage.ts          # localStorage 工具
│   ├── validators.ts       # 表單驗證
│   └── utils.ts            # cn() 等通用工具
└── types/                  # TypeScript 型別定義
```

## Key Conventions

**前端:**

- axios 統一 API 請求，服務在 `src/lib/api.ts`
- 後台管理 API 請求在 `src/lib/admin-api.ts`
- localStorage 操作統一用 `src/lib/storage.ts`
- `NEXT_PUBLIC_API_URL` 設定 API 路徑
- Token 存 localStorage `keyboard_shop_token`
- 共用元件在 `src/components/ui/`

**後端 (分層架構):**

- Controller → Service → Repository（禁止 Controller 直接操作 Model）
- FormRequest 驗證、Eloquent ORM（禁止原生 SQL）

**命名:**

- 前端: PascalCase 元件、camelCase 函式/變數、kebab-case 檔案
- 後端: PascalCase 類別、camelCase 方法、snake_case 變數/DB 欄位

## API

- 前綴: `/api/v1/`
- 認證: Bearer Token (Sanctum)，Header `Authorization: Bearer {token}`
- 回應: `{ message, data, meta? }` 成功 / `{ message, errors? }` 錯誤

## Gotchas

- 前端 2 空格 + 單引號 + 分號；後端 4 空格
- API 型別定義在 `src/types/`
- Context 放 `src/contexts/`，Hooks 放 `src/hooks/`
- 訂單/付款狀態樣式統一用 `ORDER_STATUS_BADGE_CLASSES` / `ORDER_STATUS_TEXT_CLASSES`（`src/types/order.ts`）
- ECPay 付款表單用 `openPaymentWindow()`（`src/lib/payment-utils.ts`），不要直接 `window.open`
- Pre-commit hook (husky + lint-staged) 會自動跑 Prettier + ESLint
- `npm run dev` 預設使用 Turbopack
