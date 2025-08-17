"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  X, 
  Download, 
  Plus,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import for CSV export
const CSVLink = dynamic(() => import("react-csv").then((mod) => mod.CSVLink), {
  ssr: false,
});

// Types
export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  exportKey?: string; // For CSV export
  exportLabel?: string; // For CSV export header
}

export interface DataTableAction<T = Record<string, unknown>> {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: (row: T) => void;
  variant?: "ghost" | "default" | "destructive" | "outline" | "secondary";
  show?: (row: T) => boolean;
}

export interface DataTableBatchAction<T = Record<string, unknown>> {
  icon: React.ComponentType<{ className?: string; size?: number; color?: string }>;
  label: string;
  onClick: (selectedIds: string[], selectedRows: T[]) => void;
  variant?: "ghost" | "default" | "destructive" | "outline" | "secondary";
  show?: (selectedCount: number) => boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
  // Data
  data: T[];
  columns: DataTableColumn<T>[];
  
  // Configuration
  idField?: string;
  loading?: boolean;
  
  // Features
  searchable?: boolean;
  searchPlaceholder?: string;
  sortable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  exportFilename?: string;
  
  // Actions
  actions?: DataTableAction<T>[];
  batchActions?: DataTableBatchAction<T>[];
  
  // Add button
  showAddButton?: boolean;
  addButtonLabel?: string;
  onAddClick?: () => void;
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Server-side features
  serverSide?: boolean;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
  onSortChange?: (sortKey: string, direction: 'asc' | 'desc' | null) => void;
  searchTerm?: string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc' | null;
  
  // Styling
  className?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  
  // Callbacks
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedIds: string[], selectedRows: T[]) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export function DataTableV2<T extends Record<string, unknown>>({
  data,
  columns,
  idField = 'id',
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  sortable = true,
  selectable = true,
  exportable = true,
  exportFilename = "export",
  actions = [],
  batchActions = [],
  showAddButton = false,
  addButtonLabel = "Add Item",
  onAddClick,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  // Server-side props
  serverSide = false,
  totalCount,
  currentPage: externalCurrentPage,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  searchTerm: externalSearchTerm,
  sortKey: externalSortKey,
  sortDirection: externalSortDirection,
  className = "",
  emptyMessage = "No data found",
  loadingMessage = "Loading...",
  onRowClick,
  onSelectionChange,
}: DataTableProps<T>) {
  // State - use external state for server-side, internal for client-side
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalCurrentPageSize, setInternalCurrentPageSize] = useState(pageSize);

  // Use external state if server-side, otherwise use internal state
  const searchTerm = serverSide ? (externalSearchTerm || "") : internalSearchTerm;
  const currentPage = serverSide ? (externalCurrentPage || 1) : internalCurrentPage;
  const currentPageSize = serverSide ? pageSize : internalCurrentPageSize;
  const sortConfig = serverSide 
    ? (externalSortKey ? { key: externalSortKey, direction: externalSortDirection || 'asc' } : null)
    : internalSortConfig;

  // Memoized filtered and sorted data (only for client-side)
  const processedData = useMemo(() => {
    if (serverSide) {
      // For server-side, data is already processed
      return data;
    }

    let filtered = data;

    // Apply search filter
    if (searchTerm && searchable) {
      const searchLower = searchTerm.toLowerCase();
      filtered = data.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply sorting
    if (sortConfig && sortable) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        // Convert to strings for comparison if they're not null/undefined
        const aStr = aValue?.toString() || '';
        const bStr = bValue?.toString() || '';
        
        const comparison = aStr < bStr ? -1 : 1;
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig, columns, searchable, sortable, serverSide]);

  // Pagination calculations
  const totalPages = serverSide 
    ? Math.ceil((totalCount || 0) / currentPageSize)
    : Math.ceil(processedData.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const paginatedData = serverSide 
    ? data // Server-side data is already paginated
    : (pagination ? processedData.slice(startIndex, startIndex + currentPageSize) : processedData);

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    const newSelectedIds = new Set<string>();
    if (selectedIds.size !== paginatedData.length) {
      paginatedData.forEach((row) => {
        newSelectedIds.add(String(row[idField]));
      });
    }
    setSelectedIds(newSelectedIds);
    
    if (onSelectionChange) {
      const selectedRows = paginatedData.filter(row => 
        newSelectedIds.has(String(row[idField]))
      );
      onSelectionChange(Array.from(newSelectedIds), selectedRows);
    }
  }, [selectedIds.size, paginatedData, idField, onSelectionChange]);

  const handleSelectRow = useCallback((rowId: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(rowId)) {
      newSelectedIds.delete(rowId);
    } else {
      newSelectedIds.add(rowId);
    }
    setSelectedIds(newSelectedIds);
    
    if (onSelectionChange) {
      const selectedRows = processedData.filter(row => 
        newSelectedIds.has(String(row[idField]))
      );
      onSelectionChange(Array.from(newSelectedIds), selectedRows);
    }
  }, [selectedIds, processedData, idField, onSelectionChange]);

  // Sort handler
  const handleSort = useCallback((columnKey: string) => {
    if (serverSide && onSortChange) {
      const currentDirection = externalSortKey === columnKey ? externalSortDirection : null;
      let newDirection: 'asc' | 'desc' | null = 'asc';
      
      if (currentDirection === 'asc') {
        newDirection = 'desc';
      } else if (currentDirection === 'desc') {
        newDirection = null;
      }
      
      onSortChange(columnKey, newDirection);
    } else {
      setInternalSortConfig(current => {
        if (current?.key === columnKey) {
          return current.direction === 'asc' 
            ? { key: columnKey, direction: 'desc' }
            : null;
        }
        return { key: columnKey, direction: 'asc' };
      });
    }
  }, [serverSide, onSortChange, externalSortKey, externalSortDirection]);

  // Search handler
  const handleSearchChange = useCallback((value: string) => {
    if (serverSide && onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchTerm(value);
    }
  }, [serverSide, onSearchChange]);

  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    if (serverSide && onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  }, [serverSide, onPageChange]);

  // Page size change handler
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (serverSide && onPageSizeChange) {
      onPageSizeChange(newPageSize);
      if (onPageChange) {
        onPageChange(1); // Reset to first page
      }
    } else {
      setInternalCurrentPageSize(newPageSize);
      setInternalCurrentPage(1);
    }
  }, [serverSide, onPageSizeChange, onPageChange]);

  // Export data preparation
  const exportData = useMemo(() => {
    if (!exportable) return [];
    
    return processedData.map((row) => {
      const exportRow: Record<string, unknown> = {};
      columns.forEach((column) => {
        const key = column.exportKey || column.key;
        const label = column.exportLabel || column.label;
        exportRow[label] = row[key];
      });
      return exportRow;
    });
  }, [processedData, columns, exportable]);

  const csvHeaders = useMemo(() => {
    if (!exportable) return [];
    
    return columns.map((column) => ({
      key: column.exportLabel || column.label,
      label: column.exportLabel || column.label,
    }));
  }, [columns, exportable]);

  // Get selected rows for batch actions
  const selectedRows = useMemo(() => {
    return processedData.filter(row => selectedIds.has(String(row[idField])));
  }, [processedData, selectedIds, idField]);

  // Reset page when search changes
  React.useEffect(() => {
    handlePageChange(1);
  }, [searchTerm, handlePageChange]);

  // Reset selection when data changes
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [data]);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Top toolbar */}
      {(searchable || exportable || showAddButton || batchActions.length > 0) && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            {searchable && (
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                    onClick={() => handleSearchChange("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Batch actions */}
            {batchActions.length > 0 && selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                {batchActions.map((action, index) => {
                  const show = action.show ? action.show(selectedIds.size) : true;
                  if (!show) return null;

                  const IconComponent = action.icon;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={action.variant || "outline"}
                          size="sm"
                          onClick={() => action.onClick(Array.from(selectedIds), selectedRows)}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {action.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{action.label} ({selectedIds.size} selected)</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Export button */}
            {exportable && exportData.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <CSVLink
                      data={exportData}
                      headers={csvHeaders}
                      filename={`${exportFilename}-${new Date().toISOString().split('T')[0]}.csv`}
                      className="hidden"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as CSV</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Add button */}
            {showAddButton && onAddClick && (
              <Button onClick={onAddClick} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {addButtonLabel}
              </Button>
            )}

            {/* Page size selector */}
            {pagination && (
              <Select
                value={String(currentPageSize)}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rows per page</SelectLabel>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader variant="pulse" size="lg" text={loadingMessage} />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {/* Selection column */}
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 && 
                      selectedIds.size === paginatedData.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}

              {/* Data columns */}
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable && sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      <div className="ml-2 flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </div>
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}

              {/* Actions column */}
              {actions.length > 0 && (
                <TableHead className="w-24">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const rowId = String(row[idField]);
                const isSelected = selectedIds.has(rowId);

                return (
                  <TableRow
                    key={rowId}
                    className={`${onRowClick ? 'cursor-pointer min-h-10 hover:bg-muted/50' : ''} ${
                      isSelected ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {/* Selection cell */}
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(rowId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render 
                          ? column.render(row[column.key], row, index)
                          : String(row[column.key] || '')
                        }
                      </TableCell>
                    ))}

                    {/* Actions cell */}
                    {actions.length > 0 && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {actions.map((action, actionIndex) => {
                            const show = action.show ? action.show(row) : true;
                            if (!show) return null;

                            const IconComponent = action.icon;
                            return (
                              <Tooltip key={actionIndex}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={action.variant || "ghost"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.onClick(row);
                                    }}
                                  >
                                    <IconComponent className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{action.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + 
                    (selectable ? 1 : 0) + 
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm ? `No results found for "${searchTerm}"` : emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modern Pagination Footer */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4 border-t bg-background/50">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div>
              Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{" "}
              <span className="font-medium text-foreground">
                {Math.min(startIndex + currentPageSize, serverSide ? totalCount || 0 : processedData.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {serverSide ? totalCount || 0 : processedData.length}
              </span>{" "}
              results
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={String(currentPageSize)}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8  w-16 border-0 bg-transparent p-0 hover:bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  ⟪
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  ⟨
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  ⟩
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  ⟫
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTableV2;
