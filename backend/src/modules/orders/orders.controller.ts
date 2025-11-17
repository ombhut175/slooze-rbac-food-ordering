import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, AddOrderItemDto, CheckoutOrderDto } from './dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

/**
 * Controller for order operations
 * All endpoints require authentication
 */
@Controller('orders')
@UseGuards(AuthGuard)
@ApiTags('Orders')
@ApiBearerAuth()
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create a new order in DRAFT status
   * Order country is automatically set to user's country
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description:
      "Creates a new order in DRAFT status. Order country is automatically set to the authenticated user's country.",
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        restaurantId: { type: 'string', format: 'uuid' },
        country: { type: 'string', enum: ['IN', 'US'] },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PENDING', 'PAID', 'CANCELED'],
        },
        totalAmountCents: { type: 'number' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('POST /orders request', {
      operation: 'create',
      userId: user.id,
      userRole: user.role,
      userCountry: user.country,
      restaurantId: createOrderDto.restaurantId,
      timestamp: new Date().toISOString(),
    });

    const order = await this.ordersService.create(
      user.id,
      user.country,
      createOrderDto,
    );

    this.logger.log('POST /orders response', {
      operation: 'create',
      orderId: order.id,
      userId: user.id,
      status: order.status,
      timestamp: new Date().toISOString(),
    });

    return order;
  }

  /**
   * Get all orders accessible to the authenticated user
   * ADMIN users see all orders
   * MANAGER and MEMBER users see only orders in their country
   */
  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description:
      'Returns orders based on user role. ADMIN users see all orders, MANAGER and MEMBER users see only orders in their country.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          restaurantId: { type: 'string', format: 'uuid' },
          country: { type: 'string', enum: ['IN', 'US'] },
          status: {
            type: 'string',
            enum: ['DRAFT', 'PENDING', 'PAID', 'CANCELED'],
          },
          totalAmountCents: { type: 'number' },
          currency: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async findAll(
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any[]> {
    this.logger.log('GET /orders request', {
      operation: 'findAll',
      userId: user.id,
      userRole: user.role,
      userCountry: user.country,
      timestamp: new Date().toISOString(),
    });

    const orders = await this.ordersService.findAll(user.role, user.country);

    this.logger.log('GET /orders response', {
      operation: 'findAll',
      userId: user.id,
      orderCount: orders.length,
      timestamp: new Date().toISOString(),
    });

    return orders;
  }

  /**
   * Get a specific order by ID
   * Returns order details if found
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Returns details of a specific order.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Order details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        restaurantId: { type: 'string', format: 'uuid' },
        country: { type: 'string', enum: ['IN', 'US'] },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PENDING', 'PAID', 'CANCELED'],
        },
        totalAmountCents: { type: 'number' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('GET /orders/:id request', {
      operation: 'findOne',
      orderId: id,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const order = await this.ordersService.findOne(id);

    this.logger.log('GET /orders/:id response', {
      operation: 'findOne',
      orderId: order.id,
      userId: user.id,
      status: order.status,
      timestamp: new Date().toISOString(),
    });

    return order;
  }

  /**
   * Add an item to a draft order
   * Validates that the menu item belongs to the order's restaurant
   * If item already exists, updates quantity
   * Recalculates order total
   */
  @Post(':id/items')
  @ApiOperation({
    summary: 'Add item to order',
    description:
      'Adds a menu item to a draft order. If the item already exists, updates the quantity. Order total is automatically recalculated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Item added to order successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        orderId: { type: 'string', format: 'uuid' },
        menuItemId: { type: 'string', format: 'uuid' },
        quantity: { type: 'number' },
        unitPriceCents: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Order or menu item not found',
  })
  @ApiResponse({
    status: 422,
    description:
      'Order is not in DRAFT status, menu item not available, or menu item does not belong to order restaurant',
  })
  async addItem(
    @Param('id') id: string,
    @Body() addOrderItemDto: AddOrderItemDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('POST /orders/:id/items request', {
      operation: 'addItem',
      orderId: id,
      userId: user.id,
      menuItemId: addOrderItemDto.menuItemId,
      quantity: addOrderItemDto.quantity,
      timestamp: new Date().toISOString(),
    });

    const orderItem = await this.ordersService.addItem(id, addOrderItemDto);

    this.logger.log('POST /orders/:id/items response', {
      operation: 'addItem',
      orderId: id,
      orderItemId: orderItem.id,
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return orderItem;
  }

  /**
   * Remove an item from a draft order
   * Recalculates order total
   */
  @Delete(':id/items/:itemId')
  @ApiOperation({
    summary: 'Remove item from order',
    description:
      'Removes an item from a draft order. Order total is automatically recalculated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'itemId',
    description: 'Order item ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removed from order successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Order or order item not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Order is not in DRAFT status',
  })
  async removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<void> {
    this.logger.log('DELETE /orders/:id/items/:itemId request', {
      operation: 'removeItem',
      orderId: id,
      itemId,
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    await this.ordersService.removeItem(id, itemId);

    this.logger.log('DELETE /orders/:id/items/:itemId response', {
      operation: 'removeItem',
      orderId: id,
      itemId,
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Checkout an order with payment processing
   * Only ADMIN and MANAGER roles can checkout orders
   * Processes payment and updates order status to PAID
   */
  @Post(':id/checkout')
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Checkout order',
    description:
      'Processes payment for an order and updates status to PAID. Only ADMIN and MANAGER roles can checkout orders. Order must be in DRAFT or PENDING status.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Order checked out successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        restaurantId: { type: 'string', format: 'uuid' },
        country: { type: 'string', enum: ['IN', 'US'] },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PENDING', 'PAID', 'CANCELED'],
        },
        totalAmountCents: { type: 'number' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have ADMIN or MANAGER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Order or payment method not found',
  })
  @ApiResponse({
    status: 422,
    description:
      'Order status is not valid for checkout, order is empty, or payment processing failed',
  })
  async checkout(
    @Param('id') id: string,
    @Body() checkoutOrderDto: CheckoutOrderDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('POST /orders/:id/checkout request', {
      operation: 'checkout',
      orderId: id,
      userId: user.id,
      userRole: user.role,
      paymentMethodId: checkoutOrderDto.paymentMethodId,
      timestamp: new Date().toISOString(),
    });

    const order = await this.ordersService.checkout(id, checkoutOrderDto);

    this.logger.log('POST /orders/:id/checkout response', {
      operation: 'checkout',
      orderId: order.id,
      userId: user.id,
      status: order.status,
      timestamp: new Date().toISOString(),
    });

    return order;
  }

  /**
   * Cancel an order and its associated payment
   * Only ADMIN and MANAGER roles can cancel orders
   * Updates order status to CANCELED and payment status to CANCELED
   */
  @Post(':id/cancel')
  @Roles('ADMIN', 'MANAGER')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Cancel order',
    description:
      'Cancels an order and its associated payment. Only ADMIN and MANAGER roles can cancel orders. Updates order status to CANCELED and payment status to CANCELED if payment exists.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Order canceled successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        restaurantId: { type: 'string', format: 'uuid' },
        country: { type: 'string', enum: ['IN', 'US'] },
        status: {
          type: 'string',
          enum: ['DRAFT', 'PENDING', 'PAID', 'CANCELED'],
        },
        totalAmountCents: { type: 'number' },
        currency: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have ADMIN or MANAGER role',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('POST /orders/:id/cancel request', {
      operation: 'cancel',
      orderId: id,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const order = await this.ordersService.cancel(id);

    this.logger.log('POST /orders/:id/cancel response', {
      operation: 'cancel',
      orderId: order.id,
      userId: user.id,
      status: order.status,
      timestamp: new Date().toISOString(),
    });

    return order;
  }
}
