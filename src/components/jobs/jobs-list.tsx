"use client";

import React, { useState } from "react";
import { Edit, FileCheck, Trash2 } from "lucide-react";
import { Lead } from "@/types/leads";
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
import { Customer } from "@/types/database";
import { Job, JOB_STATUSES } from "@/types/jobs";
import { useJobs } from "@/hooks/useJobs";
import { formatToPHDate } from "@/utils/date";
import { AddJobForm } from "./add-job-form";
import { wait } from "@/utils/promise";
import SearchCustomerForm from "../estimates/search-customer-form";
import { EditJobForm } from "./edit-job-form";
import DeleteJobForm from "./delete-job-form";
import DeleteJobsByBatchForm from "./batch-delete-job";

export function JobsList() {
  const {
    job,
    currentPage,
    setCurrentPage,
    sortConfig,
    searchTerm,
    setSearchTerm,
    loading,
    refreshJobs,
    setPerPage,
    setSortConfig,
    perPage,
    totalCount,
  } = useJobs();
  console.log(job);
  const [isInfoEstimateShown, setIsInfoEstimateShown] = useState<Job | false>(
    false
  );
  const [isAddConfirmationOpen, setIsAddConfirmationOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState<Customer | false>(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState<Job | false>(false);
  const [isDeleteJobOpen, setIsDeleteJobOpen] = useState<Job | false>(false);
  const [isDeleteBatchFormOpen, setIsDeleteBatchFormOpen] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  // Get status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = JOB_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  // Column configuration for DataTableV2
  const columns: DataTableColumn<Job>[] = [
    {
      key: "customer_id",
      label: "Customer ID",
      sortable: true,
      render: (value: unknown, job: Job) => (
        <div className="flex flex-col gap-1">{job.customer?.id}</div>
      ),
    },
    {
      key: "customer_first_name",
      label: "Name",
      sortable: true,
      render: (value: unknown, job: Job) => (
        <div>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={`customers/${job.customer?.id}`}
            className="font-medium hover:underline"
          >
            {job.customer.first_name + " " + job.customer.last_name}
          </Link>
          {job.customer.email && (
            <div className="text-sm text-muted-foreground ">
              {job.customer.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "job_name",
      label: "Job",
      sortable: true,
      render: (value: unknown, job: Job) => (
        <div className="flex flex-col gap-1">{job.job_name}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: "due_date",
      label: "Due Date",
      sortable: true,
      render: (value: unknown, job: Job) => (
        <div className="flex flex-col gap-1">
          {formatToPHDate(job.due_date)}
        </div>
      ),
    },
  ];

  const actions: DataTableAction<Job>[] = [
    {
      icon: Edit,
      label: "Edit Job",
      onClick: (job: Job) => setIsEditJobOpen(job),
    },

    // {
    //   icon: FileCheck,
    //   label: "Approve Job",
    //   disabled: (job: Job) => job.status === "completed",
    //   onClick: async (job: Job) => setIsApproveEstimateOpen(job),
    // },
    {
      icon: Trash2,
      label: "Delete Job",

      onClick: async (job: Job) => setIsDeleteJobOpen(job),
    },
  ];

  // Batch action configuration for DataTableV2
  const batchActions: DataTableBatchAction<Job>[] = [
    {
      icon: Trash2,
      label: "Delete Jobs",
      onClick: (selectedIds: string[]) => {
        setSelectedJobIds(new Set(selectedIds));
        setIsDeleteBatchFormOpen(true);
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
            <h1 className="text-2xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Manage your customer jobs</p>
          </div>
        </div>
      </div>

      {/* {isInfoJobShown && (
        <InfoEstimate
          estimate={isInfoEstimateShown}
          open={!!isInfoEstimateShown}
          setIsApproveEstimateOpen={setIsApproveEstimateOpen}
          setIsEditJobOpen={setIsEditJobOpen}
          setIsDeleteJobOpen={setIsDeleteJobOpen}
          onOpenChange={() => setIsInfoEstimateShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoEstimateShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )} */}

      {/* Add Estimate Customer ID Form */}
      {isAddConfirmationOpen && (
        <SearchCustomerForm
          open={isAddConfirmationOpen}
          onOpenChange={setIsAddConfirmationOpen}
          onSuccess={async (customer) => {
            setIsAddConfirmationOpen(false);
            await wait(200);
            setIsAddJobOpen(customer);
          }}
          label="job"
        />
      )}
      {isAddJobOpen && (
        <AddJobForm
          customer={isAddJobOpen}
          open={!!isAddJobOpen}
          onOpenChange={() => setIsAddJobOpen(false)}
          onSuccess={() => {
            setIsAddJobOpen(false);
            refreshJobs();
          }}
        />
      )}

      {isEditJobOpen && (
        <EditJobForm
          job={isEditJobOpen}
          open={!!isEditJobOpen}
          onOpenChange={() => setIsEditJobOpen(false)}
          onSuccess={() => {
            setIsEditJobOpen(false);
            refreshJobs();
          }}
        />
      )}
      {isDeleteJobOpen && (
        <DeleteJobForm
          job={isDeleteJobOpen}
          open={!!isDeleteJobOpen}
          onOpenChange={() => setIsDeleteJobOpen(false)}
          onSuccess={() => {
            setIsDeleteJobOpen(false);
            setIsInfoEstimateShown(false);
            refreshJobs();
          }}
        />
      )}

   

      <DeleteJobsByBatchForm
        selectedIds={selectedJobIds}
        open={isDeleteBatchFormOpen}
        onOpenChange={setIsDeleteBatchFormOpen}
        onSuccess={() => {
          setIsDeleteBatchFormOpen(false);
          setSelectedJobIds(new Set());
          refreshJobs();
        }}
      />
      {/* Data Table */}
      <DataTableV2<Job>
        data={job}
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
                key: sortKey as keyof Job | "job_name",
                columnName: sortKey,
                sortBy: direction,
              },
            ]);
          }
        }}
        searchTerm={searchTerm}
        showAddButton={true}
        addButtonLabel="Add Job"
        onAddClick={() => setIsAddConfirmationOpen(true)}
        sortKey={
          sortConfig.length > 0 ? (sortConfig[0].key as string) : undefined
        }
        sortDirection={sortConfig.length > 0 ? sortConfig[0].sortBy : undefined}
        pagination={true}
        pageSize={perPage}
        pageSizeOptions={[10, 25, 50, 100]}
        onRowClick={(job) => {
          setIsInfoEstimateShown(job);
        }}
      />
    </div>
  );
}
