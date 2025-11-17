import { Injectable, Logger } from '@nestjs/common';
import { PaymentMethodsRepository } from '../../core/database/repositories/payment-methods.repository';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import type { PaymentMethodEntity } from '../../core/database/repositories/payment-methods.repository';

/**
 * Service for managing payment methods
 * Handles CRUD operations and business logic for payment methods
 */
@Injectable()
export class PaymentMethodsService {
  private readonly logger = new Logger(PaymentMethodsService.name);

  constructor(
    private readonly paymentMethodsRepository: PaymentMethodsRepository,
  ) {}

  /**
   * Get all active payment methods
   * Accessible to all authenticated users
   */
  async findAll(): Promise<PaymentMethodEntity[]> {
    this.logger.log('Finding all active payment methods', {
      operation: 'findAll',
      timestamp: new Date().toISOString(),
    });

    try {
      const paymentMethods = await this.paymentMethodsRepository.findAll(true);

      this.logger.log(`Found ${paymentMethods.length} active payment methods`, {
        count: paymentMethods.length,
      });

      return paymentMethods;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding payment methods', {
        operation: 'findAll',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Create a new payment method
   * Only ADMIN users can create payment methods
   * Generates mock last4 and brand if not provided
   */
  async create(
    dto: CreatePaymentMethodDto,
    createdByUserId: string,
  ): Promise<PaymentMethodEntity> {
    this.logger.log('Creating new payment method', {
      operation: 'create',
      label: dto.label,
      createdByUserId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Generate mock last4 if not provided (random 4 digits)
      const last4 = dto.last4 || this.generateMockLast4();

      // Set brand to MOCK
      const brand = 'MOCK';

      // If isDefault is true, set all other payment methods to non-default
      if (dto.isDefault) {
        await this.paymentMethodsRepository.setAllNonDefault();
        this.logger.log('Set all existing payment methods to non-default');
      }

      const paymentMethod = await this.paymentMethodsRepository.create({
        provider: 'MOCK',
        label: dto.label,
        brand,
        last4,
        expMonth: dto.expMonth,
        expYear: dto.expYear,
        country: dto.country,
        isDefault: dto.isDefault ?? false,
        active: true,
        createdByUserId,
      });

      this.logger.log('Payment method created successfully', {
        id: paymentMethod.id,
        label: paymentMethod.label,
        last4: paymentMethod.last4,
      });

      return paymentMethod;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error creating payment method', {
        operation: 'create',
        label: dto.label,
        createdByUserId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Update an existing payment method
   * Only ADMIN users can update payment methods
   * Enforces single default payment method constraint
   */
  async update(
    id: string,
    dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    this.logger.log('Updating payment method', { id, updates: dto });

    try {
      // Verify payment method exists first
      await this.paymentMethodsRepository.findByIdOrThrow(id);

      // If setting this as default, set all others to non-default first
      if (dto.isDefault === true) {
        await this.paymentMethodsRepository.setAllNonDefault();
        this.logger.log('Set all existing payment methods to non-default');
      }

      const paymentMethod = await this.paymentMethodsRepository.update(id, dto);

      this.logger.log('Payment method updated successfully', {
        id: paymentMethod.id,
        label: paymentMethod.label,
      });

      return paymentMethod;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error updating payment method', {
        operation: 'update',
        id,
        updates: dto,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  /**
   * Generate a random 4-digit string for mock last4
   */
  private generateMockLast4(): string {
    const randomNum = Math.floor(Math.random() * 10000);
    return randomNum.toString().padStart(4, '0');
  }
}
