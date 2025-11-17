/**
 * useOrders Hook
 * Fetches the list of orders with SWR caching
 * Automatically filtered by user's country on the backend (for non-admin users)
 */

import useSWR from 'swr';
import { API_ENDPOINTS } from '@/constants/api';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Order } from '@/types/food-ordering';

export function useOrders() {
  hackLog.dev('useOrders hook initialized');

  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.FOOD_ORDERING.ORDERS,
    () => swrFetcher(API_ENDPOINTS.FOOD_ORDERING.ORDERS) as Promise<Order[]>,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', API_ENDPOINTS.FOOD_ORDERING.ORDERS, {
          count: data?.length || 0,
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

  return {
    orders: data || [],
    isLoading,
    error,
    isEmpty: !isLoading && (!data || data.length === 0),
    refetch: mutate,
  };
}
