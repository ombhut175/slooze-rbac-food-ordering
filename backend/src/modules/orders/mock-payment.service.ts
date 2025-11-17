import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  PaymentsRepository,
  CreatePaymentDto,
  PaymentEntity,
} from '../../core/database/repositories/payments.repository';
import { PaymentMethodsRepository } from '../../core/database/repositories/payment-methods.repository';

/**
 * MockPaymentService simulates payment processing without external API integration.
 * All payment operations are database-only for testing purposes.
 */
@Injectable()
export class MockPaymentService {
  private readonly logger = new Logger(MockPaymentService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymentMethodsRepository: PaymentMethodsRepository,
  ) {}

  /**
   * Process a payment using the MOCK provider (database-only simulation).
   * Creates a payment record with SUCCEEDED status and generates a mock transaction ID.
   *
   * @param orderId - The order ID to process payment for
   * @param paymentMethodId - The payment method ID to use
   * @param amountCents - The payment amount in cents
   * @param currency - The currency code (e.g., 'INR', 'USD')
   * @returns The created payment entity with SUCCEEDED status
   */
  async processPayment(
    orderId: string,
    paymentMethodId: string,
    amountCents: number,
    currency: string,
  ): Promise<PaymentEntity> {
    this.logger.log(
      `Processing MOCK payment for order: ${orderId}, amount: ${amountCents} ${currency}`,
    );

    try {
      // Fetch payment method to validate it exists and is active
      const paymentMethod =
        await this.paymentMethodsRepository.findByIdOrThrow(paymentMethodId);

      this.logger.log(
        `Payment method found: ${paymentMethod.label} (${paymentMethod.provider})`,
      );

      // Validate payment method is active
      if (!paymentMethod.active) {
        this.logger.error(
          `Payment method ${paymentMethodId} is not active, failing payment`,
        );
        return await this.createFailedPayment(
          orderId,
          paymentMethodId,
          amountCents,
          currency,
          'INACTIVE_PAYMENT_METHOD',
          'Payment method is not active',
        );
      }

      // Generate mock transaction ID
      const mockTransactionId = `mock_txn_${randomUUID()}`;

      this.logger.log(`Generated mock transaction ID: ${mockTransactionId}`);

      // Create payment record with SUCCEEDED status
      const paymentData: CreatePaymentDto = {
        orderId,
        paymentMethodId,
        provider: 'MOCK',
        amountCents,
        currency,
        status: 'SUCCEEDED',
        stripePaymentIntentId: mockTransactionId,
      };

      const payment = await this.paymentsRepository.create(paymentData);

      this.logger.log(
        `Payment processed successfully: ${payment.id}, transaction: ${mockTransactionId}`,
      );

      return payment;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to process payment for order ${orderId}: ${errorMessage}`,
        errorStack,
      );

      // Create failed payment record
      return await this.createFailedPayment(
        orderId,
        paymentMethodId,
        amountCents,
        currency,
        'PROCESSING_ERROR',
        errorMessage,
      );
    }
  }

  /**
   * Find a payment by order ID.
   *
   * @param orderId - The order ID to find payment for
   * @returns The payment entity if found, null otherwise
   */
  async findPaymentByOrderId(orderId: string): Promise<PaymentEntity | null> {
    this.logger.log(`Finding payment for order: ${orderId}`);

    try {
      const payment = await this.paymentsRepository.findByOrderId(orderId);

      if (payment) {
        this.logger.log(
          `Payment found for order ${orderId}: ${payment.id}, status: ${payment.status}`,
        );
      } else {
        this.logger.log(`No payment found for order: ${orderId}`);
      }

      return payment;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to find payment for order ${orderId}: ${errorMessage}`,
        errorStack,
      );

      throw error;
    }
  }

  /**
   * Cancel a payment by updating its status to CANCELED.
   *
   * @param paymentId - The payment ID to cancel
   * @returns The updated payment entity with CANCELED status
   */
  async cancelPayment(paymentId: string): Promise<PaymentEntity> {
    this.logger.log(`Canceling payment: ${paymentId}`);

    try {
      // Fetch payment to validate it exists
      const payment = await this.paymentsRepository.findByIdOrThrow(paymentId);

      this.logger.log(
        `Payment found: ${payment.id}, current status: ${payment.status}`,
      );

      // Update payment status to CANCELED
      const canceledPayment = await this.paymentsRepository.updateStatus(
        paymentId,
        'CANCELED',
      );

      this.logger.log(
        `Payment canceled successfully: ${paymentId}, previous status: ${payment.status}`,
      );

      return canceledPayment;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error(
        `Failed to cancel payment ${paymentId}: ${errorMessage}`,
        errorStack,
      );

      throw error;
    }
  }

  /**
   * Create a failed payment record in the database.
   * Private helper method for handling payment failures.
   *
   * @param orderId - The order ID
   * @param paymentMethodId - The payment method ID
   * @param amountCents - The payment amount in cents
   * @param currency - The currency code
   * @param errorCode - The error code
   * @param errorMessage - The error message
   * @returns The created payment entity with FAILED status
   */
  private async createFailedPayment(
    orderId: string,
    paymentMethodId: string,
    amountCents: number,
    currency: string,
    errorCode: string,
    errorMessage: string,
  ): Promise<PaymentEntity> {
    this.logger.warn(
      `Creating failed payment record for order ${orderId}: ${errorCode} - ${errorMessage}`,
    );

    const paymentData: CreatePaymentDto = {
      orderId,
      paymentMethodId,
      provider: 'MOCK',
      amountCents,
      currency,
      status: 'FAILED',
      errorCode,
      errorMessage,
    };

    const payment = await this.paymentsRepository.create(paymentData);

    this.logger.log(`Failed payment record created: ${payment.id}`);

    return payment;
  }
}
