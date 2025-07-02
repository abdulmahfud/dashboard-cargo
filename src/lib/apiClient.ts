// src/lib/api/apiClient.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import axiosRetry from "axios-retry"; // 👈 import axios-retry
import { getCookie, deleteCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.bhisakirim.com/api";
const API_TIMEOUT = 30000;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Tambahkan middleware retry
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

// Request interceptor
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      deleteCookie("token");
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = `/login?callbackUrl=${window.location.pathname}`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
