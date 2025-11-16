"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AuthCard, { Field, Input, SubmitButton, MutedLink } from "../_components/auth-card";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useGuestProtection } from "@/components/auth/auth-provider";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordLoading, forgotPasswordError, clearErrors } = useAuthStore();
  const { shouldRender } = useGuestProtection();
  const [sent, setSent] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    hackLog.componentMount('ForgotPasswordPage', {
      hasForgotPasswordError: !!forgotPasswordError,
      isLoading: isForgotPasswordLoading
    });

    // Clear any previous errors when component mounts
    clearErrors();
  }, [clearErrors]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    
    hackLog.formSubmit('forgotPassword', {
      email,
      component: 'ForgotPasswordPage'
    });

    // Clear previous errors
    setFormError(null);
    clearErrors();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address");
      hackLog.formValidation('forgotPassword', { email: 'Invalid email' });
      return;
    }

    try {
      const success = await forgotPassword({ email });
      
      if (success) {
        hackLog.storeAction('forgotPasswordSuccess', {
          email,
          component: 'ForgotPasswordPage'
        });
        
        setSent(true);
        toast.success('Password reset email sent successfully!');
      }
      // If forgot password failed, error is already in forgotPasswordError from store
    } catch (error: any) {
      hackLog.error('Forgot password submission failed', {
        error: error.message,
        email,
        component: 'ForgotPasswordPage'
      });
    }
  }

  // Display either form validation error or API error
  const displayError = formError || forgotPasswordError;

  // Don't render if user is already authenticated
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <AuthCard
          title={sent ? "Check your email" : "Reset password"}
          subtitle={
            sent
              ? "We've sent a reset link to verify your email address."
              : "Enter your email and we'll send you a secure reset link."
          }
          footer={
            <div className="space-x-1">
              <span>Remember now?</span>
              <MutedLink href={ROUTES.AUTH.LOGIN}>Back to login</MutedLink>
            </div>
          }
        >
          {sent ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-slate-600 dark:text-slate-300">
              If you don't see the email in a few minutes, check your spam folder.
            </motion.div>
          ) : (
            <form className="grid gap-4" onSubmit={onSubmit}>
              <Field label="Email" error={displayError ?? undefined}>
                <Input name="email" type="email" inputMode="email" placeholder="you@school.edu" autoComplete="email" required />
              </Field>

              <SubmitButton type="submit" loading={isForgotPasswordLoading}>
                Send reset link
              </SubmitButton>
            </form>
          )}
        </AuthCard>
      </div>

      <div className="order-1 md:order-2">
        <AsidePanel />
      </div>
    </div>
  );
}

function AsidePanel() {
  return (
    <div className="relative mx-auto max-w-md md:max-w-none">
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 p-6 shadow-2xl backdrop-blur-sm dark:border-amber-900/30">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-amber-900 dark:text-amber-100">We've got you</h2>
        <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
          Secure account recovery keeps you connected to your favorite restaurants and orders.
        </p>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-sm transition-colors dark:border-amber-900/40 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100">
            🔐 Quick one-click reset from your email
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 shadow-sm transition-colors dark:border-amber-900/40 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100">
            ✓ Secure token-based recovery links
          </div>
        </div>
      </div>
    </div>
  );
}
