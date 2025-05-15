import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";
import { getCookie, deleteCookie } from "cookies-next";

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = getCookie("token");

    // If token exists, add to headers
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token
      deleteCookie("token");

      // Redirect to login page if not already there
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

// Type definitions
export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Array<{
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
      model_type: string;
      model_id: number;
      role_id: number;
    };
  }>;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: UserData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

// API service class
export class ApiService {
  // Authentication endpoints
  static async login(email: string, password: string): Promise<AxiosResponse> {
    return apiClient.post("/login", { email, password });
  }

  static async register(data: RegisterData): Promise<AxiosResponse> {
    return apiClient.post("/auth/register", data);
  }

  static async logout(): Promise<AxiosResponse> {
    return apiClient.post("/logout");
  }

  // User endpoints
  static async getCurrentUser(): Promise<AxiosResponse> {
    return apiClient.get("/user");
  }

  static async updateUser(
    userId: number,
    userData: Partial<UserData>
  ): Promise<AxiosResponse> {
    return apiClient.put(`/users/${userId}`, userData);
  }

  static async getUser(
    id: number
  ): Promise<
    AxiosResponse<{ success: boolean; message: string; data: UserData }>
  > {
    return apiClient.get(`/admin/users/${id}`);
  }
}

export default apiClient;
