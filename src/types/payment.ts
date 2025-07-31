export interface PaymentCreateRequest {
  shipping_data: {
    vendor: string;
    detail: Record<string, unknown>[];
    [key: string]: unknown;
  };
  amount: number;
}

export interface PaymentCreateResponse {
  success: boolean;
  message: string;
  data?: {
    payment_id: number;
    reference_no: string;
    invoice_id: string;
    invoice_url: string;
    amount: number;
    expired_at: string;
    status: string;
  };
  errors?: Record<string, unknown>;
}

export interface PaymentStatus {
  reference_no: string;
  invoice_id: string;
  amount: number;
  status: "pending" | "paid" | "expired" | "failed";
  payment_method?: string;
  payment_channel?: string;
  invoice_url?: string;
  paid_at?: string;
  expired_at?: string;
  created_at: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  message?: string;
  data?: PaymentStatus;
}

export interface PaymentHistoryResponse {
  success: boolean;
  message?: string;
  data?: PaymentStatus[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PaymentCancelResponse {
  success: boolean;
  message: string;
}

export interface PaymentFlow {
  step: "shipping" | "payment" | "processing" | "completed" | "failed";
  payment?: PaymentStatus;
  shippingData?: Record<string, unknown>;
}
