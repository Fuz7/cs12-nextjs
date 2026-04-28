"use client";

import React, { useState } from "react";
import { LinkIcon, FileCheck, Trash2, UnlinkIcon } from "lucide-react";
import {
  DataTableV2,
  type DataTableColumn,
  type DataTableAction,
  type DataTableBatchAction,
} from "@/components/ui/data-table-v2";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { wait } from "@/utils/promise";
import { currencyCharacter } from "@/types/database";
import { useUsers } from "@/hooks/useUsers";
import SearchCustomerForm from "../estimates/search-customer-form";
import { formatToPHDate } from "@/utils/date";

// import { EditUserForm } from "./edit-user-form";
import DeleteUserForm from "./delete-user-form";
import DeleteUsersByBatchForm from "./batch-delete-user";
// import { InfoUser } from "./info-user";
import { User } from "@/types/users";
import { INVOICE_STATUSES } from "@/types/invoices";
import LinkUserForm from "./link-user-form";
import UnlinkUserForm from "./unlink-user-form";
import { InfoUser } from "./info-user";
export function UsersList() {
  const {
    user,
    currentPage,
    setCurrentPage,
    sortConfig,
    searchTerm,
    setSearchTerm,
    loading,
    refreshUsers,
    setPerPage,
    setSortConfig,
    perPage,
    totalCount,
  } = useUsers();
  console.log(user);
  const [isInfoUserShown, setIsInfoUserShown] = useState<User | false>(false);

  const [isLinkUserOpen, setIsLinkUserOpen] = useState<User | false>(false);
  const [isUnLinkUserOpen, setIsUnLinkUserOpen] = useState<User | false>(false);

  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState<User | false>(false);
  const [isDeleteBatchFormOpen, setIsDeleteBatchFormOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  // Get status badge component
  const getStatusBadge = (is_linked: boolean) => {
    return is_linked ? (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 hover:bg-green-100/90
         hover:text-green-800/90"
      >
        Verified
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 hover:bg-red-100/90 hover:text-red-800/90"
      >
        Unverified
      </Badge>
    );
  };
  console.log(user);
  // Column configuration for DataTableV2
  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: unknown, user: User) => (
        <div>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={{
              pathname: `customers/${user.id}`,
              query: { category: "users" },
            }}
            className="font-medium hover:underline"
          >
            {user.name}
          </Link>
          {user.email && (
            <div className="text-sm text-muted-foreground ">{user.email}</div>
          )}
        </div>
      ),
    },
    {
      key: "customer", // 🔥 not "name"
      label: "Linked Customer",
      sortable: true,
      render: (_: unknown, user: User) => {
        const customer = user.customer;

        if (!customer) {
          return <span className="text-muted-foreground">No customer</span>;
        }

        return (
          <div>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={{
                pathname: `customers/${customer.id}`, // 🔥 use customer.id
                query: { category: "users" },
              }}
              className="font-medium hover:underline"
            >
              {customer.first_name} {customer.last_name}
            </Link>

            {customer.email && (
              <div className="text-sm text-muted-foreground">
                {customer.email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "is_linked",
      label: "Status",
      sortable: true,
      render: (value: unknown) => getStatusBadge(value as boolean),
    },

    {
      key: "created_at",
      label: "Date Created",
      sortable: true,
      render: (value: unknown, user: User) => (
        <div className="flex flex-col gap-1">
          {formatToPHDate(user.created_at)}
        </div>
      ),
    },
  ];

  const actions: DataTableAction<User>[] = [
    {
      icon: LinkIcon,
      label: "Link User",
      show: (user: User) => !user.is_linked,
      onClick: (user: User) => setIsLinkUserOpen(user),
    },
    {
      icon: UnlinkIcon,
      label: "Unlink User",
      show: (user: User) => user.is_linked,
      onClick: (user: User) => setIsUnLinkUserOpen(user),
    },
    // {
    //   icon: FileCheck,
    //   label: "Approve User",
    //   disabled: (user: User) => user.status === "approved",
    //   onClick: async (user: User) => setIsApproveUserOpen(user),
    // },
    {
      icon: Trash2,
      label: "Delete User",

      onClick: async (user: User) => setIsDeleteUserOpen(user),
    },
  ];

  // Batch action configuration for DataTableV2
  const batchActions: DataTableBatchAction<User>[] = [
    {
      icon: Trash2,
      label: "Delete Users",
      onClick: (selectedIds: string[]) => {
        setSelectedUserIds(new Set(selectedIds));
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
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage your customers users</p>
          </div>
        </div>
      </div>

      {isInfoUserShown && (
        <InfoUser
          user={isInfoUserShown}
          open={!!isInfoUserShown}
          is_user_linked={isInfoUserShown.is_linked}
          setIsLinkedUserOpen={setIsLinkUserOpen}
          setIsDeleteUserOpen={setIsDeleteUserOpen}
          setIsUnLinkedUserOpen={setIsUnLinkUserOpen}
          onOpenChange={() => setIsInfoUserShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoUserShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )}

      {isLinkUserOpen && (
        <LinkUserForm
          user={isLinkUserOpen}
          open={!!isLinkUserOpen}
          onOpenChange={() => setIsLinkUserOpen(false)}
          onSuccess={() => {
            setIsLinkUserOpen(false);
            refreshUsers();
          }}
        />
      )}
      {isUnLinkUserOpen && (
        <UnlinkUserForm
          user={isUnLinkUserOpen}
          open={!!isUnLinkUserOpen}
          onOpenChange={() => setIsUnLinkUserOpen(false)}
          onSuccess={() => {
            setIsUnLinkUserOpen(false);
            refreshUsers();
          }}
        />
      )}
      {isDeleteUserOpen && (
        <DeleteUserForm
          user={isDeleteUserOpen}
          open={!!isDeleteUserOpen}
          onOpenChange={() => setIsDeleteUserOpen(false)}
          onSuccess={() => {
            setIsDeleteUserOpen(false);
            setIsInfoUserShown(false);
            refreshUsers();
          }}
        />
      )}

      <DeleteUsersByBatchForm
        selectedIds={selectedUserIds}
        open={isDeleteBatchFormOpen}
        onOpenChange={setIsDeleteBatchFormOpen}
        onSuccess={() => {
          setIsDeleteBatchFormOpen(false);
          setSelectedUserIds(new Set());
          refreshUsers();
        }}
      />

      {/* Data Table */}
      <DataTableV2<User>
        data={user}
        columns={columns}
        actions={actions}
        batchActions={batchActions}
        loading={loading}
        loadingMessage="Loading users..."
        emptyMessage="No users found. Add your first lead!"
        searchPlaceholder="Search users..."
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
                key: sortKey as keyof User | "name",
                columnName: sortKey,
                sortBy: direction,
              },
            ]);
          }
        }}
        searchTerm={searchTerm}
        showAddButton={true}
        addButtonLabel="Add User"
        sortKey={
          sortConfig.length > 0 ? (sortConfig[0].key as string) : undefined
        }
        sortDirection={sortConfig.length > 0 ? sortConfig[0].sortBy : undefined}
        pagination={true}
        pageSize={perPage}
        pageSizeOptions={[10, 25, 50, 100]}
        onRowClick={(user) => {
          setIsInfoUserShown(user);
        }}
      />
    </div>
  );
}
