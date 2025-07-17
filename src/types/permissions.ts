export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionsResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface PaginatedPermissionsResponse {
  success: boolean;
  message: string;
  data: {
    data: Permission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface PermissionApiParams {
  page?: number;
  per_page?: number;
  search?: string;
} 