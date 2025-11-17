/**
 * useCheckout Hook
 * Manages order checkout process with payment method selection
 * Handles cart clearing and navigation after successful checkout
 */

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import { useCartStore } from './use-cart-store';
import type { Order, CheckoutOrderRequest } from '@/types/food-ordering';

/**
 * Checkout operations hook
 * Provides function for completing order checkout with payment method
 */
export function useCheckout() {
  const { mutate } = useSWRConfig();
  const cartStore = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  hackLog.dev('useCheckout hook initialized');

  /**
   * Checkout order with selected payment method
   * Clears cart and navigates to confirmation page on success
   * @param orderId - ID of the order to checkout
   * @param paymentMethodId - ID of the payment method to use
   * @returns The updated order or null on failure
   */
  const checkout = async (
    orderId: string,
    paymentMethodId: string
  ): Promise<Order | null> => {
    hackLog.storeAction('checkoutOrder', {
      orderId,
      paymentMethodId,
      timestamp: new Date().toISOString(),
    });

    setIsProcessing(true);

    try {
      const checkoutPayload: CheckoutOrderRequest = {
        paymentMethodId,
      };

      hackLog.apiRequest('POST', API_ENDPOINTS.FOOD_ORDERING.ORDER_CHECKOUT(orderId), checkoutPayload);

      const order = await apiRequest.post<Order>(
        API_ENDPOINTS.FOOD_ORDERING.ORDER_CHECKOUT(orderId),
        checkoutPayload,
        false // Don't show default success toast, we'll show custom one
      );

      hackLog.apiSuccess('POST', API_ENDPOINTS.FOOD_ORDERING.ORDER_CHECKOUT(orderId), {
        orderId: order.id,
        status: order.status,
        totalAmountCents: order.totalAmountCents,
        paymentMethodId: order.paymentMethodId,
      });

      // Clear cart state after successful checkout
      cartStore.clearCart();
      hackLog.storeAction('cartClearedAfterCheckout', {
        orderId,
        trigger: 'checkout_success',
      });

      // Invalidate SWR cache for orders
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDERS);
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(orderId));

      hackLog.dev('SWR cache invalidated after checkout', {
        orderId,
      });

      // Show success toast
      toast.success('Order completed successfully!');

      // Return the order for navigation purposes
      return order;
    } catch (error) {
      hackLog.error('Checkout failed', {
        error,
        orderId,
        paymentMethodId,
        timestamp: new Date().toISOString(),
      });

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to complete checkout. Please try again.',
      });

      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    checkout,
    isProcessing,
  };
}
