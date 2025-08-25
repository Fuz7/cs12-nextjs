"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead } from "@/types/leads";

import toast from "react-hot-toast";
import { CreateLeadData, UpdateLeadData } from "@/types/leads";
import {
  convertLeadToCustomer,
  createLead,
  deleteLead,
  deleteLeads,
  getLeadsByPagination,
  updateLead,
} from "@/services/leads";
import { useDebounce } from "./useDebounce";
import { getEstimatesByPagination } from "@/services/estimates";
import { Estimate } from "@/types/estimates";

export interface SortableEstimateColumn {
  key: keyof Lead;
  columnName: string;
  sortBy?: "asc" | "desc";
}

// export interface UseLeadsReturn {
//   leads: Lead[];
//   loading: boolean;
//   error: string | null;
//   totalCount: number;
//   currentPage: number;
//   totalPages: number;
//   searchTerm: string;
//   sortConfig: SortableLeadColumn[];
//   selectedRows: Set<string>;
//   perPage: number;
//   // Actions
//   setLeads: (leads: Lead[]) => void;
//   setCurrentPage: (page: number) => void;
//   setSearchTerm: (term: string) => void;
//   setSortConfig: (config: SortableLeadColumn[]) => void;
//   setSelectedRows: (rows: Set<string>) => void;
//   refreshEstimates: () => Promise<void>;
//   handleCreateLead: (leadData: CreateLeadData) => Promise<boolean>;
//   handleUpdateLead: (id: number, leadData: UpdateLeadData) => Promise<boolean>;
//   handleDeleteLead: (id: number) => Promise<boolean>;
//   handleDeleteSelectedLeads: () => Promise<boolean>;
//   handleConvertLead: (
//     id: number,
//     customerData?: Record<string, unknown>
//   ) => Promise<boolean>;
//   setPerPage: (pageNumber: number) => void;
// }

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
        debouncedSearchTerm
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

  const handleCreateLead = useCallback(
    async (leadData: CreateLeadData): Promise<boolean> => {
      try {
        const response = await createLead({
          ...leadData,
        });

        if (response.status === "success") {
          toast.success("Lead created successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to create lead");
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

  const handleUpdateLead = useCallback(
    async (id: number, leadData: UpdateLeadData): Promise<boolean> => {
      try {
        const response = await updateLead(id, leadData);

        if (response.status === "success") {
          toast.success("Lead updated successfully");
          return true;
        } else {
          toast.error(response.message || "Failed to update lead");
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

  const handleDeleteLead = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await deleteLead(id);

      if (response.status === "success") {
        toast.success("Lead deleted successfully");
        return true;
      } else {
        toast.error(response.message || "Failed to delete lead");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const handleDeleteSelectedLeads = useCallback(async (): Promise<boolean> => {
    if (selectedRows.size === 0) {
      toast.error("No leads selected");
      return false;
    }

    try {
      const response = await deleteLeads(selectedRows);

      if (response.status === "success") {
        toast.success(`${selectedRows.size} lead(s) deleted successfully`);
        setSelectedRows(new Set());
        await refreshEstimates();
        return true;
      } else {
        toast.error(response.message || "Failed to delete leads");
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      return false;
    }
  }, [selectedRows, refreshEstimates]);

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
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
    handleDeleteSelectedLeads,
  };
};
