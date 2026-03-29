'use client';

/**
 * 後台新增商品頁面
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { adminCreateProduct, adminGetCategories } from '@/lib/admin-api';
import { ProductFormFields } from '@/components/admin/product-form-fields';
import { ProductSpecEditor } from '@/components/admin/product-spec-editor';
import type { ProductFormData } from '@/components/admin/product-form-fields';
import type { SpecRow } from '@/components/admin/product-spec-editor';
import type { AdminCategory } from '@/types/admin';

const EMPTY_FORM: ProductFormData = {
  name: '',
  sku: '',
  category_id: '',
  price: '',
  original_price: '',
  stock: '0',
  description: '',
  content: '',
  is_active: true,
  sort_order: '0',
};

interface ApiError {
  errors?: Record<string, string[]>;
  message?: string;
}

export default function AdminProductNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [specs, setSpecs] = useState<SpecRow[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    adminGetCategories({ per_page: 100 })
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (field: keyof ProductFormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
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
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    setGlobalError('');

    try {
      await adminCreateProduct({
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
        specifications: specs
          .filter(s => s.spec_name.trim() && s.spec_value.trim())
          .map(s => ({ spec_name: s.spec_name.trim(), spec_value: s.spec_value.trim() })),
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
        <h1 className='text-2xl font-bold text-white'>新增商品</h1>
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

        {/* Specifications */}
        <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4'>
          <h2 className='text-base font-semibold text-white'>商品規格</h2>
          <ProductSpecEditor specs={specs} onChange={setSpecs} />
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
            {submitting ? '儲存中...' : '建立商品'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
