"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Store, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllRestaurants } from "@/hooks/use-all-restaurants";
import { RestaurantTable } from "./restaurant-table";
import { CreateRestaurantModal } from "./create-restaurant-modal";
import { EditRestaurantModal } from "./edit-restaurant-modal";
import hackLog from "@/lib/logger";
import type { Restaurant } from "@/types/food-ordering";
import { format } from "date-fns";

const RESTAURANTS_PER_PAGE = 50;

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function RestaurantsManagement() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [countryFilter, setCountryFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingRestaurant, setEditingRestaurant] = React.useState<Restaurant | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { restaurants, isLoading, error, refetch } = useAllRestaurants();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    hackLog.componentMount("RestaurantsManagement", {
      restaurantCount: restaurants?.length || 0,
    });
  }, [restaurants]);

  // Filter restaurants based on search and filters
  const filteredRestaurants = React.useMemo(() => {
    if (!restaurants) return [];

    return restaurants.filter((restaurant) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        restaurant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCountry =
        countryFilter === "all" || restaurant.country === countryFilter;
      const matchesStatus =
        statusFilter === "all" || restaurant.status === statusFilter;

      return matchesSearch && matchesCountry && matchesStatus;
    });
  }, [restaurants, debouncedSearchQuery, countryFilter, statusFilter]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, countryFilter, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRestaurants.length / RESTAURANTS_PER_PAGE);
  const showPagination = filteredRestaurants.length > RESTAURANTS_PER_PAGE;
  const startIndex = (currentPage - 1) * RESTAURANTS_PER_PAGE;
  const endIndex = startIndex + RESTAURANTS_PER_PAGE;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const exportToCSV = () => {
    const headers = ["Name", "Country", "Status", "Created At", "Updated At"];
    const rows = filteredRestaurants.map((restaurant) => [
      restaurant.name,
      restaurant.country === "IN" ? "India" : "United States",
      restaurant.status,
      format(new Date(restaurant.createdAt), "MMM d, yyyy"),
      format(new Date(restaurant.updatedAt), "MMM d, yyyy"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `restaurants-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingRestaurant(null);
    refetch();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 sm:max-w-sm"></div>
          <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 sm:w-[180px]"></div>
          <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 sm:w-[180px]"></div>
          <div className="h-9 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 sm:w-[180px]"></div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-16 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-16 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-16 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-900/10"
      >
        <p className="text-sm font-medium text-red-900 dark:text-red-100">
          Failed to load restaurants
        </p>
        <p className="mt-2 text-xs text-red-700 dark:text-red-300">
          {error?.message || "An error occurred while loading restaurants"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Search, Filters, and Create Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-orange-200/50 focus-visible:border-orange-300 focus-visible:ring-orange-200/50 dark:border-orange-900/30 dark:focus-visible:border-orange-700"
          />
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full border-orange-200/50 sm:w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="IN">🇮🇳 India</SelectItem>
              <SelectItem value="US">🇺🇸 United States</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full border-orange-200/50 sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Create Restaurant Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="ml-auto bg-gradient-to-r from-orange-600 to-red-600 text-white transition-all hover:from-orange-700 hover:to-red-700 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Restaurant
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new restaurant to the platform</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Results Count and Export */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {showPagination ? (
            <>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRestaurants.length)} of{" "}
              {filteredRestaurants.length} restaurants
            </>
          ) : (
            <>Showing {filteredRestaurants.length} of {restaurants?.length || 0} restaurants</>
          )}
        </p>
        {filteredRestaurants.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-500/30 dark:bg-slate-700/30 dark:hover:border-orange-500/50 dark:hover:bg-orange-950/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export filtered restaurants to CSV</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Restaurant Table */}
      <div className="overflow-hidden rounded-xl border border-orange-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-orange-500/30 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 dark:shadow-lg dark:shadow-slate-950/50">
        <div className="overflow-x-auto">
        {filteredRestaurants.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 shadow-sm dark:from-orange-500/20 dark:to-red-500/20 dark:shadow-orange-500/20">
              <Store className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
              No restaurants found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-300">
              {searchQuery || countryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search filters to find what you're looking for."
                : "Get started by creating your first restaurant."}
            </p>
            <div className="mt-6 flex gap-3">
              {(searchQuery || countryFilter !== "all" || statusFilter !== "all") ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCountryFilter("all");
                    setStatusFilter("all");
                  }}
                  className="border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-500/30 dark:bg-slate-700/50 dark:hover:border-orange-500/50 dark:hover:bg-orange-950/30"
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white transition-all hover:from-orange-700 hover:to-red-700 dark:shadow-lg dark:shadow-orange-500/20"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Restaurant
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <RestaurantTable
            restaurants={paginatedRestaurants}
            onEdit={setEditingRestaurant}
          />
        )}
        </div>
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between border-t border-orange-200/50 pt-4 dark:border-orange-900/30"
        >
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50 dark:border-orange-500/30 dark:bg-slate-700/30 dark:hover:border-orange-500/50 dark:hover:bg-orange-950/30"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-slate-400 dark:text-slate-600"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    className={
                      currentPage === page
                        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 dark:shadow-lg dark:shadow-orange-500/30"
                        : "border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-500/30 dark:bg-slate-700/30 dark:hover:border-orange-500/50 dark:hover:bg-orange-950/30"
                    }
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50 dark:border-orange-500/30 dark:bg-slate-700/30 dark:hover:border-orange-500/50 dark:hover:bg-orange-950/30"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Create Restaurant Modal */}
      <CreateRestaurantModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Restaurant Modal */}
      {editingRestaurant && (
        <EditRestaurantModal
          restaurant={editingRestaurant}
          onClose={() => setEditingRestaurant(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </motion.div>
  );
}
