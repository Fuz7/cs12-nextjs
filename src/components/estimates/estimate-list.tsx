"use client";

import React, { useState } from "react";
import { Phone, Mail, Edit, Trash2, UserCheck, Building } from "lucide-react";
import { Lead } from "@/types/leads";
import { LEAD_STATUSES } from "@/types/leads";
import {
  DataTableV2,
  type DataTableColumn,
  type DataTableAction,
  type DataTableBatchAction,
} from "@/components/ui/data-table-v2";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/useLeads";
import { useEstimates } from "@/hooks/useEstimates";
import { Estimate, ESTIMATE_STATUSES } from "@/types/estimates";
import Link from "next/link";
import AddEstimateCustomerIdForm from "./search-customer-form";
import SearchCustomerForm from "./search-customer-form";
import { Customer } from "@/types/database";
import { AddEstimateForm } from "./add-estimate-form";
import { wait } from "@/utils/promise";

export function EstimatesList() {
  const {
    estimate,
    currentPage,
    setCurrentPage,
    sortConfig,
    searchTerm,
    setSearchTerm,
    loading,
    refreshEstimates,
    setPerPage,
    setSortConfig,
    perPage,
    totalCount,
  } = useEstimates();
  console.log(estimate);
  const [isAddConfirmationOpen, setIsAddConfirmationOpen] = useState(false);
  const [isAddEstimateOpen, setIsAddEstimateOpen] = useState<Customer | false>(
    false
  );
  const [isEditEstimateOpen, setIsEditEstimateOpen] = useState<
    Estimate | false
  >(false);
  const [isDeleteEstimateOpen, setIsDeleteEstimateOpen] = useState<
    Estimate | false
  >(false);

  // Get status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = ESTIMATE_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  // Column configuration for DataTableV2
  const columns: DataTableColumn<Estimate>[] = [
    {
      key: "customer_id",
      label: "Customer ID",
      sortable: true,
      render: (value: unknown, estimate: Estimate) => (
        <div className="flex flex-col gap-1">{estimate.customer?.id}</div>
      ),
    },
    {
      key: "customer_first_name",
      label: "Name",
      sortable: true,
      render: (value: unknown, estimate: Estimate) => (
        <div>
          <Link
            href={`dashboard/customers/${estimate.customer?.id}`}
            className="font-medium"
          >
            {estimate.customer.first_name + " " + estimate.customer.last_name}
          </Link>
          {estimate.customer.email && (
            <div className="text-sm text-muted-foreground ">
              {estimate.customer.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "job_name",
      label: "Title",
      sortable: true,
      render: (value: unknown, estimate: Estimate) => (
        <div className="flex flex-col gap-1">{estimate.job_name}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: "tasks_total_price",
      label: "Estimates",
      sortable: true,
      render: (value: unknown) => {
        const num = Number(value) || 0;

        return (
          <span className="text-sm">
            $
            {num.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
  ];

  const actions: DataTableAction<Estimate>[] = [
    {
      icon: Edit,
      label: "Edit Estimate",
      onClick: (estimate: Estimate) => setIsEditEstimateOpen(estimate),
    },
    {
      icon: Trash2,
      label: "Delete Estimate",
      onClick: async (estimate: Estimate) => setIsDeleteEstimateOpen(estimate),
    },
  ];

  // Batch action configuration for DataTableV2
  const batchActions: DataTableBatchAction<Estimate>[] = [
    {
      icon: Trash2,
      label: "Delete Leads",
      onClick: (selectedIds: string[]) => {
        console.log("Batch delete clicked for:", selectedIds);
      },
      show: (count: number) => count > 0,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Estimates</h1>
            <p className="text-muted-foreground">
              Manage your sales leads and convert them to customers
            </p>
          </div>
        </div>
      </div>

      {/* Add Estimate Customer ID Form */}
      {isAddConfirmationOpen && (
        <SearchCustomerForm
          open={isAddConfirmationOpen}
          onOpenChange={setIsAddConfirmationOpen}
          onSuccess={async (customer) => {
            setIsAddConfirmationOpen(false);
            await wait(200);
            setIsAddEstimateOpen(customer);
          }}
        />
      )}
      {isAddEstimateOpen && (
        <AddEstimateForm
          customer={isAddEstimateOpen}
          open={!!isAddEstimateOpen}
          onOpenChange={() => setIsAddEstimateOpen(false)}
          onSuccess={() => {
            setIsAddEstimateOpen(false);
            refreshEstimates();
          }}
        />
      )}
      {/* Edit Lead Form */}
      {/* {isEditEstimateOpen && (
        <EditLeadForm
          lead={isEditEstimateOpen}
          open={!!isEditEstimateOpen}
          onOpenChange={() => setIsEditEstimateOpen(false)}
          onSuccess={() => {
            setIsEditEstimateOpen(false);
            refreshLeads();
          }}
        />
      )} */}
      {/* {isDeleteEstimateOpen && (
        <DeleteLeadForm
          lead={isDeleteEstimateOpen}
          open={!!isDeleteEstimateOpen}
          onOpenChange={() => setIsDeleteEstimateOpen(false)}
          onSuccess={() => {
            setIsDeleteEstimateOpen(false);
            refreshLeads();
          }}
        />
      )}

      {isConvertLeadOpen && (
        <ConvertLeadForm
          lead={isConvertLeadOpen}
          open={!!isConvertLeadOpen}
          onOpenChange={() => setIsConvertLeadOpen(false)}
          onSuccess={() => {
            setIsConvertLeadOpen(false);
            refreshLeads();
          }}
        />
      )} */}
      {/* Data Table */}
      <DataTableV2<Estimate>
        data={estimate}
        columns={columns}
        actions={actions}
        batchActions={batchActions}
        loading={loading}
        loadingMessage="Loading leads..."
        emptyMessage="No leads found. Add your first lead!"
        searchPlaceholder="Search leads..."
        idField="id"
        searchable={true}
        serverSide={true}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPerPage}
        onSearchChange={setSearchTerm}
        onSortChange={(sortKey, direction) => {
          if (direction === null) {
            setSortConfig([]);
          } else {
            setSortConfig([
              {
                key: sortKey as keyof Lead | "name",
                columnName: sortKey,
                sortBy: direction,
              },
            ]);
          }
        }}
        searchTerm={searchTerm}
        showAddButton={true}
        addButtonLabel="Add Estimate"
        onAddClick={() => setIsAddConfirmationOpen(true)}
        sortKey={
          sortConfig.length > 0 ? (sortConfig[0].key as string) : undefined
        }
        sortDirection={sortConfig.length > 0 ? sortConfig[0].sortBy : undefined}
        pagination={true}
        pageSize={perPage}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}
