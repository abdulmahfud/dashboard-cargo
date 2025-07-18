export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  email_verified_at: string | null;
  created_at?: string;
  updated_at?: string;
  roles: string[];
  permissions: string[];
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

export interface LoginResponse {
  success: boolean;
  user: UserData;
  permissions: string[];
  token: string;
  avatar: string;
}
