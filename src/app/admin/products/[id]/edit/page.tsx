'use client';

/**
 * 後台編輯商品頁面
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { adminGetProduct, adminUpdateProduct, adminGetCategories } from '@/lib/admin-api';
import { ProductFormFields } from '@/components/admin/product-form-fields';
import { ProductImageManager } from '@/components/admin/product-image-manager';
import { ProductSpecManager } from '@/components/admin/product-spec-manager';
import type { ProductFormData } from '@/components/admin/product-form-fields';
import type { AdminProduct, AdminCategory } from '@/types/admin';

interface ApiError {
  errors?: Record<string, string[]>;
  message?: string;
}

function productToForm(p: AdminProduct): ProductFormData {
  return {
    name: p.name,
    sku: p.sku,
    category_id: p.category ? String(p.category.id) : '',
    price: String(p.price),
    original_price: p.original_price ? String(p.original_price) : '',
    stock: String(p.stock),
    description: p.description ?? '',
    content: p.content ?? '',
    is_active: p.is_active,
    sort_order: String(p.sort_order),
  };
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<ProductFormData | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [globalError, setGlobalError] = useState('');

  const loadProduct = useCallback(() => {
    adminGetProduct(productId)
      .then(p => {
        setProduct(p);
        setForm(productToForm(p));
      })
      .catch(() => setLoadError('無法載入商品資料'));
  }, [productId]);

  useEffect(() => {
    loadProduct();
    adminGetCategories({ per_page: 100 })
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, [loadProduct]);

  const handleChange = (field: keyof ProductFormData, value: string | boolean) => {
    setForm(prev => (prev ? { ...prev, [field]: value } : prev));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    if (!form) {
      return false;
    }
    const errs: Record<string, string> = {};
    if (!form.name.trim()) {
      errs.name = '請輸入商品名稱';
    }
    if (!form.sku.trim()) {
      errs.sku = '請輸入 SKU';
    }
    if (!form.price || Number(form.price) < 0) {
      errs.price = '請輸入有效售價';
    }
    if (!form.stock || Number(form.stock) < 0) {
      errs.stock = '請輸入有效庫存';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !validate()) {
      return;
    }
    setSubmitting(true);
    setGlobalError('');

    try {
      await adminUpdateProduct(productId, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category_id: form.category_id ? Number(form.category_id) : 0,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        stock: Number(form.stock),
        description: form.description.trim() || undefined,
        content: form.content.trim() || undefined,
        is_active: form.is_active,
        sort_order: Number(form.sort_order) || 0,
      });
      router.push('/admin/products');
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: ApiError } };
      const data = apiErr?.response?.data;
      if (data?.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(data.errors).forEach(([k, v]) => {
          fieldErrors[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(fieldErrors);
      } else {
        setGlobalError(data?.message ?? '儲存失敗，請重試');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-64 gap-4'>
        <p className='text-red-400'>{loadError}</p>
        <Link href='/admin/products' className='text-blue-400 hover:underline text-sm'>
          返回列表
        </Link>
      </div>
    );
  }

  if (!product || !form) {
    return <div className='text-zinc-500 text-sm py-10 text-center'>載入中...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-6'
    >
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Link
          href='/admin/products'
          className='p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors'
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-white'>編輯商品</h1>
          <p className='text-zinc-500 text-xs mt-0.5'>{product.name}</p>
        </div>
      </div>

      {globalError && (
        <div className='bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm'>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Info */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5'>
          <h2 className='text-base font-semibold text-white'>基本資料</h2>
          <ProductFormFields
            form={form}
            errors={errors}
            categories={categories}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className='flex items-center gap-3 justify-end'>
          <Link
            href='/admin/products'
            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors'
          >
            取消
          </Link>
          <button
            type='submit'
            disabled={submitting}
            className='bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {submitting ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </form>

      {/* Images Section */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4'>
        <h2 className='text-base font-semibold text-white'>商品圖片</h2>
        <ProductImageManager
          productId={productId}
          images={product.images}
          onRefresh={loadProduct}
        />
      </div>

      {/* Specs Section */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4'>
        <h2 className='text-base font-semibold text-white'>商品規格</h2>
        <ProductSpecManager
          productId={productId}
          specs={product.specifications}
          onRefresh={loadProduct}
        />
      </div>
    </motion.div>
  );
}
