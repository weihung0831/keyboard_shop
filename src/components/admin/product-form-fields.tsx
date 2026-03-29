'use client';

/**
 * 商品表單欄位元件 — 新增/編輯共用
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import type { AdminCategory } from '@/types/admin';

export interface ProductFormData {
  name: string;
  sku: string;
  category_id: string;
  price: string;
  original_price: string;
  stock: string;
  description: string;
  content: string;
  is_active: boolean;
  sort_order: string;
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FieldProps) {
  return (
    <div className='space-y-1.5'>
      <label className='block text-sm text-zinc-400'>
        {label}
        {required && <span className='text-red-400 ml-1'>*</span>}
      </label>
      {children}
      {error && <p className='text-xs text-red-400'>{error}</p>}
    </div>
  );
}

const inputClass =
  'bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none w-full';

interface Props {
  form: ProductFormData;
  errors: Record<string, string>;
  categories: AdminCategory[];
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
}

export function ProductFormFields({ form, errors, categories, onChange }: Props) {
  return (
    <div className='space-y-5'>
      {/* Row: name + sku */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <FormField label='商品名稱' required error={errors.name}>
          <input
            value={form.name}
            onChange={e => onChange('name', e.target.value)}
            className={cn(inputClass, errors.name && 'border-red-500')}
            placeholder='e.g. HHKB Professional Hybrid'
          />
        </FormField>
        <FormField label='SKU' required error={errors.sku}>
          <input
            value={form.sku}
            onChange={e => onChange('sku', e.target.value)}
            className={cn(inputClass, errors.sku && 'border-red-500')}
            placeholder='e.g. HHKB-PRO-HYBRID'
          />
        </FormField>
      </div>

      {/* Row: category + sort_order */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <FormField label='商品分類' error={errors.category_id}>
          <select
            value={form.category_id}
            onChange={e => onChange('category_id', e.target.value)}
            className={cn(inputClass, errors.category_id && 'border-red-500')}
          >
            <option value=''>請選擇分類</option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label='排序' error={errors.sort_order}>
          <input
            type='number'
            value={form.sort_order}
            onChange={e => onChange('sort_order', e.target.value)}
            className={inputClass}
            min='0'
          />
        </FormField>
      </div>

      {/* Row: price + original_price + stock */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <FormField label='售價' required error={errors.price}>
          <input
            type='number'
            value={form.price}
            onChange={e => onChange('price', e.target.value)}
            className={cn(inputClass, errors.price && 'border-red-500')}
            min='0'
          />
        </FormField>
        <FormField label='原價' error={errors.original_price}>
          <input
            type='number'
            value={form.original_price}
            onChange={e => onChange('original_price', e.target.value)}
            className={inputClass}
            min='0'
          />
        </FormField>
        <FormField label='庫存' required error={errors.stock}>
          <input
            type='number'
            value={form.stock}
            onChange={e => onChange('stock', e.target.value)}
            className={cn(inputClass, errors.stock && 'border-red-500')}
            min='0'
          />
        </FormField>
      </div>

      {/* Description */}
      <FormField label='簡短描述' error={errors.description}>
        <textarea
          value={form.description}
          onChange={e => onChange('description', e.target.value)}
          className={inputClass}
          rows={2}
          placeholder='顯示在列表頁的短描述'
        />
      </FormField>

      {/* Content — 富文字編輯器 */}
      <FormField label='詳細內容' error={errors.content}>
        <RichTextEditor value={form.content} onChange={v => onChange('content', v)} />
      </FormField>

      {/* is_active toggle */}
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => onChange('is_active', !form.is_active)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            form.is_active ? 'bg-blue-600' : 'bg-zinc-700',
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 rounded-full bg-white transition-transform',
              form.is_active ? 'translate-x-6' : 'translate-x-1',
            )}
          />
        </button>
        <span className='text-sm text-zinc-400'>{form.is_active ? '上架中' : '已下架'}</span>
      </div>
    </div>
  );
}
