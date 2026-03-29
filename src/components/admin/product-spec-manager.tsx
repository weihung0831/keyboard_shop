'use client';

/**
 * 商品規格管理元件 — 編輯頁用，含現有規格 CRUD + 新增列
 */

import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import {
  adminCreateProductSpec,
  adminUpdateProductSpec,
  adminDeleteProductSpec,
} from '@/lib/admin-api';
import type { AdminProduct } from '@/types/admin';

type Spec = AdminProduct['specifications'][number];

interface Props {
  productId: number;
  specs: Spec[];
  onRefresh: () => void;
}

interface NewSpecRow {
  spec_name: string;
  spec_value: string;
}

const inputClass =
  'bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-sm focus:border-blue-500 focus:outline-none';

export function ProductSpecManager({ productId, specs, onRefresh }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{ spec_name: string; spec_value: string }>({
    spec_name: '',
    spec_value: '',
  });
  const [newRow, setNewRow] = useState<NewSpecRow>({ spec_name: '', spec_value: '' });
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const startEdit = (spec: Spec) => {
    setEditingId(spec.id);
    setEditDraft({ spec_name: spec.spec_name, spec_value: spec.spec_value });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (specId: number) => {
    if (!editDraft.spec_name.trim() || !editDraft.spec_value.trim()) {
      return;
    }
    setSaving(true);
    try {
      await adminUpdateProductSpec(productId, specId, {
        spec_name: editDraft.spec_name.trim(),
        spec_value: editDraft.spec_value.trim(),
      });
      setEditingId(null);
      onRefresh();
    } catch {
      alert('更新失敗，請重試');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (specId: number) => {
    if (!window.confirm('確定要刪除此規格？')) {
      return;
    }
    try {
      await adminDeleteProductSpec(productId, specId);
      onRefresh();
    } catch {
      alert('刪除失敗，請重試');
    }
  };

  const handleAdd = async () => {
    if (!newRow.spec_name.trim() || !newRow.spec_value.trim()) {
      return;
    }
    setSaving(true);
    try {
      await adminCreateProductSpec(productId, {
        spec_name: newRow.spec_name.trim(),
        spec_value: newRow.spec_value.trim(),
      });
      setNewRow({ spec_name: '', spec_value: '' });
      setAddingNew(false);
      onRefresh();
    } catch {
      alert('新增失敗，請重試');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='space-y-2'>
      {specs.length > 0 && (
        <div className='space-y-1.5'>
          {specs.map(spec =>
            editingId === spec.id ? (
              <div key={spec.id} className='flex gap-2 items-center'>
                <input
                  value={editDraft.spec_name}
                  onChange={e => setEditDraft(d => ({ ...d, spec_name: e.target.value }))}
                  className={`${inputClass} flex-1`}
                />
                <input
                  value={editDraft.spec_value}
                  onChange={e => setEditDraft(d => ({ ...d, spec_value: e.target.value }))}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type='button'
                  onClick={() => saveEdit(spec.id)}
                  disabled={saving}
                  className='p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors'
                >
                  <Check size={14} />
                </button>
                <button
                  type='button'
                  onClick={cancelEdit}
                  className='p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors'
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                key={spec.id}
                className='flex items-center gap-3 px-3 py-2 bg-zinc-800/50 rounded-lg group'
              >
                <span className='text-zinc-400 text-sm flex-1 truncate'>{spec.spec_name}</span>
                <span className='text-white text-sm flex-1 truncate'>{spec.spec_value}</span>
                <div className='flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    type='button'
                    onClick={() => startEdit(spec)}
                    className='p-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors'
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDelete(spec.id)}
                    className='p-1.5 rounded bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors'
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Add new row */}
      {addingNew ? (
        <div className='flex gap-2 items-center'>
          <input
            value={newRow.spec_name}
            onChange={e => setNewRow(r => ({ ...r, spec_name: e.target.value }))}
            placeholder='規格名稱'
            className={`${inputClass} flex-1`}
          />
          <input
            value={newRow.spec_value}
            onChange={e => setNewRow(r => ({ ...r, spec_value: e.target.value }))}
            placeholder='規格值'
            className={`${inputClass} flex-1`}
          />
          <button
            type='button'
            onClick={handleAdd}
            disabled={saving}
            className='p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors'
          >
            <Check size={14} />
          </button>
          <button
            type='button'
            onClick={() => {
              setAddingNew(false);
              setNewRow({ spec_name: '', spec_value: '' });
            }}
            className='p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors'
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => setAddingNew(true)}
          className='flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors'
        >
          <Plus size={14} />
          新增規格
        </button>
      )}
    </div>
  );
}
