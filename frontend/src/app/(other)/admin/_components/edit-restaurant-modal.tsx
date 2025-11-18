"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RestaurantsAPI } from "@/lib/api/restaurants";
import { toast } from "@/hooks/use-toast";
import hackLog from "@/lib/logger";
import type { Restaurant } from "@/types/food-ordering";

interface EditRestaurantModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRestaurantModal({
  restaurant,
  onClose,
  onSuccess,
}: EditRestaurantModalProps) {
  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState<"IN" | "US">("IN");
  const [status, setStatus] = React.useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    name?: string;
  }>({});

  // Pre-populate form with restaurant data
  React.useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setCountry(restaurant.country);
      setStatus(restaurant.status);
      setErrors({});
    }
  }, [restaurant]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Restaurant name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    hackLog.dev("Updating restaurant", {
      restaurantId: restaurant.id,
      name,
      country,
      status,
    });

    try {
      // Only send changed fields
      const updateData: {
        name?: string;
        country?: "IN" | "US";
        status?: "ACTIVE" | "INACTIVE";
      } = {};

      if (name.trim() !== restaurant.name) {
        updateData.name = name.trim();
      }
      if (country !== restaurant.country) {
        updateData.country = country;
      }
      if (status !== restaurant.status) {
        updateData.status = status;
      }

      await RestaurantsAPI.updateRestaurant(restaurant.id, updateData);

      toast({
        title: "Success",
        description: "Restaurant updated successfully",
        duration: 3000,
      });

      onSuccess();
    } catch (error: any) {
      hackLog.error("Failed to update restaurant", {
        error: error.message,
        restaurantId: restaurant.id,
        updateData: { name, country, status },
      });

      // Check for specific country change validation error
      const errorMessage = error.message || "Failed to update restaurant";
      const isCountryChangeError = errorMessage.toLowerCase().includes("country") && 
                                   errorMessage.toLowerCase().includes("order");

      toast({
        title: "Error",
        description: isCountryChangeError
          ? "Cannot change country for restaurant with existing orders"
          : errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!restaurant} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Edit Restaurant
            </DialogTitle>
            <DialogDescription>
              Update restaurant information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Restaurant Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Restaurant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Enter restaurant name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                className={`border-orange-200/50 focus-visible:border-orange-300 focus-visible:ring-orange-200/50 ${
                  errors.name ? "border-red-500" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="edit-country" className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={country}
                onValueChange={(value) => setCountry(value as "IN" | "US")}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="edit-country"
                  className="border-orange-200/50 focus:border-orange-300 focus:ring-orange-200/50"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">🇮🇳 India</SelectItem>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Note: Country cannot be changed if restaurant has existing orders
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as "ACTIVE" | "INACTIVE")}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="edit-status"
                  className="border-orange-200/50 focus:border-orange-300 focus:ring-orange-200/50"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-orange-200/50 hover:border-orange-300 hover:bg-orange-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white transition-all hover:from-orange-700 hover:to-red-700 hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Restaurant"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
