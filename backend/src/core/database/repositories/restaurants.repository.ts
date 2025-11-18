import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { restaurants, menuItems, orders } from '../schema';
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

  async create(createDto: {
    name: string;
    country: 'IN' | 'US';
    status?: 'ACTIVE' | 'INACTIVE';
  }): Promise<RestaurantEntity> {
    this.logger.log('Creating restaurant', {
      operation: 'create',
      restaurantData: createDto,
      timestamp: new Date().toISOString(),
    });

    try {
      const [newRestaurant] = await this.db
        .insert(restaurants)
        .values({
          name: createDto.name,
          country: createDto.country,
          status: createDto.status || 'ACTIVE',
        })
        .returning();

      this.logger.log('Restaurant created successfully', {
        operation: 'create',
        restaurantId: newRestaurant.id,
        restaurantName: newRestaurant.name,
        timestamp: new Date().toISOString(),
      });

      return newRestaurant as RestaurantEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error creating restaurant', {
        operation: 'create',
        restaurantData: createDto,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async update(
    restaurantId: string,
    updateDto: {
      name?: string;
      country?: 'IN' | 'US';
      status?: 'ACTIVE' | 'INACTIVE';
    },
  ): Promise<RestaurantEntity> {
    this.logger.log('Updating restaurant', {
      operation: 'update',
      restaurantId,
      updateData: updateDto,
      timestamp: new Date().toISOString(),
    });

    try {
      const [updatedRestaurant] = await this.db
        .update(restaurants)
        .set({
          ...updateDto,
          updatedAt: new Date(),
        })
        .where(eq(restaurants.id, restaurantId))
        .returning();

      if (!updatedRestaurant) {
        this.logger.error('Restaurant not found for update', {
          operation: 'update',
          restaurantId,
          timestamp: new Date().toISOString(),
        });
        throw new NotFoundException(
          `Restaurant with ID ${restaurantId} not found`,
        );
      }

      this.logger.log('Restaurant updated successfully', {
        operation: 'update',
        restaurantId,
        restaurantName: updatedRestaurant.name,
        timestamp: new Date().toISOString(),
      });

      return updatedRestaurant as RestaurantEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error updating restaurant', {
        operation: 'update',
        restaurantId,
        updateData: updateDto,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  async hasOrders(restaurantId: string): Promise<boolean> {
    this.logger.log('Checking if restaurant has orders', {
      operation: 'hasOrders',
      restaurantId,
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await this.db
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.restaurantId, restaurantId))
        .limit(1);

      const hasOrders = result.length > 0;

      this.logger.log('Restaurant orders check complete', {
        operation: 'hasOrders',
        restaurantId,
        hasOrders,
        timestamp: new Date().toISOString(),
      });

      return hasOrders;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error checking restaurant orders', {
        operation: 'hasOrders',
        restaurantId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}
