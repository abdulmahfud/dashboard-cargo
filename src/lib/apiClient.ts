import axios, { AxiosInstance, AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { getCookie, deleteCookie } from "cookies-next";
import type {
  ShipperListResponse,
  ReceiverListResponse,
  ProvinceListResponse,
  RegencyListResponse,
  DistrictListResponse,
} from "@/types/dataRegulerForm";
import type {
  ReceiverListResponse as ReceiverDataListResponse,
  ReceiverResponse,
  ReceiverCreateRequest,
  ReceiverUpdateRequest,
} from "@/types/dataPenerima";
import type {
  ShipperListResponse as ShipperDataListResponse,
  ShipperResponse,
  ShipperCreateRequest,
  ShipperUpdateRequest,
} from "@/types/dataPengirim";
import type { OrderListResponse } from "@/types/laporanPengiriman";
import type {
  OrderRequest,
  OrderResponse,
  ExpeditionVendor,
} from "@/types/order";
import type { AddressSearchResponse } from "@/types/addressSearch";
import type {
  UserListResponse,
  UserDetailResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserUpdateRequest,
  UserUpdateResponse,
  UserDeleteResponse,
  RolesListResponse,
} from "@/types/users";
import type {
  RoleListResponse,
  RoleDetailResponse,
  RoleCreateRequest,
  RoleCreateResponse,
  RoleUpdateRequest,
  RoleUpdateResponse,
  RoleDeleteResponse,
  PermissionListResponse,
  SimpleRoleListResponse,
} from "@/types/roles";

// Ambil URL dari .env
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.bhisakirim.com/api";

const API_TIMEOUT = 30000;

// Buat instance axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const isDev = process.env.NODE_ENV === "development";

// Tambahkan fungsi logout terpusat
export function logout() {
  // Hapus cookie token (pastikan domain cocok!)
  deleteCookie("token", {
    path: "/",
    ...(isDev ? {} : { domain: ".bhisakirim.com" }),
  });

  // Arahkan ke login
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
  }
}

// ✅ Retry otomatis jika error jaringan atau 5xx
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError): boolean => {
    const status = error.response?.status;
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      status === 429 ||
      (typeof status === "number" && status >= 500)
    );
  },
});

// ✅ Inject Authorization header dari cookie
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Tangani error 401 + hindari infinite redirect
let isRedirecting = false;

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login") &&
      !isRedirecting
    ) {
      isRedirecting = true;
      logout();
    }

    return Promise.reject(error);
  }
);

// ✅ Get shippers
export const getShippers = async (): Promise<ShipperListResponse> => {
  const res = await apiClient.get("/admin/shipper");
  return res.data;
};

// ✅ Get receivers
export const getReceivers = async (): Promise<ReceiverListResponse> => {
  const res = await apiClient.get("/admin/receiver");
  return res.data;
};

// ✅ Get provinces
export const getProvinces = async (): Promise<ProvinceListResponse> => {
  const res = await apiClient.get("/public/provinces");
  return res.data;
};

// ✅ Get regencies by province
export const getRegencies = async (
  provinceId: number
): Promise<RegencyListResponse> => {
  const res = await apiClient.get(`/public/provinces/${provinceId}/regencies`);
  return res.data;
};

// ✅ Get districts by regency
export const getDistricts = async (
  regencyId: number
): Promise<DistrictListResponse> => {
  const res = await apiClient.get(`/public/regencies/${regencyId}/districts`);
  return res.data;
};

// ✅ Get JNT Express shipment cost
export const getJntExpressShipmentCost = async ({
  weight,
  sendSiteCode,
  destAreaCode,
}: {
  weight: string | number;
  sendSiteCode: string;
  destAreaCode: string;
}) => {
  // Konversi berat dari gram ke kilogram untuk JNT API
  const weightInKg = Number(weight) / 1000;

  const requestPayload = {
    weight: weightInKg.toString(),
    sendSiteCode,
    destAreaCode,
  };

  const res = await apiClient.post(
    "/admin/expedition/jntexpress/shipment_cost",
    requestPayload
  );

  return res.data;
};

// ✅ Receiver CRUD operations
export const getReceiversData = async (
  search?: string,
  page?: number
): Promise<ReceiverDataListResponse> => {
  const params: { search?: string; page?: number } = {};
  if (search) params.search = search;
  if (page) params.page = page;

  const res = await apiClient.get("/admin/receiver", { params });
  return res.data;
};

export const createReceiver = async (
  data: ReceiverCreateRequest
): Promise<ReceiverResponse> => {
  const res = await apiClient.post("/admin/receiver", data);
  return res.data;
};

export const updateReceiver = async (
  id: number,
  data: ReceiverUpdateRequest
): Promise<ReceiverResponse> => {
  const res = await apiClient.put(`/admin/receiver/${id}`, data);
  return res.data;
};

export const deleteReceiver = async (id: number): Promise<ReceiverResponse> => {
  const res = await apiClient.delete(`/admin/receiver/${id}`);
  return res.data;
};

export const getReceiverById = async (
  id: number
): Promise<ReceiverResponse> => {
  const res = await apiClient.get(`/admin/receiver/${id}`);
  return res.data;
};

// ✅ Shipper CRUD operations
export const getShippersData = async (
  search?: string,
  page?: number
): Promise<ShipperDataListResponse> => {
  const params: { search?: string; page?: number } = {};
  if (search) params.search = search;
  if (page) params.page = page;

  const res = await apiClient.get("/admin/shipper", { params });
  return res.data;
};

export const createShipper = async (
  data: ShipperCreateRequest
): Promise<ShipperResponse> => {
  const res = await apiClient.post("/admin/shipper", data);
  return res.data;
};

export const updateShipper = async (
  id: number,
  data: ShipperUpdateRequest
): Promise<ShipperResponse> => {
  const res = await apiClient.put(`/admin/shipper/${id}`, data);
  return res.data;
};

export const deleteShipper = async (id: number): Promise<ShipperResponse> => {
  const res = await apiClient.delete(`/admin/shipper/${id}`);
  return res.data;
};

export const getShipperById = async (id: number): Promise<ShipperResponse> => {
  const res = await apiClient.get(`/admin/shipper/${id}`);
  return res.data;
};

// ✅ Orders/Laporan Pengiriman operations
export const getOrders = async (): Promise<OrderListResponse> => {
  const res = await apiClient.get("/admin/list-orders");
  return res.data;
};

// ✅ Order submission to expedition vendors
export const submitOrderToExpedition = async (
  vendor: ExpeditionVendor,
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const res = await apiClient.post(
    `/admin/expedition/${vendor}/order`,
    orderData
  );
  return res.data;
};

// ✅ JNT Express order submission (specific method)
export const submitJntExpressOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const res = await apiClient.post(
    "/admin/expedition/jntexpress/order",
    orderData
  );
  return res.data;
};

// ✅ Lion order submission (for future use)
export const submitLionOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const res = await apiClient.post("/admin/expedition/lion/order", orderData);
  return res.data;
};

// ✅ SAP order submission (for future use)
export const submitSapOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  const res = await apiClient.post("/admin/expedition/sap/order", orderData);
  return res.data;
};

// ✅ Search address (provinces, regencies, districts, subdistricts, postal codes)
export const searchAddress = async (
  query: string
): Promise<AddressSearchResponse> => {
  const res = await apiClient.get(
    `/public/search-address?query=${encodeURIComponent(query)}`
  );
  return res.data;
};

// ✅ User registration
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  whatsapp: string;
}) => {
  const res = await apiClient.post("/register", data);
  return res.data;
};

// ✅ Resend email verification
export const resendEmailVerification = async () => {
  const res = await apiClient.post("/email/resend");
  return res.data;
};

// ✅ Cancel order functions for different vendors
export const cancelJntExpressOrder = async (data: {
  orderid: string;
  remark: string;
}) => {
  const res = await apiClient.post("/admin/expedition/jntexpress/cancel", data);
  return res.data;
};

export const cancelLionOrder = async (data: {
  orderid: string;
  remark: string;
}) => {
  const res = await apiClient.post("/admin/expedition/lion/cancel", data);
  return res.data;
};

export const cancelSapOrder = async (data: {
  orderid: string;
  remark: string;
}) => {
  const res = await apiClient.post("/admin/expedition/sap/cancel", data);
  return res.data;
};

// ✅ User management functions
export const getCurrentUser = async (): Promise<UserDetailResponse> => {
  try {
    const res = await apiClient.get("/admin/me");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

export const getUsers = async (
  search?: string,
  page?: number
): Promise<UserListResponse> => {
  const params:       { search?: string; page?: number } = {};
  if (search) params.search = search;
  if (page) params.page = page;

  const res = await apiClient.get("/admin/users", { params });
  return res.data;
};

export const getUserById = async (id: number): Promise<UserDetailResponse> => {
  const res = await apiClient.get(`/admin/users/${id}`);
  return res.data;
};

export const createUser = async (
  data: UserCreateRequest
): Promise<UserCreateResponse> => {
  const res = await apiClient.post("/admin/users", data);
  return res.data;
};

export const updateUser = async (
  id: number,
  data: UserUpdateRequest
): Promise<UserUpdateResponse> => {
  const res = await apiClient.put(`/admin/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<UserDeleteResponse> => {
  const res = await apiClient.delete(`/admin/users/${id}`);
  return res.data;
};

export const getRoles = async (): Promise<RolesListResponse> => {
  const res = await apiClient.get("/admin/roles");
  return res.data;
};

// ✅ Role management functions
export const getRolesWithPagination = async (
  search?: string,
  page?: number
): Promise<RoleListResponse> => {
  const params: { search?: string; page?: number } = {};
  if (search) params.search = search;
  if (page) params.page = page;

  const res = await apiClient.get("/admin/roles", { params });
  return res.data;
};

export const getRoleById = async (id: number): Promise<RoleDetailResponse> => {
  const res = await apiClient.get(`/admin/roles/${id}`);
  return res.data;
};

export const createRole = async (
  data: RoleCreateRequest
): Promise<RoleCreateResponse> => {
  const res = await apiClient.post("/admin/roles", data);
  return res.data;
};

export const updateRole = async (
  id: number,
  data: RoleUpdateRequest
): Promise<RoleUpdateResponse> => {
  const res = await apiClient.put(`/admin/roles/${id}`, data);
  return res.data;
};

export const deleteRole = async (id: number): Promise<RoleDeleteResponse> => {
  const res = await apiClient.delete(`/admin/roles/${id}`);
  return res.data;
};

export const getAllRoles = async (): Promise<SimpleRoleListResponse> => {
  const res = await apiClient.get("/admin/roles/all");
  return res.data;
};

export const getPermissions = async (): Promise<PermissionListResponse> => {
  const res = await apiClient.get("/admin/permissions");
  return res.data;
};

export const getAllPermissions = async (): Promise<PermissionListResponse> => {
  const res = await apiClient.get("/admin/permissions/all");
  return res.data;
};

export default apiClient;
