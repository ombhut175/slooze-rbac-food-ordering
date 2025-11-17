import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Controller for payment method management
 * All endpoints require authentication
 * Create and update operations require ADMIN role
 */
@Controller('payment-methods')
@UseGuards(AuthGuard)
@ApiTags('Payment Methods')
@ApiBearerAuth()
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  /**
   * Get all active payment methods
   * Accessible to all authenticated users
   */
  @Get()
  @ApiOperation({
    summary: 'Get all active payment methods',
    description:
      'Returns all active payment methods. Accessible to all authenticated users.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active payment methods',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          provider: { type: 'string', enum: ['MOCK', 'STRIPE'] },
          label: { type: 'string' },
          brand: { type: 'string', nullable: true },
          last4: { type: 'string', nullable: true },
          expMonth: { type: 'number', nullable: true },
          expYear: { type: 'number', nullable: true },
          country: { type: 'string', enum: ['IN', 'US'], nullable: true },
          active: { type: 'boolean' },
          isDefault: { type: 'boolean' },
          createdByUserId: { type: 'string', format: 'uuid' },
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
  async findAll() {
    return this.paymentMethodsService.findAll();
  }

  /**
   * Create a new payment method
   * Only ADMIN users can create payment methods
   */
  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Create a new payment method',
    description:
      'Creates a new payment method with MOCK provider. Only accessible to ADMIN users. Automatically generates mock last4 and brand if not provided.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment method created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        provider: { type: 'string', enum: ['MOCK'] },
        label: { type: 'string' },
        brand: { type: 'string' },
        last4: { type: 'string' },
        expMonth: { type: 'number', nullable: true },
        expYear: { type: 'number', nullable: true },
        country: { type: 'string', enum: ['IN', 'US'], nullable: true },
        active: { type: 'boolean' },
        isDefault: { type: 'boolean' },
        createdByUserId: { type: 'string', format: 'uuid' },
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
  async create(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentMethodsService.create(createPaymentMethodDto, userId);
  }

  /**
   * Update an existing payment method
   * Only ADMIN users can update payment methods
   */
  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Update a payment method',
    description:
      'Updates an existing payment method. Only accessible to ADMIN users. Can update label, active status, and default status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        provider: { type: 'string', enum: ['MOCK', 'STRIPE'] },
        label: { type: 'string' },
        brand: { type: 'string', nullable: true },
        last4: { type: 'string', nullable: true },
        expMonth: { type: 'number', nullable: true },
        expYear: { type: 'number', nullable: true },
        country: { type: 'string', enum: ['IN', 'US'], nullable: true },
        active: { type: 'boolean' },
        isDefault: { type: 'boolean' },
        createdByUserId: { type: 'string', format: 'uuid' },
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
  @ApiResponse({
    status: 404,
    description: 'Not Found - Payment method not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(id, updatePaymentMethodDto);
  }
}
