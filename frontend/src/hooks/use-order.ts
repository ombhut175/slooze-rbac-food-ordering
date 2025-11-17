/**
 * useOrder Hook
 * Fetches a single order with its items and related data
 * Used for order details and checkout pages
 */

import useSWR from 'swr';
import { API_ENDPOINTS } from '@/constants/api';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Order } from '@/types/food-ordering';

export function useOrder(orderId: string | null) {
  hackLog.dev('useOrder hook initialized', { orderId });

  const { data, error, isLoading, mutate } = useSWR(
    orderId ? API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(orderId) : null,
    orderId ? () => swrFetcher(API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(orderId)) as Promise<Order> : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(orderId!), {
          orderId: data?.id,
          status: data?.status,
          itemCount: data?.items?.length || 0,
        });
      },
      onError: (err) => {
        hackLog.apiError('GET', API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(orderId!), err);
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load order details',
        });
      },
    }
  );

  return {
    order: data || null,
    isLoading,
    error,
    refetch: mutate,
  };
}
