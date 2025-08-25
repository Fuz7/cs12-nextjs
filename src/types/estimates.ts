import { Customer } from "./database";
import { TaskFillable } from "./tasks";

export type Estimate = {
  id: number;
  customer: Pick<Customer, "id" | "first_name" | "last_name" | "email">;
  job_name: string;
  status: EstimateStatus;
  notes?: string;
  tasks: TaskFillable[];
};

export type EstimateStatus = "draft" | "sent" | "approved" | "rejected";

export interface PaginatedEstimateResponse {
  current_page: number;
  data: Estimate[];
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

export const ESTIMATE_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-blue-100 text-blue-800" },
  {
    value: "sent",
    label: "Sent",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "approved",
    label: "Approved",
    color: "bg-green-100 text-green-800",
  },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
] as const;

export type EstimateAdd = Omit<Estimate, "id" | "customer">;
