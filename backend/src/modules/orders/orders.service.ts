import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrdersRepository } from '../../core/database/repositories/orders.repository';
import { RestaurantsRepository } from '../../core/database/repositories/restaurants.repository';
import { OrderItemsRepository } from '../../core/database/repositories/order-items.repository';
import type { OrderEntity } from '../../core/database/repositories/orders.repository';
import type { OrderItemEntity } from '../../core/database/repositories/order-items.repository';
import { CreateOrderDto, AddOrderItemDto, CheckoutOrderDto } from './dto';
import { MESSAGES } from '../../common/constants/string-const';
import { MockPaymentService } from './mock-payment.service';

/**
 * Service for managing orders with country-scoped access
 * Implements business logic for order operations
 */
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly mockPaymentService: MockPaymentService,
  ) {}

  /**
   * Create a new order in DRAFT status
   * Order country is set to user's country
   * Order total is initialized to 0
   */
  async create(
    userId: string,
    userCountry: 'IN' | 'US',
    dto: CreateOrderDto,
  ): Promise<OrderEntity> {
    this.logger.log('Creating order', {
      operation: 'create',
      userId,
      userCountry,
      restaurantId: dto.restaurantId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Verify restaurant exists
      const restaurant = await this.restaurantsRepository.findByIdOrThrow(
        dto.restaurantId,
      );

      this.logger.log('Restaurant found, creating order', {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantCountry: restaurant.country,
        userCountry,
      });

      // Create order with user's country
      const order = await this.ordersRepository.create({
        userId,
        restaurantId: dto.restaurantId,
        country: userCountry,
        currency: restaurant.country === 'IN' ? 'INR' : 'USD',
      });

      this.logger.log('Order created successfully', {
        orderId: order.id,
        userId,
        restaurantId: dto.restaurantId,
        country: order.country,
        status: order.status,
      });

      return order;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error creating order', {
        operation: 'create',
        userId,
        userCountry,
        restaurantId: dto.restaurantId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Find all orders with country-scoped access
   * ADMIN users see all orders
   * MANAGER and MEMBER users see only orders in their country
   */
  async findAll(
    userRole: 'ADMIN' | 'MANAGER' | 'MEMBER',
    userCountry: 'IN' | 'US',
  ): Promise<OrderEntity[]> {
    this.logger.log('Finding orders', {
      operation: 'findAll',
      userRole,
      userCountry,
      timestamp: new Date().toISOString(),
    });

    try {
      // ADMIN users see all orders
      if (userRole === 'ADMIN') {
        this.logger.log('ADMIN user - returning all orders');
        const orders = await this.ordersRepository.findAll();
        this.logger.log(`Found ${orders.length} orders for ADMIN`);
        return orders;
      }

      // MANAGER and MEMBER users see only their country's orders
      this.logger.log(
        `${userRole} user - filtering by country: ${userCountry}`,
      );
      const orders = await this.ordersRepository.findAll(
        undefined,
        userCountry,
      );
      this.logger.log(
        `Found ${orders.length} orders for ${userRole} in ${userCountry}`,
      );
      return orders;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding orders', {
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
   * Find a specific order by ID
   * Returns order with items if found, throws NotFoundException otherwise
   */
  async findOne(
    orderId: string,
  ): Promise<OrderEntity & { items?: OrderItemEntity[] }> {
    this.logger.log('Finding order by ID', {
      operation: 'findOne',
      orderId,
      timestamp: new Date().toISOString(),
    });

    try {
      const order = await this.ordersRepository.findById(orderId);

      if (!order) {
        this.logger.warn('Order not found', { orderId });
        throw new NotFoundException(MESSAGES.ORDER_NOT_FOUND);
      }

      // Fetch order items
      const items = await this.orderItemsRepository.findByOrderId(orderId);

      this.logger.log('Order found', {
        orderId: order.id,
        userId: order.userId,
        restaurantId: order.restaurantId,
        status: order.status,
        country: order.country,
        itemCount: items.length,
      });

      return {
        ...order,
        items,
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding order', {
        operation: 'findOne',
        orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Add an item to a draft order
   * Validates that the order is in DRAFT status
   * Validates that the menu item belongs to the order's restaurant
   * If item already exists, updates quantity
   * Recalculates order total after adding item
   */
  async addItem(
    orderId: string,
    dto: AddOrderItemDto,
  ): Promise<OrderItemEntity> {
    this.logger.log('Adding item to order', {
      operation: 'addItem',
      orderId,
      menuItemId: dto.menuItemId,
      quantity: dto.quantity,
      timestamp: new Date().toISOString(),
    });

    try {
      // Get order and verify it exists
      const order = await this.ordersRepository.findById(orderId);
      if (!order) {
        this.logger.warn('Order not found', { orderId });
        throw new NotFoundException(MESSAGES.ORDER_NOT_FOUND);
      }

      // Verify order is in DRAFT status
      if (order.status !== 'DRAFT') {
        this.logger.warn('Order is not in DRAFT status', {
          orderId,
          status: order.status,
        });
        throw new UnprocessableEntityException(MESSAGES.ORDER_NOT_DRAFT);
      }

      // Get menu item and verify it exists
      const menuItem = await this.restaurantsRepository.findMenuItemById(
        dto.menuItemId,
      );
      if (!menuItem) {
        this.logger.warn('Menu item not found', {
          menuItemId: dto.menuItemId,
        });
        throw new NotFoundException(MESSAGES.MENU_ITEM_NOT_FOUND);
      }

      // Verify menu item is available
      if (!menuItem.available) {
        this.logger.warn('Menu item is not available', {
          menuItemId: dto.menuItemId,
        });
        throw new UnprocessableEntityException(
          MESSAGES.MENU_ITEM_NOT_AVAILABLE,
        );
      }

      // Verify menu item belongs to order's restaurant
      if (menuItem.restaurantId !== order.restaurantId) {
        this.logger.warn('Menu item does not belong to order restaurant', {
          menuItemId: dto.menuItemId,
          menuItemRestaurantId: menuItem.restaurantId,
          orderRestaurantId: order.restaurantId,
        });
        throw new UnprocessableEntityException(
          MESSAGES.MENU_ITEM_WRONG_RESTAURANT,
        );
      }

      this.logger.log('Validation passed, adding/updating order item', {
        orderId,
        menuItemId: dto.menuItemId,
        menuItemName: menuItem.name,
        unitPrice: menuItem.priceCents,
      });

      // Check if item already exists in order
      const existingItem =
        await this.orderItemsRepository.findByOrderAndMenuItem(
          orderId,
          dto.menuItemId,
        );

      let orderItem: OrderItemEntity;

      if (existingItem) {
        // Update existing item quantity
        this.logger.log('Updating existing order item quantity', {
          orderItemId: existingItem.id,
          oldQuantity: existingItem.quantity,
          newQuantity: dto.quantity,
        });
        orderItem = await this.orderItemsRepository.updateQuantity(
          existingItem.id,
          dto.quantity,
        );
      } else {
        // Create new order item
        this.logger.log('Creating new order item', {
          orderId,
          menuItemId: dto.menuItemId,
          quantity: dto.quantity,
          unitPrice: menuItem.priceCents,
        });
        orderItem = await this.orderItemsRepository.create({
          orderId,
          menuItemId: dto.menuItemId,
          quantity: dto.quantity,
          unitPriceCents: menuItem.priceCents,
        });
      }

      // Recalculate and update order total
      await this.recalculateOrderTotal(orderId);

      this.logger.log('Item added to order successfully', {
        orderId,
        orderItemId: orderItem.id,
        menuItemId: dto.menuItemId,
        quantity: dto.quantity,
      });

      return orderItem;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error adding item to order', {
        operation: 'addItem',
        orderId,
        menuItemId: dto.menuItemId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Remove an item from a draft order
   * Recalculates order total after removing item
   */
  async removeItem(orderId: string, itemId: string): Promise<void> {
    this.logger.log('Removing item from order', {
      operation: 'removeItem',
      orderId,
      itemId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Get order and verify it exists
      const order = await this.ordersRepository.findById(orderId);
      if (!order) {
        this.logger.warn('Order not found', { orderId });
        throw new NotFoundException(MESSAGES.ORDER_NOT_FOUND);
      }

      // Verify order is in DRAFT status
      if (order.status !== 'DRAFT') {
        this.logger.warn('Order is not in DRAFT status', {
          orderId,
          status: order.status,
        });
        throw new UnprocessableEntityException(MESSAGES.ORDER_NOT_DRAFT);
      }

      this.logger.log('Validation passed, deleting order item', {
        orderId,
        itemId,
      });

      // Delete the order item
      await this.orderItemsRepository.delete(itemId);

      // Recalculate and update order total
      await this.recalculateOrderTotal(orderId);

      this.logger.log('Item removed from order successfully', {
        orderId,
        itemId,
      });
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error removing item from order', {
        operation: 'removeItem',
        orderId,
        itemId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Checkout an order with payment processing
   * Validates order status, processes payment, and updates order status to PAID
   * Only ADMIN and MANAGER roles can checkout orders
   */
  async checkout(orderId: string, dto: CheckoutOrderDto): Promise<OrderEntity> {
    this.logger.log('Checking out order', {
      operation: 'checkout',
      orderId,
      paymentMethodId: dto.paymentMethodId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Get order and verify it exists
      const order = await this.ordersRepository.findById(orderId);
      if (!order) {
        this.logger.warn('Order not found', { orderId });
        throw new NotFoundException(MESSAGES.ORDER_NOT_FOUND);
      }

      // Verify order status is DRAFT or PENDING
      if (order.status !== 'DRAFT' && order.status !== 'PENDING') {
        this.logger.warn('Order status is not valid for checkout', {
          orderId,
          status: order.status,
        });
        throw new UnprocessableEntityException(
          MESSAGES.ORDER_INVALID_STATUS_FOR_CHECKOUT,
        );
      }

      // Verify order has items
      if (order.totalAmountCents <= 0) {
        this.logger.warn('Order has no items or zero total', {
          orderId,
          totalAmountCents: order.totalAmountCents,
        });
        throw new UnprocessableEntityException(MESSAGES.ORDER_EMPTY);
      }

      this.logger.log('Order validation passed, processing payment', {
        orderId,
        totalAmountCents: order.totalAmountCents,
        currency: order.currency,
      });

      // Process payment using MockPaymentService
      const payment = await this.mockPaymentService.processPayment(
        orderId,
        dto.paymentMethodId,
        order.totalAmountCents,
        order.currency,
      );

      this.logger.log('Payment processed', {
        orderId,
        paymentId: payment.id,
        paymentStatus: payment.status,
      });

      // Check if payment was successful
      if (payment.status !== 'SUCCEEDED') {
        this.logger.error('Payment failed', {
          orderId,
          paymentId: payment.id,
          paymentStatus: payment.status,
          errorCode: payment.errorCode,
          errorMessage: payment.errorMessage,
        });
        throw new UnprocessableEntityException(
          payment.errorMessage || MESSAGES.PAYMENT_FAILED,
        );
      }

      // Update order status to PAID
      const updatedOrder = await this.ordersRepository.updateStatus(
        orderId,
        'PAID',
      );

      this.logger.log('Order checkout completed successfully', {
        orderId,
        paymentId: payment.id,
        orderStatus: updatedOrder.status,
        timestamp: new Date().toISOString(),
      });

      return updatedOrder;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error checking out order', {
        operation: 'checkout',
        orderId,
        paymentMethodId: dto.paymentMethodId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Cancel an order and its associated payment
   * Updates order status to CANCELED
   * Updates payment status to CANCELED if payment exists
   * Only ADMIN and MANAGER roles can cancel orders
   */
  async cancel(orderId: string): Promise<OrderEntity> {
    this.logger.log('Canceling order', {
      operation: 'cancel',
      orderId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Get order and verify it exists
      const order = await this.ordersRepository.findById(orderId);
      if (!order) {
        this.logger.warn('Order not found', { orderId });
        throw new NotFoundException(MESSAGES.ORDER_NOT_FOUND);
      }

      this.logger.log('Order found, proceeding with cancellation', {
        orderId,
        currentStatus: order.status,
      });

      // Update order status to CANCELED
      const canceledOrder = await this.ordersRepository.updateStatus(
        orderId,
        'CANCELED',
      );

      this.logger.log('Order status updated to CANCELED', {
        orderId,
        previousStatus: order.status,
        newStatus: canceledOrder.status,
      });

      // Find and cancel associated payment if it exists
      const payment =
        await this.mockPaymentService.findPaymentByOrderId(orderId);

      if (payment) {
        this.logger.log('Payment found, canceling payment', {
          orderId,
          paymentId: payment.id,
          paymentStatus: payment.status,
        });

        await this.mockPaymentService.cancelPayment(payment.id);

        this.logger.log('Payment canceled successfully', {
          orderId,
          paymentId: payment.id,
        });
      } else {
        this.logger.log(
          'No payment found for order, skipping payment cancellation',
          {
            orderId,
          },
        );
      }

      this.logger.log('Order cancellation completed successfully', {
        orderId,
        timestamp: new Date().toISOString(),
      });

      return canceledOrder;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error canceling order', {
        operation: 'cancel',
        orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Recalculate order total based on order items
   * Private helper method used after adding or removing items
   */
  private async recalculateOrderTotal(orderId: string): Promise<void> {
    this.logger.log('Recalculating order total', {
      operation: 'recalculateOrderTotal',
      orderId,
      timestamp: new Date().toISOString(),
    });

    try {
      const total =
        await this.orderItemsRepository.calculateOrderTotal(orderId);

      await this.ordersRepository.updateTotal(orderId, total);

      this.logger.log('Order total recalculated', {
        orderId,
        totalCents: total,
      });
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error recalculating order total', {
        operation: 'recalculateOrderTotal',
        orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}
