"use client";

import React, { useState } from "react";
import { Edit, FileCheck, Trash2 } from "lucide-react";
import {
  DataTableV2,
  type DataTableColumn,
  type DataTableAction,
  type DataTableBatchAction,
} from "@/components/ui/data-table-v2";
import { Badge } from "@/components/ui/badge";
import { useEstimates } from "@/hooks/useEstimates";
import { Estimate, ESTIMATE_STATUSES } from "@/types/estimates";
import Link from "next/link";
import SearchCustomerForm from "./search-customer-form";
import { currencyCharacter, Customer } from "@/types/database";
import { AddEstimateForm } from "./add-estimate-form";
import { wait } from "@/utils/promise";
import { EditEstimateForm } from "./edit-estimate-form";
import DeleteEstimateForm from "./delete-estimate-form";
import DeleteEstimatesByBatchForm from "./batch-delete-estimate-form";
import { InfoEstimate } from "./info-estimate";
import ApproveEstimateForm from "./approve-estimate-form";

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
  const [isInfoEstimateShown, setIsInfoEstimateShown] = useState<
    Estimate | false
  >(false);
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
  const [isDeleteBatchFormOpen, setIsDeleteBatchFormOpen] = useState(false);
  const [selectedEstimateIds, setSelectedEstimateIds] = useState<Set<string>>(
    new Set()
  );
  const [isApproveEstimateOpen, setIsApproveEstimateOpen] = useState<
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
  console.log(estimate);
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
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={{
              pathname: `customers/${estimate.customer?.id}`,
              query: { category: "estimates" },
            }}
            className="font-medium hover:underline"
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
            {currencyCharacter}
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
      icon: FileCheck,
      label: "Approve Estimate",
      disabled: (estimate: Estimate) => estimate.status !== "sent",
      onClick: async (estimate: Estimate) => setIsApproveEstimateOpen(estimate),
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
      label: "Delete Estimates",
      onClick: (selectedIds: string[]) => {
        setSelectedEstimateIds(new Set(selectedIds));
        setIsDeleteBatchFormOpen(true);
      },
      show: (count: number) => count > 0,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between ml-2 items-center">
          <div>
            <h1 className="text-2xl font-bold">Estimates</h1>
            <p className="text-muted-foreground">
              Manage your sales leads and convert them to customers
            </p>
          </div>
        </div>
      </div>

      {isInfoEstimateShown && (
        <InfoEstimate
          estimate={isInfoEstimateShown}
          open={!!isInfoEstimateShown}
          setIsApproveEstimateOpen={setIsApproveEstimateOpen}
          setIsEditEstimateOpen={setIsEditEstimateOpen}
          setIsDeleteEstimateOpen={setIsDeleteEstimateOpen}
          onOpenChange={() => setIsInfoEstimateShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoEstimateShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )}

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
          label="estimate"
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
      {isEditEstimateOpen && (
        <EditEstimateForm
          estimate={isEditEstimateOpen}
          open={!!isEditEstimateOpen}
          onOpenChange={() => setIsEditEstimateOpen(false)}
          onSuccess={() => {
            setIsEditEstimateOpen(false);
            refreshEstimates();
          }}
        />
      )}
      {isDeleteEstimateOpen && (
        <DeleteEstimateForm
          estimate={isDeleteEstimateOpen}
          open={!!isDeleteEstimateOpen}
          onOpenChange={() => setIsDeleteEstimateOpen(false)}
          onSuccess={() => {
            setIsDeleteEstimateOpen(false);
            setIsInfoEstimateShown(false);
            refreshEstimates();
          }}
        />
      )}

      {isApproveEstimateOpen && (
        <ApproveEstimateForm
          estimate={isApproveEstimateOpen}
          open={!!isApproveEstimateOpen}
          onOpenChange={() => setIsApproveEstimateOpen(false)}
          onSuccess={() => {
            setIsApproveEstimateOpen(false);
            setIsInfoEstimateShown(false);
            refreshEstimates();
          }}
        />
      )}

      {/* Delete Customers Form */}
      <DeleteEstimatesByBatchForm
        selectedIds={selectedEstimateIds}
        open={isDeleteBatchFormOpen}
        onOpenChange={setIsDeleteBatchFormOpen}
        onSuccess={() => {
          setIsDeleteBatchFormOpen(false);
          setSelectedEstimateIds(new Set());
          refreshEstimates();
        }}
      />
      {/* Data Table */}
      <DataTableV2<Estimate>
        data={estimate}
        columns={columns}
        actions={actions}
        batchActions={batchActions}
        loading={loading}
        loadingMessage="Loading estimates..."
        emptyMessage="No estimates found. Add your first lead!"
        searchPlaceholder="Search estimates..."
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
                key: sortKey as keyof Estimate | "job_name",
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
        onRowClick={(estimate) => {
          setIsInfoEstimateShown(estimate);
        }}
      />
    </div>
  );
}
