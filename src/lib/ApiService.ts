import apiClient, { logout as globalLogout } from "./apiClient";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import type {
  UserData,
  RegisterData,
  ApiResponse,
  LoginResponse,
} from "@/types/api";

export class ApiService {
  // ✅ Generic request helper
  static async request<T>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.request<T>(config);
  }

  // ✅ Login
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<LoginResponse>> {
    return apiClient.post("/login", { email, password });
  }

  // ✅ Register
  static async register(
    data: RegisterData
  ): Promise<AxiosResponse<ApiResponse<null>>> {
    return apiClient.post("/auth/register", data);
  }

  // ✅ Logout (terpusat)
  static async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.warn("Logout API failed:", error);
    } finally {
      globalLogout(); // hapus token & redirect login
    }
  }

  // ✅ Get current user
  static async getCurrentUser(): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return apiClient.get("/admin/me");
  }

  // ✅ Update user
  static async updateUser(
    userId: number,
    userData: Partial<UserData>
  ): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return apiClient.put(`/users/${userId}`, userData);
  }

  // ✅ Get user by ID
  static async getUser(
    id: number
  ): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return apiClient.get(`/admin/users/${id}`);
  }
}
