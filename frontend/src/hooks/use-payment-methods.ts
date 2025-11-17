/**
 * usePaymentMethods Hook
 * Fetches the list of payment methods with SWR caching
 * Used for checkout and payment methods management pages
 */

import useSWR from 'swr';
import { API_ENDPOINTS } from '@/constants/api';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { PaymentMethod } from '@/types/food-ordering';

export function usePaymentMethods() {
  hackLog.dev('usePaymentMethods hook initialized');

  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS,
    () => swrFetcher(API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS) as Promise<PaymentMethod[]>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS, {
          count: data?.length || 0,
          activeCount: data?.filter((pm) => pm.active).length || 0,
        });
      },
      onError: (err) => {
        hackLog.apiError('GET', API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS, err);
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load payment methods',
        });
      },
    }
  );

  // Filter to only active payment methods for checkout
  const activePaymentMethods = data?.filter((pm) => pm.active) || [];

  return {
    paymentMethods: data || [],
    activePaymentMethods,
    isLoading,
    error,
    isEmpty: !isLoading && (!data || data.length === 0),
    refetch: mutate,
  };
}
