import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import hackLog from '@/lib/logger';

/**
 * Cart Store State Interface
 * Manages shopping cart state for food ordering
 */
interface CartState {
  // State
  orderId: string | null;
  restaurantId: string | null;
  isOpen: boolean;
  
  // Actions
  setOrderId: (orderId: string) => void;
  setRestaurantId: (restaurantId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

/**
 * Cart Store - Shopping cart state management
 * Manages draft order ID, restaurant selection, and cart sidebar visibility
 * Persists to localStorage to survive page refreshes
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      orderId: null,
      restaurantId: null,
      isOpen: false,
      
      /**
       * Set the current draft order ID
       */
      setOrderId: (orderId: string): void => {
        hackLog.storeAction('setOrderId', {
          orderId,
          previousOrderId: get().orderId,
          trigger: 'cart_operation'
        });
        
        set({ orderId });
      },
      
      /**
       * Set the current restaurant ID
       */
      setRestaurantId: (restaurantId: string): void => {
        hackLog.storeAction('setRestaurantId', {
          restaurantId,
          previousRestaurantId: get().restaurantId,
          trigger: 'restaurant_selection'
        });
        
        set({ restaurantId });
      },
      
      /**
       * Clear all cart data
       * Called after checkout or when starting a new order
       */
      clearCart: (): void => {
        hackLog.storeAction('clearCart', {
          hadOrderId: !!get().orderId,
          hadRestaurantId: !!get().restaurantId,
          trigger: 'checkout_or_reset'
        });
        
        set({
          orderId: null,
          restaurantId: null,
          isOpen: false
        });
      },
      
      /**
       * Open the cart sidebar
       */
      openCart: (): void => {
        hackLog.storeAction('openCart', {
          orderId: get().orderId,
          trigger: 'user_action'
        });
        
        set({ isOpen: true });
      },
      
      /**
       * Close the cart sidebar
       */
      closeCart: (): void => {
        hackLog.storeAction('closeCart', {
          orderId: get().orderId,
          trigger: 'user_action'
        });
        
        set({ isOpen: false });
      }
    }),
    {
      name: 'cart-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Persist all cart state
      partialize: (state) => ({
        orderId: state.orderId,
        restaurantId: state.restaurantId,
        isOpen: state.isOpen
      }),
      
      // Log store rehydration for debugging
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          hackLog.error('Cart store rehydration failed', { error });
        } else {
          hackLog.storeAction('rehydrated', {
            hasOrderId: !!state?.orderId,
            hasRestaurantId: !!state?.restaurantId,
            isOpen: state?.isOpen
          });
        }
      }
    }
  )
);

// Export selector hooks for easy access to specific store parts
export const useCartOrderId = () => useCartStore(state => state.orderId);
export const useCartRestaurantId = () => useCartStore(state => state.restaurantId);
export const useCartIsOpen = () => useCartStore(state => state.isOpen);
