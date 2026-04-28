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
import Link from "next/link";
import { wait } from "@/utils/promise";
import { currencyCharacter, Customer } from "@/types/database";
import { useInvoices } from "@/hooks/useInvoice";
import { Invoice, INVOICE_STATUSES } from "@/types/invoices";
import { formatToPHDate } from "@/utils/date";
import { AddInvoiceForm } from "./add-invoice-form";
import { EditInvoiceForm } from "./edit-invoice-form";
import DeleteInvoiceForm from "./delete-invoice-form";
import DeleteInvoicesByBatchForm from "./batch-delete-invoice";
import { InfoInvoice } from "./info-invoice";
import SearchCustomerForm from "../customers/search-customer-form";
export function InvoicesList() {
  const {
    invoice,
    currentPage,
    setCurrentPage,
    sortConfig,
    searchTerm,
    setSearchTerm,
    loading,
    refreshInvoices,
    setPerPage,
    setSortConfig,
    perPage,
    totalCount,
  } = useInvoices();
  console.log(invoice);
  const [isInfoInvoiceShown, setIsInfoInvoiceShown] = useState<Invoice | false>(
    false
  );
  const [isAddConfirmationOpen, setIsAddConfirmationOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState<Customer | false>(
    false
  );
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState<Invoice | false>(
    false
  );
  const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState<
    Invoice | false
  >(false);
  const [isDeleteBatchFormOpen, setIsDeleteBatchFormOpen] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(
    new Set()
  );

  // Get status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = INVOICE_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };
  console.log(invoice);
  // Column configuration for DataTableV2
  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "customer_id",
      label: "Customer ID",
      sortable: true,
      render: (value: unknown, invoice: Invoice) => (
        <div className="flex flex-col gap-1">{invoice.customer?.id}</div>
      ),
    },
    {
      key: "customer_first_name",
      label: "Name",
      sortable: true,
      render: (value: unknown, invoice: Invoice) => (
        <div>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={{
              pathname: `customers/${invoice.customer?.id}`,
              query: { category: "invoices" },
            }}
            className="font-medium hover:underline"
          >
            {invoice.customer.first_name + " " + invoice.customer.last_name}
          </Link>
          {invoice.customer.email && (
            <div className="text-sm text-muted-foreground ">
              {invoice.customer.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "job_name",
      label: "Job",
      sortable: true,
      render: (value: unknown, invoice: Invoice) => (
        <div className="flex flex-col gap-1">{invoice.job_name}</div>
      ),
    },

    {
      key: "due_date",
      label: "Due Date",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex flex-col gap-1">
          {formatToPHDate(value as string)}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as string),
    },
    {
      key: "paid_amount",
      label: "Paid Amount",
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
    {
      key: "tasks_total_price",
      label: "Invoice",
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

  const actions: DataTableAction<Invoice>[] = [
    {
      icon: Edit,
      label: "Edit Invoice",
      onClick: (invoice: Invoice) => setIsEditInvoiceOpen(invoice),
    },

    // {
    //   icon: FileCheck,
    //   label: "Approve Invoice",
    //   disabled: (invoice: Invoice) => invoice.status === "approved",
    //   onClick: async (invoice: Invoice) => setIsApproveInvoiceOpen(invoice),
    // },
    {
      icon: Trash2,
      label: "Delete Invoice",

      onClick: async (invoice: Invoice) => setIsDeleteInvoiceOpen(invoice),
    },
  ];

  // Batch action configuration for DataTableV2
  const batchActions: DataTableBatchAction<Invoice>[] = [
    {
      icon: Trash2,
      label: "Delete Invoices",
      onClick: (selectedIds: string[]) => {
        setSelectedInvoiceIds(new Set(selectedIds));
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
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">
              Manage your customers invoices
            </p>
          </div>
        </div>
      </div>

      {isInfoInvoiceShown && (
        <InfoInvoice
          invoice={isInfoInvoiceShown}
          open={!!isInfoInvoiceShown}
          setIsEditInvoiceOpen={setIsEditInvoiceOpen}
          setIsDeleteInvoiceOpen={setIsDeleteInvoiceOpen}
          onOpenChange={() => setIsInfoInvoiceShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoInvoiceShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )}

      {isAddConfirmationOpen && (
        <SearchCustomerForm
          open={isAddConfirmationOpen}
          onOpenChange={setIsAddConfirmationOpen}
          onSuccess={async (customer) => {
            setIsAddConfirmationOpen(false);
            await wait(200);
            setIsAddInvoiceOpen(customer);
          }}
        />
      )}
      {isAddInvoiceOpen && (
        <AddInvoiceForm
          customer={isAddInvoiceOpen}
          open={!!isAddInvoiceOpen}
          onOpenChange={() => setIsAddInvoiceOpen(false)}
          onSuccess={() => {
            setIsAddInvoiceOpen(false);
            refreshInvoices();
          }}
        />
      )}
      {isEditInvoiceOpen && (
        <EditInvoiceForm
          invoice={isEditInvoiceOpen}
          open={!!isEditInvoiceOpen}
          onOpenChange={() => setIsEditInvoiceOpen(false)}
          onSuccess={() => {
            setIsEditInvoiceOpen(false);
            refreshInvoices();
          }}
        />
      )}
      {isDeleteInvoiceOpen && (
        <DeleteInvoiceForm
          invoice={isDeleteInvoiceOpen}
          open={!!isDeleteInvoiceOpen}
          onOpenChange={() => setIsDeleteInvoiceOpen(false)}
          onSuccess={() => {
            setIsDeleteInvoiceOpen(false);
            setIsInfoInvoiceShown(false);
            refreshInvoices();
          }}
        />
      )}

      <DeleteInvoicesByBatchForm
        selectedIds={selectedInvoiceIds}
        open={isDeleteBatchFormOpen}
        onOpenChange={setIsDeleteBatchFormOpen}
        onSuccess={() => {
          setIsDeleteBatchFormOpen(false);
          setSelectedInvoiceIds(new Set());
          refreshInvoices();
        }}
      />

      {/* Data Table */}
      <DataTableV2<Invoice>
        data={invoice}
        columns={columns}
        actions={actions}
        batchActions={batchActions}
        loading={loading}
        loadingMessage="Loading invoices..."
        emptyMessage="No invoices found. Add your first lead!"
        searchPlaceholder="Search invoices..."
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
                key: sortKey as keyof Invoice | "job_name",
                columnName: sortKey,
                sortBy: direction,
              },
            ]);
          }
        }}
        searchTerm={searchTerm}
        showAddButton={true}
        addButtonLabel="Add Invoice"
        onAddClick={() => setIsAddConfirmationOpen(true)}
        sortKey={
          sortConfig.length > 0 ? (sortConfig[0].key as string) : undefined
        }
        sortDirection={sortConfig.length > 0 ? sortConfig[0].sortBy : undefined}
        pagination={true}
        pageSize={perPage}
        pageSizeOptions={[10, 25, 50, 100]}
        onRowClick={(invoice) => {
          setIsInfoInvoiceShown(invoice);
        }}
      />
    </div>
  );
}
