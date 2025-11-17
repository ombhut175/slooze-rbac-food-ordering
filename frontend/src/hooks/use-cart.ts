/**
 * useCart Hook
 * Manages shopping cart operations with automatic order creation
 * Handles adding, removing, and updating items with SWR cache invalidation
 */

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/constants/api';
import { apiRequest } from '@/helpers/request';
import { handleError } from '@/helpers/errors';
import hackLog from '@/lib/logger';
import { useCartStore } from './use-cart-store';
import type {
  Order,
  OrderItem,
  CreateOrderRequest,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
} from '@/types/food-ordering';

/**
 * Cart operations hook
 * Provides functions for managing cart items with automatic order creation
 */
export function useCart() {
  const { mutate } = useSWRConfig();
  const cartStore = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  hackLog.dev('useCart hook initialized', {
    orderId: cartStore.orderId,
    restaurantId: cartStore.restaurantId,
  });

  /**
   * Add item to cart with optimistic UI update
   * Creates a new order if one doesn't exist
   * If adding from a different restaurant, clears existing cart and creates new order
   * @param menuItemId - ID of the menu item to add
   * @param quantity - Quantity to add
   * @param restaurantId - ID of the restaurant (required for new orders)
   */
  const addItem = async (
    menuItemId: string,
    quantity: number,
    restaurantId: string
  ): Promise<OrderItem | null> => {
    hackLog.storeAction('addItemToCart', {
      menuItemId,
      quantity,
      restaurantId,
      currentOrderId: cartStore.orderId,
      currentRestaurantId: cartStore.restaurantId,
    });

    setIsAdding(true);

    try {
      let currentOrderId = cartStore.orderId;
      const currentRestaurantId = cartStore.restaurantId;

      // Check if adding from a different restaurant
      if (currentOrderId && currentRestaurantId && currentRestaurantId !== restaurantId) {
        hackLog.dev('Different restaurant detected, clearing existing cart', {
          currentRestaurantId,
          newRestaurantId: restaurantId,
          currentOrderId,
        });

        // Show warning to user
        toast.info('Starting new cart from different restaurant', {
          description: 'Your previous cart has been cleared',
        });

        // Clear existing cart
        cartStore.clearCart();
        currentOrderId = null;
      }

      // Create order if it doesn't exist
      if (!currentOrderId) {
        hackLog.dev('Creating new order for cart', { restaurantId });

        const createOrderPayload: CreateOrderRequest = {
          restaurantId,
        };

        const newOrder = await apiRequest.post<Order>(
          API_ENDPOINTS.FOOD_ORDERING.ORDERS,
          createOrderPayload,
          false // Don't show success toast for order creation
        );

        currentOrderId = newOrder.id;
        cartStore.setOrderId(currentOrderId);
        cartStore.setRestaurantId(restaurantId);

        hackLog.apiSuccess('POST', API_ENDPOINTS.FOOD_ORDERING.ORDERS, {
          orderId: currentOrderId,
          restaurantId,
        });
      }

      // Add item to order with optimistic update
      const addItemPayload: AddOrderItemRequest = {
        menuItemId,
        quantity,
      };

      // Optimistically update the cache before API call
      const orderKey = API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(currentOrderId);
      
      await mutate(
        orderKey,
        async (currentData?: Order) => {
          hackLog.dev('Optimistic update: adding item to cache', {
            orderId: currentOrderId,
            menuItemId,
            quantity,
          });

          // If no current data, just proceed with API call
          if (!currentData) {
            return currentData;
          }

          // Create optimistic order item
          const optimisticItem: OrderItem = {
            id: `temp-${Date.now()}`, // Temporary ID
            orderId: currentOrderId,
            menuItemId,
            quantity,
            unitPriceCents: 0, // Will be updated from server
            createdAt: new Date().toISOString(),
          };

          // Add optimistic item to order
          const updatedItems = [...(currentData.items || []), optimisticItem];

          return {
            ...currentData,
            items: updatedItems,
          };
        },
        false // Don't revalidate yet
      );

      // Make actual API call
      const orderItem = await apiRequest.post<OrderItem>(
        API_ENDPOINTS.FOOD_ORDERING.ORDER_ITEMS(currentOrderId),
        addItemPayload,
        false // Don't show default success toast, we'll show custom one
      );

      hackLog.apiSuccess('POST', API_ENDPOINTS.FOOD_ORDERING.ORDER_ITEMS(currentOrderId), {
        orderItemId: orderItem.id,
        menuItemId,
        quantity,
      });

      // Revalidate to get accurate data from server
      await mutate(orderKey);
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDERS);

      hackLog.dev('SWR cache revalidated after adding item', {
        orderId: currentOrderId,
      });

      // Show success toast
      toast.success('Item added to cart');

      return orderItem;
    } catch (error) {
      hackLog.error('Failed to add item to cart', {
        error,
        menuItemId,
        quantity,
        restaurantId,
        orderId: cartStore.orderId,
      });

      // Rollback optimistic update on error
      if (cartStore.orderId) {
        hackLog.dev('Rolling back optimistic update', {
          orderId: cartStore.orderId,
        });
        await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(cartStore.orderId));
      }

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to add item to cart',
      });

      return null;
    } finally {
      setIsAdding(false);
    }
  };

  /**
   * Remove item from cart with optimistic UI update
   * @param itemId - ID of the order item to remove
   */
  const removeItem = async (itemId: string): Promise<boolean> => {
    const currentOrderId = cartStore.orderId;

    if (!currentOrderId) {
      hackLog.warn('Cannot remove item: no active order', { itemId });
      toast.error('No active cart found');
      return false;
    }

    hackLog.storeAction('removeItemFromCart', {
      itemId,
      orderId: currentOrderId,
    });

    setIsRemoving(true);

    const orderKey = API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(currentOrderId);

    try {
      // Optimistically update the cache before API call
      await mutate(
        orderKey,
        async (currentData?: Order) => {
          hackLog.dev('Optimistic update: removing item from cache', {
            orderId: currentOrderId,
            itemId,
          });

          // If no current data, just proceed with API call
          if (!currentData) {
            return currentData;
          }

          // Remove item from order
          const updatedItems = (currentData.items || []).filter(
            (item) => item.id !== itemId
          );

          // Recalculate total
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.unitPriceCents * item.quantity,
            0
          );

          return {
            ...currentData,
            items: updatedItems,
            totalAmountCents: newTotal,
          };
        },
        false // Don't revalidate yet
      );

      // Make actual API call
      await apiRequest.delete(
        API_ENDPOINTS.FOOD_ORDERING.ORDER_ITEM(currentOrderId, itemId),
        false // Don't show default success toast
      );

      hackLog.apiSuccess('DELETE', API_ENDPOINTS.FOOD_ORDERING.ORDER_ITEM(currentOrderId, itemId), {
        itemId,
        orderId: currentOrderId,
      });

      // Revalidate to get accurate data from server
      await mutate(orderKey);
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDERS);

      hackLog.dev('SWR cache revalidated after removing item', {
        orderId: currentOrderId,
        itemId,
      });

      // Show success toast
      toast.success('Item removed from cart');

      return true;
    } catch (error) {
      hackLog.error('Failed to remove item from cart', {
        error,
        itemId,
        orderId: currentOrderId,
      });

      // Rollback optimistic update on error
      hackLog.dev('Rolling back optimistic update', {
        orderId: currentOrderId,
      });
      await mutate(orderKey);

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to remove item from cart',
      });

      return false;
    } finally {
      setIsRemoving(false);
    }
  };

  /**
   * Update item quantity in cart with optimistic UI update
   * @param itemId - ID of the order item to update
   * @param quantity - New quantity
   */
  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    const currentOrderId = cartStore.orderId;

    if (!currentOrderId) {
      hackLog.warn('Cannot update quantity: no active order', { itemId, quantity });
      toast.error('No active cart found');
      return false;
    }

    hackLog.storeAction('updateItemQuantity', {
      itemId,
      quantity,
      orderId: currentOrderId,
    });

    setIsUpdating(true);

    const orderKey = API_ENDPOINTS.FOOD_ORDERING.ORDER_DETAILS(currentOrderId);

    try {
      // Optimistically update the cache before API call
      await mutate(
        orderKey,
        async (currentData?: Order) => {
          hackLog.dev('Optimistic update: updating item quantity in cache', {
            orderId: currentOrderId,
            itemId,
            quantity,
          });

          // If no current data, just proceed with API call
          if (!currentData) {
            return currentData;
          }

          // Update item quantity
          const updatedItems = (currentData.items || []).map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );

          // Recalculate total
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.unitPriceCents * item.quantity,
            0
          );

          return {
            ...currentData,
            items: updatedItems,
            totalAmountCents: newTotal,
          };
        },
        false // Don't revalidate yet
      );

      // Make actual API call
      const updatePayload: UpdateOrderItemRequest = {
        quantity,
      };

      await apiRequest.patch(
        API_ENDPOINTS.FOOD_ORDERING.ORDER_ITEM(currentOrderId, itemId),
        updatePayload,
        false // Don't show default success toast
      );

      hackLog.apiSuccess('PATCH', API_ENDPOINTS.FOOD_ORDERING.ORDER_ITEM(currentOrderId, itemId), {
        itemId,
        quantity,
        orderId: currentOrderId,
      });

      // Revalidate to get accurate data from server
      await mutate(orderKey);
      await mutate(API_ENDPOINTS.FOOD_ORDERING.ORDERS);

      hackLog.dev('SWR cache revalidated after updating quantity', {
        orderId: currentOrderId,
        itemId,
        quantity,
      });

      // Show success toast
      toast.success('Cart updated');

      return true;
    } catch (error) {
      hackLog.error('Failed to update item quantity', {
        error,
        itemId,
        quantity,
        orderId: currentOrderId,
      });

      // Rollback optimistic update on error
      hackLog.dev('Rolling back optimistic update', {
        orderId: currentOrderId,
      });
      await mutate(orderKey);

      handleError(error, {
        toast: true,
        fallbackMessage: 'Failed to update item quantity',
      });

      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    // State
    orderId: cartStore.orderId,
    restaurantId: cartStore.restaurantId,
    isOpen: cartStore.isOpen,
    
    // Loading states
    isAdding,
    isRemoving,
    isUpdating,
    isProcessing: isAdding || isRemoving || isUpdating,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart: cartStore.clearCart,
    openCart: cartStore.openCart,
    closeCart: cartStore.closeCart,
  };
}
