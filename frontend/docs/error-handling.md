# Error Handling Guide

## Overview

This document describes the comprehensive error handling implementation in the frontend application. All error handling follows a consistent pattern using centralized helpers and utilities.

## Architecture

### 1. Error Boundary Component

**Location**: `frontend/src/components/error-boundary.tsx`

The `ErrorBoundary` component catches React errors and displays a fallback UI. It's wrapped around the entire application in the root layout.

**Features**:
- Catches all React component errors
- Logs errors with full context using hackLog
- Displays user-friendly error message
- Provides retry functionality
- Shows error details in development mode
- Redirects to home page option

**Usage**:
```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. API Error Handling

**Location**: `frontend/src/helpers/request.ts` and `frontend/src/lib/api/apiClient.ts`

All API calls use the centralized `apiRequest` helper which provides:

**Features**:
- Automatic error toast notifications
- 401 Unauthorized handling with redirect to login
- 403 Forbidden handling with permission messages
- Network error handling
- Server error handling (5xx)
- Backend error message extraction
- Comprehensive logging with hackLog

**Interceptors**:
1. **Request Interceptor**: Logs all outgoing requests
2. **Response Interceptor**: Handles errors and shows appropriate messages

**401 Handling**:
- Clears auth state
- Redirects to login page with return URL
- Shows "Session expired" message

**403 Handling**:
- Shows permission denied message
- Logs forbidden access attempt
- Displays backend error message if available

### 3. Error Helper Functions

**Location**: `frontend/src/helpers/errors.ts`

**Functions**:

#### `extractErrorMessage(error, fallback?)`
Extracts meaningful error messages from any error type.

**Handles**:
- Network/Fetch errors
- Timeout errors
- API response errors
- Standard Error objects
- String errors
- Object errors

#### `handleError(error, options?)`
Main error handler used throughout the application.

**Options**:
- `toast`: Show toast notification (default: true)
- `fallbackMessage`: Custom fallback message
- `logToConsole`: Log to console (default: true)
- `suppressConsoleError`: Suppress console error (default: false)

**Usage**:
```typescript
try {
  await someAsyncOperation();
} catch (error) {
  handleError(error, {
    toast: true,
    fallbackMessage: 'Failed to perform operation',
  });
}
```

#### `withErrorHandling(asyncFn, options?)`
Wraps async functions with automatic error handling.

#### `catchErrors(promise, options?)`
Promise wrapper that catches and handles errors.

### 4. Custom Hooks Error Handling

All custom hooks follow a consistent error handling pattern:

**Pattern**:
```typescript
export function useCustomHook() {
  const { data, error, isLoading } = useSWR(
    endpoint,
    fetcher,
    {
      onSuccess: (data) => {
        hackLog.apiSuccess('GET', endpoint, { count: data.length });
      },
      onError: (err) => {
        hackLog.apiError('GET', endpoint, err);
        handleError(err, {
          toast: true,
          fallbackMessage: 'Failed to load data',
        });
      },
    }
  );

  return { data, error, isLoading };
}
```

**Hooks with Error Handling**:
- `useRestaurants`
- `useRestaurantMenu`
- `useOrders`
- `useOrder`
- `usePaymentMethods`
- `useCart`
- `useCheckout`
- `useOrderActions`
- `usePaymentMethodActions`

### 5. Loading States

All async operations display loading states:

**Types**:
1. **Skeleton Loaders**: For list/grid content
2. **Spinners**: For buttons and inline loading
3. **Loading Overlays**: For full-page operations
4. **Disabled States**: For buttons during processing

**Example**:
```tsx
{isLoading && <SkeletonLoader />}
{!isLoading && data && <Content data={data} />}
```

### 6. Success Notifications

All mutations show success toast notifications:

**Pattern**:
```typescript
const result = await apiRequest.post(endpoint, data);
toast.success('Operation completed successfully');
```

**Automatic Success Toasts**:
- Cart operations (add, remove, update)
- Checkout completion
- Order cancellation
- Payment method creation/update

### 7. Logging

All errors are logged with full context using hackLog:

**Error Logging**:
```typescript
hackLog.error('Operation failed', {
  error: error.message,
  context: additionalContext,
  timestamp: new Date().toISOString(),
});
```

**API Logging**:
- `hackLog.apiRequest()`: Before API call
- `hackLog.apiSuccess()`: On successful response
- `hackLog.apiError()`: On error response

**Store Logging**:
- `hackLog.storeAction()`: On state changes
- `hackLog.storeUpdate()`: On store updates

## Error Types and Handling

### Network Errors
- **Message**: "Network error occurred. Please check your connection."
- **Handling**: Toast notification, retry option
- **Logging**: Full error context

### 401 Unauthorized
- **Message**: "Your session has expired. Please log in again."
- **Handling**: Clear auth state, redirect to login
- **Logging**: URL, method, status

### 403 Forbidden
- **Message**: Backend message or "You do not have permission to perform this action."
- **Handling**: Toast notification with permission message
- **Logging**: URL, method, status, message

### 404 Not Found
- **Message**: Backend message or "Resource not found."
- **Handling**: Toast notification
- **Logging**: URL, method, status

### 500 Server Error
- **Message**: "Server error occurred. Please try again later."
- **Handling**: Toast notification, retry option
- **Logging**: URL, method, status

### Validation Errors
- **Message**: Backend validation messages
- **Handling**: Inline form errors, toast notification
- **Logging**: Field errors, validation context

## Best Practices

### 1. Always Use Helpers
✅ **DO**: Use `apiRequest` for all API calls
❌ **DON'T**: Use `axios` or `fetch` directly

✅ **DO**: Use `handleError` for error handling
❌ **DON'T**: Implement custom error handling

### 2. Provide Context
✅ **DO**: Log errors with full context
```typescript
hackLog.error('Failed to add item', {
  error,
  itemId,
  userId,
  timestamp: new Date().toISOString(),
});
```

❌ **DON'T**: Log errors without context
```typescript
console.error(error);
```

### 3. Show Loading States
✅ **DO**: Show loading indicators during async operations
```typescript
{isLoading && <Spinner />}
{!isLoading && data && <Content />}
```

❌ **DON'T**: Leave users waiting without feedback

### 4. Handle All Error Cases
✅ **DO**: Handle loading, error, empty, and success states
```typescript
{isLoading && <Loading />}
{error && <Error />}
{isEmpty && <Empty />}
{data && <Content />}
```

❌ **DON'T**: Only handle success case

### 5. Use Try-Catch Blocks
✅ **DO**: Wrap async operations in try-catch
```typescript
try {
  const result = await operation();
  return result;
} catch (error) {
  handleError(error);
  return null;
}
```

❌ **DON'T**: Let errors propagate unhandled

## Testing Error Handling

### Manual Testing Checklist

- [ ] Network error: Disconnect internet, verify error message
- [ ] 401 error: Use expired token, verify redirect to login
- [ ] 403 error: Access restricted resource, verify permission message
- [ ] 404 error: Request non-existent resource, verify not found message
- [ ] 500 error: Trigger server error, verify server error message
- [ ] Validation error: Submit invalid form, verify field errors
- [ ] React error: Trigger component error, verify error boundary
- [ ] Loading states: Verify all async operations show loading
- [ ] Success toasts: Verify all mutations show success message
- [ ] Error logging: Check console for hackLog error entries

### Automated Testing

Error handling is tested through:
1. Unit tests for error helper functions
2. Integration tests for API error scenarios
3. E2E tests for user-facing error flows

## Troubleshooting

### Error Not Showing Toast
- Check if `toast` option is set to `true` in `handleError`
- Verify Toaster component is rendered in layout
- Check browser console for errors

### 401 Not Redirecting
- Verify API client interceptor is configured
- Check auth store `clearUserData` function
- Ensure redirect logic is not blocked

### Error Boundary Not Catching
- Verify ErrorBoundary wraps the component
- Check if error is thrown in event handler (use `useErrorHandler`)
- Ensure error is not caught before reaching boundary

### Missing Error Context
- Add more context to hackLog calls
- Include relevant IDs, timestamps, and state
- Use structured logging format

## Summary

The error handling system provides:
- ✅ Comprehensive error catching at all levels
- ✅ User-friendly error messages
- ✅ Automatic 401/403 handling
- ✅ Loading states for all async operations
- ✅ Success notifications for mutations
- ✅ Detailed error logging
- ✅ Consistent error handling patterns
- ✅ Zero runtime errors through defensive programming
