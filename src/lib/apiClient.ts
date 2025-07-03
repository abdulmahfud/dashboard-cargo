import axios, { AxiosInstance, AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { getCookie, deleteCookie } from "cookies-next";

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

export default apiClient;
