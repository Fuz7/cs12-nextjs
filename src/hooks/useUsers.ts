"use client";

import { useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { User } from "@/types/users";
import {
  getUsersByPagination,
  linkUserToCustomer,
  unlinkUserFromCustomer,
} from "@/services/users";

export interface SortableUserColumn {
  key: keyof User;
  columnName: string;
  sortBy?: "asc" | "desc";
}

export const useUsers = () => {
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortableUserColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(10);
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 1;
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUsersByPagination(
        currentPage,
        perPage,
        sortConfig,
        debouncedSearchTerm,
      );

      if (response.status === "success" && response.data) {
        setUser(response.data.data);
        setTotalCount(response?.data?.total || 0);
      } else {
        setError(response.message || "Failed to fetch users");
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortConfig, debouncedSearchTerm]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);
  const linkUser = useCallback(
    async (
      customerId: number | string,
      userId: number | string,
    ): Promise<boolean> => {
      try {
        const response = await linkUserToCustomer(customerId, userId);

        if (response.status === "success") {
          toast.success("User linked to customer successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to link user");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
        return false;
      }
    },
    [],
  );

  const unlinkUser = useCallback(
    async (userId: number | string): Promise<boolean> => {
      try {
        const response = await unlinkUserFromCustomer(userId);

        if (response.status === "success") {
          toast.success("User unlinked successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to link user");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
        return false;
      }
    },
    [],
  );

  return {
    user,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    searchTerm,
    sortConfig,
    selectedRows,
    perPage,
    // Actions
    setUser,
    setCurrentPage,
    setSearchTerm,
    setSortConfig,
    setSelectedRows,
    refreshUsers,
    setPerPage,
    linkUser,
    unlinkUser,
  };
};
