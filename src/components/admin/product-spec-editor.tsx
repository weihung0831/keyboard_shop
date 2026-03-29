'use client';

/**
 * 商品規格編輯器 — 動態新增/移除規格列
 */

import React from 'react';
import { Plus, X } from 'lucide-react';

export interface SpecRow {
  spec_name: string;
  spec_value: string;
}

interface Props {
  specs: SpecRow[];
  onChange: (specs: SpecRow[]) => void;
}

export function ProductSpecEditor({ specs, onChange }: Props) {
  const addRow = () => onChange([...specs, { spec_name: '', spec_value: '' }]);

  const removeRow = (idx: number) => onChange(specs.filter((_, i) => i !== idx));

  const updateRow = (idx: number, field: keyof SpecRow, value: string) => {
    const next = specs.map((row, i) => (i === idx ? { ...row, [field]: value } : row));
    onChange(next);
  };

  return (
    <div className='space-y-2'>
      {specs.map((row, idx) => (
        <div key={idx} className='flex gap-2 items-center'>
          <input
            value={row.spec_name}
            onChange={e => updateRow(idx, 'spec_name', e.target.value)}
            placeholder='規格名稱（如：軸體）'
            className='bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none flex-1'
          />
          <input
            value={row.spec_value}
            onChange={e => updateRow(idx, 'spec_value', e.target.value)}
            placeholder='規格值（如：Cherry MX 紅軸）'
            className='bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none flex-1'
          />
          <button
            type='button'
            onClick={() => removeRow(idx)}
            className='p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors flex-shrink-0'
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={addRow}
        className='flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors'
      >
        <Plus size={14} />
        新增規格
      </button>
    </div>
  );
}
