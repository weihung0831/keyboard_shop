'use client';

import { useState, useCallback } from 'react';
import type { Order, OrderStats, OrdersQueryParams, CreateOrderRequest } from '@/types/order';
import type { PaginationMeta } from '@/types/product';
import {
  apiGetOrders,
  apiGetOrderStats,
  apiCreateOrder,
  apiGetOrder,
  apiCancelOrder,
} from '@/lib/api';

/**
 * 訂單 Hook 狀態
 */
interface OrdersState {
  /** 訂單列表 */
  orders: Order[];
  /** 分頁資訊 */
  pagination: PaginationMeta | null;
  /** 訂單統計 */
  stats: OrderStats | null;
  /** 當前訂單詳情 */
  currentOrder: Order | null;
  /** 是否正在載入 */
  isLoading: boolean;
  /** 錯誤訊息 */
  error: string | null;
}

/**
 * 訂單 Hook 回傳值
 */
interface UseOrdersReturn extends OrdersState {
  /** 取得訂單列表 */
  fetchOrders: (params?: OrdersQueryParams) => Promise<void>;
  /** 取得訂單統計 */
  fetchStats: () => Promise<void>;
  /** 取得訂單詳情 */
  fetchOrder: (orderId: number) => Promise<Order | null>;
  /** 建立訂單 */
  createOrder: (data: CreateOrderRequest) => Promise<Order | null>;
  /** 取消訂單 */
  cancelOrder: (orderId: number) => Promise<boolean>;
  /** 清除錯誤 */
  clearError: () => void;
  /** 清除當前訂單 */
  clearCurrentOrder: () => void;
}

/**
 * 訂單管理 Hook
 */
export function useOrders(): UseOrdersReturn {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    pagination: null,
    stats: null,
    currentOrder: null,
    isLoading: false,
    error: null,
  });

  /**
   * 取得訂單列表
   */
  const fetchOrders = useCallback(async (params?: OrdersQueryParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiGetOrders(params);
      setState(prev => ({
        ...prev,
        orders: response.data,
        pagination: response.meta,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '取得訂單列表失敗';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  /**
   * 取得訂單統計
   */
  const fetchStats = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const stats = await apiGetOrderStats();
      setState(prev => ({ ...prev, stats, isLoading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : '取得訂單統計失敗';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  /**
   * 取得訂單詳情
   */
  const fetchOrder = useCallback(async (orderId: number): Promise<Order | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const order = await apiGetOrder(orderId);
      setState(prev => ({ ...prev, currentOrder: order, isLoading: false }));
      return order;
    } catch (error) {
      const message = error instanceof Error ? error.message : '取得訂單詳情失敗';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      return null;
    }
  }, []);

  /**
   * 建立訂單
   */
  const createOrder = useCallback(async (data: CreateOrderRequest): Promise<Order | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const order = await apiCreateOrder(data);
      setState(prev => ({
        ...prev,
        currentOrder: order,
        isLoading: false,
      }));
      return order;
    } catch (error) {
      const message = error instanceof Error ? error.message : '建立訂單失敗';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      return null;
    }
  }, []);

  /**
   * 取消訂單
   */
  const cancelOrder = useCallback(async (orderId: number): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await apiCancelOrder(orderId);

      // 更新訂單列表中的狀態
      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: result.status,
                status_label: result.status_label,
                cancelled_at: result.cancelled_at,
              }
            : order,
        ),
        // 如果當前訂單是被取消的訂單，也更新它
        currentOrder:
          prev.currentOrder?.id === orderId
            ? {
                ...prev.currentOrder,
                status: result.status,
                status_label: result.status_label,
                cancelled_at: result.cancelled_at,
              }
            : prev.currentOrder,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : '取消訂單失敗';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      return false;
    }
  }, []);

  /**
   * 清除錯誤
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * 清除當前訂單
   */
  const clearCurrentOrder = useCallback(() => {
    setState(prev => ({ ...prev, currentOrder: null }));
  }, []);

  return {
    ...state,
    fetchOrders,
    fetchStats,
    fetchOrder,
    createOrder,
    cancelOrder,
    clearError,
    clearCurrentOrder,
  };
}

export default useOrders;
