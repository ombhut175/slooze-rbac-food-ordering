import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { payments } from '../schema';
import { eq } from 'drizzle-orm';
import { MESSAGES } from '../../../common/constants/string-const';

export interface CreatePaymentDto {
  orderId: string;
  paymentMethodId: string;
  provider: 'MOCK' | 'STRIPE';
  amountCents: number;
  currency: string;
  status: 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  stripePaymentIntentId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface PaymentEntity {
  id: string;
  orderId: string;
  paymentMethodId: string;
  provider: 'MOCK' | 'STRIPE';
  amountCents: number;
  currency: string;
  status: 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  stripePaymentIntentId: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PaymentsRepository extends BaseRepository<PaymentEntity> {
  async create(data: CreatePaymentDto): Promise<PaymentEntity> {
    this.logger.log(`Creating payment for order: ${data.orderId}`);

    try {
      const result = await this.db
        .insert(payments)
        .values({
          orderId: data.orderId,
          paymentMethodId: data.paymentMethodId,
          provider: data.provider,
          amountCents: data.amountCents,
          currency: data.currency,
          status: data.status,
          stripePaymentIntentId: data.stripePaymentIntentId,
          errorCode: data.errorCode,
          errorMessage: data.errorMessage,
        })
        .returning();

      this.logger.log(`Payment created successfully: ${result[0].id}`);
      return result[0] as PaymentEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error('Failed to create payment', errorStack);
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    this.logger.log(`Finding payment by order ID: ${orderId}`);
    const result = await this.findOne(payments, eq(payments.orderId, orderId));
    if (result) {
      this.logger.log(`Payment found for order: ${orderId}`);
    } else {
      this.logger.log(`Payment not found for order: ${orderId}`);
    }
    return result;
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    this.logger.log(`Finding payment by ID: ${id}`);
    const result = await this.findOne(payments, eq(payments.id, id));
    if (result) {
      this.logger.log(`Payment found: ${id}`);
    } else {
      this.logger.log(`Payment not found with ID: ${id}`);
    }
    return result;
  }

  async findByIdOrThrow(id: string): Promise<PaymentEntity> {
    return super.findByIdOrThrow(payments, id, MESSAGES.PAYMENT_NOT_FOUND);
  }

  async updateStatus(
    id: string,
    status: 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED' | 'CANCELED',
    errorCode?: string,
    errorMessage?: string,
  ): Promise<PaymentEntity> {
    this.logger.log(`Updating payment status: ${id} to ${status}`);

    try {
      const result = await this.db
        .update(payments)
        .set({
          status,
          errorCode: errorCode || null,
          errorMessage: errorMessage || null,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, id))
        .returning();

      if (!result.length) {
        this.logger.warn(`Payment not found for status update: ${id}`);
        throw new Error(MESSAGES.PAYMENT_NOT_FOUND);
      }

      this.logger.log(`Payment status updated successfully: ${id}`);
      return result[0] as PaymentEntity;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Failed to update payment status: ${id}`, errorStack);
      throw error;
    }
  }
}
