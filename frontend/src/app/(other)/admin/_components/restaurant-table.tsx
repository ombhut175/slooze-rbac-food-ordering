"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Restaurant } from "@/types/food-ordering";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
}

type SortField = "name" | "country" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

// Country Badge Component
function CountryBadge({ country }: { country: "IN" | "US" }) {
  const countryConfig = {
    IN: { label: "🇮🇳 India", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
    US: { label: "🇺🇸 United States", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  };

  const config = countryConfig[country];

  return (
    <Badge className={`${config.className} hover:${config.className}`}>
      {config.label}
    </Badge>
  );
}

export function RestaurantTable({ restaurants, onEdit }: RestaurantTableProps) {
  const [sortField, setSortField] = React.useState<SortField>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort restaurants based on current sort field and direction
  const sortedRestaurants = React.useMemo(() => {
    const sorted = [...restaurants].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "country":
          aValue = a.country;
          bValue = b.country;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [restaurants, sortField, sortDirection]);

  // Render sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <Table className="min-w-[900px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead
            className="cursor-pointer select-none font-semibold text-slate-900 transition-colors hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
            onClick={() => handleSort("name")}
          >
            <div className="flex items-center">
              Name
              <SortIcon field="name" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none font-semibold text-slate-900 transition-colors hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
            onClick={() => handleSort("country")}
          >
            <div className="flex items-center">
              Country
              <SortIcon field="country" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none font-semibold text-slate-900 transition-colors hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
            onClick={() => handleSort("status")}
          >
            <div className="flex items-center">
              Status
              <SortIcon field="status" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none font-semibold text-slate-900 transition-colors hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
            onClick={() => handleSort("createdAt")}
          >
            <div className="flex items-center">
              Created At
              <SortIcon field="createdAt" />
            </div>
          </TableHead>
          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
            Updated At
          </TableHead>
          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRestaurants.map((restaurant, index) => (
          <motion.tr
            key={restaurant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onEdit(restaurant)}
            className="group cursor-pointer border-b border-orange-200/30 transition-colors hover:bg-orange-50/50 dark:border-slate-700/50 dark:hover:bg-slate-700/30"
          >
            <TableCell className="font-medium text-slate-900 dark:text-slate-100">
              {restaurant.name}
            </TableCell>
            <TableCell>
              <CountryBadge country={restaurant.country} />
            </TableCell>
            <TableCell>
              {restaurant.status === "ACTIVE" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  Inactive
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-slate-600 dark:text-slate-400">
              {format(new Date(restaurant.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-slate-600 dark:text-slate-400">
              {format(new Date(restaurant.updatedAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(restaurant);
                    }}
                    className="text-orange-600 transition-colors hover:bg-orange-100 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-950/30 dark:hover:text-orange-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit restaurant details</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}
