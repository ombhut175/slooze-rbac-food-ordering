import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { paymentMethods } from '../schema';
import { eq } from 'drizzle-orm';
import { MESSAGES } from '../../../common/constants/string-const';

export interface CreatePaymentMethodDto {
  provider: 'MOCK' | 'STRIPE';
  label: string;
  stripePaymentMethodId?: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  country?: 'IN' | 'US';
  active?: boolean;
  isDefault?: boolean;
  createdByUserId: string;
}

export interface UpdatePaymentMethodDto {
  label?: string;
  active?: boolean;
  isDefault?: boolean;
}

export interface PaymentMethodEntity {
  id: string;
  provider: 'MOCK' | 'STRIPE';
  label: string;
  stripePaymentMethodId: string | null;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  country: 'IN' | 'US' | null;
  active: boolean;
  isDefault: boolean;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PaymentMethodsRepository extends BaseRepository<PaymentMethodEntity> {
  async create(data: CreatePaymentMethodDto): Promise<PaymentMethodEntity> {
    this.logger.log(`Creating payment method: ${data.label}`);

    try {
      const result = await this.db
        .insert(paymentMethods)
        .values({
          provider: data.provider,
          label: data.label,
          stripePaymentMethodId: data.stripePaymentMethodId,
          brand: data.brand,
          last4: data.last4,
          expMonth: data.expMonth,
          expYear: data.expYear,
          country: data.country,
          active: data.active ?? true,
          isDefault: data.isDefault ?? false,
          createdByUserId: data.createdByUserId,
        })
        .returning();

      this.logger.log(`Payment method created successfully: ${result[0].id}`);
      return result[0] as PaymentMethodEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Failed to create payment method', errorStack);
      throw error;
    }
  }

  async findAll(activeOnly = true): Promise<PaymentMethodEntity[]> {
    this.logger.log(
      `Finding all payment methods${activeOnly ? ' (active only)' : ''}`,
    );

    try {
      let result;
      if (activeOnly) {
        result = await this.db
          .select()
          .from(paymentMethods)
          .where(eq(paymentMethods.active, true))
          .orderBy(paymentMethods.createdAt);
      } else {
        result = await this.db
          .select()
          .from(paymentMethods)
          .orderBy(paymentMethods.createdAt);
      }

      this.logger.log(`Found ${result.length} payment methods`);
      return result as PaymentMethodEntity[];
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Error finding payment methods', errorStack);
      throw error;
    }
  }

  async findById(id: string): Promise<PaymentMethodEntity | null> {
    this.logger.log(`Finding payment method by ID: ${id}`);
    const result = await this.findOne(
      paymentMethods,
      eq(paymentMethods.id, id),
    );
    if (result) {
      this.logger.log(`Payment method found: ${result.label} (ID: ${id})`);
    } else {
      this.logger.log(`Payment method not found with ID: ${id}`);
    }
    return result;
  }

  async findByIdOrThrow(id: string): Promise<PaymentMethodEntity> {
    return super.findByIdOrThrow(
      paymentMethods,
      id,
      MESSAGES.PAYMENT_METHOD_NOT_FOUND,
    );
  }

  async update(
    id: string,
    data: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    this.logger.log(`Updating payment method: ${id}`);

    try {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (data.label !== undefined) {
        updateData.label = data.label;
      }

      if (data.active !== undefined) {
        updateData.active = data.active;
      }

      if (data.isDefault !== undefined) {
        updateData.isDefault = data.isDefault;
      }

      const result = await this.db
        .update(paymentMethods)
        .set(updateData)
        .where(eq(paymentMethods.id, id))
        .returning();

      if (!result.length) {
        this.logger.warn(`Payment method not found for update: ${id}`);
        throw new Error(MESSAGES.PAYMENT_METHOD_NOT_FOUND);
      }

      this.logger.log(`Payment method updated successfully: ${id}`);
      return result[0] as PaymentMethodEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Failed to update payment method: ${id}`, errorStack);
      throw error;
    }
  }

  async setAllNonDefault(): Promise<void> {
    this.logger.log('Setting all payment methods to non-default');

    try {
      await this.db
        .update(paymentMethods)
        .set({
          isDefault: false,
          updatedAt: new Date(),
        })
        .where(eq(paymentMethods.isDefault, true));

      this.logger.log('All payment methods set to non-default successfully');
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(
        'Failed to set all payment methods to non-default',
        errorStack,
      );
      throw error;
    }
  }
}
