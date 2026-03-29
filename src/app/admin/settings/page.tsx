'use client';

import { useState, useEffect, useRef } from 'react';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminGetSettings, adminBatchUpdateSettings } from '@/lib/admin-api';
import type { SystemSetting } from '@/types/admin';

const INPUT_CLASS =
  'bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none';

type SettingValue = string | number | boolean;

function groupSettings(settings: SystemSetting[]): Record<string, SystemSetting[]> {
  return settings.reduce<Record<string, SystemSetting[]>>((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});
}

function isBoolean(value: SettingValue): boolean {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
}

function isInteger(value: SettingValue): boolean {
  if (typeof value === 'boolean') return false;
  return Number.isInteger(Number(value)) && !isNaN(Number(value)) && String(value) !== '';
}

function toBoolean(value: SettingValue): boolean {
  return value === true || value === 'true' || value === 1;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 px-4 py-3 rounded-lg text-sm font-medium shadow-lg z-50 transition-all',
        type === 'success'
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30',
      )}
    >
      {message}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [values, setValues] = useState<Record<string, SettingValue>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminGetSettings();
        setSettings(data);
        const initial: Record<string, SettingValue> = {};
        data.forEach(s => {
          initial[s.key] = s.value;
        });
        setValues(initial);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(values).map(([key, value]) => ({ key, value }));
      await adminBatchUpdateSettings(payload);
      showToast('設定已儲存', 'success');
    } catch {
      showToast('儲存失敗，請稍後再試', 'error');
    } finally {
      setSaving(false);
    }
  };

  const setValue = (key: string, value: SettingValue) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const grouped = groupSettings(settings);

  if (isLoading) {
    return <div className='py-20 text-center text-zinc-500 text-sm'>載入中...</div>;
  }

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-white'>系統設定</h1>
          <p className='mt-1 text-sm text-zinc-400'>管理系統參數與功能開關</p>
        </div>
        <button
          disabled={saving}
          onClick={handleSave}
          className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50'
        >
          <Save className='h-4 w-4' />
          {saving ? '儲存中...' : '儲存設定'}
        </button>
      </div>

      <div className='space-y-6'>
        {Object.entries(grouped).map(([group, groupSettings]) => (
          <div key={group} className='bg-zinc-900 border border-zinc-800 rounded-xl p-6'>
            <h2 className='text-sm font-semibold text-white mb-4 pb-3 border-b border-zinc-800'>
              {{ general: '一般', payment: '金流', shipping: '運費' }[group] ?? group}
            </h2>
            <div className='space-y-4'>
              {groupSettings.map(setting => {
                const currentValue = values[setting.key] ?? setting.value;
                const isBool = isBoolean(setting.value);
                const isInt = !isBool && isInteger(setting.value);

                return (
                  <div key={setting.key} className='flex items-start justify-between gap-4'>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm text-zinc-200 font-medium'>
                        {setting.description ?? setting.key}
                      </p>
                    </div>
                    <div className='flex-shrink-0'>
                      {isBool ? (
                        <button
                          type='button'
                          onClick={() => setValue(setting.key, !toBoolean(currentValue))}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            toBoolean(currentValue) ? 'bg-blue-600' : 'bg-zinc-600',
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                              toBoolean(currentValue) ? 'translate-x-6' : 'translate-x-1',
                            )}
                          />
                        </button>
                      ) : isInt ? (
                        <input
                          type='number'
                          className={cn(INPUT_CLASS, 'w-28 text-right')}
                          value={currentValue as number}
                          onChange={e => setValue(setting.key, Number(e.target.value))}
                        />
                      ) : (
                        <input
                          type='text'
                          className={cn(INPUT_CLASS, 'w-48')}
                          value={currentValue as string}
                          onChange={e => setValue(setting.key, e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
