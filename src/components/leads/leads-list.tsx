"use client";

import React, { useState } from "react";
import { Phone, Mail, Edit, Trash2, UserCheck, Building } from "lucide-react";
import { Lead } from "@/types/leads";
import { LEAD_STATUSES } from "@/types/leads";
import { AddLeadForm, EditLeadForm } from "./index";
import {
  DataTableV2,
  type DataTableColumn,
  type DataTableAction,
  type DataTableBatchAction,
} from "@/components/ui/data-table-v2";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/useLeads";
import DeleteLeadForm from "./delete-lead-form";
import ConvertLeadForm from "./convert-lead-form";
import DeleteLeadsByBatchForm from "./batch-delete-lead";

export function LeadsList() {
  const {
    leads,
    currentPage,
    setCurrentPage,
    sortConfig,
    searchTerm,
    setSearchTerm,
    loading,
    refreshLeads,
    setPerPage,
    setSortConfig,
    perPage,
    totalCount,
  } = useLeads();

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState<Lead | false>(false);
  const [isDeleteLeadOpen, setIsDeleteLeadOpen] = useState<Lead | false>(false);
  const [isConvertLeadOpen, setIsConvertLeadOpen] = useState<Lead | false>(
    false
  );
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteBatchFormOpen, setIsDeleteBatchFormOpen] = useState(false);
  // Get status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = LEAD_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  // Column configuration for DataTableV2
  const columns: DataTableColumn<Lead>[] = [
    {
      key: "first_name",
      label: "Name",
      sortable: true,
      render: (value: unknown, lead: Lead) => (
        <div>
          <p className="font-medium">
            {lead.first_name + " " + lead.last_name}
          </p>
          {lead.company && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Building className="h-3 w-3" />
              {lead.company}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      sortable: true,
      render: (value: unknown, lead: Lead) => (
        <div className="flex flex-col gap-1">
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{lead.phone}</span>
            </div>
          )}
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
      key: "source",
      label: "Source",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm">{(value as string) || "N/A"}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions: DataTableAction<Lead>[] = [
    {
      icon: Edit,
      label: "Edit Lead",
      onClick: (lead: Lead) => setIsEditLeadOpen(lead),
    },
    {
      icon: UserCheck,
      disabled:(lead:Lead) => lead.status !== "qualified",
      label: "Convert to Customer",
      onClick: async (lead: Lead) => setIsConvertLeadOpen(lead),
    },
    {
      icon: Trash2,
      label: "Delete Lead",
      onClick: async (lead: Lead) => setIsDeleteLeadOpen(lead),
    },
  ];

  // Batch action configuration for DataTableV2
  const batchActions: DataTableBatchAction<Lead>[] = [
    {
      icon: Trash2,
      label: "Delete Leads",
      onClick: (selectedIds: string[]) => {
        setSelectedLeadIds(new Set(selectedIds));
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
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Manage your sales leads and convert them to customers
            </p>
          </div>
        </div>
      </div>

      {/* Add Lead Form */}
      <AddLeadForm
        open={isAddLeadOpen}
        onOpenChange={setIsAddLeadOpen}
        onSuccess={() => {
          setIsAddLeadOpen(false);
          refreshLeads();
        }}
      />

      {/* Edit Lead Form */}
      {isEditLeadOpen && (
        <EditLeadForm
          lead={isEditLeadOpen}
          open={!!isEditLeadOpen}
          onOpenChange={() => setIsEditLeadOpen(false)}
          onSuccess={() => {
            setIsEditLeadOpen(false);
            refreshLeads();
          }}
        />
      )}
      {isDeleteLeadOpen && (
        <DeleteLeadForm
          lead={isDeleteLeadOpen}
          open={!!isDeleteLeadOpen}
          onOpenChange={() => setIsDeleteLeadOpen(false)}
          onSuccess={() => {
            setIsDeleteLeadOpen(false);
            refreshLeads();
          }}
        />
      )}

      {isDeleteBatchFormOpen && (
        <DeleteLeadsByBatchForm
          selectedIds={selectedLeadIds}
          open={isDeleteBatchFormOpen}
          onOpenChange={setIsDeleteBatchFormOpen}
          onSuccess={() => {
            setIsDeleteBatchFormOpen(false);
            setSelectedLeadIds(new Set());
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
      )}
      {/* Data Table */}
      <DataTableV2<Lead>
        data={leads}
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
        addButtonLabel="Add Lead"
        onAddClick={() => setIsAddLeadOpen(true)}
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
