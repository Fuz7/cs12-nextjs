import { Customer } from "./database";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  is_linked: boolean;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  customer: Customer | null;
};

export interface PaginatedUserResponse {
  current_page: number;
  data: User[];
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
];
