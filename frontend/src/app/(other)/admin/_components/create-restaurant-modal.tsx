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

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRestaurantModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRestaurantModalProps) {
  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState<"IN" | "US">("IN");
  const [status, setStatus] = React.useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    name?: string;
  }>({});

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setName("");
      setCountry("IN");
      setStatus("ACTIVE");
      setErrors({});
    }
  }, [isOpen]);

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

    hackLog.dev("Creating restaurant", {
      name,
      country,
      status,
    });

    try {
      await RestaurantsAPI.createRestaurant({
        name: name.trim(),
        country,
        status,
      });

      toast({
        title: "Success",
        description: "Restaurant created successfully",
        duration: 3000,
      });

      onSuccess();
    } catch (error: any) {
      hackLog.error("Failed to create restaurant", {
        error: error.message,
        name,
        country,
        status,
      });

      toast({
        title: "Error",
        description: error.message || "Failed to create restaurant",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Create Restaurant
            </DialogTitle>
            <DialogDescription>
              Add a new restaurant to the system. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Restaurant Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Restaurant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
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
              <Label htmlFor="country" className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={country}
                onValueChange={(value) => setCountry(value as "IN" | "US")}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="country"
                  className="border-orange-200/50 focus:border-orange-300 focus:ring-orange-200/50"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">🇮🇳 India</SelectItem>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as "ACTIVE" | "INACTIVE")}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="status"
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
                    Creating...
                  </>
                ) : (
                  "Create Restaurant"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
