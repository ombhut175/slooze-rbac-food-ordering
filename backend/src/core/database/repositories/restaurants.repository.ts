import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { restaurants, menuItems } from '../schema';
import { eq, and } from 'drizzle-orm';
import { MESSAGES } from '../../../common/constants/string-const';

export interface RestaurantEntity {
  id: string;
  name: string;
  country: 'IN' | 'US';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemEntity {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class RestaurantsRepository extends BaseRepository<RestaurantEntity> {
  async findAll(country?: string): Promise<RestaurantEntity[]> {
    this.logger.log(
      `Finding all restaurants${country ? ` for country: ${country}` : ''}`,
    );

    try {
      let result;
      if (country) {
        result = await this.db
          .select()
          .from(restaurants)
          .where(eq(restaurants.country, country as 'IN' | 'US'))
          .orderBy(restaurants.name);
      } else {
        result = await this.db
          .select()
          .from(restaurants)
          .orderBy(restaurants.name);
      }

      this.logger.log(`Found ${result.length} restaurants`);
      return result as RestaurantEntity[];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding restaurants', errorStack);
      throw error;
    }
  }

  async findById(id: string): Promise<RestaurantEntity | null> {
    this.logger.log(`Finding restaurant by ID: ${id}`);
    const result = await this.findOne(restaurants, eq(restaurants.id, id));
    if (result) {
      this.logger.log(`Restaurant found: ${result.name} (ID: ${id})`);
    } else {
      this.logger.log(`Restaurant not found with ID: ${id}`);
    }
    return result;
  }

  async findByIdOrThrow(id: string): Promise<RestaurantEntity> {
    return super.findByIdOrThrow(
      restaurants,
      id,
      MESSAGES.RESTAURANT_NOT_FOUND,
    );
  }

  async getMenuItems(restaurantId: string): Promise<MenuItemEntity[]> {
    this.logger.log(`Finding menu items for restaurant: ${restaurantId}`);

    try {
      const result = await this.db
        .select()
        .from(menuItems)
        .where(
          and(
            eq(menuItems.restaurantId, restaurantId),
            eq(menuItems.available, true),
          ),
        )
        .orderBy(menuItems.name);

      this.logger.log(
        `Found ${result.length} menu items for restaurant: ${restaurantId}`,
      );
      return result as MenuItemEntity[];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Error finding menu items for restaurant: ${restaurantId}`,
        errorStack,
      );
      throw error;
    }
  }

  async findMenuItemById(id: string): Promise<MenuItemEntity | null> {
    this.logger.log(`Finding menu item by ID: ${id}`);

    try {
      const result = await this.db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, id))
        .limit(1);

      if (result.length > 0) {
        this.logger.log(`Menu item found: ${result[0].name} (ID: ${id})`);
        return result[0] as MenuItemEntity;
      } else {
        this.logger.log(`Menu item not found with ID: ${id}`);
        return null;
      }
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Error finding menu item by ID: ${id}`, errorStack);
      throw error;
    }
  }
}
