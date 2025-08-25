import { SortableEstimateColumn } from "@/hooks/useEstimates";
import axios from "@/lib/axios";
import { EstimateAdd, PaginatedEstimateResponse } from "@/types/estimates";
import { JsonResponse, jsonResponse } from "@/utils/response";

export async function getEstimatesByPagination(
  activePage: number,
  perPage: number,
  sortConfig: SortableEstimateColumn[] | [],
  searchTerm: string
): Promise<JsonResponse<PaginatedEstimateResponse | null>> {
  const sortBy = sortConfig.length > 0 ? sortConfig[0].key : "created_at";
  const orderBy = sortConfig.length > 0 ? sortConfig[0].sortBy : "desc";

  const res = await axios.get(`/api/estimates`, {
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
      message: "Failed to collect leads",
    }); // ❌ throwing
  }

  return jsonResponse<PaginatedEstimateResponse>({
    data: res.data as PaginatedEstimateResponse,
    status: "success",
  });
}

export async function createEstimate(
  formData: EstimateAdd,
  customerId: number
) {
  const res = await axios.post("/api/estimates", { formData, customerId });
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
