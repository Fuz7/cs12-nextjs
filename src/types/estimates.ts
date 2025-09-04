import { Customer } from "./database";
import { TaskFillable } from "./tasks";

export type Estimate = {
  id: number;
  customer: Pick<
    Customer,
    "id" | "first_name" | "last_name" | "email" | "property_address"
  >;
  job_name: string;
  status: EstimateStatus;
  notes?: string;
  tasks: TaskFillable[];
  tasks_total_price?: string;
  site_address?: string;
  updated_at: Date;
  created_at: Date;
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
  {
    value: "draft",
    label: "Draft",
    color: "bg-blue-100 text-blue-800",
    entry: [""],
  },
  {
    value: "sent",
    label: "Sent",
    color: "bg-yellow-100 text-yellow-800",
    hover: "hover:bg-yellow-100/90 hover:text-yellow-800/90",
    entry: ["draft", "rejected"],
  },
  {
    value: "approved",
    label: "Approved",
    color: "bg-green-100 text-green-800",
    hover: "hover:bg-green-100/90 hover:text-green-800/90",
    entry: [""],
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    hover: "hover:bg-red-100/90 hover:text-red-800/90",

    entry: ["sent"],
  },
];

export type EstimateAdd = Omit<
  Estimate,
  "id" | "customer" | "created_at" | "updated_at"
>;
