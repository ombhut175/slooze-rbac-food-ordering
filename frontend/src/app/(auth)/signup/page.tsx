"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthCard, { Field, Input, PasswordInput, SubmitButton, MutedLink } from "../_components/auth-card";
import { CountrySelect } from "../_components/country-select";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useGuestProtection } from "@/components/auth/auth-provider";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isSignupLoading, signupError, clearErrors } = useAuthStore();
  const { shouldRender } = useGuestProtection();
  const [country, setCountry] = React.useState<string>("IN");
  const [formErrors, setFormErrors] = React.useState<{ name?: string; email?: string; password?: string; confirm?: string; country?: string } | null>(null);

  React.useEffect(() => {
    hackLog.componentMount('SignupPage', {
      hasSignupError: !!signupError,
      isLoading: isSignupLoading
    });

    // Clear any previous errors when component mounts
    clearErrors();
  }, [clearErrors]);

  function validate(form: FormData) {
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    const nextErrors: { name?: string; email?: string; password?: string; confirm?: string; country?: string } = {};
    
    if (!name) nextErrors.name = "Your name is required";
    if (!email) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";
    if (!password) nextErrors.password = "Password is required";
    else if (password.length < 8) nextErrors.password = "At least 8 characters";
    if (confirm !== password) nextErrors.confirm = "Passwords do not match";
    if (!country) nextErrors.country = "Please select your country";
    else if (!['IN', 'US'].includes(country)) nextErrors.country = "Invalid country selection";
    
    return { name, email, password, confirm, nextErrors };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { name, email, password, nextErrors } = validate(form);
    
    hackLog.formSubmit('signup', {
      name,
      email,
      passwordLength: password.length,
      country,
      hasValidationErrors: Object.keys(nextErrors).length > 0,
      component: 'SignupPage'
    });

    // Clear previous errors
    setFormErrors(null);
    clearErrors();

    // Check for validation errors
    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      hackLog.formValidation('signup', nextErrors);
      return;
    }

    try {
      // Backend signup needs email, password, and country
      const success = await signup({ email, password, country: country as 'IN' | 'US' });
      
      if (success) {
        hackLog.storeAction('signupRedirect', {
          email,
          country,
          redirectTo: ROUTES.AUTH.LOGIN,
          component: 'SignupPage'
        });
        
        toast.success('Account created successfully! Please log in.');
        router.push(ROUTES.AUTH.LOGIN);
      }
      // If signup failed, error is already in signupError from store
    } catch (error: any) {
      hackLog.error('Signup submission failed', {
        error: error.message,
        email,
        country,
        component: 'SignupPage'
      });
    }
  }

  // Display either form validation errors or API errors
  const displayErrors = formErrors || (signupError ? { email: signupError } : null);

  // Don't render if user is already authenticated
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <AuthCard
          title="Get started"
          subtitle="Join FoodHub and order from your favorite restaurants"
          footer={
            <div className="space-x-1">
              <span>Already have an account?</span>
              <MutedLink href={ROUTES.AUTH.LOGIN}>Sign in</MutedLink>
            </div>
          }
        >
          <form className="grid gap-4" onSubmit={onSubmit}>
            <Field label="Full name" error={displayErrors?.name}>
              <Input name="name" placeholder="Alex Johnson" autoComplete="name" required />
            </Field>

            <Field label="Email" error={displayErrors?.email}>
              <Input name="email" type="email" inputMode="email" placeholder="you@school.edu" autoComplete="email" required />
            </Field>

            <CountrySelect 
              value={country}
              onChange={(value) => {
                setCountry(value);
                hackLog.formValidation('signup-country', { 
                  country: value, 
                  component: 'SignupPage' 
                });
              }}
              error={displayErrors?.country}
            />

            <Field label="Password" hint="Use at least 8 characters." error={displayErrors?.password}>
              <PasswordInput name="password" placeholder="••••••••" autoComplete="new-password" required />
            </Field>

            <Field label="Confirm password" error={displayErrors?.confirm}>
              <PasswordInput name="confirm" placeholder="••••••••" autoComplete="new-password" required />
            </Field>

            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input type="checkbox" name="tos" required className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span>I agree to the Terms and Privacy Policy</span>
            </label>

            <SubmitButton type="submit" loading={isSignupLoading}>
              Create account
            </SubmitButton>
          </form>
        </AuthCard>
      </div>

      <div className="order-1 md:order-2">
        <SignupAside />
      </div>
    </div>
  );
}

function SignupAside() {
  return (
    <div className="relative mx-auto max-w-md md:max-w-none">
      <div className="relative overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/15 p-6 shadow-2xl backdrop-blur-sm dark:border-green-900/30">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-green-900 dark:text-green-100">Start eating better</h2>
        <p className="mt-2 text-sm text-green-800 dark:text-green-200">
          Explore diverse cuisines, track your orders, and enjoy seamless food delivery experience.
        </p>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-3 shadow-sm transition-colors dark:border-green-900/40 dark:bg-green-950/60 text-green-900 dark:text-green-100">
            🍽️ Curated restaurants and cuisines
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-3 shadow-sm transition-colors dark:border-green-900/40 dark:bg-green-950/60 text-green-900 dark:text-green-100">
            💳 Secure payments and instant confirmations
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-3 shadow-sm transition-colors dark:border-green-900/40 dark:bg-green-950/60 text-green-900 dark:text-green-100">
            🎁 Seasonal offers and surprise bonuses
          </div>
        </div>
      </div>
    </div>
  );
}
