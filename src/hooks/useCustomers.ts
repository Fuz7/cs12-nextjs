import { useState, useCallback, useEffect } from "react";
import { Customer } from "@/types/database";
import { useDebounce } from "./useDebounce";
import { getCustomersByPagination, searchCustomer } from "@/services/customers";
import toast from "react-hot-toast";

export type SortableTableColumn = {
  key: keyof Customer | "name";
  columnName: string;
  sortBy?: "asc" | "desc";
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortableTableColumn[]>([]);
  const [perPage, setPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState<number>(1);

  // Use a shorter debounce time for better responsiveness
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const fetchData = useCallback(
    async (skipLoading = false) => {
      if (!skipLoading) {
        setIsLoading(true);
      }

      try {
        const customersRes = await getCustomersByPagination(
          activePage,
          perPage,
          sortConfig,
          debouncedSearchTerm
        );
        if (customersRes.status === "success") {
          const count = customersRes?.data?.total || 0;
          setTotalCount(count);
          const totalPages = count > 0 ? Math.ceil(count / perPage) : 1;

          // Ensure we don't go beyond the max page when filtering reduces results
          if (activePage > totalPages && totalPages > 0) {
            setActivePage(totalPages);
            return;
          }

          setMaxPage(totalPages);
          setCustomers(customersRes?.data?.data || []);
        } else {
          throw new Error(customersRes?.message || "Failed to fetch customers");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        // Don't clear customers on error to maintain UI state
      } finally {
        setIsLoading(false);
      }
    },
    [activePage, perPage, sortConfig, debouncedSearchTerm]
  );

  const handleSearchCustomer = useCallback(async (id: number) => {
    try {
      const response = await searchCustomer(id);

      if (
        response.status === "success" &&
        Object.keys(response.data as object).length !== 0
      ) {
        return response.data as Customer;
      } else {
        return false;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Refresh function that can be called from outside
  const refresh = useCallback(() => {
    return fetchData(false); // Show loading indicator on manual refresh
  }, [fetchData]);

  // Store previous values to detect changes
  const [prevSearchTerm, setPrevSearchTerm] = useState(debouncedSearchTerm);
  const [prevPerPage, setPrevPerPage] = useState(perPage);
  const [prevSortConfig, setPrevSortConfig] = useState(
    JSON.stringify(sortConfig)
  );

  useEffect(() => {
    // Detect what changed
    const searchChanged = prevSearchTerm !== debouncedSearchTerm;
    const perPageChanged = prevPerPage !== perPage;
    const sortConfigChanged = prevSortConfig !== JSON.stringify(sortConfig);

    // Update previous values
    if (searchChanged) setPrevSearchTerm(debouncedSearchTerm);
    if (perPageChanged) setPrevPerPage(perPage);
    if (sortConfigChanged) setPrevSortConfig(JSON.stringify(sortConfig));

    if (
      (searchChanged || perPageChanged || sortConfigChanged) &&
      activePage !== 1
    ) {
      setActivePage(1);
    } else {
      fetchData(false);
    }
  }, [
    activePage,
    debouncedSearchTerm,
    perPage,
    sortConfig,
    fetchData,
    prevSearchTerm,
    prevPerPage,
    prevSortConfig,
  ]);

  return {
    isLoading,
    perPage,
    customers,
    activePage,
    sortConfig,
    searchTerm,
    maxPage,
    totalCount,
    error,
    setCustomers,
    setPerPage,
    setSortConfig,
    setActivePage,
    setSearchTerm,
    refresh,
    handleSearchCustomer,
  };
}
