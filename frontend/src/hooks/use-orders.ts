/**
 * useOrders Hook - COMPLETELY REWRITTEN
 * Fetches ALL orders once and provides filtering utilities
 * No complex cache key logic - simple and reliable
 */

import useSWR from 'swr';
import { API_ENDPOINTS } from '@/constants/api';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Order } from '@/types/food-ordering';

/**
 * Simple hook that fetches ALL orders
 * Filtering is handled by the component using this hook
 */
export function useOrders() {
  hackLog.dev('🪝 useOrders hook called', {
    endpoint: API_ENDPOINTS.FOOD_ORDERING.ORDERS,
    timestamp: new Date().toISOString(),
  });

  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    API_ENDPOINTS.FOOD_ORDERING.ORDERS,
    async () => {
      const result = await swrFetcher(API_ENDPOINTS.FOOD_ORDERING.ORDERS);
      return result as Order[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', API_ENDPOINTS.FOOD_ORDERING.ORDERS, {
          totalOrders: data?.length || 0,
          orderStatuses: data?.map((o) => o.status) || [],
        });
      },
      onError: (err) => {
        hackLog.apiError('GET', API_ENDPOINTS.FOOD_ORDERING.ORDERS, err);
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load orders',
        });
      },
    }
  );

  hackLog.dev('🪝 useOrders result', {
    isLoading,
    hasData: !!data,
    totalOrders: data?.length || 0,
    hasError: !!error,
  });

  return {
    allOrders: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
