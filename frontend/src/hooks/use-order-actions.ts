/**
 * useOrderActions Hook
 * Manages order actions like cancellation
 * Handles confirmation dialogs and cache invalidation
 */

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import type { Order } from '@/types/food-ordering';

/**
 * Order actions hook
 * Provides functions for order operations like cancellation
 */
export function useOrderActions() {
  const { mutate } = useSWRConfig();
  const [isProcessing, setIsProcessing] = useState(false);

  hackLog.dev('useOrderActions hook initialized');

  /**
   * Cancel an order
   * Updates order status to CANCELED
   * @param orderId - ID of the order to cancel
   * @returns The updated order or null on failure
   */
  const cancel = async (orderId: string): Promise<Order | null> => {
    hackLog.storeAction('cancelOrder', {
      orderId,
      timestamp: new Date().toISOString(),
    });

    setIsProcessing(true);

    try {
      hackLog.apiRequest('POST', API_ENDPOINTS.FOOD_ORDERING.ORDER_CANCEL(orderId));

      const order = await apiRequest.post<Order>(
        API_ENDPOINTS.FOOD_ORDERING.ORDER_CANCEL(orderId),
        undefined,
        false // Don't show default success toast, we'll show custom one
      );

      hackLog.apiSuccess('POST', API_ENDPOINTS.FOOD_ORDERING.ORDER_CANCEL(orderId), {
        orderId: order.id,
        status: order.status,
        previousStatus: 'PAID',
      });

      // Invalidate SWR cache for orders
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDERS);
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(orderId));

      hackLog.dev('SWR cache invalidated after order cancellation', {
        orderId,
      });

      // Show success toast
      toast.success('Order canceled successfully');

      return order;
    } catch (error) {
      hackLog.error('Order cancellation failed', {
        error,
        orderId,
        timestamp: new Date().toISOString(),
      });

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to cancel order. Please try again.',
      });

      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    cancel,
    isProcessing,
  };
}
