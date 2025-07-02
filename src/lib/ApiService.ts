import apiClient from "./apiClient";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import type { UserData, RegisterData, ApiResponse } from "@/types/api";

export class ApiService {
  // Generic request helper (recommended)
  static async request<T>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.request<T>(config);
  }

  // Authentication
  static async login(email: string, password: string): Promise<AxiosResponse> {
    return apiClient.post("/login", { email, password });
  }

  static async register(data: RegisterData): Promise<AxiosResponse> {
    return apiClient.post("/auth/register", data);
  }

  static async logout(): Promise<AxiosResponse> {
    return apiClient.post("/logout");
  }

  // User
  static async getCurrentUser(): Promise<AxiosResponse<ApiResponse<UserData>>> {
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
  ): Promise<AxiosResponse<ApiResponse<UserData>>> {
    return apiClient.get(`/admin/users/${id}`);
  }
}
