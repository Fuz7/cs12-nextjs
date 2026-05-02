"use client";

import { useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { Job } from "@/types/jobs";
import { getJobsByPagination,getActiveJobsByUserId } from "@/services/jobs";

export interface SortableJobColumn {
  key: keyof Job;
  columnName: string;
  sortBy?: "asc" | "desc";
}

export const useJobs = () => {
  const [job, setJob] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortableJobColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(10);
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 1;
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getJobsByPagination(
        currentPage,
        perPage,
        sortConfig,
        debouncedSearchTerm,
      );

      if (response.status === "success" && response.data) {
        setJob(response.data.data);
        setTotalCount(response?.data?.total || 0);
      } else {
        setError(response.message || "Failed to fetch jobs");
        toast.error(response.message || "Failed to fetch jobs");
      }
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).message
          : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortConfig, debouncedSearchTerm]);

  const refreshJobs = useCallback(async () => {
    await fetchJobs();
  }, [fetchJobs]);

  // Fetch jobs when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);
  
  const fetchActiveJobsByUserId = useCallback(
    async (userId: number): Promise<boolean> => {
      try {
        const response = await getActiveJobsByUserId(userId);

        if (response.status === "success") {
          toast.success("Jobs fetched successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to fetch jobs");
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
    job,
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
    setJob,
    setCurrentPage,
    setSearchTerm,
    setSortConfig,
    setSelectedRows,
    refreshJobs,
    setPerPage,
    fetchActiveJobsByUserId
  };
};
