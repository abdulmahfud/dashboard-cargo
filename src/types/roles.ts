export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Role[];
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

export interface RoleDetailResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RoleCreateRequest {
  name: string;
  guard_name?: string;
  permissions?: number[];
}

export interface RoleUpdateRequest {
  name: string;
  guard_name?: string;
  permissions?: number[];
}

export interface RoleCreateResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RoleUpdateResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface RoleDeleteResponse {
  success: boolean;
  message: string;
}

// Helper interface for permission grouping
export interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

export interface PermissionListResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface SimpleRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface SimpleRoleListResponse {
  success: boolean;
  message: string;
  data: SimpleRole[];
}
