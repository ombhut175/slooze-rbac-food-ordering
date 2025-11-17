import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { orders, restaurants } from '../schema';
import { eq, and } from 'drizzle-orm';
import { MESSAGES } from '../../../common/constants/string-const';

export interface CreateOrderDto {
  userId: string;
  restaurantId: string;
  country: 'IN' | 'US';
  currency: string;
}

export interface OrderEntity {
  id: string;
  userId: string;
  restaurantId: string;
  country: 'IN' | 'US';
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELED';
  totalAmountCents: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  restaurant?: {
    id: string;
    name: string;
    country: 'IN' | 'US';
    status: 'ACTIVE' | 'INACTIVE';
  };
}

@Injectable()
export class OrdersRepository extends BaseRepository<OrderEntity> {
  async create(data: CreateOrderDto): Promise<OrderEntity> {
    this.logger.log(
      `Creating order for user: ${data.userId}, restaurant: ${data.restaurantId}`,
    );

    try {
      const result = await this.db
        .insert(orders)
        .values({
          userId: data.userId,
          restaurantId: data.restaurantId,
          country: data.country,
          currency: data.currency,
          status: 'DRAFT',
          totalAmountCents: 0,
        })
        .returning();

      this.logger.log(`Order created successfully: ${result[0].id}`);
      return result[0] as OrderEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Failed to create order', errorStack);
      throw error;
    }
  }

  async findAll(userId?: string, country?: string): Promise<OrderEntity[]> {
    this.logger.log(
      `Finding all orders${userId ? ` for user: ${userId}` : ''}${country ? ` in country: ${country}` : ''}`,
    );

    try {
      const conditions = [];
      if (userId) {
        conditions.push(eq(orders.userId, userId));
      }
      if (country) {
        conditions.push(eq(orders.country, country as 'IN' | 'US'));
      }

      let result;
      if (conditions.length > 0) {
        result = await this.db
          .select({
            id: orders.id,
            userId: orders.userId,
            restaurantId: orders.restaurantId,
            country: orders.country,
            status: orders.status,
            totalAmountCents: orders.totalAmountCents,
            currency: orders.currency,
            createdAt: orders.createdAt,
            updatedAt: orders.updatedAt,
            restaurant: {
              id: restaurants.id,
              name: restaurants.name,
              country: restaurants.country,
              status: restaurants.status,
            },
          })
          .from(orders)
          .leftJoin(restaurants, eq(orders.restaurantId, restaurants.id))
          .where(and(...conditions))
          .orderBy(orders.createdAt);
      } else {
        result = await this.db
          .select({
            id: orders.id,
            userId: orders.userId,
            restaurantId: orders.restaurantId,
            country: orders.country,
            status: orders.status,
            totalAmountCents: orders.totalAmountCents,
            currency: orders.currency,
            createdAt: orders.createdAt,
            updatedAt: orders.updatedAt,
            restaurant: {
              id: restaurants.id,
              name: restaurants.name,
              country: restaurants.country,
              status: restaurants.status,
            },
          })
          .from(orders)
          .leftJoin(restaurants, eq(orders.restaurantId, restaurants.id))
          .orderBy(orders.createdAt);
      }

      this.logger.log(`Found ${result.length} orders`);
      return result as OrderEntity[];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding orders', errorStack);
      throw error;
    }
  }

  async findById(id: string): Promise<OrderEntity | null> {
    this.logger.log(`Finding order by ID: ${id}`);

    try {
      const result = await this.db
        .select({
          id: orders.id,
          userId: orders.userId,
          restaurantId: orders.restaurantId,
          country: orders.country,
          status: orders.status,
          totalAmountCents: orders.totalAmountCents,
          currency: orders.currency,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          restaurant: {
            id: restaurants.id,
            name: restaurants.name,
            country: restaurants.country,
            status: restaurants.status,
          },
        })
        .from(orders)
        .leftJoin(restaurants, eq(orders.restaurantId, restaurants.id))
        .where(eq(orders.id, id))
        .limit(1);

      if (result.length > 0) {
        this.logger.log(`Order found: ${id}`);
        return result[0] as OrderEntity;
      } else {
        this.logger.log(`Order not found with ID: ${id}`);
        return null;
      }
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding order by ID', errorStack);
      throw error;
    }
  }

  async findByIdOrThrow(id: string): Promise<OrderEntity> {
    const order = await this.findById(id);
    if (!order) {
      throw new Error(MESSAGES.ORDER_NOT_FOUND);
    }
    return order;
  }

  async updateTotal(orderId: string, totalCents: number): Promise<OrderEntity> {
    this.logger.log(`Updating order total: ${orderId} to ${totalCents} cents`);

    try {
      const result = await this.db
        .update(orders)
        .set({
          totalAmountCents: totalCents,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      if (!result.length) {
        this.logger.warn(`Order not found for update: ${orderId}`);
        throw new Error(MESSAGES.ORDER_NOT_FOUND);
      }

      this.logger.log(`Order total updated successfully: ${orderId}`);
      return result[0] as OrderEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Failed to update order total: ${orderId}`, errorStack);
      throw error;
    }
  }

  async updateStatus(
    orderId: string,
    status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELED',
  ): Promise<OrderEntity> {
    this.logger.log(`Updating order status: ${orderId} to ${status}`);

    try {
      const result = await this.db
        .update(orders)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      if (!result.length) {
        this.logger.warn(`Order not found for status update: ${orderId}`);
        throw new Error(MESSAGES.ORDER_NOT_FOUND);
      }

      this.logger.log(`Order status updated successfully: ${orderId}`);
      return result[0] as OrderEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Failed to update order status: ${orderId}`,
        errorStack,
      );
      throw error;
    }
  }
}
