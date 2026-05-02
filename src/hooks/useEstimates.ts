"use client";

import { useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import {
  approveEstimate,
  getEstimatesByPagination,
  rejectEstimate,
} from "@/services/estimates";
import { Estimate } from "@/types/estimates";

export interface SortableEstimateColumn {
  key: keyof Estimate;
  columnName: string;
  sortBy?: "asc" | "desc";
}

export const useEstimates = () => {
  const [estimate, setEstimate] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortableEstimateColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(10);
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 1;
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const fetchEstimates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getEstimatesByPagination(
        currentPage,
        perPage,
        sortConfig,
        debouncedSearchTerm,
      );

      if (response.status === "success" && response.data) {
        setEstimate(response.data.data);
        setTotalCount(response?.data?.total || 0);
      } else {
        setError(response.message || "Failed to fetch leads");
        toast.error(response.message || "Failed to fetch leads");
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

  const refreshEstimates = useCallback(async () => {
    await fetchEstimates();
  }, [fetchEstimates]);

  const handleApproveEstimate = useCallback(
    async (estimateId: number, due_date: string): Promise<boolean> => {
      try {
        const response = await approveEstimate(estimateId, due_date);

        if (response.status === "success") {
          toast.success("Estimate approved successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to approved lead");
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

  const handleRejectEstimate = useCallback(
    async (estimateId: number): Promise<boolean> => {
      try {
        const response = await rejectEstimate(estimateId);

        if (response.status === "success") {
          toast.success("Estimate rejected successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to reject lead");
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

  // Fetch leads when dependencies change
  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  return {
    estimate,
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
    setEstimate,
    setCurrentPage,
    setSearchTerm,
    setSortConfig,
    setSelectedRows,
    refreshEstimates,
    setPerPage,
    handleApproveEstimate,
    handleRejectEstimate,
  };
};
