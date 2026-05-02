"use client";

import { useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { Invoice } from "@/types/invoices";
import { getInvoicesByPagination, getInvoicesByUserId } from "@/services/invoices";

export interface SortableInvoiceColumn {
  key: keyof Invoice;
  columnName: string;
  sortBy?: "asc" | "desc";
}

export const useInvoices = () => {
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortableInvoiceColumn[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(10);
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 1;
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getInvoicesByPagination(
        currentPage,
        perPage,
        sortConfig,
        debouncedSearchTerm
      );

      if (response.status === "success" && response.data) {
        setInvoice(response.data.data);
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

  const refreshInvoices = useCallback(async () => {
    await fetchInvoices();
  }, [fetchInvoices]);

  // Fetch leads when dependencies change
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  const fetchInvoicesByUserId = useCallback(
    async (userId: number): Promise<boolean> => {
      try {
        const response = await getInvoicesByUserId(userId);

        if (response.status === "success") {
          toast.success("Invoices fetched successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to fetch invoices");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
        return false;
      }
    },
    []
  );

  return {
    invoice,
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
    setInvoice,
    setCurrentPage,
    setSearchTerm,
    setSortConfig,
    setSelectedRows,
    refreshInvoices,
    setPerPage,
  };
};
