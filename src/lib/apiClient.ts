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

export default apiClient;
