/**
 * useRestaurants Hook
 * Fetches the list of restaurants with SWR caching
 * Automatically filtered by user's country on the backend
 */

import useSWR from 'swr';
import { API_ENDPOINTS } from '@/constants/api';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Restaurant } from '@/types/food-ordering';

export function useRestaurants() {
  hackLog.dev('useRestaurants hook initialized');

  const { data, error, isLoading, mutate } = useSWR(
    API_ENDPOINTS.FOOD_ORDERING.RESTAURANTS,
    () => swrFetcher(API_ENDPOINTS.FOOD_ORDERING.RESTAURANTS) as Promise<Restaurant[]>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', API_ENDPOINTS.FOOD_ORDERING.RESTAURANTS, {
          count: data?.length || 0,
        });
      },
      onError: (err) => {
        hackLog.apiError('GET', API_ENDPOINTS.FOOD_ORDERING.RESTAURANTS, err);
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load restaurants',
        });
      },
    }
  );

  return {
    restaurants: data || [],
    isLoading,
    error,
    isEmpty: !isLoading && (!data || data.length === 0),
    refetch: mutate,
  };
}
