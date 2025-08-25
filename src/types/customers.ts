import { Customer } from "./database";

export interface PaginatedCustomerResponse {
  current_page: number;
  data: Customer[];
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
export type CustomerAdd = Omit<Customer, "id" | "created_at" | "updated_at">;

