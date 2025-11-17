import { Controller, Get, Param, UseGuards, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

/**
 * Controller for restaurant and menu operations
 * All endpoints require authentication
 */
@Controller('restaurants')
@UseGuards(AuthGuard)
@ApiTags('Restaurants')
@ApiBearerAuth()
export class RestaurantsController {
  private readonly logger = new Logger(RestaurantsController.name);

  constructor(private readonly restaurantsService: RestaurantsService) {}

  /**
   * Get all restaurants accessible to the authenticated user
   * ADMIN users see all restaurants
   * MANAGER and MEMBER users see only restaurants in their country
   */
  @Get()
  @ApiOperation({
    summary: 'Get all restaurants',
    description:
      'Returns restaurants based on user role. ADMIN users see all restaurants, MANAGER and MEMBER users see only restaurants in their country.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          country: { type: 'string', enum: ['IN', 'US'] },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
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
    this.logger.log('GET /restaurants request', {
      operation: 'findAll',
      userId: user.id,
      userRole: user.role,
      userCountry: user.country,
      timestamp: new Date().toISOString(),
    });

    const restaurants = await this.restaurantsService.findAll(
      user.role,
      user.country,
    );

    this.logger.log('GET /restaurants response', {
      operation: 'findAll',
      userId: user.id,
      restaurantCount: restaurants.length,
      timestamp: new Date().toISOString(),
    });

    return restaurants;
  }

  /**
   * Get a single restaurant by ID
   * Returns restaurant details
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get restaurant by ID',
    description: 'Returns details for a specific restaurant.',
  })
  @ApiParam({
    name: 'id',
    description: 'Restaurant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        country: { type: 'string', enum: ['IN', 'US'] },
        status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
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
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('GET /restaurants/:id request', {
      operation: 'findOne',
      restaurantId: id,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const restaurant = await this.restaurantsService.findOne(id);

    this.logger.log('GET /restaurants/:id response', {
      operation: 'findOne',
      restaurantId: id,
      userId: user.id,
      restaurantName: restaurant.name,
      timestamp: new Date().toISOString(),
    });

    return restaurant;
  }

  /**
   * Get menu items for a specific restaurant
   * Returns all available menu items
   */
  @Get(':id/menu')
  @ApiOperation({
    summary: 'Get restaurant menu',
    description:
      'Returns all available menu items for the specified restaurant.',
  })
  @ApiParam({
    name: 'id',
    description: 'Restaurant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'List of menu items',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          restaurantId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          priceCents: { type: 'number' },
          currency: { type: 'string' },
          available: { type: 'boolean' },
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
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async getMenu(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any[]> {
    this.logger.log('GET /restaurants/:id/menu request', {
      operation: 'getMenu',
      restaurantId: id,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const menuItems = await this.restaurantsService.getMenu(id);

    this.logger.log('GET /restaurants/:id/menu response', {
      operation: 'getMenu',
      restaurantId: id,
      userId: user.id,
      menuItemCount: menuItems.length,
      timestamp: new Date().toISOString(),
    });

    return menuItems;
  }
}
