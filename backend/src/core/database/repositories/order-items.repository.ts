import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { orderItems, menuItems } from '../schema';
import { eq, and, sum, sql } from 'drizzle-orm';
import { MESSAGES } from '../../../common/constants/string-const';

export interface CreateOrderItemDto {
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPriceCents: number;
}

export interface OrderItemEntity {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPriceCents: number;
  createdAt: Date;
  menuItem?: {
    id: string;
    name: string;
    description: string | null;
    priceCents: number;
    currency: string;
    available: boolean;
  };
}

@Injectable()
export class OrderItemsRepository extends BaseRepository<OrderItemEntity> {
  async create(data: CreateOrderItemDto): Promise<OrderItemEntity> {
    this.logger.log(
      `Creating order item for order: ${data.orderId}, menu item: ${data.menuItemId}`,
    );

    try {
      const result = await this.db
        .insert(orderItems)
        .values({
          orderId: data.orderId,
          menuItemId: data.menuItemId,
          quantity: data.quantity,
          unitPriceCents: data.unitPriceCents,
        })
        .returning();

      this.logger.log(`Order item created successfully: ${result[0].id}`);
      return result[0] as OrderItemEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Failed to create order item', errorStack);
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<OrderItemEntity[]> {
    this.logger.log(`Finding order items for order: ${orderId}`);

    try {
      const result = await this.db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          menuItemId: orderItems.menuItemId,
          quantity: orderItems.quantity,
          unitPriceCents: orderItems.unitPriceCents,
          createdAt: orderItems.createdAt,
          menuItem: {
            id: menuItems.id,
            name: menuItems.name,
            description: menuItems.description,
            priceCents: menuItems.priceCents,
            currency: menuItems.currency,
            available: menuItems.available,
          },
        })
        .from(orderItems)
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
        .where(eq(orderItems.orderId, orderId));

      this.logger.log(
        `Found ${result.length} order items for order: ${orderId}`,
      );
      return result as OrderItemEntity[];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Error finding order items for order: ${orderId}`,
        errorStack,
      );
      throw error;
    }
  }

  async findByOrderAndMenuItem(
    orderId: string,
    menuItemId: string,
  ): Promise<OrderItemEntity | null> {
    this.logger.log(
      `Finding order item for order: ${orderId}, menu item: ${menuItemId}`,
    );

    const result = await this.findOne(
      orderItems,
      and(
        eq(orderItems.orderId, orderId),
        eq(orderItems.menuItemId, menuItemId),
      ),
    );

    if (result) {
      this.logger.log(
        `Order item found for order: ${orderId}, menu item: ${menuItemId}`,
      );
    } else {
      this.logger.log(
        `Order item not found for order: ${orderId}, menu item: ${menuItemId}`,
      );
    }
    return result;
  }

  async updateQuantity(id: string, quantity: number): Promise<OrderItemEntity> {
    this.logger.log(`Updating order item quantity: ${id} to ${quantity}`);

    try {
      const result = await this.db
        .update(orderItems)
        .set({ quantity })
        .where(eq(orderItems.id, id))
        .returning();

      if (!result.length) {
        this.logger.warn(`Order item not found for update: ${id}`);
        throw new Error(MESSAGES.ORDER_ITEM_NOT_FOUND);
      }

      this.logger.log(`Order item quantity updated successfully: ${id}`);
      return result[0] as OrderItemEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Failed to update order item quantity: ${id}`,
        errorStack,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting order item: ${id}`);

    try {
      const result = await this.db
        .delete(orderItems)
        .where(eq(orderItems.id, id))
        .returning();

      if (!result.length) {
        this.logger.warn(`Order item not found for deletion: ${id}`);
        throw new Error(MESSAGES.ORDER_ITEM_NOT_FOUND);
      }

      this.logger.log(`Order item deleted successfully: ${id}`);
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Failed to delete order item: ${id}`, errorStack);
      throw error;
    }
  }

  async calculateOrderTotal(orderId: string): Promise<number> {
    this.logger.log(`Calculating total for order: ${orderId}`);

    try {
      const result = await this.db
        .select({
          total: sum(
            sql`${orderItems.quantity} * ${orderItems.unitPriceCents}`,
          ),
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      const total = result[0]?.total ? Number(result[0].total) : 0;
      this.logger.log(`Calculated total for order ${orderId}: ${total} cents`);
      return total;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        `Error calculating order total for order: ${orderId}`,
        errorStack,
      );
      throw error;
    }
  }
}
