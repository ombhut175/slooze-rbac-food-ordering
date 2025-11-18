import { apiRequest } from '@/helpers/request';
import hackLog from '@/lib/logger';
import { extractErrorMessage } from '@/helpers/errors';
import type { Restaurant } from '@/types/food-ordering';

// Restaurant API Request Types
export interface CreateRestaurantRequest {
  name: string;
  country: 'IN' | 'US';
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateRestaurantRequest {
  name?: string;
  country?: 'IN' | 'US';
  status?: 'ACTIVE' | 'INACTIVE';
}

// Restaurant API Service
export class RestaurantsAPI {
  /**
   * Get all restaurants for admin (ADMIN only)
   * Returns list of all restaurants from both countries
   */
  static async getAllRestaurantsForAdmin(): Promise<Restaurant[]> {
    try {
      const response = await apiRequest.get<Restaurant[]>('restaurants/all', false);
      
      hackLog.apiSuccess('GET', 'restaurants/all', {
        restaurantCount: response?.length || 0,
        component: 'RestaurantsAPI'
      });

      return response;
    } catch (error) {
      hackLog.apiError('GET', 'restaurants/all', {
        error: error,
        component: 'RestaurantsAPI'
      });
      
      const errorMessage = extractErrorMessage(error, 'Failed to fetch restaurants');
      throw new Error(errorMessage);
    }
  }

  /**
   * Create new restaurant (ADMIN only)
   * Creates a new restaurant in the system
   */
  static async createRestaurant(data: CreateRestaurantRequest): Promise<Restaurant> {
    try {
      const response = await apiRequest.post<Restaurant>('restaurants', data, true);
      
      hackLog.apiSuccess('POST', 'restaurants', {
        restaurantName: data.name,
        country: data.country,
        component: 'RestaurantsAPI'
      });

      return response;
    } catch (error) {
      hackLog.apiError('POST', 'restaurants', {
        error: error,
        data,
        component: 'RestaurantsAPI'
      });
      
      const errorMessage = extractErrorMessage(error, 'Failed to create restaurant');
      throw new Error(errorMessage);
    }
  }

  /**
   * Update restaurant (ADMIN only)
   * Updates an existing restaurant's information
   */
  static async updateRestaurant(restaurantId: string, data: UpdateRestaurantRequest): Promise<Restaurant> {
    try {
      const response = await apiRequest.patch<Restaurant>(`restaurants/${restaurantId}`, data, true);
      
      hackLog.apiSuccess('PATCH', `restaurants/${restaurantId}`, {
        restaurantId,
        updateData: data,
        component: 'RestaurantsAPI'
      });

      return response;
    } catch (error) {
      hackLog.apiError('PATCH', `restaurants/${restaurantId}`, {
        error: error,
        restaurantId,
        data,
        component: 'RestaurantsAPI'
      });
      
      const errorMessage = extractErrorMessage(error, 'Failed to update restaurant');
      throw new Error(errorMessage);
    }
  }
}
