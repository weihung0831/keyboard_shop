'use client';

/**
 * 後台商品管理列表頁面
 */

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetProducts, adminDeleteProduct, adminBatchToggleProducts } from '@/lib/admin-api';
import { ProductTableRow } from '@/components/admin/product-table-row';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { AdminProduct } from '@/types/admin';
import type { PaginationMeta } from '@/types/product';

const TABLE_HEADERS = ['', '圖片', '商品名稱', 'SKU', '售價', '庫存', '狀態', '操作'];
const TABLE_COLS = 'grid-cols-[40px_60px_1fr_120px_100px_80px_90px_100px]';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<'' | '1' | '0'>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string, unknown> = { page, per_page: 15 };
    if (search) {
      params.search = search;
    }
    if (activeFilter !== '') {
      params.is_active = activeFilter;
    }

    adminGetProducts(params)
      .then(res => {
        setProducts(res.data);
        setMeta(res.meta);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, activeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelected(prev => (prev.length === products.length ? [] : products.map(p => p.id)));
  };

  const handleDelete = (product: AdminProduct) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteProduct(deleteTarget.id);
      fetchProducts();
      setSelected(prev => prev.filter(id => id !== deleteTarget.id));
    } catch {
      // silent - modal will close regardless
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleBatchToggle = async (isActive: boolean) => {
    if (selected.length === 0) {
      return;
    }
    try {
      await adminBatchToggleProducts({ product_ids: selected, is_active: isActive });
      setSelected([]);
      fetchProducts();
    } catch {
      setErrorMsg('批次操作失敗，請重試');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-4'
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-white'>商品管理</h1>
        <Link
          href='/admin/products/new'
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors'
        >
          <Plus size={16} />
          新增商品
        </Link>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-3'>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <div className='relative'>
            <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500' />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder='搜尋商品名稱、SKU...'
              className='bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none w-64'
            />
          </div>
          <button
            type='submit'
            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors'
          >
            搜尋
          </button>
        </form>

        <select
          value={activeFilter}
          onChange={e => {
            setActiveFilter(e.target.value as '' | '1' | '0');
            setPage(1);
          }}
          className='bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none'
        >
          <option value=''>全部狀態</option>
          <option value='1'>已上架</option>
          <option value='0'>已下架</option>
        </select>
      </div>

      {/* Batch Actions */}
      {selected.length > 0 && (
        <div className='flex items-center gap-3 bg-blue-600/10 border border-blue-600/30 rounded-lg px-4 py-2'>
          <span className='text-blue-400 text-sm'>已選 {selected.length} 項</span>
          <button
            onClick={() => handleBatchToggle(true)}
            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-xs transition-colors'
          >
            批次上架
          </button>
          <button
            onClick={() => handleBatchToggle(false)}
            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-xs transition-colors'
          >
            批次下架
          </button>
          <button
            onClick={() => setSelected([])}
            className='text-zinc-500 hover:text-zinc-300 text-xs ml-auto'
          >
            取消選取
          </button>
        </div>
      )}

      {/* Table */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto'>
        {/* Table Header */}
        <div
          className={cn(
            'grid gap-3 items-center px-4 py-3 border-b border-zinc-800 text-xs text-zinc-500 uppercase tracking-wide',
            TABLE_COLS,
          )}
        >
          <input
            type='checkbox'
            checked={products.length > 0 && selected.length === products.length}
            onChange={toggleSelectAll}
            className='w-4 h-4 accent-blue-600'
          />
          {TABLE_HEADERS.slice(1).map(h => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>載入中...</div>
        ) : products.length === 0 ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>沒有符合條件的商品</div>
        ) : (
          products.map(product => (
            <ProductTableRow
              key={product.id}
              product={product}
              selected={selected.includes(product.id)}
              onSelect={toggleSelect}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className='flex items-center justify-between text-sm'>
          <span className='text-zinc-500'>
            共 {meta.total} 筆，第 {meta.current_page} / {meta.last_page} 頁
          </span>
          <div className='flex gap-2'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={meta.current_page === 1}
              className='p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 transition-colors'
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page === meta.last_page}
              className='p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 transition-colors'
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      {errorMsg && (
        <ConfirmModal
          title='操作失敗'
          message={errorMsg}
          confirmText='確定'
          onConfirm={() => setErrorMsg(null)}
          onCancel={() => setErrorMsg(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title='刪除商品'
          message={`確定要刪除「${deleteTarget.name}」？此操作無法復原。`}
          confirmText='刪除'
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </motion.div>
  );
}
