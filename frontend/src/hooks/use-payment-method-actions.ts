/**
 * usePaymentMethodActions Hook
 * Provides actions for creating, updating, and toggling payment methods
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { apiRequest } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import { API_ENDPOINTS } from '@/constants/api';
import hackLog from '@/lib/logger';
import type {
  PaymentMethod,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
} from '@/types/food-ordering';

export function usePaymentMethodActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Create a new payment method
   */
  const createPaymentMethod = async (
    data: CreatePaymentMethodRequest
  ): Promise<PaymentMethod | null> => {
    hackLog.dev('Creating payment method', { data });
    setIsProcessing(true);

    try {
      const paymentMethod = await apiRequest.post<PaymentMethod>(
        API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS,
        data
      );

      hackLog.dev('Payment method created successfully', {
        paymentMethodId: paymentMethod.id,
      });

      return paymentMethod;
    } catch (error: any) {
      hackLog.error('Failed to create payment method', {
        error: error.message,
        data,
        timestamp: new Date().toISOString(),
      });

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to create payment method',
      });

      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Update an existing payment method
   */
  const updatePaymentMethod = async (
    id: string,
    data: UpdatePaymentMethodRequest
  ): Promise<PaymentMethod | null> => {
    hackLog.dev('Updating payment method', { id, data });
    setIsProcessing(true);

    try {
      const paymentMethod = await apiRequest.patch<PaymentMethod>(
        API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHOD(id),
        data
      );

      hackLog.dev('Payment method updated successfully', {
        paymentMethodId: paymentMethod.id,
      });

      return paymentMethod;
    } catch (error: any) {
      hackLog.error('Failed to update payment method', {
        error: error.message,
        id,
        data,
        timestamp: new Date().toISOString(),
      });

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to update payment method',
      });

      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Toggle payment method active status
   */
  const toggleActive = async (
    paymentMethod: PaymentMethod
  ): Promise<PaymentMethod | null> => {
    const newActiveStatus = !paymentMethod.active;

    hackLog.dev('Toggling payment method active status', {
      paymentMethodId: paymentMethod.id,
      currentStatus: paymentMethod.active,
      newStatus: newActiveStatus,
    });

    setIsProcessing(true);

    try {
      const updatedPaymentMethod = await apiRequest.patch<PaymentMethod>(
        API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHOD(paymentMethod.id),
        { active: newActiveStatus }
      );

      toast.success(
        `Payment method ${newActiveStatus ? 'activated' : 'deactivated'} successfully`
      );

      hackLog.dev('Payment method active status toggled successfully', {
        paymentMethodId: updatedPaymentMethod.id,
        newStatus: updatedPaymentMethod.active,
      });

      return updatedPaymentMethod;
    } catch (error: any) {
      hackLog.error('Failed to toggle payment method active status', {
        error: error.message,
        paymentMethodId: paymentMethod.id,
        timestamp: new Date().toISOString(),
      });

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to update payment method status',
      });

      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createPaymentMethod,
    updatePaymentMethod,
    toggleActive,
    isProcessing,
  };
}
