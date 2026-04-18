"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer } from "@/types/database";
import { EditCustomerForm } from "./edit-customer-form";
import { AddCustomerForm } from "./add-customer-form";
import DeleteCustomersByBatchForm from "./batch-delete-customers--form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DataTableV2,
  DataTableColumn,
  DataTableBatchAction,
} from "@/components/ui/data-table-v2";

export function CustomersList() {
  const router = useRouter();
  const {
    customers,
    setCustomers,
    // locations,
    isLoading,
    perPage,
    setPerPage,
    activePage,
    setActivePage,
    totalCount,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,
    refresh,
  } = useCustomers();
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState<
    Customer | false
  >(false);
  const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(
    new Set(),
  );
  console.log(sortConfig);
  // Column configuration for DataTableV2
  const columns: DataTableColumn<Customer>[] = [
    {
      key: "id",
      label: "Customer ID",
      sortable: true,
    },
    {
      key: "first_name",
      label: "Name",
      sortable: true,
      render: (value: unknown, customer: Customer) => (
        <div>
          <Link
            href={{
              pathname: `customers/${customer?.id}`,
              query: { category: "estimate" },
            }}
            className="hover:underline  font-medium"
          >
            {customer.first_name} {customer.last_name}
          </Link>
          {customer.email && (
            <div className="text-sm  text-muted-foreground">
              {customer.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "company_name",
      label: "Company Name",
      sortable: true,
      render: (value: unknown, customer: Customer) => (
        <>{customer.company_name}</>
      ),
    },
    {
      key: "property_address",
      label: "Address",
      sortable: true,
      render: (value: unknown, customer: Customer) => (
        <>{customer.property_address}</>
      ),
    },
    {
      key: "phone_number",
      label: "Contact",
      sortable: false,
      render: (value: unknown, customer: Customer) => (
        <div className="flex flex-col gap-1">
          {customer.email && (
            <div className="flex items-center gap-2">
              <a
                href={`tel:${customer.phone}`}
                className="text-sm text-blue-600"
              >
                {customer.phone}
              </a>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Action configuration for DataTableV2
  // const actions: DataTableAction<Customer>[] = [
  //   {
  //     icon: Edit,
  //     label: "Edit Customer",
  //     onClick: (customer: Customer) => setIsEditCustomerOpen(customer),
  //   },
  //   {
  //     icon: FileText,
  //     label: "View Details",
  //     onClick: (customer: Customer) => window.open(`/admin/dashboard/customers/${customer.id}`, '_self'),
  //   },
  //   {
  //     icon: MoreHorizontal,
  //     label: "More Actions",
  //     onClick: (customer: Customer) => {
  //       console.log("More actions for customer:", customer.id);
  //     },
  //   },
  // ];

  // Batch action configuration for DataTableV2
  const batchActions: DataTableBatchAction<Customer>[] = [
    {
      icon: Trash2,
      label: "Delete Customers",
      onClick: (selectedIds: string[]) => {
        setSelectedCustomerIds(new Set(selectedIds));
        setIsDeleteFormOpen(true);
      },
      show: (count: number) => count > 0,
      variant: "destructive",
    },
  ];

  // Get location name by ID
  // const getLocationName = (locationId: string | null) => {
  //   if (!locationId) return "N/A";
  //   const location = locations.find((loc: Location) => loc.id === locationId);
  //   return location ? location.name : "Unknown";
  // };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between ml-2 items-center">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer database and track customer information
            </p>
          </div>
        </div>
      </div>

      {/* Add Customer Form */}
      <AddCustomerForm
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        onSuccess={() => {
          setIsAddCustomerOpen(false);
          refresh();
        }}
      />

      {/* Edit Customer Form */}
      {isEditCustomerOpen && (
        <EditCustomerForm
          customer={isEditCustomerOpen}
          open={!!isEditCustomerOpen}
          onOpenChange={() => setIsEditCustomerOpen(false)}
          onSuccess={() => {
            setIsEditCustomerOpen(false);
            refresh();
          }}
        />
      )}

      {/* Delete Customers Form */}
      <DeleteCustomersByBatchForm
        selectedIds={selectedCustomerIds}
        open={isDeleteFormOpen}
        onOpenChange={setIsDeleteFormOpen}
        onSuccess={() => {
          setIsDeleteFormOpen(false);
          setSelectedCustomerIds(new Set());
          refresh();
        }}
        setData={setCustomers}
      />

      {/* Data Table */}
      <DataTableV2<Customer & Record<string, unknown>>
        data={customers as (Customer & Record<string, unknown>)[]}
        columns={columns}
        // actions={actions}
        batchActions={batchActions}
        loading={isLoading}
        loadingMessage="Loading customers..."
        emptyMessage="No customers found. Add your first customer!"
        searchPlaceholder="Search customers..."
        idField="id"
        exportable={false}
        exportFilename="customers"
        showAddButton={true}
        addButtonLabel="Add Customer"
        onAddClick={() => setIsAddCustomerOpen(true)}
        pagination={true}
        searchable={true}
        pageSize={perPage}
        pageSizeOptions={[10, 25, 50, 100]}
        // Server-side props
        serverSide={true}
        totalCount={totalCount}
        currentPage={activePage}
        onPageChange={setActivePage}
        onPageSizeChange={setPerPage}
        onSearchChange={setSearchTerm}
        onSortChange={(sortKey, direction) => {
          if (direction === null) {
            setSortConfig([]);
          } else {
            setSortConfig([
              {
                key: sortKey as keyof Customer | "name",
                columnName: sortKey,
                sortBy: direction,
              },
            ]);
          }
        }}
        searchTerm={searchTerm}
        sortKey={
          sortConfig.length > 0 ? (sortConfig[0].key as string) : undefined
        }
        sortDirection={sortConfig.length > 0 ? sortConfig[0].sortBy : undefined}
        onSelectionChange={(selectedIds) => {
          setSelectedCustomerIds(new Set(selectedIds));
        }}
        onRowClick={(customer) => {
          router.push(
            `/admin/dashboard/customers/${customer.id}?category=estimate`,
          );
        }}
      />
    </div>
  );
}
