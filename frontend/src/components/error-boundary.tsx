'use client';

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 * Logs errors with full context for debugging
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import hackLog from '@/lib/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error with full context
    hackLog.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Log to console for development
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  reset = () => {
    hackLog.storeAction('errorBoundaryReset', {
      previousError: this.state.error?.message,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 * Displays a user-friendly error message with retry option
 */
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h2>

        <p className="mb-6 text-center text-slate-600 dark:text-slate-400">
          We encountered an unexpected error. Please try again or contact support if the problem
          persists.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
            <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Error Details (Development Only):
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">{error.message}</p>
            {error.stack && (
              <pre className="mt-2 max-h-40 overflow-auto text-xs text-slate-600 dark:text-slate-400">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full bg-orange-600 hover:bg-orange-700">
            Try Again
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to use error boundary imperatively
 * Useful for catching errors in event handlers
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
