import { SortableUserColumn } from "@/hooks/useUsers";
import axios from "@/lib/axios";
import { PaginatedUserResponse } from "@/types/users";
import { jsonResponse, JsonResponse } from "@/utils/response";

export async function getUsersByPagination(
  activePage: number,
  perPage: number,
  sortConfig: SortableUserColumn[] | [],
  searchTerm: string,
): Promise<JsonResponse<PaginatedUserResponse | null>> {
  const sortBy = sortConfig.length > 0 ? sortConfig[0].key : "created_at";
  const orderBy = sortConfig.length > 0 ? sortConfig[0].sortBy : "desc";

  const res = await axios.get(`/api/users`, {
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
      message: "Failed to collect user",
    }); // ❌ throwing
  }

  return jsonResponse<PaginatedUserResponse>({
    data: res.data as PaginatedUserResponse,
    status: "success",
  });
}
export async function linkUserToCustomer(
  customerId: number | string,
  userId: number | string,
): Promise<JsonResponse<null>> {
  const res = await axios.patch(`/api/users/${customerId}/link/${userId}`, {
    id: customerId,
  });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to delete lead",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}

export async function unlinkUserFromCustomer(
  userId: number | string,
): Promise<JsonResponse<null>> {
  const res = await axios.patch(`/api/users/${userId}/unlink`);

  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to unlink user",
    });
  }

  return jsonResponse({
    data: null,
    status: "success",
  });
}

export async function deleteUser(id: number): Promise<JsonResponse<null>> {
  const res = await axios.delete(`/api/users/${id}`);
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to delete user",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}
export async function deleteUsers(
  ids: Set<string>
): Promise<JsonResponse<null>> {
  const res = await axios.delete(`/api/users`, {
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