/**
 * Cart Sidebar Component
 * 
 * Slide-in sidebar displaying cart items with quantity controls
 * Features:
 * - List of cart items with quantity controls
 * - Remove item button for each item
 * - Order total with currency formatting
 * - Checkout button (role-based visibility)
 * - Empty state with "Browse Restaurants" link
 * - Close button and backdrop
 * - Framer Motion slide and fade animations
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useOrder } from "@/hooks/use-order";
import { useAuthStore } from "@/hooks/use-auth-store";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";
import type { OrderItem } from "@/types/food-ordering";

/**
 * Format currency based on currency code
 */
function formatCurrency(amountCents: number, currency: 'INR' | 'USD'): string {
  const amount = amountCents / 100;
  
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Cart Item Component
 * Displays a single cart item with quantity controls
 */
interface CartItemProps {
  item: OrderItem;
  currency: 'INR' | 'USD';
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

function CartItem({
  item,
  currency,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving,
}: CartItemProps) {
  const itemTotal = item.unitPriceCents * item.quantity;
  const isProcessing = isUpdating || isRemoving;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-2 py-4 border-b border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {item.menuItem?.name || 'Unknown Item'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {formatCurrency(item.unitPriceCents, currency)} each
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          disabled={isProcessing}
          className="h-8 w-8 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={isProcessing || item.quantity <= 1}
            className="h-8 w-8"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={isProcessing}
            className="h-8 w-8"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {formatCurrency(itemTotal, currency)}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Cart Sidebar Props
 */
export interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cart Sidebar Component
 */
export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const publicUser = useAuthStore(state => state.publicUser);
  const { orderId, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();
  const { order, isLoading } = useOrder(orderId);

  // Log component mount
  React.useEffect(() => {
    if (isOpen) {
      hackLog.componentMount('CartSidebar', {
        orderId,
        userRole: publicUser?.role,
        hasOrder: !!order,
        itemCount: order?.items?.length || 0,
      });
    }
  }, [isOpen, orderId, publicUser?.role, order]);

  // Check if user can checkout (ADMIN or MANAGER only)
  const canCheckout = publicUser?.role === 'ADMIN' || publicUser?.role === 'MANAGER';

  // Handle checkout navigation
  const handleCheckout = () => {
    if (!orderId) return;
    
    hackLog.dev('User navigating to checkout', {
      orderId,
      userRole: publicUser?.role,
      totalAmount: order?.totalAmountCents,
    });

    onClose();
    router.push(ROUTES.FOOD_ORDERING.CHECKOUT(orderId) as any);
  };

  // Handle quantity update
  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    hackLog.dev('Updating cart item quantity', { itemId, quantity, orderId });
    await updateQuantity(itemId, quantity);
  };

  // Handle item removal
  const handleRemoveItem = async (itemId: string) => {
    hackLog.dev('Removing cart item', { itemId, orderId });
    await removeItem(itemId);
  };

  // Calculate totals
  const itemCount = order?.items?.length || 0;
  const totalAmount = order?.totalAmountCents || 0;
  const currency = order?.currency || 'USD';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] max-w-full bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
                    ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading cart...</p>
                  </div>
                </div>
              ) : itemCount === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Add items from a restaurant to get started
                  </p>
                  <Button
                    asChild
                    onClick={onClose}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Link href={ROUTES.FOOD_ORDERING.RESTAURANTS as any}>
                      Browse Restaurants
                    </Link>
                  </Button>
                </div>
              ) : (
                // Cart Items
                <div className="px-6">
                  <AnimatePresence mode="popLayout">
                    {order?.items?.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        currency={currency}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        isUpdating={isUpdating}
                        isRemoving={isRemoving}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-slate-900 dark:text-slate-100">
                    Total
                  </span>
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalAmount, currency)}
                  </span>
                </div>

                {/* Checkout Button */}
                {canCheckout ? (
                  <Button
                    onClick={handleCheckout}
                    disabled={isUpdating || isRemoving}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                      Only Managers and Admins can checkout orders
                    </p>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
