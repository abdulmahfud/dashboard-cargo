// Base shipper interface
export interface Shipper {
  id: number;
  user_id: number;
  name: string;
  phone: string | null;
  contact: string | null;
  email: string | null;
  address: string | null;
  province: string | null;
  regency: string | null;
  district: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

// API Response interfaces
export interface ShipperResponse {
  success: boolean;
  message: string;
  data: Shipper | null;
}

export interface ShipperListResponse {
  success: boolean;
  message: string;
  data: {
    data: Shipper[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

// Form interfaces
export interface ShipperCreateRequest {
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
  latitude?: number;
  longitude?: number;
}

export interface ShipperUpdateRequest {
  name: string;
  phone?: string;
  contact?: string;
  email?: string;
  address?: string;
  province?: string;
  regency?: string;
  district?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}

// Location interfaces (reusing from existing types)
export interface Province {
  id: number;
  name: string;
}

export interface Regency {
  id: number;
  province_id: number;
  name: string;
}

export interface District {
  id: number;
  regency_id: number;
  name: string;
}

// Form validation interface
export interface ShipperFormData {
  name: string;
  phone: string;
  contact: string;
  email: string;
  address: string;
  province_id: string;
  regency_id: string;
  district_id: string;
  postal_code: string;
}

export interface ShipperFormErrors {
  name?: string;
  phone?: string;
  contact?: string;
  email?: string;
  address?: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  postal_code?: string;
}
