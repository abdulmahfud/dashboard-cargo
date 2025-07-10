// Types for Receiver Data Management

export interface Receiver {
  id: number;
  user_id: number;
  name: string;
  phone?: string;
  contact?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  postal_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReceiverFormData {
  name: string;
  phone: string;
  contact: string;
  email: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  postal_code: string;
}

export interface ReceiverListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Receiver[];
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

export interface ReceiverResponse {
  success: boolean;
  message: string;
  data: Receiver;
}

export interface ReceiverCreateRequest {
  user_id: number;
  name: string;
  phone?: string;
  contact?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  postal_code?: string;
}

export interface ReceiverUpdateRequest {
  user_id: number;
  name: string;
  phone?: string;
  contact?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  postal_code?: string;
}
