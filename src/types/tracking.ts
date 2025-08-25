// Standardized tracking response types
export interface StandardizedTrackingResponse {
  success: boolean;
  vendor: string;
  tracking_data: StandardizedTrackingData;
  order_info: OrderInfo;
}

export interface OrderInfo {
  reference_no: string;
  vendor: string;
  awb_no: string | null;
  status: string;
  created_at: string;
  user_id: number;
}

export interface StandardizedTrackingData {
  awb_no: string | null;
  invoice_number: string | null;
  package_info: PackageInfo;
  cost_details: CostDetails;
  addresses: Addresses;
  tracking_history: TrackingHistoryItem[];
  estimated_times?: EstimatedTimes;
  latest_status?: string | null;
  delivery_datetime?: string | null;
  photo_url?: string | null;
  signature_url?: string | null;
  cancellation_reason?: string | null;
  driver_info?: DriverInfo;
}

export interface PackageInfo {
  item_name: string | null;
  weight: number | null;
  quantity: number | null;
  service_code?: string | null;
  category?: string | null;
  pickup_datetime?: string | null;
  note?: string | null;
}

export interface CostDetails {
  shipping_cost: number;
  cod_value?: number;
  insurance_cost?: number;
  total_amount?: number;
  invoice_value?: number;
  payment_type?: string | null;
}

export interface Addresses {
  sender: AddressInfo;
  receiver: AddressInfo;
}

export interface AddressInfo {
  name: string | null;
  address: string | null;
  city: string | null;
  province?: string | null;
  district?: string | null;
  zip_code: string | null;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
}

export interface TrackingHistoryItem {
  datetime: string | null;
  city: string | null;
  status: string | null;
  status_code?: number | null;
  store_name?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  note?: string | null;
  next_site?: string | null;
  name?: string | null;
  address?: string | null;
  province?: string | null;
  district?: string | null;
}

export interface EstimatedTimes {
  pickup_date: string | null;
  pickup_time_range: {
    min: string | null;
    max: string | null;
  };
  arrival_date: string | null;
  arrival_time_range: {
    min: string | null;
    max: string | null;
  };
}

export interface DriverInfo {
  pickup_driver: DriverDetails;
  delivery_driver: DriverDetails;
}

export interface DriverDetails {
  name: string | null;
  phone: string | null;
  photo: string | null;
}
