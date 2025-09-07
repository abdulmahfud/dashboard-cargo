// Expedition service types based on API schemas

export interface ExpeditionAddress {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    city: string;
    district: string;
    postal_code: string;
    latitude: number;
    longitude: number;
}

export interface BaseShipmentRequest {
    sender: ExpeditionAddress;
    receiver: ExpeditionAddress;
    package_weight: number;
    package_length: number;
    package_width: number;
    package_height: number;
    item_value: number;
    shipment_method: string;
}

// GoSend specific types
export interface GoSendCostRequest extends BaseShipmentRequest {
    origin: string; // "latitude,longitude"
    destination: string; // "latitude,longitude"
}

export interface GoSendOrderRequest extends GoSendCostRequest {
    item_description: string;
    quantity: number;
    reference_no: string;
    amount: number;
}

export interface GoSendCostResponse {
    status: string;
    message: string;
    data: {
        Instant?: {
            shipment_method: string;
            estimated_cost?: number;
            estimated_delivery?: string;
        };
        SameDay?: {
            shipment_method: string;
            estimated_cost?: number;
            estimated_delivery?: string;
        };
    };
    costs: Array<{
        service_type: string;
        serviceable: boolean;
        estimated_cost?: number;
        estimated_delivery?: string;
    }>;
}

// JNT Cargo specific types
export interface JntCargoCostRequest extends BaseShipmentRequest {
    weight: number;
    sender_city: string;
    receiver_city: string;
    sender_province: string;
    receiver_province: string;
    origin_city: string;
    destination_city: string;
}

export interface JntCargoOrderRequest extends JntCargoCostRequest {
    item_description: string;
    quantity: number;
    reference_no: string;
    amount: number;
}

export interface JntCargoCostResponse {
    status: string;
    message: string;
    data: {
        service_type: string;
        service_name: string;
        estimated_cost: number;
        estimated_delivery: string;
        serviceable: boolean;
    };
    costs: Array<{
        service_type: string;
        serviceable: boolean;
        estimated_cost?: number;
        estimated_delivery?: string;
    }>;
}

// ID Express specific types
export interface IdExpressCostRequest extends BaseShipmentRequest {
    weight: number;
    sender_city: string;
    receiver_city: string;
    sender_province: string;
    receiver_province: string;
    senderCityId: number;
    recipientDistrictId: number;
    origin: string; // address string
    destination: string; // address string
}

export interface IdExpressOrderRequest extends IdExpressCostRequest {
    item_description: string;
    quantity: number;
    reference_no: string;
    amount: number;
}

export interface IdExpressCostResponse {
    success?: boolean; // For error responses
    status?: string;
    message: string;
    data?: {
        service_type: string;
        service_name: string;
        estimated_cost: number;
        estimated_delivery: string;
        serviceable: boolean;
    } | null;
    costs?: Array<{
        service_type: string;
        serviceable: boolean;
        estimated_cost?: number;
        estimated_delivery?: string;
    }>;
}

// POS Indonesia specific types
export interface PosIndonesiaCostRequest extends BaseShipmentRequest {
    service_code: string; // REGULER, EXPRESS, etc.
    pieces?: number;
    detail?: {
        weight: number;
        item_value: number;
        cod?: number;
        insurance?: number;
        use_insurance?: boolean;
        remark?: string;
        items?: Array<{
            name: string;
            value: number;
        }>;
    };
}

export interface PosIndonesiaOrderRequest extends PosIndonesiaCostRequest {
    reference_no: string;
    amount: number;
    item_description?: string;
}

export interface PosIndonesiaCostResponse {
    status: string;
    message: string;
    data: {
        service_code: string;
        service_name: string;
        estimated_cost: number;
        estimated_delivery: string;
        serviceable: boolean;
        fee_details?: Array<{
            service_type: string;
            base_fee: number;
            insurance_fee?: number;
            cod_fee?: number;
            total_fee: number;
        }>;
    };
    costs: Array<{
        service_type: string;
        serviceable: boolean;
        estimated_cost?: number;
        estimated_delivery?: string;
    }>;
}

// Common order response type
export interface ExpeditionOrderResponse {
    success: boolean;
    data: {
        id: number;
        user_id: number;
        vendor: string;
        reference_no: string;
        awb_no: string | null;
        shipment_sender_id: number | null;
        shipment_receiver_id: number | null;
        shipment_type: string;
        service_code: string;
        service_type_code: string;
        cod_value: number;
        reguler_value: number;
        item_value: number;
        status: string;
        label_url: string | null;
        created_at: string;
        updated_at: string;
        user: {
            id: number;
            email: string;
        };
        histories: Array<Record<string, unknown>>;
    };
}

// Common tracking response type
export interface ExpeditionTrackingResponse {
    success: boolean;
    data: {
        status: string;
        description: string;
        history: Array<{
            timestamp?: string;
            status?: string;
            description?: string;
            location?: string;
        }>;
    };
}

// Expedition service configuration
export interface ExpeditionServiceConfig {
    name: string;
    displayName: string;
    enabled: boolean;
    services: string[];
    requiredFields: string[];
    coordinateFormat?: string;
}

// Vendor types enum
export enum ExpeditionVendor {
    GOSEND = 'gosend',
    JNT_CARGO = 'jntcargo',
    ID_EXPRESS = 'idexpress',
    JNT_EXPRESS = 'jntexpress',
    PAXEL = 'paxel',
    LION = 'lion',
    POS_INDONESIA = 'posindonesia'
}

// Service types for each vendor
export const VENDOR_SERVICES = {
    [ExpeditionVendor.GOSEND]: ['Instant', 'Same Day'],
    [ExpeditionVendor.JNT_CARGO]: ['FT', 'LTL', 'Regular'],
    [ExpeditionVendor.ID_EXPRESS]: ['Regular', 'Express'],
    [ExpeditionVendor.JNT_EXPRESS]: ['EZ', 'REG'],
    [ExpeditionVendor.PAXEL]: ['PICKUP', 'DROPOFF'],
    [ExpeditionVendor.LION]: ['REGULER', 'COD'],
    [ExpeditionVendor.POS_INDONESIA]: ['REGULER', 'EXPRESS']
} as const;

// Error response type
export interface ExpeditionErrorResponse {
    success: false;
    message: string;
    data?: null;
    errors?: Record<string, string[]>;
}
