// Order types for expedition APIs

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  pieces: string;
  weight: string;
  remark: string;
  item_value: string;
  use_insurance: boolean;
  insurance: string;
  cod: string;
  items: OrderItem[];
}

export interface OrderRequest {
  shipper_id?: number;
  receiver_id?: number;
  sender?: {
    name: string;
    phone: string;
    address: string;
    province: string;
    regency: string;
    district: string;
  };
  receiver?: {
    name: string;
    phone: string;
    address: string;
    province: string;
    regency: string;
    district: string;
  };
  service_code: string;
  detail: OrderDetail;
  expresstype: string;
  servicetype: string; // "1" = Pickup, "6" = Drop Off
}

export interface VendorResponse {
  status: string;
  data?: {
    awb_no: string;
    label_url: string;
    service_code: string;
    cod_value: string;
    item_value: string;
    reguler_value: number;
    etd: string;
    des_code: string;
    status: string;
  };
  awb_no?: string;
  label_url?: string;
  raw_response?: {
    success: boolean;
    desc: string;
    detail: Array<{
      orderid: string;
      status: string;
      awb_no: string;
      desCode: string;
      etd: string;
    }>;
  };
}

export interface OrderResponse {
  status: string;
  message?: string;
  data?: {
    awb_no: string;
    label_url: string;
    service_code: string;
    cod_value: number;
    item_value: number;
    reguler_value: number;
    etd: string;
    des_code: string;
    status: string;
  };
  order?: {
    id: number;
    reference_no: string;
    awb_no: string;
    vendor: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  vendor_response?: VendorResponse;
}

export type ExpeditionVendor = "jntexpress" | "lion" | "sap";

export interface OrderSubmissionData {
  vendor: ExpeditionVendor;
  shippingOption: {
    id: string;
    name: string;
    price: string;
  };
  formData: {
    receiverId?: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    province: string;
    regency: string;
    district: string;
    itemContent: string;
    itemType: string;
    itemValue: string;
    itemQuantity: string;
    weight: string;
    length: string;
    width: string;
    height: string;
    notes: string;
    deliveryType: string;
    paymentMethod: string;
    servicetype: number;
  };
  businessData: {
    id: number;
    businessName: string;
    senderName: string;
    contact: string;
    province: string | null;
    regency: string | null;
    district: string | null;
    address: string;
  };
  isInsured: boolean;
  customCODValue?: string;
}
 