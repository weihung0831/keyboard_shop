'use client';

/**
 * 商品管理 — 表格列元件
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminProduct } from '@/types/admin';

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'https://keyboard-shop-api.zeabur.app/api/v1'
).replace(/\/api\/v1$/, '');

function resolveImageUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  return raw.startsWith('http') ? raw : `${API_ORIGIN}${raw}`;
}

interface Props {
  product: AdminProduct;
  selected: boolean;
  onSelect: (id: number) => void;
  onDelete: (product: AdminProduct) => void;
}

export function ProductTableRow({ product, selected, onSelect, onDelete }: Props) {
  const primaryImage = product.images.find(img => img.is_primary) ?? product.images[0];
  const imageUrl = resolveImageUrl(primaryImage?.image_url ?? primaryImage?.url);

  return (
    <div
      className={cn(
        'grid grid-cols-[40px_60px_1fr_120px_100px_80px_90px_100px] gap-3 items-center px-4 py-3 border-b border-zinc-800/50 text-sm transition-colors',
        selected ? 'bg-blue-600/5' : 'bg-zinc-900/50 hover:bg-zinc-800/50',
      )}
    >
      {/* Checkbox */}
      <input
        type='checkbox'
        checked={selected}
        onChange={() => onSelect(product.id)}
        className='w-4 h-4 accent-blue-600'
      />

      {/* Image */}
      <div className='w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            width={40}
            height={40}
            className='object-cover w-full h-full'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-zinc-600 text-xs'>
            無
          </div>
        )}
      </div>

      {/* Name */}
      <div className='min-w-0'>
        <div className='text-white font-medium truncate'>{product.name}</div>
        <div className='text-zinc-500 text-xs truncate'>{product.category?.name ?? '未分類'}</div>
      </div>

      {/* SKU */}
      <span className='text-zinc-400 text-xs font-mono truncate'>{product.sku}</span>

      {/* Price */}
      <span className='text-white'>NT${product.price.toLocaleString()}</span>

      {/* Stock */}
      <span
        className={cn('font-medium', product.stock <= 10 ? 'text-yellow-400' : 'text-zinc-300')}
      >
        {product.stock}
      </span>

      {/* Status Badge */}
      <span
        className={cn(
          'px-2 py-0.5 rounded text-xs w-fit',
          product.is_active
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-zinc-700/30 text-zinc-500 border border-zinc-700/30',
        )}
      >
        {product.is_active ? '上架' : '下架'}
      </span>

      {/* Actions */}
      <div className='flex items-center gap-6'>
        <Link
          href={`/admin/products/${product.id}/edit`}
          className='text-zinc-400 hover:text-blue-400 transition-colors'
          title='編輯'
        >
          <Pencil className='h-4 w-4' />
        </Link>
        <button
          onClick={() => onDelete(product)}
          className='text-zinc-400 hover:text-red-400 transition-colors'
          title='刪除'
        >
          <Trash2 className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
