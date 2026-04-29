import { SortableInvoiceColumn } from "@/hooks/useInvoice";
import axios from "@/lib/axios";
import axiosServerSide from "@/lib/axios.server";
import {
  Invoice,
  InvoiceAdd,
  InvoiceChartItem,
  PaginatedInvoiceResponse,
} from "@/types/invoices";
import { jsonResponse, JsonResponse } from "@/utils/response";

export async function getInvoicesByPagination(
  activePage: number,
  perPage: number,
  sortConfig: SortableInvoiceColumn[] | [],
  searchTerm: string,
): Promise<JsonResponse<PaginatedInvoiceResponse | null>> {
  const sortBy = sortConfig.length > 0 ? sortConfig[0].key : "created_at";
  const orderBy = sortConfig.length > 0 ? sortConfig[0].sortBy : "desc";

  const res = await axios.get(`/api/invoices`, {
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
      message: "Failed to collect invoice",
    }); // ❌ throwing
  }

  return jsonResponse<PaginatedInvoiceResponse>({
    data: res.data as PaginatedInvoiceResponse,
    status: "success",
  });
}

export async function getInvoicesById(
  id: number,
  cookieHeader: string,
): Promise<JsonResponse<Invoice[] | null>> {
  const res = await axiosServerSide.get(`/api/invoices/${id}`, {
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
export async function createInvoice(formData: InvoiceAdd, customerId: number) {
  const res = await axios.post(`/api/invoices/${customerId}`, formData);
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

export async function editInvoice(
  formData: InvoiceAdd,
  invoiceId: number,
  deletedIds: number[] | [],
) {
  const res = await axios.patch(`/api/invoices/${invoiceId}`, {
    ...formData,
    deletedIds,
  });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to edit invoice",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}
export async function deleteInvoice(id: number): Promise<JsonResponse<null>> {
  const res = await axios.delete(`/api/invoices/${id}`);
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to delete estimate",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}

export async function deleteInvoices(
  ids: Set<string>,
): Promise<JsonResponse<null>> {
  const res = await axios.delete(`/api/invoices`, {
    data: { ids: [...ids] },
  });
  if (res.status !== 200) {
    return jsonResponse({
      data: null,
      status: "error",
      message: "Failed to delete invoices",
    });
  }
  return jsonResponse({
    data: null,
    status: "success",
  });
}

type LastMontRevenue = {
  last_month: string;
  percentage_difference: number;
};

export async function getLastMonthRevenue(
  cookieHeader: string,
): Promise<JsonResponse<LastMontRevenue | null>> {
  const res = await axiosServerSide.get(
    `/api/invoices/analytics/getLastMonthRevenue`,
    {
      headers: { Cookie: cookieHeader, Referer: process.env.FRONTEND_URL },
    },
  );
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

export async function getChartInvoiceRevenue(
  cookieHeader: string,
): Promise<JsonResponse<InvoiceChartItem[] | null>> {
  const res = await axiosServerSide.get(
    `/api/invoices/analytics/getChartInvoiceRevenue`,
    {
      headers: { Cookie: cookieHeader, Referer: process.env.FRONTEND_URL },
    },
  );
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
