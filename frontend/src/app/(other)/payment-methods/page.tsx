"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  AlertCircle,
  RefreshCw,
  Plus,
  Edit2,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { useRoleCheck } from "@/hooks/use-role-check";
import { AppNavigation } from "@/components/app-navigation";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { usePaymentMethodActions } from "@/hooks/use-payment-method-actions";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import { PaymentMethodForm } from "@/components/food-ordering/payment-method-form";
import hackLog from "@/lib/logger";
import type { PaymentMethod } from "@/types/food-ordering";
import { ROUTES } from "@/constants/routes";

// Skeleton loader for payment method cards
function PaymentMethodCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="animate-pulse">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 h-6 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>
  );
}

// Payment method card component
interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit: () => void;
  onToggleActive: () => void;
}

function PaymentMethodCard({
  paymentMethod,
  onEdit,
  onToggleActive,
}: PaymentMethodCardProps) {
  // Format expiry date
  const expiryDate =
    paymentMethod.expMonth && paymentMethod.expYear
      ? `${String(paymentMethod.expMonth).padStart(2, "0")}/${String(
          paymentMethod.expYear
        ).slice(-2)}`
      : "N/A";

  // Get brand icon/text
  const brandDisplay = paymentMethod.brand || "Card";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Label and Default Badge */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {paymentMethod.label}
            </h3>
            {paymentMethod.isDefault && (
              <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <Star className="h-3 w-3 fill-current" />
                Default
              </div>
            )}
          </div>

          {/* Brand and Last4 */}
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">{brandDisplay}</span>
            {paymentMethod.last4 && (
              <>
                <span>•</span>
                <span>•••• {paymentMethod.last4}</span>
              </>
            )}
          </div>

          {/* Expiry and Country */}
          <div className="mt-2 flex items-center gap-3">
            {paymentMethod.expMonth && paymentMethod.expYear && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Expires {expiryDate}
              </span>
            )}
            {paymentMethod.country && (
              <CountryBadge country={paymentMethod.country} size="sm" />
            )}
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          aria-label="Edit payment method"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </div>

      {/* Active Status and Toggle */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {paymentMethod.active ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Active
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                Inactive
              </span>
            </>
          )}
        </div>

        {/* Toggle Active Button */}
        <button
          onClick={onToggleActive}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            paymentMethod.active
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          {paymentMethod.active ? "Deactivate" : "Activate"}
        </button>
      </div>
    </motion.div>
  );
}

// Empty state component
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
        <CreditCard className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        No payment methods yet
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        Create your first payment method to enable checkout functionality.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        <Plus className="h-5 w-5" />
        Create Payment Method
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
        Failed to load payment methods
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        {error?.message || "An error occurred while loading payment methods."}
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

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const { canManagePaymentMethods, getUnavailableFeatureMessage } = useRoleCheck();
  const { paymentMethods, isLoading, error, isEmpty, refetch } =
    usePaymentMethods();
  const { toggleActive } = usePaymentMethodActions();

  // Form state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<PaymentMethod | null>(null);

  // Check if user is ADMIN
  const isAdmin = canManagePaymentMethods();

  React.useEffect(() => {
    hackLog.componentMount("PaymentMethodsPage", {
      hasUser: !!user,
      userId: user?.id,
      userRole: publicUser?.role,
      isAuthenticated: !!user,
      isAdmin,
      timestamp: new Date().toISOString(),
    });

    // Redirect non-admin users to dashboard
    if (user && !isAdmin) {
      hackLog.dev("Non-admin user attempted to access payment methods page", {
        userId: user.id,
        userRole: publicUser?.role,
        timestamp: new Date().toISOString(),
      });
      router.push(ROUTES.DASHBOARD as any);
    }

    return () => {
      hackLog.dev("PaymentMethodsPage unmounting", {
        timestamp: new Date().toISOString(),
      });
    };
  }, [user, publicUser, isAdmin, router]);

  // Handle create payment method
  const handleCreate = () => {
    hackLog.dev("User clicked create payment method", {
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    setFormMode("create");
    setSelectedPaymentMethod(null);
    setIsFormOpen(true);
  };

  // Handle edit payment method
  const handleEdit = (paymentMethod: PaymentMethod) => {
    hackLog.dev("User clicked edit payment method", {
      paymentMethodId: paymentMethod.id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    setFormMode("edit");
    setSelectedPaymentMethod(paymentMethod);
    setIsFormOpen(true);
  };

  // Handle toggle active status
  const handleToggleActive = async (paymentMethod: PaymentMethod) => {
    hackLog.dev("User toggled payment method active status", {
      paymentMethodId: paymentMethod.id,
      currentStatus: paymentMethod.active,
      newStatus: !paymentMethod.active,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });

    const result = await toggleActive(paymentMethod);
    if (result) {
      // Refresh the list after successful toggle
      refetch();
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    hackLog.dev("Payment method form submitted successfully", {
      mode: formMode,
      timestamp: new Date().toISOString(),
    });
    // Refresh the list
    refetch();
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPaymentMethod(null);
  };

  // Handle retry
  const handleRetry = () => {
    hackLog.dev("User clicked retry", {
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    refetch();
  };

  // Show helpful message for non-admin users
  if (shouldRender && user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
        <AppNavigation />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
              Access Restricted
            </h3>
            <p className="mt-2 max-w-md text-center text-slate-600 dark:text-slate-400">
              {getUnavailableFeatureMessage('payment-methods')}
            </p>
            <button
              onClick={() => router.push(ROUTES.DASHBOARD as any)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

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
      {/* App Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-100 sm:text-3xl lg:text-4xl">
                Payment Methods
              </h1>
              <p className="mt-2 text-sm text-orange-600 dark:text-orange-300 sm:text-base">
                Manage payment methods for checkout
              </p>
            </div>

            {/* Create Button (only show when not loading and not empty) */}
            {!isLoading && !error && !isEmpty && (
              <button
                onClick={handleCreate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 sm:w-auto"
              >
                <Plus className="h-5 w-5" />
                <span className="sm:inline">Create Payment Method</span>
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PaymentMethodCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}

          {/* Empty State */}
          {!isLoading && !error && isEmpty && (
            <EmptyState onCreate={handleCreate} />
          )}

          {/* Payment Methods Grid */}
          {!isLoading && !error && !isEmpty && (
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
              {paymentMethods.map((paymentMethod) => (
                <motion.div
                  key={paymentMethod.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <PaymentMethodCard
                    paymentMethod={paymentMethod}
                    onEdit={() => handleEdit(paymentMethod)}
                    onToggleActive={() => handleToggleActive(paymentMethod)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Payment Method Form Modal */}
      <PaymentMethodForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        paymentMethod={selectedPaymentMethod}
        mode={formMode}
      />
    </div>
  );
}
