/**
 * useRestaurantMenu Hook
 * Fetches restaurant details and menu items
 * Combines two API calls into a single hook
 */

import useSWR from 'swr';
import { API_ENDPOINTS } from '@/constants/api';
import { swrFetcher } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Restaurant, MenuItem } from '@/types/food-ordering';

export function useRestaurantMenu(restaurantId: string) {
  hackLog.dev('useRestaurantMenu hook initialized', { restaurantId });

  // Fetch restaurant details
  const {
    data: restaurant,
    error: restaurantError,
    isLoading: isLoadingRestaurant,
  } = useSWR(
    restaurantId ? API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_DETAILS(restaurantId) : null,
    restaurantId ? () => swrFetcher(API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_DETAILS(restaurantId)) as Promise<Restaurant> : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess(
          'GET',
          API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_DETAILS(restaurantId),
          { restaurantName: data?.name }
        );
      },
      onError: (err) => {
        hackLog.apiError(
          'GET',
          API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_DETAILS(restaurantId),
          err
        );
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load restaurant details',
        });
      },
    }
  );

  // Fetch menu items
  const {
    data: menu,
    error: menuError,
    isLoading: isLoadingMenu,
    mutate: mutateMenu,
  } = useSWR(
    restaurantId ? API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_MENU(restaurantId) : null,
    restaurantId ? () => swrFetcher(API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_MENU(restaurantId)) as Promise<MenuItem[]> : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        hackLog.apiSuccess(
          'GET',
          API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_MENU(restaurantId),
          { menuItemCount: data?.length || 0 }
        );
      },
      onError: (err) => {
        hackLog.apiError(
          'GET',
          API_ENDPOINTS.FOOD_ORDERING.RESTAURANT_MENU(restaurantId),
          err
        );
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load menu items',
        });
      },
    }
  );

  const isLoading = isLoadingRestaurant || isLoadingMenu;
  const error = restaurantError || menuError;

  return {
    restaurant,
    menu: menu || [],
    isLoading,
    error,
    isEmpty: !isLoading && (!menu || menu.length === 0),
    refetch: mutateMenu,
  };
}
