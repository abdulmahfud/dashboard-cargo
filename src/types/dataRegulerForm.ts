export interface Shipper {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  contact: string | null;
  email: string | null;
  address: string;
  province: string | null;
  regency: string | null;
  district: string | null;
  postal_code: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ShipperListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Shipper[];
    // ... tambahkan field lain jika perlu
  };
}

export interface Receiver {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  contact: string | null;
  email: string | null;
  address: string;
  province: string | null;
  regency: string | null;
  district: string | null;
  postal_code: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ReceiverListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Receiver[];
    // ... tambahkan field lain jika perlu
  };
}

export const itemTypes = [
  "Elektronik",
  "Fashion",
  "Buku",
  "Makanan",
  "Kosmetik",
  "Aksesoris",
  "Lainnya",
];

export interface Province {
  id: number;
  name: string;
}

export interface Regency {
  id: number;
  name: string;
  province_id: number;
}

export interface District {
  id: number;
  name: string;
  regency_id: number;
}

export interface ProvinceListResponse {
  success: boolean;
  message: string;
  data: Province[];
}

export interface RegencyListResponse {
  success: boolean;
  message: string;
  data: Regency[];
}

export interface DistrictListResponse {
  success: boolean;
  message: string;
  data: District[];
}
