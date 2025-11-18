import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';

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
   * Get all restaurants for admin (no country filtering)
   * Returns all restaurants in the system
   */
  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get all restaurants (ADMIN only)',
    description:
      'Returns all restaurants in the system without country filtering. Only accessible by users with ADMIN role.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all restaurants',
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
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have ADMIN role',
  })
  async getAllRestaurants(
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any[]> {
    this.logger.log('GET /restaurants/all request', {
      operation: 'getAllRestaurants',
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const restaurants =
      await this.restaurantsService.getAllRestaurantsForAdmin();

    this.logger.log('GET /restaurants/all response', {
      operation: 'getAllRestaurants',
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

  /**
   * Create a new restaurant (ADMIN only)
   * Returns the created restaurant
   */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Create restaurant (ADMIN only)',
    description:
      'Creates a new restaurant. Only accessible by users with ADMIN role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', example: 'Spice Paradise' },
        country: { type: 'string', enum: ['IN', 'US'], example: 'IN' },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          example: 'ACTIVE',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have ADMIN role',
  })
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('POST /restaurants request', {
      operation: 'createRestaurant',
      restaurantData: createRestaurantDto,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const restaurant = await this.restaurantsService.createRestaurant(
      createRestaurantDto,
      user.id,
    );

    this.logger.log('POST /restaurants response', {
      operation: 'createRestaurant',
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return restaurant;
  }

  /**
   * Update an existing restaurant (ADMIN only)
   * Returns the updated restaurant
   */
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Update restaurant (ADMIN only)',
    description:
      'Updates an existing restaurant. Only accessible by users with ADMIN role. Cannot change country if restaurant has existing orders.',
  })
  @ApiParam({
    name: 'id',
    description: 'Restaurant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', example: 'Spice Paradise' },
        country: { type: 'string', enum: ['IN', 'US'], example: 'IN' },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          example: 'ACTIVE',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Invalid input data or cannot change country with existing orders',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async updateRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<any> {
    this.logger.log('PATCH /restaurants/:id request', {
      operation: 'updateRestaurant',
      restaurantId: id,
      updateData: updateRestaurantDto,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    const restaurant = await this.restaurantsService.updateRestaurant(
      id,
      updateRestaurantDto,
    );

    this.logger.log('PATCH /restaurants/:id response', {
      operation: 'updateRestaurant',
      restaurantId: id,
      restaurantName: restaurant.name,
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return restaurant;
  }
}
