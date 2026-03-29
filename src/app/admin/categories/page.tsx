'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '@/lib/admin-api';
import type { AdminCategory, AdminCategoryFormData } from '@/types/admin';
import { ConfirmModal } from '@/components/admin/confirm-modal';

const INPUT_CLASS =
  'bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none w-full';

const EMPTY_FORM: AdminCategoryFormData = {
  name: '',
  slug: '',
  description: '',
  is_active: true,
  sort_order: 0,
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

// ==================== Modal ====================

interface CategoryModalProps {
  initial?: AdminCategoryFormData;
  onSubmit: (data: AdminCategoryFormData) => Promise<void>;
  onClose: () => void;
  isEditing: boolean;
}

function CategoryModal({ initial, onSubmit, onClose, isEditing }: CategoryModalProps) {
  const [form, setForm] = useState<AdminCategoryFormData>(initial ?? EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof AdminCategoryFormData, value: string | number | boolean) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && typeof value === 'string' && !isEditing) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/60' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl'>
        <div className='flex items-center justify-between mb-5'>
          <h3 className='text-lg font-semibold text-white'>
            {isEditing ? '編輯分類' : '新增分類'}
          </h3>
          <button onClick={onClose} className='text-zinc-400 hover:text-white transition-colors'>
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-xs text-zinc-400 mb-1 block'>名稱 *</label>
              <input
                className={INPUT_CLASS}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder='分類名稱'
                autoFocus
              />
            </div>
            <div>
              <label className='text-xs text-zinc-400 mb-1 block'>Slug</label>
              <input
                className={INPUT_CLASS}
                value={form.slug ?? ''}
                onChange={e => set('slug', e.target.value)}
                placeholder='自動產生'
              />
            </div>
          </div>

          <div>
            <label className='text-xs text-zinc-400 mb-1 block'>描述</label>
            <input
              className={INPUT_CLASS}
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value)}
              placeholder='選填'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-xs text-zinc-400 mb-1 block'>排序</label>
              <input
                type='number'
                className={INPUT_CLASS}
                value={form.sort_order ?? 0}
                onChange={e => set('sort_order', Number(e.target.value))}
              />
            </div>
            <div className='flex items-end pb-1'>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => set('is_active', !form.is_active)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    form.is_active ? 'bg-blue-600' : 'bg-zinc-600',
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                      form.is_active ? 'translate-x-6' : 'translate-x-1',
                    )}
                  />
                </button>
                <span className='text-zinc-300 text-sm'>{form.is_active ? '啟用' : '停用'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800'>
          <button
            onClick={onClose}
            className='bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm'
          >
            取消
          </button>
          <button
            disabled={saving || !form.name.trim()}
            onClick={handleSubmit}
            className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 flex items-center gap-1.5'
          >
            <Check className='h-4 w-4' />
            {saving ? '儲存中...' : isEditing ? '更新' : '新增'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Page ====================

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    open: boolean;
    editingCat?: AdminCategory;
  }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminGetCategories({ per_page: 100 });
      setCategories(res.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (data: AdminCategoryFormData) => {
    await adminCreateCategory(data);
    setModalState({ open: false });
    fetchCategories();
  };

  const handleUpdate = async (id: number, data: AdminCategoryFormData) => {
    await adminUpdateCategory(id, data);
    setModalState({ open: false });
    fetchCategories();
  };

  const handleDelete = async (cat: AdminCategory) => {
    try {
      await adminDeleteCategory(cat.id);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err: unknown) {
      setDeleteTarget(null);
      const msg = err instanceof Error ? err.message : '刪除失敗，請稍後再試';
      setErrorMsg(msg);
    }
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>分類管理</h1>
          <p className='mt-1 text-sm text-zinc-400'>共 {categories.length} 個分類</p>
        </div>
        <button
          onClick={() => setModalState({ open: true })}
          className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          新增分類
        </button>
      </div>

      {/* Modal */}
      {modalState.open && (
        <CategoryModal
          isEditing={!!modalState.editingCat}
          initial={
            modalState.editingCat
              ? {
                  name: modalState.editingCat.name,
                  slug: modalState.editingCat.slug,
                  description: modalState.editingCat.description ?? '',
                  is_active: modalState.editingCat.is_active,
                  sort_order: modalState.editingCat.sort_order,
                }
              : undefined
          }
          onSubmit={data =>
            modalState.editingCat
              ? handleUpdate(modalState.editingCat.id, data)
              : handleCreate(data)
          }
          onClose={() => setModalState({ open: false })}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          title='刪除分類'
          message={
            deleteTarget.products_count > 0
              ? `此分類下有 ${deleteTarget.products_count} 個商品，刪除後商品將失去分類。\n確定要刪除「${deleteTarget.name}」嗎？`
              : `確定要刪除「${deleteTarget.name}」嗎？`
          }
          confirmText='刪除'
          danger
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Error Modal */}
      {errorMsg && (
        <ConfirmModal
          title='操作失敗'
          message={errorMsg}
          confirmText='確定'
          onConfirm={() => setErrorMsg(null)}
          onCancel={() => setErrorMsg(null)}
        />
      )}

      {/* Category List */}
      <div className='bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto'>
        <div className='grid grid-cols-[2fr_1.5fr_80px_60px_80px_80px] text-xs text-zinc-400 px-4 py-3 border-b border-zinc-800 bg-zinc-950'>
          <span>名稱</span>
          <span>Slug</span>
          <span>商品數</span>
          <span>排序</span>
          <span>狀態</span>
          <span></span>
        </div>

        {isLoading ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>載入中...</div>
        ) : categories.length === 0 ? (
          <div className='py-16 text-center text-zinc-500 text-sm'>尚無分類</div>
        ) : (
          categories.map(cat => (
            <div
              key={cat.id}
              className='grid grid-cols-[2fr_1.5fr_80px_60px_80px_80px] px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors text-sm items-center'
            >
              <span className='text-white font-medium'>{cat.name}</span>
              <span className='text-zinc-500 text-xs font-mono'>{cat.slug}</span>
              <span className='text-zinc-400'>{cat.products_count}</span>
              <span className='text-zinc-400'>{cat.sort_order}</span>
              <span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs border',
                    cat.is_active
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
                  )}
                >
                  {cat.is_active ? '啟用' : '停用'}
                </span>
              </span>
              <span className='flex gap-6'>
                <button
                  onClick={() => setModalState({ open: true, editingCat: cat })}
                  className='text-zinc-400 hover:text-blue-400 transition-colors'
                  title='編輯'
                >
                  <Pencil className='h-4 w-4' />
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className='text-zinc-400 hover:text-red-400 transition-colors'
                  title='刪除'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
