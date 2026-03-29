# 鍵盤商城 Keyboard Shop

機械鍵盤電商平台，採用前後端分離架構。前端使用 Next.js 15 + React 19，後端使用 Laravel 12 API（獨立專案 [keyboard_shop_api](https://github.com/weihung0831/keyboard_shop_api)）。

## 功能

**前台**

- 商品瀏覽與搜尋、商品 3D 檢視
- 購物車管理（本地 + API 同步）
- 會員註冊 / 登入（Bearer Token 認證）
- 結帳流程與 ECPay 綠界金流整合
- 訂單管理（查詢、取消、付款）
- 願望清單
- 會員專區（個人資料、修改密碼、訂單歷史）

**後台管理**

- 商品管理（新增、編輯、圖片上傳、規格管理、富文本編輯器）
- 訂單管理與詳情檢視
- 使用者管理
- 商品分類管理
- 訊息 / 聯絡管理
- 網站設定

## 技術棧

| 類別       | 技術                                     |
| ---------- | ---------------------------------------- |
| 框架       | Next.js 15 (App Router, Turbopack)       |
| UI         | React 19 + TypeScript 5 + Tailwind CSS 4 |
| HTTP       | axios                                    |
| 動畫       | Motion (Framer Motion)                   |
| 富文本     | Tiptap                                   |
| 3D         | Three.js + React Three Fiber             |
| 圖示       | Lucide React, Tabler Icons               |
| 表單       | React Hook Form + Zod                    |
| 程式碼品質 | ESLint + Prettier + husky + lint-staged  |

## 快速開始

### 前置需求

- Node.js >= 20.0.0
- 後端 API 服務執行中（見 [keyboard_shop_api](https://github.com/weihung0831/keyboard_shop_api)）

### 安裝

```bash
git clone https://github.com/weihung0831/keyboard_shop.git
cd keyboard_shop
npm install
```

### 環境設定

建立 `.env.local`：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 開發

```bash
npm run dev           # 啟動開發伺服器 (Turbopack)
npm run build         # 正式環境建置
npm run lint          # ESLint 檢查
npm run type-check    # TypeScript 型別檢查
npm run format:check  # Prettier 格式檢查
```

## 專案結構

```
src/
├── app/                    # App Router 頁面
│   ├── admin/              # 後台管理（商品/訂單/使用者/分類/訊息/設定）
│   ├── products/           # 商品列表與詳情
│   ├── checkout/           # 結帳流程
│   ├── member/             # 會員專區
│   │   ├── dashboard/      # 會員首頁
│   │   ├── orders/         # 訂單管理
│   │   ├── wishlist/       # 願望清單
│   │   ├── profile/        # 個人資料
│   │   └── change-password/# 修改密碼
│   ├── login/              # 登入
│   └── register/           # 註冊
├── components/             # React 元件
│   ├── ui/                 # 共用 UI 元件
│   ├── auth/               # 認證相關元件
│   ├── admin/              # 後台管理元件
│   └── member/             # 會員相關元件
├── contexts/               # React Context (Auth, Cart, Wishlist, Settings)
├── hooks/                  # 自定義 Hooks
├── lib/                    # 工具函式 & API 服務
│   ├── api.ts              # axios API 服務
│   ├── admin-api.ts        # 後台管理 API 服務
│   ├── payment-utils.ts    # ECPay 付款工具
│   ├── storage.ts          # localStorage 工具
│   ├── validators.ts       # 表單驗證
│   └── utils.ts            # 通用工具
├── types/                  # TypeScript 型別定義
└── data/                   # 靜態資料
```

## 授權

本專案僅供學習用途。
