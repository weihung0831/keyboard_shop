import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 將 specifications 統一轉換為 Record<string, string>
 * 相容後端陣列格式 [{spec_name, spec_value}] 與物件格式
 */
export function parseSpecs(
  raw: Record<string, string> | { spec_name: string; spec_value: string }[] | null | undefined,
): Record<string, string> {
  if (!raw) return {};
  if (Array.isArray(raw)) {
    return Object.fromEntries(raw.map(s => [s.spec_name, s.spec_value]));
  }
  return raw;
}
