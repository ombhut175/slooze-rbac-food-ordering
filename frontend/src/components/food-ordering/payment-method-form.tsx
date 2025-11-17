"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/helpers/request";
import { handleError } from "@/helpers/errors";
import { API_ENDPOINTS } from "@/constants/api";
import hackLog from "@/lib/logger";
import type {
  PaymentMethod,
  CreatePaymentMethodRequest,
  UpdatePaymentMethodRequest,
} from "@/types/food-ordering";

export interface PaymentMethodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  paymentMethod?: PaymentMethod | null;
  mode: "create" | "edit";
}

interface FormData {
  label: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  country: "IN" | "US" | "";
  isDefault: boolean;
}

interface FormErrors {
  label?: string;
  brand?: string;
  last4?: string;
  expMonth?: string;
  expYear?: string;
  country?: string;
}

export function PaymentMethodForm({
  isOpen,
  onClose,
  onSuccess,
  paymentMethod,
  mode,
}: PaymentMethodFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    label: "",
    brand: "",
    last4: "",
    expMonth: "",
    expYear: "",
    country: "",
    isDefault: false,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  // Initialize form data when payment method changes
  React.useEffect(() => {
    if (mode === "edit" && paymentMethod) {
      setFormData({
        label: paymentMethod.label || "",
        brand: paymentMethod.brand || "",
        last4: paymentMethod.last4 || "",
        expMonth: paymentMethod.expMonth?.toString() || "",
        expYear: paymentMethod.expYear?.toString() || "",
        country: paymentMethod.country || "",
        isDefault: paymentMethod.isDefault || false,
      });
    } else {
      // Reset form for create mode
      setFormData({
        label: "",
        brand: "",
        last4: "",
        expMonth: "",
        expYear: "",
        country: "",
        isDefault: false,
      });
    }
    setErrors({});
  }, [mode, paymentMethod, isOpen]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Label is required
    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    }

    // Brand is optional but if provided, should be reasonable length
    if (formData.brand && formData.brand.length > 50) {
      newErrors.brand = "Brand name is too long";
    }

    // Last4 validation (optional, but if provided must be 4 digits)
    if (formData.last4) {
      if (!/^\d{4}$/.test(formData.last4)) {
        newErrors.last4 = "Last 4 digits must be exactly 4 numbers";
      }
    }

    // Expiry month validation (optional, but if provided must be 1-12)
    if (formData.expMonth) {
      const month = parseInt(formData.expMonth, 10);
      if (isNaN(month) || month < 1 || month > 12) {
        newErrors.expMonth = "Month must be between 1 and 12";
      }
    }

    // Expiry year validation (optional, but if provided must be current year or later)
    if (formData.expYear) {
      const year = parseInt(formData.expYear, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < currentYear || year > currentYear + 20) {
        newErrors.expYear = `Year must be between ${currentYear} and ${currentYear + 20}`;
      }
    }

    // If expMonth is provided, expYear must also be provided and vice versa
    if (formData.expMonth && !formData.expYear) {
      newErrors.expYear = "Year is required when month is provided";
    }
    if (formData.expYear && !formData.expMonth) {
      newErrors.expMonth = "Month is required when year is provided";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    hackLog.formSubmit("PaymentMethodForm", {
      mode,
      paymentMethodId: paymentMethod?.id,
      formData: { ...formData, last4: "****" }, // Don't log sensitive data
      timestamp: new Date().toISOString(),
    });

    // Validate form
    if (!validateForm()) {
      hackLog.formValidation("PaymentMethodForm", errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        // Create new payment method
        const requestData: CreatePaymentMethodRequest = {
          label: formData.label.trim(),
        };

        // Add optional fields only if they have values
        if (formData.brand) requestData.brand = formData.brand.trim();
        if (formData.last4) requestData.last4 = formData.last4;
        if (formData.expMonth && formData.expYear) {
          requestData.expMonth = parseInt(formData.expMonth, 10);
          requestData.expYear = parseInt(formData.expYear, 10);
        }
        if (formData.country) requestData.country = formData.country;
        if (formData.isDefault) requestData.isDefault = formData.isDefault;

        hackLog.apiRequest("POST", API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS, requestData);

        await apiRequest.post<PaymentMethod>(
          API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHODS,
          requestData
        );

        toast.success("Payment method created successfully");
        hackLog.dev("Payment method created successfully");
      } else {
        // Update existing payment method
        const requestData: UpdatePaymentMethodRequest = {
          label: formData.label.trim(),
        };

        // For update, we can only update label, active, and isDefault
        // Other fields are immutable after creation
        if (formData.isDefault !== paymentMethod?.isDefault) {
          requestData.isDefault = formData.isDefault;
        }

        hackLog.apiRequest(
          "PATCH",
          API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHOD(paymentMethod!.id),
          requestData
        );

        await apiRequest.patch<PaymentMethod>(
          API_ENDPOINTS.FOOD_ORDERING.PAYMENT_METHOD(paymentMethod!.id),
          requestData
        );

        toast.success("Payment method updated successfully");
        hackLog.dev("Payment method updated successfully");
      }

      // Close modal and refresh list
      onSuccess();
      onClose();
    } catch (error: any) {
      hackLog.error("Failed to save payment method", {
        error: error.message,
        mode,
        paymentMethodId: paymentMethod?.id,
        timestamp: new Date().toISOString(),
      });

      handleError(error, {
        toast: true,
        fallbackMessage: `Failed to ${mode === "create" ? "create" : "update"} payment method`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Generate year options (current year + 20 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear + i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Payment Method" : "Edit Payment Method"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new payment method for checkout."
              : "Update payment method details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label Field */}
          <div className="space-y-2">
            <Label htmlFor="label">
              Label <span className="text-red-500">*</span>
            </Label>
            <Input
              id="label"
              type="text"
              placeholder="e.g., Personal Card, Company Card"
              value={formData.label}
              onChange={(e) => handleInputChange("label", e.target.value)}
              aria-invalid={!!errors.label}
              disabled={isSubmitting}
            />
            {errors.label && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.label}</p>
            )}
          </div>

          {/* Brand Field (only for create mode) */}
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                type="text"
                placeholder="e.g., Visa, Mastercard, Amex"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                aria-invalid={!!errors.brand}
                disabled={isSubmitting}
              />
              {errors.brand && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.brand}</p>
              )}
            </div>
          )}

          {/* Last 4 Digits (only for create mode) */}
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="last4">Last 4 Digits</Label>
              <Input
                id="last4"
                type="text"
                placeholder="1234"
                maxLength={4}
                value={formData.last4}
                onChange={(e) => handleInputChange("last4", e.target.value)}
                aria-invalid={!!errors.last4}
                disabled={isSubmitting}
              />
              {errors.last4 && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.last4}</p>
              )}
            </div>
          )}

          {/* Expiry Date (only for create mode) */}
          {mode === "create" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expMonth">Expiry Month</Label>
                <Select
                  value={formData.expMonth}
                  onValueChange={(value) => handleInputChange("expMonth", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="expMonth" aria-invalid={!!errors.expMonth}>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {String(month).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expMonth && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.expMonth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expYear">Expiry Year</Label>
                <Select
                  value={formData.expYear}
                  onValueChange={(value) => handleInputChange("expYear", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="expYear" aria-invalid={!!errors.expYear}>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expYear && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.expYear}</p>
                )}
              </div>
            </div>
          )}

          {/* Country Field (only for create mode) */}
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="country" aria-invalid={!!errors.country}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">🇮🇳 India</SelectItem>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.country}</p>
              )}
            </div>
          )}

          {/* Is Default Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                handleInputChange("isDefault", checked === true)
              }
              disabled={isSubmitting}
            />
            <Label
              htmlFor="isDefault"
              className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default payment method
            </Label>
          </div>

          {/* Form Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create"
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
