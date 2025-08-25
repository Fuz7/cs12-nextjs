import { SortableTableColumn } from "@/hooks/useCustomers";
import axios from "@/lib/axios";
import { CustomerAdd, PaginatedCustomerResponse } from "@/types/customers";
import { Customer } from "@/types/database";
import { jsonResponse, JsonResponse } from "@/utils/response";

export async function getCustomersByPagination(
  activePage: number,
  perPage: number,
  sortConfig: SortableTableColumn[] | [],
  searchTerm: string
): Promise<JsonResponse<PaginatedCustomerResponse | null>> {
  const sortBy = sortConfig.length > 0 ? sortConfig[0].key : "created_at";
  const orderBy = sortConfig.length > 0 ? sortConfig[0].sortBy : "desc";

  const res = await axios.get(`/api/customers`, {
    params: {
      page: activePage,
      perPage,
      sortBy,
      sortOrder: orderBy,
      searchTerm,
    },
  });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to collect customers",
    }); // ❌ throwing
  }

  return jsonResponse<PaginatedCustomerResponse>({
    data: res.data as PaginatedCustomerResponse,
    status: "success",
  });
}

export async function createCustomer(
  formData: CustomerAdd
): Promise<JsonResponse<null>> {
  const res = await axios.post("/api/customers", formData);
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to create customer",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}

export async function updateCustomer(
  id: number,
  customer: Partial<Customer>
): Promise<JsonResponse<null>> {
  const res = await axios.patch(`/api/customers/${id}`, { ...customer });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to update customer",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}

export async function deleteCustomers(
  ids: Set<string>
): Promise<JsonResponse<null>> {
  const res = await axios.delete(`/api/customers`, {
    data: { ids: [...ids] },
  });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to update customer",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}
export async function getCustomerById(
  id: number,
  cookieHeader: string
): Promise<JsonResponse<Customer | null>> {
  const res = await axios.get(`/api/customers/${id}`, {
    headers: { Cookie: cookieHeader, Referer: process.env.FRONTEND_URL },
  });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to update customer",
    });
  }
  return jsonResponse({
    data: res.data,
    status: "success",
  });
}

export async function searchCustomer(
  id: number
): Promise<JsonResponse<Customer | object>> {
  const res = await axios.get(`/api/customers/${id}/search`, {});
  if (res.status !== 200) {
    return jsonResponse({
      data: {},
      status: "error",
      message: "Failed to update customer",
    });
  }
  return jsonResponse({
    data: res.data,
    status: "success",
  });
}
