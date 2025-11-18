"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/hooks/use-auth-store";
import { UsersAPI, type PublicUser } from "@/lib/api/users";
import { toast } from "@/hooks/use-toast";
import hackLog from "@/lib/logger";

interface UserTableProps {
  users: PublicUser[];
  onUpdate: () => void;
}

type SortField = "email" | "role" | "country" | "createdAt";
type SortDirection = "asc" | "desc";

export function UserTable({ users, onUpdate }: UserTableProps) {
  const { publicUser: currentUser } = useAuthStore();
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);
  const [updatingField, setUpdatingField] = React.useState<"role" | "country" | null>(null);
  const [sortField, setSortField] = React.useState<SortField>("email");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort users based on current sort field and direction
  const sortedUsers = React.useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "country":
          aValue = a.country;
          bValue = b.country;
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
  }, [users, sortField, sortDirection]);

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

  const handleRoleUpdate = async (userId: string, newRole: "ADMIN" | "MANAGER" | "MEMBER") => {
    setUpdatingUserId(userId);
    setUpdatingField("role");

    hackLog.dev("Updating user role", {
      userId,
      newRole,
      currentUserId: currentUser?.id,
    });

    try {
      await UsersAPI.updateUserRole(userId, newRole);

      toast({
        title: "Success",
        description: "User role updated successfully",
        duration: 3000,
      });

      onUpdate();
    } catch (error: any) {
      hackLog.error("Failed to update user role", {
        error: error.message,
        userId,
        newRole,
      });

      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdatingUserId(null);
      setUpdatingField(null);
    }
  };

  const handleCountryUpdate = async (userId: string, newCountry: "IN" | "US") => {
    setUpdatingUserId(userId);
    setUpdatingField("country");

    hackLog.dev("Updating user country", {
      userId,
      newCountry,
      currentUserId: currentUser?.id,
    });

    try {
      await UsersAPI.updateUserCountry(userId, newCountry);

      toast({
        title: "Success",
        description: "User country updated successfully",
        duration: 3000,
      });

      onUpdate();
    } catch (error: any) {
      hackLog.error("Failed to update user country", {
        error: error.message,
        userId,
        newCountry,
      });

      toast({
        title: "Error",
        description: error.message || "Failed to update user country",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdatingUserId(null);
      setUpdatingField(null);
    }
  };

  return (
    <Table className="min-w-[800px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead
            className="cursor-pointer select-none font-semibold text-slate-900 transition-colors hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
            onClick={() => handleSort("email")}
          >
            <div className="flex items-center">
              Email
              <SortIcon field="email" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none font-semibold text-slate-900 transition-colors hover:text-orange-600 dark:text-slate-100 dark:hover:text-orange-400"
            onClick={() => handleSort("role")}
          >
            <div className="flex items-center">
              Role
              <SortIcon field="role" />
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
          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
            Email Verified
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map((user, index) => {
          const isCurrentUser = user.id === currentUser?.id;
          const isUpdating = updatingUserId === user.id;

          return (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group border-b border-orange-200/30 transition-colors hover:bg-orange-50/50 dark:border-slate-700/50 dark:hover:bg-slate-700/30"
            >
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                {user.email}
                {isCurrentUser && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    You
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) =>
                    handleRoleUpdate(user.id, value as "ADMIN" | "MANAGER" | "MEMBER")
                  }
                  disabled={isCurrentUser || isUpdating}
                >
                  <SelectTrigger
                    className={`w-[130px] ${
                      isCurrentUser
                        ? "cursor-not-allowed opacity-50"
                        : "border-orange-200/50 hover:border-orange-300"
                    }`}
                  >
                    {isUpdating && updatingField === "role" ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={user.country}
                  onValueChange={(value) => handleCountryUpdate(user.id, value as "IN" | "US")}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[150px] border-orange-200/50 hover:border-orange-300">
                    {isUpdating && updatingField === "country" ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">🇮🇳 India</SelectItem>
                    <SelectItem value="US">🇺🇸 United States</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {user.isEmailVerified ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    Not Verified
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400">
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </TableCell>
            </motion.tr>
          );
        })}
      </TableBody>
    </Table>
  );
}
