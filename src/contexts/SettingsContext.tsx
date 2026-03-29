'use client';

/**
 * 系統設定 Context
 * 從後端載入公開設定，提供給前台元件使用
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface Settings {
  site_name: string;
  site_description: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  ecpay_enabled: boolean;
  [key: string]: string | number | boolean;
}

const DEFAULT_SETTINGS: Settings = {
  site_name: 'Axis Keys',
  site_description: 'Axis Keys - 您的一站式鍵盤商店',
  shipping_fee: 60,
  free_shipping_threshold: 1500,
  ecpay_enabled: true,
};

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get<{ data: Record<string, string | number | boolean> }>(
          '/settings',
        );
        setSettings({ ...DEFAULT_SETTINGS, ...response.data.data });
      } catch {
        // Use defaults on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
