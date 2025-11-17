"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, AlertCircle, RefreshCw, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { useOrders } from "@/hooks/use-orders";
import { StatusBadge } from "@/components/food-ordering/status-badge";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import { formatCurrency } from "@/lib/utils";
import hackLog from "@/lib/logger";
import type { Order, OrderStatus } from "@/types/food-ordering";
import { ROUTES } from "@/constants/routes";

// Status filter type
type StatusFilter = "ALL" | OrderStatus;

// Skeleton loader for order cards
function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="animate-pulse">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 h-5 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
}

// Order card component
interface OrderCardProps {
  order: Order;
  showCountry: boolean;
  onClick: () => void;
}

function OrderCard({ order, showCountry, onClick }: OrderCardProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const shortOrderId = order.id.substring(0, 8);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Order #{shortOrderId}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {order.restaurant?.name || "Unknown Restaurant"}
          </h3>
          {showCountry && (
            <div className="mt-2">
              <CountryBadge country={order.country} size="sm" />
            </div>
          )}
        </div>
        <StatusBadge status={order.status} size="md" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {formatCurrency(order.totalAmountCents, order.currency)}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {orderDate}
        </div>
      </div>
    </motion.div>
  );
}

// Empty state component
function EmptyState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
        <ShoppingBag className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        No orders yet
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        You haven't placed any orders yet.
        <br />
        Start by browsing restaurants and adding items to your cart.
      </p>
      <button
        onClick={() => router.push(ROUTES.FOOD_ORDERING.RESTAURANTS as any)}
        className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        Browse Restaurants
      </button>
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
        Failed to load orders
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        {error?.message || "An error occurred while loading orders."}
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

// Status filter buttons component
interface StatusFilterButtonsProps {
  activeFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
  orderCounts: Record<StatusFilter, number>;
}

function StatusFilterButtons({
  activeFilter,
  onFilterChange,
  orderCounts,
}: StatusFilterButtonsProps) {
  const filters: StatusFilter[] = ["ALL", "DRAFT", "PAID", "CANCELED"];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        const count = orderCounts[filter] || 0;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            } border ${
              isActive
                ? "border-orange-600"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <Filter className="h-4 w-4" />
            {filter === "ALL" ? "All" : filter}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive
                  ? "bg-orange-700 text-white"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// No results for filter component
interface NoFilterResultsProps {
  statusFilter: StatusFilter;
  onClearFilter: () => void;
}

function NoFilterResults({ statusFilter, onClearFilter }: NoFilterResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        <Filter className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        No {statusFilter.toLowerCase()} orders
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        You don't have any orders with this status.
      </p>
      <button
        onClick={onClearFilter}
        className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        View All Orders
      </button>
    </motion.div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  
  // Local state for filter - this is the key to reliability
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  
  // Check if user is ADMIN
  const isAdmin = publicUser?.role === "ADMIN";
  
  // Fetch ALL orders once
  const { allOrders, isLoading, error, refetch } = useOrders();

  // Filter orders in component state - guaranteed to trigger re-renders
  const displayedOrders = React.useMemo(() => {
    hackLog.dev("🔄 Filtering orders", {
      statusFilter,
      totalOrders: allOrders.length,
      timestamp: new Date().toISOString(),
    });

    if (statusFilter === "ALL") {
      return allOrders;
    }
    
    const filtered = allOrders.filter((order) => order.status === statusFilter);
    
    hackLog.dev("✅ Orders filtered", {
      statusFilter,
      totalOrders: allOrders.length,
      filteredCount: filtered.length,
      timestamp: new Date().toISOString(),
    });
    
    return filtered;
  }, [allOrders, statusFilter]);

  // Calculate order counts for filter buttons
  const orderCounts = React.useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      ALL: allOrders.length,
      DRAFT: 0,
      PENDING: 0,
      PAID: 0,
      CANCELED: 0,
    };

    allOrders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });

    hackLog.dev("📊 Order counts calculated", {
      counts,
      timestamp: new Date().toISOString(),
    });

    return counts;
  }, [allOrders]);

  // Component mount logging
  React.useEffect(() => {
    hackLog.componentMount("OrdersPage", {
      hasUser: !!user,
      userId: user?.id,
      userRole: publicUser?.role,
      isAdmin,
      timestamp: new Date().toISOString(),
    });

    return () => {
      hackLog.dev("OrdersPage unmounting", {
        timestamp: new Date().toISOString(),
      });
    };
  }, [user, publicUser, isAdmin]);

  // Log filter changes
  React.useEffect(() => {
    hackLog.dev("📊 OrdersPage state", {
      statusFilter,
      displayedOrdersCount: displayedOrders.length,
      allOrdersCount: allOrders.length,
      isLoading,
      timestamp: new Date().toISOString(),
    });
  }, [statusFilter, displayedOrders.length, allOrders.length, isLoading]);

  // Handle order click
  const handleOrderClick = (orderId: string) => {
    hackLog.dev("User clicked order", {
      orderId,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    router.push(ROUTES.FOOD_ORDERING.ORDER_DETAILS(orderId) as any);
  };

  // Handle filter change
  const handleFilterChange = (filter: StatusFilter) => {
    hackLog.dev("🔄 User changing order filter", {
      previousFilter: statusFilter,
      newFilter: filter,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    
    setStatusFilter(filter);
  };

  // Handle retry
  const handleRetry = () => {
    hackLog.dev("User clicked retry", {
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    refetch();
  };

  // Don't render if user is not authenticated
  if (!shouldRender || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
      <AppNavigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-100 sm:text-4xl">
              My Orders
            </h1>
            <p className="mt-2 text-orange-600 dark:text-orange-300">
              View and manage your order history
            </p>
          </div>

          {/* Status Filter Buttons */}
          {!isLoading && !error && allOrders.length > 0 && (
            <div className="mb-6">
              <StatusFilterButtons
                activeFilter={statusFilter}
                onFilterChange={handleFilterChange}
                orderCounts={orderCounts}
              />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}

          {/* Empty State - no orders at all */}
          {!isLoading && !error && allOrders.length === 0 && <EmptyState />}

          {/* No Results for Filter - orders exist but filter returns none */}
          {!isLoading &&
            !error &&
            allOrders.length > 0 &&
            displayedOrders.length === 0 && (
              <NoFilterResults
                statusFilter={statusFilter}
                onClearFilter={() => setStatusFilter("ALL")}
              />
            )}

          {/* Orders Grid */}
          {!isLoading && !error && displayedOrders.length > 0 && (
            <motion.div
              key={`orders-${statusFilter}-${displayedOrders.length}`}
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
              {displayedOrders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <OrderCard
                    order={order}
                    showCountry={isAdmin}
                    onClick={() => handleOrderClick(order.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
