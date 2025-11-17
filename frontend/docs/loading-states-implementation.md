# Loading and Skeleton States Implementation

This document provides a comprehensive overview of all loading and skeleton states implemented in the food ordering feature.

## Overview

All pages and components in the food ordering feature have comprehensive loading states to provide excellent user experience during data fetching and async operations.

## Skeleton Components

### 1. RestaurantCardSkeleton
**Location:** `frontend/src/components/food-ordering/restaurant-card.tsx`

**Features:**
- Animated pulse effect
- Matches restaurant card layout
- Shows placeholder for name, country badge, and status indicator
- Used in restaurants list page

**Usage:**
```tsx
import { RestaurantCardSkeleton } from "@/components/food-ordering";

<RestaurantCardSkeleton />
```

### 2. MenuItemSkeleton
**Location:** `frontend/src/components/food-ordering/menu-item.tsx`

**Features:**
- Animated pulse effect
- Matches menu item card layout
- Shows placeholder for image, name, description, price, and controls
- Used in restaurant menu page

**Usage:**
```tsx
import { MenuItemSkeleton } from "@/components/food-ordering";

<MenuItemSkeleton />
```

### 3. OrderCardSkeleton
**Location:** `frontend/src/components/food-ordering/order-card.tsx`

**Features:**
- Animated pulse effect
- Matches order card layout
- Shows placeholder for order ID, restaurant name, status, total, and date
- Used in orders list page

**Usage:**
```tsx
import { OrderCardSkeleton } from "@/components/food-ordering";

<OrderCardSkeleton />
```

## Loading Overlay Components

### 1. LoadingOverlay
**Location:** `frontend/src/components/food-ordering/loading-overlay.tsx`

**Features:**
- Full-screen overlay with backdrop blur
- Animated spinner
- Customizable loading message
- Smooth fade in/out animations
- Prevents user interaction during loading
- Used for blocking operations like checkout processing

**Usage:**
```tsx
import { LoadingOverlay } from "@/components/food-ordering";

<LoadingOverlay 
  isOpen={isProcessing} 
  message="Processing your order..." 
/>
```

### 2. LoadingSpinner
**Location:** `frontend/src/components/food-ordering/loading-overlay.tsx`

**Features:**
- Inline spinner for buttons and inline loading states
- Three sizes: sm, md, lg
- Inherits text color from parent
- Used in buttons during async operations

**Usage:**
```tsx
import { LoadingSpinner } from "@/components/food-ordering";

<button disabled={isLoading}>
  {isLoading ? (
    <>
      <LoadingSpinner size="sm" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</button>
```

## Page Loading States

### 1. Restaurants Page
**Location:** `frontend/src/app/(other)/restaurants/page.tsx`

**Loading States:**
- ✅ Skeleton grid (6 restaurant card skeletons)
- ✅ Empty state for no restaurants
- ✅ Error state with retry button
- ✅ Auth loading spinner

**Implementation:**
```tsx
{isLoading && (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <RestaurantCardSkeleton key={i} />
    ))}
  </div>
)}
```

### 2. Restaurant Menu Page
**Location:** `frontend/src/app/(other)/restaurants/[id]/page.tsx`

**Loading States:**
- ✅ Restaurant header skeleton
- ✅ Menu items grid skeleton (6 menu item skeletons)
- ✅ Empty state for no menu items
- ✅ Error state with retry button
- ✅ Button loading state for "Add to Cart"
- ✅ Auth loading spinner

**Implementation:**
```tsx
{isLoading && (
  <>
    {/* Restaurant Header Skeleton */}
    <div className="mb-8">
      <div className="mb-2 h-10 w-64 animate-pulse rounded bg-slate-200"></div>
      <div className="h-6 w-32 animate-pulse rounded bg-slate-200"></div>
    </div>

    {/* Menu Items Skeleton */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <MenuItemSkeleton key={i} />
      ))}
    </div>
  </>
)}
```

### 3. Orders Page
**Location:** `frontend/src/app/(other)/orders/page.tsx`

**Loading States:**
- ✅ Skeleton grid (6 order card skeletons)
- ✅ Empty state for no orders
- ✅ Error state with retry button
- ✅ Empty filter state
- ✅ Auth loading spinner

**Implementation:**
```tsx
{isLoading && (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </div>
)}
```

### 4. Order Details Page
**Location:** `frontend/src/app/(other)/orders/[id]/page.tsx`

**Loading States:**
- ✅ Order details skeleton (header, items list, summary)
- ✅ Error state with back button
- ✅ Button loading state for "Cancel Order"
- ✅ Auth loading spinner

**Implementation:**
```tsx
function OrderDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-4 h-8 w-48 rounded bg-slate-200"></div>
        <div className="h-6 w-64 rounded bg-slate-200"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items list skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border p-6">
            <div className="mb-4 h-6 w-32 rounded bg-slate-200"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded bg-slate-200"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border p-6">
            <div className="mb-4 h-6 w-32 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="h-8 w-full rounded bg-slate-200"></div>
              <div className="h-10 w-full rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5. Checkout Page
**Location:** `frontend/src/app/(other)/checkout/[orderId]/page.tsx`

**Loading States:**
- ✅ Checkout skeleton (order summary + payment methods)
- ✅ Error state with back and retry buttons
- ✅ Button loading state for "Complete Order"
- ✅ Processing overlay during checkout
- ✅ Auth loading spinner

**Implementation:**
```tsx
function CheckoutSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-4 h-8 w-48 rounded bg-slate-200"></div>
        <div className="h-6 w-64 rounded bg-slate-200"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order summary skeleton */}
        <div className="rounded-xl border p-6">
          <div className="mb-4 h-6 w-32 rounded bg-slate-200"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded bg-slate-200"></div>
            ))}
          </div>
        </div>

        {/* Payment methods skeleton */}
        <div className="rounded-xl border p-6">
          <div className="mb-4 h-6 w-32 rounded bg-slate-200"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded bg-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6. Order Confirmation Page
**Location:** `frontend/src/app/(other)/orders/[id]/confirmation/page.tsx`

**Loading States:**
- ✅ Centered loading spinner with message
- ✅ Error state with back button
- ✅ Celebration animation on success
- ✅ Auth loading spinner

**Implementation:**
```tsx
{isLoading && (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      <p className="text-slate-600">Loading order details...</p>
    </div>
  </div>
)}
```

### 7. Payment Methods Page
**Location:** `frontend/src/app/(other)/payment-methods/page.tsx`

**Loading States:**
- ✅ Skeleton grid (6 payment method card skeletons)
- ✅ Empty state for no payment methods
- ✅ Error state with retry button
- ✅ Button loading state for toggle active
- ✅ Auth loading spinner
- ✅ Access restricted state for non-admin users

**Implementation:**
```tsx
function PaymentMethodCardSkeleton() {
  return (
    <div className="rounded-xl border p-6">
      <div className="animate-pulse">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 h-6 w-48 rounded bg-slate-200"></div>
            <div className="h-4 w-32 rounded bg-slate-200"></div>
          </div>
          <div className="h-6 w-6 rounded bg-slate-200"></div>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div className="h-4 w-24 rounded bg-slate-200"></div>
          <div className="h-8 w-16 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
```

## Button Loading States

All async button operations include loading states:

### 1. Add to Cart Button
**Location:** `frontend/src/components/food-ordering/menu-item.tsx`

```tsx
<button
  onClick={handleAddToCart}
  disabled={isDisabled}
>
  {isProcessing || isAdding ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Adding...</span>
    </>
  ) : (
    <>
      <Plus className="h-4 w-4" />
      <span>Add to Cart</span>
    </>
  )}
</button>
```

### 2. Complete Order Button
**Location:** `frontend/src/app/(other)/checkout/[orderId]/page.tsx`

```tsx
<button
  onClick={handleCompleteOrder}
  disabled={isProcessing || noPaymentMethods || !selectedPaymentMethodId}
>
  {isProcessing ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      Processing...
    </span>
  ) : (
    <span className="flex items-center justify-center gap-2">
      <CreditCard className="h-5 w-5" />
      Complete Order
    </span>
  )}
</button>
```

### 3. Cancel Order Button
**Location:** `frontend/src/app/(other)/orders/[id]/page.tsx`

```tsx
<button
  onClick={handleCancelClick}
  disabled={isProcessing}
>
  {isProcessing ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <Trash2 className="h-4 w-4" />
  )}
  {isProcessing ? "Canceling..." : "Cancel Order"}
</button>
```

## Error States

All pages include comprehensive error states with:
- ✅ Error icon (AlertCircle)
- ✅ Error message from API or generic fallback
- ✅ Retry button (where applicable)
- ✅ Back/navigation button
- ✅ Smooth animations

Example error state pattern:
```tsx
function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">
        Failed to load data
      </h3>
      <p className="mt-2 text-center text-slate-600">
        {error?.message || "An error occurred."}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </motion.div>
  );
}
```

## Empty States

All list pages include empty states with:
- ✅ Empty state icon
- ✅ Helpful message
- ✅ Call-to-action button
- ✅ Smooth animations

Example empty state pattern:
```tsx
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">
        No items yet
      </h3>
      <p className="mt-2 text-center text-slate-600">
        Helpful message explaining the empty state
      </p>
      <button
        onClick={handleAction}
        className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white"
      >
        Call to Action
      </button>
    </motion.div>
  );
}
```

## Authentication Loading

All pages include authentication loading state:
```tsx
if (!shouldRender || !user) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
        <span className="text-sm text-slate-600">Loading...</span>
      </div>
    </div>
  );
}
```

## Responsive Design

All loading states are fully responsive:
- ✅ Mobile (320px - 767px): Single column layout
- ✅ Tablet (768px - 1023px): Two column layout
- ✅ Desktop (1024px+): Three column layout

## Dark Mode Support

All loading states support dark mode:
- ✅ Skeleton backgrounds adapt to dark theme
- ✅ Spinner colors adapt to dark theme
- ✅ Text colors adapt to dark theme
- ✅ Background colors adapt to dark theme

## Animation Patterns

All loading states use consistent animation patterns:
- ✅ Pulse animation for skeletons
- ✅ Spin animation for spinners
- ✅ Fade in/out for overlays
- ✅ Stagger animation for lists
- ✅ Scale animation for cards

## Performance Considerations

- ✅ Skeleton components are lightweight
- ✅ Animations use CSS transforms (GPU accelerated)
- ✅ Loading states prevent layout shift
- ✅ Optimistic UI updates for better perceived performance

## Accessibility

All loading states are accessible:
- ✅ Proper ARIA labels on buttons
- ✅ Disabled state styling
- ✅ Keyboard navigation support
- ✅ Screen reader friendly messages

## Summary

The food ordering feature has comprehensive loading and skeleton states implemented across all pages and components:

✅ **7 pages** with full loading state coverage
✅ **3 skeleton components** for cards
✅ **2 loading overlay components** for blocking operations
✅ **All async buttons** have loading states
✅ **All pages** have error states with retry
✅ **All list pages** have empty states
✅ **All pages** have auth loading states
✅ **Fully responsive** across all devices
✅ **Dark mode support** throughout
✅ **Smooth animations** using Framer Motion
✅ **Accessible** with proper ARIA labels

The implementation follows best practices and provides an excellent user experience during data fetching and async operations.
