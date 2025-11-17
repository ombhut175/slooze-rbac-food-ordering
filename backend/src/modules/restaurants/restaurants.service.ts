import { Injectable, Logger } from '@nestjs/common';
import { RestaurantsRepository } from '../../core/database/repositories/restaurants.repository';
import type {
  RestaurantEntity,
  MenuItemEntity,
} from '../../core/database/repositories/restaurants.repository';

/**
 * Service for managing restaurants with country-scoped access
 * Implements business logic for restaurant and menu operations
 */
@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);

  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  /**
   * Find all restaurants with country-scoped access
   * ADMIN users see all restaurants
   * MANAGER and MEMBER users see only restaurants in their country
   */
  async findAll(
    userRole: 'ADMIN' | 'MANAGER' | 'MEMBER',
    userCountry: 'IN' | 'US',
  ): Promise<RestaurantEntity[]> {
    this.logger.log('Finding restaurants', {
      operation: 'findAll',
      userRole,
      userCountry,
      timestamp: new Date().toISOString(),
    });

    try {
      // ADMIN users see all restaurants
      if (userRole === 'ADMIN') {
        this.logger.log('ADMIN user - returning all restaurants');
        const restaurants = await this.restaurantsRepository.findAll();
        this.logger.log(`Found ${restaurants.length} restaurants for ADMIN`);
        return restaurants;
      }

      // MANAGER and MEMBER users see only their country's restaurants
      this.logger.log(
        `${userRole} user - filtering by country: ${userCountry}`,
      );
      const restaurants = await this.restaurantsRepository.findAll(userCountry);
      this.logger.log(
        `Found ${restaurants.length} restaurants for ${userRole} in ${userCountry}`,
      );
      return restaurants;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding restaurants', {
        operation: 'findAll',
        userRole,
        userCountry,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Find a single restaurant by ID
   * Returns restaurant details
   */
  async findOne(restaurantId: string): Promise<RestaurantEntity> {
    this.logger.log('Finding restaurant by ID', {
      operation: 'findOne',
      restaurantId,
      timestamp: new Date().toISOString(),
    });

    try {
      const restaurant =
        await this.restaurantsRepository.findByIdOrThrow(restaurantId);

      this.logger.log('Restaurant found', {
        restaurantId,
        restaurantName: restaurant.name,
        restaurantCountry: restaurant.country,
      });

      return restaurant;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding restaurant', {
        operation: 'findOne',
        restaurantId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Get menu items for a specific restaurant
   * Returns all available menu items
   */
  async getMenu(restaurantId: string): Promise<MenuItemEntity[]> {
    this.logger.log('Getting restaurant menu', {
      operation: 'getMenu',
      restaurantId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Verify restaurant exists
      const restaurant =
        await this.restaurantsRepository.findByIdOrThrow(restaurantId);

      this.logger.log('Restaurant found, fetching menu items', {
        restaurantId,
        restaurantName: restaurant.name,
        restaurantCountry: restaurant.country,
      });

      const menuItems =
        await this.restaurantsRepository.getMenuItems(restaurantId);

      this.logger.log(`Found ${menuItems.length} menu items`, {
        restaurantId,
        menuItemCount: menuItems.length,
      });

      return menuItems;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error getting restaurant menu', {
        operation: 'getMenu',
        restaurantId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}
