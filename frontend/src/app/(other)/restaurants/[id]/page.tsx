"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { useRestaurantMenu } from "@/hooks/use-restaurant-menu";
import { useCart } from "@/hooks/use-cart";
import { MenuItem, MenuItemSkeleton } from "@/components/food-ordering/menu-item";
import hackLog from "@/lib/logger";
import { ROUTES } from "@/constants/routes";

// Country badge component
interface CountryBadgeProps {
  country: 'IN' | 'US';
}

function CountryBadge({ country }: CountryBadgeProps) {
  const countryFlag = country === 'IN' ? '🇮🇳' : '🇺🇸';
  const countryName = country === 'IN' ? 'India' : 'United States';

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
      {countryFlag} {countryName}
    </span>
  );
}

// Floating cart summary component
interface CartSummaryProps {
  itemCount: number;
  totalCents: number;
  currency: 'INR' | 'USD';
  onViewCart: () => void;
}

function FloatingCartSummary({ itemCount, totalCents, currency, onViewCart }: CartSummaryProps) {
  const formatPrice = (priceCents: number, curr: string) => {
    const amount = priceCents / 100;
    if (curr === "INR") {
      return `₹${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  if (itemCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-4"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 sm:h-10 sm:w-10">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-900 dark:text-slate-100 sm:text-sm">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            </p>
            <p className="text-base font-bold text-orange-600 dark:text-orange-400 sm:text-lg">
              {formatPrice(totalCents, currency)}
            </p>
          </div>
        </div>
        <button
          onClick={onViewCart}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 sm:px-6 sm:py-3 sm:text-base"
        >
          View Cart
        </button>
      </div>
    </motion.div>
  );
}

// Error state component
interface ErrorStateProps {
  error: any;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Failed to load menu
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        {error?.message || 'An error occurred while loading the menu.'}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </motion.div>
  );
}

// Empty state component
function EmptyMenuState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
        <span className="text-4xl">🍽️</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        No menu items available
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        This restaurant doesn't have any menu items yet.
        <br />
        Please check back later.
      </p>
    </motion.div>
  );
}

export default function RestaurantMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const { restaurant, menu, isLoading, error, isEmpty, refetch } = useRestaurantMenu(id);
  const { addItem, isAdding, orderId } = useCart();
  const [cartItemCount, setCartItemCount] = React.useState(0);
  const [cartTotal, setCartTotal] = React.useState(0);

  React.useEffect(() => {
    hackLog.componentMount('RestaurantMenuPage', {
      hasUser: !!user,
      userId: user?.id,
      userRole: publicUser?.role,
      userCountry: publicUser?.country,
      restaurantId: id,
      isAuthenticated: !!user,
      timestamp: new Date().toISOString(),
    });

    return () => {
      hackLog.dev('RestaurantMenuPage unmounting', {
        timestamp: new Date().toISOString(),
      });
    };
  }, [user, publicUser, id]);

  // Calculate cart summary from current order
  React.useEffect(() => {
    // This would ideally come from the order data
    // For now, we'll update it when items are added
    // In a real implementation, you'd fetch the order and calculate from items
    hackLog.dev('Cart state updated', {
      orderId,
      itemCount: cartItemCount,
      total: cartTotal,
    });
  }, [orderId, cartItemCount, cartTotal]);

  const handleAddToCart = async (itemId: string, quantity: number) => {
    if (!restaurant) {
      hackLog.warn('Cannot add to cart: restaurant not loaded', { itemId, quantity });
      return;
    }

    hackLog.dev('Adding item to cart', {
      itemId,
      quantity,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });

    try {
      await addItem(itemId, quantity, restaurant.id);
      
      // Update cart summary (simplified - in real app would fetch order)
      const menuItem = menu.find(item => item.id === itemId);
      if (menuItem) {
        setCartItemCount(prev => prev + quantity);
        setCartTotal(prev => prev + (menuItem.priceCents * quantity));
      }
    } catch (error) {
      hackLog.error('Failed to add item to cart in page', {
        error,
        itemId,
        quantity,
      });
    }
  };

  const handleViewCart = () => {
    hackLog.dev('User clicked view cart', {
      orderId,
      itemCount: cartItemCount,
      userId: user?.id,
    });
    // TODO: Open cart sidebar when implemented
    // For now, just log the action
  };

  const handleBack = () => {
    hackLog.dev('User clicked back button', {
      restaurantId: id,
      userId: user?.id,
    });
    router.push(ROUTES.FOOD_ORDERING.RESTAURANTS as any);
  };

  const handleRetry = () => {
    hackLog.dev('User clicked retry', {
      restaurantId: id,
      userId: user?.id,
    });
    refetch();
  };

  // Don't render if user is not authenticated
  if (!shouldRender || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 pb-24 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
      {/* App Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Restaurants</span>
          </button>

          {/* Loading State */}
          {isLoading && (
            <>
              {/* Restaurant Header Skeleton */}
              <div className="mb-8">
                <div className="mb-2 h-10 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Menu Items Skeleton */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MenuItemSkeleton key={i} />
                ))}
              </div>
            </>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}

          {/* Restaurant Header and Menu */}
          {!isLoading && !error && restaurant && (
            <>
              {/* Restaurant Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-100 sm:text-4xl">
                      {restaurant.name}
                    </h1>
                    <div className="mt-2">
                      <CountryBadge country={restaurant.country} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {isEmpty && <EmptyMenuState />}

              {/* Menu Items Grid */}
              {!isEmpty && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {menu.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <MenuItem
                        item={item}
                        onAddToCart={handleAddToCart}
                        isAdding={isAdding}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </main>

      {/* Floating Cart Summary */}
      {restaurant && (
        <FloatingCartSummary
          itemCount={cartItemCount}
          totalCents={cartTotal}
          currency={restaurant.country === 'IN' ? 'INR' : 'USD'}
          onViewCart={handleViewCart}
        />
      )}
    </div>
  );
}
