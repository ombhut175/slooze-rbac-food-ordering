/**
 * useAllRestaurants Hook
 * Fetches all restaurants in the system (ADMIN only)
 * Uses SWR for caching and automatic revalidation
 * Unlike useRestaurants, this returns restaurants from ALL countries
 */

import useSWR from 'swr';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Restaurant } from '@/types/food-ordering';

const ALL_RESTAURANTS_ENDPOINT = 'restaurants/all';

export function useAllRestaurants() {
  hackLog.dev('useAllRestaurants hook initialized');

  const { data, error, isLoading, mutate } = useSWR<Restaurant[]>(
    ALL_RESTAURANTS_ENDPOINT,
    () => swrFetcher(ALL_RESTAURANTS_ENDPOINT) as Promise<Restaurant[]>,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', ALL_RESTAURANTS_ENDPOINT, {
          count: data?.length || 0,
        });
      },
      onError: (err) => {
        hackLog.apiError('GET', ALL_RESTAURANTS_ENDPOINT, err);
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
