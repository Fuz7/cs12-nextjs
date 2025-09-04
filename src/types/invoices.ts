import { Customer } from "./database";
import { TaskFillable } from "./tasks";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";
export type Invoice = {
  id: number;
  customer: Pick<
    Customer,
    "id" | "first_name" | "last_name" | "email" | "property_address"
  >;
  job_name: string;
  status: InvoiceStatus;
  notes?: string;
  paid_amount: string;
  tasks: TaskFillable[];
  tasks_total_price?: string;
  site_address?: string;
  due_date: string;
  updated_at: Date;
  created_at: Date;
};

export interface PaginatedInvoiceResponse {
  current_page: number;
  data: Invoice[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export type InvoiceAdd = Omit<
  Invoice,
  "id" | "customer" | "created_at" | "updated_at"
>;
export const INVOICE_STATUSES = [
  {
    value: "draft",
    label: "Draft",
    color: "bg-blue-100 text-blue-800",
    hover: "hover:bg-blue-100/90 hover:text-blue-800/90",
    entry: [""],
  },
  {
    value: "sent",
    label: "Sent",
    color: "bg-yellow-100 text-yellow-800",
    hover: "hover:bg-yellow-100/90 hover:text-yellow-800/90",
    entry: ["draft"],
  },
  {
    value: "partially_paid",
    label: "Partial",
    color: "bg-purple-100 text-purple-800",
    hover: "hover:bg-purple-100/90 hover:text-purple-800/90",
    entry: [""],
  },
  {
    value: "paid",
    label: "Paid",
    color: "bg-green-100 text-green-800",
    hover: "hover:bg-green-100/90 hover:text-green-800/90",
    entry: ["sent", "partially_paid","overdue"],
  },
  {
    value: "overdue",
    label: "Overdue",
    color: "bg-red-100 text-red-800",
    hover: "hover:bg-red-100/90 hover:text-red-800/90",
    entry: [""],
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-neutral-100 text-neutral-800",
    hover: "hover:bg-neutral-100/90 hover:text-neutral-800/90",
    entry: ["sent", "partially_paid"],
  },
];
