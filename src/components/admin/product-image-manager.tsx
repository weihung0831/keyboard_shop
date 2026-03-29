'use client';

/**
 * 商品圖片管理元件 — 顯示現有圖片 + 上傳新圖片
 */

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Trash2, Upload } from 'lucide-react';
import { adminDeleteProductImage, adminUploadProductImages } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/confirm-modal';
import type { AdminProduct } from '@/types/admin';

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || 'https://keyboard-shop-api.zeabur.app/api/v1'
).replace(/\/api\/v1$/, '');

interface Props {
  productId: number;
  images: AdminProduct['images'];
  onRefresh: () => void;
}

export function ProductImageManager({ productId, images, onRefresh }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) {
      return;
    }
    setUploading(true);
    try {
      await adminUploadProductImages(productId, files);
      onRefresh();
    } catch {
      alert('上傳失敗，請重試');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (imageId: number) => {
    setDeletingId(imageId);
    setDeleteTargetId(null);
    try {
      await adminDeleteProductImage(productId, imageId);
      onRefresh();
    } catch {
      alert('刪除失敗，請重試');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='space-y-4'>
      {/* Existing images grid */}
      {images.length > 0 ? (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
          {images.map(img => {
            const rawUrl = img.image_url ?? img.url;
            const url = rawUrl?.startsWith('http') ? rawUrl : `${API_ORIGIN}${rawUrl}`;
            return (
              <div
                key={img.id}
                className='relative group rounded-lg overflow-hidden bg-zinc-800 aspect-square'
              >
                <Image src={url} alt='' fill className='object-cover' sizes='150px' />
                {img.is_primary && (
                  <span className='absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded'>
                    主圖
                  </span>
                )}
                <button
                  onClick={() => setDeleteTargetId(img.id)}
                  disabled={deletingId === img.id}
                  className='absolute top-1 right-1 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50'
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className='text-zinc-500 text-sm'>尚無圖片</p>
      )}

      {/* Delete confirm modal */}
      {deleteTargetId !== null && (
        <ConfirmModal
          title='刪除圖片'
          message='確定要刪除此圖片？'
          confirmText='刪除'
          danger
          onConfirm={() => handleDelete(deleteTargetId)}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}

      {/* Upload button */}
      <div>
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handleUpload}
          className='hidden'
        />
        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className='flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50'
        >
          <Upload size={14} />
          {uploading ? '上傳中...' : '上傳圖片'}
        </button>
        <p className='text-zinc-600 text-xs mt-1.5'>支援 JPG、PNG、WebP，可多選</p>
      </div>
    </div>
  );
}
