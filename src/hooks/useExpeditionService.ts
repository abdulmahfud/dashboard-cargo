import { useState, useCallback } from 'react';
import {
    getGoSendShipmentCost,
    createGoSendOrder,
    trackGoSendOrder,
    cancelGoSendOrder,
    getJntCargoShipmentCost,
    createJntCargoOrder,
    trackJntCargoOrder,
    getIdExpressShipmentCost,
    createIdExpressOrder,
    trackIdExpressOrder,
} from '@/lib/apiClient';
import type {
    ExpeditionAddress,
    GoSendCostResponse,
    JntCargoCostResponse,
    IdExpressCostResponse,
    ExpeditionOrderResponse,
    ExpeditionTrackingResponse,
} from '@/types/expedition';
import { ExpeditionVendor } from '@/types/expedition';

export interface UseExpeditionServiceReturn {
    loading: boolean;
    error: string | null;

    // Cost calculation
    calculateGoSendCost: (params: {
        sender: ExpeditionAddress;
        receiver: ExpeditionAddress;
        package_weight: number;
        package_length: number;
        package_width: number;
        package_height: number;
        item_value: number;
        shipment_method: 'Instant' | 'Same Day';
    }) => Promise<GoSendCostResponse | null>;

    calculateJntCargoCost: (params: {
        sender: ExpeditionAddress;
        receiver: ExpeditionAddress;
        package_weight: number;
        package_length: number;
        package_width: number;
        package_height: number;
        item_value: number;
        shipment_method: string;
        weight: number;
        sender_city: string;
        receiver_city: string;
        sender_province: string;
        receiver_province: string;
        origin_city: string;
        destination_city: string;
    }) => Promise<JntCargoCostResponse | null>;

    calculateIdExpressCost: (params: {
        senderCityId: number;
        recipientDistrictId: number;
        weight: number;
        expressType?: string;
    }) => Promise<IdExpressCostResponse | null>;

    // Order creation
    createOrder: (vendor: ExpeditionVendor, orderData: Record<string, unknown>) => Promise<ExpeditionOrderResponse | null>;

    // Order tracking
    trackOrder: (vendor: ExpeditionVendor, params: Record<string, unknown>) => Promise<ExpeditionTrackingResponse | null>;

    // Order cancellation
    cancelOrder: (vendor: ExpeditionVendor, params: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
}

export const useExpeditionService = (): UseExpeditionServiceReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleServiceCall = useCallback(async <T>(
        serviceCall: () => Promise<T>,
        serviceName: string
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🚀 Starting ${serviceName} service call`);
            const result = await serviceCall();
            console.log(`✅ ${serviceName} service call completed successfully`, result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `${serviceName} failed`;
            console.error(`❌ ${serviceName} service call failed:`, err);
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // GoSend cost calculation
    const calculateGoSendCost = useCallback(async (params: {
        sender: ExpeditionAddress;
        receiver: ExpeditionAddress;
        package_weight: number;
        package_length: number;
        package_width: number;
        package_height: number;
        item_value: number;
        shipment_method: 'Instant' | 'Same Day';
    }) => {
        return handleServiceCall(async () => {
            const request = {
                ...params,
                origin: `${params.sender.latitude},${params.sender.longitude}`,
                destination: `${params.receiver.latitude},${params.receiver.longitude}`,
            };

            return getGoSendShipmentCost(request);
        }, 'GoSend Cost Calculation');
    }, [handleServiceCall]);

    // JNT Cargo cost calculation  
    const calculateJntCargoCost = useCallback(async (params: {
        sender: ExpeditionAddress;
        receiver: ExpeditionAddress;
        package_weight: number;
        package_length: number;
        package_width: number;
        package_height: number;
        item_value: number;
        shipment_method: string;
        weight: number;
        sender_city: string;
        receiver_city: string;
        sender_province: string;
        receiver_province: string;
        origin_city: string;
        destination_city: string;
    }) => {
        return handleServiceCall(async () => {
            return getJntCargoShipmentCost(params);
        }, 'JNT Cargo Cost Calculation');
    }, [handleServiceCall]);

    // ID Express cost calculation - simplified to match backend expectations
    const calculateIdExpressCost = useCallback(async (params: {
        senderCityId: number;
        recipientDistrictId: number;
        weight: number;
        expressType?: string;
    }) => {
        return handleServiceCall(async () => {
            return getIdExpressShipmentCost(params);
        }, 'ID Express Cost Calculation');
    }, [handleServiceCall]);

    // Generic order creation
    const createOrder = useCallback(async (vendor: ExpeditionVendor, orderData: Record<string, unknown>) => {
        return handleServiceCall(async () => {
            switch (vendor) {
                case ExpeditionVendor.GOSEND:
                    return createGoSendOrder(orderData as unknown as Parameters<typeof createGoSendOrder>[0]);
                case ExpeditionVendor.JNT_CARGO:
                    return createJntCargoOrder(orderData as unknown as Parameters<typeof createJntCargoOrder>[0]);
                case ExpeditionVendor.ID_EXPRESS:
                    return createIdExpressOrder(orderData as unknown as Parameters<typeof createIdExpressOrder>[0]);
                default:
                    throw new Error(`Unsupported vendor: ${vendor}`);
            }
        }, `${vendor} Order Creation`);
    }, [handleServiceCall]);

    // Generic order tracking
    const trackOrder = useCallback(async (vendor: ExpeditionVendor, params: Record<string, unknown>) => {
        return handleServiceCall(async () => {
            switch (vendor) {
                case ExpeditionVendor.GOSEND:
                    return trackGoSendOrder(params as Parameters<typeof trackGoSendOrder>[0]);
                case ExpeditionVendor.JNT_CARGO:
                    return trackJntCargoOrder(params as Parameters<typeof trackJntCargoOrder>[0]);
                case ExpeditionVendor.ID_EXPRESS:
                    return trackIdExpressOrder(params as Parameters<typeof trackIdExpressOrder>[0]);
                default:
                    throw new Error(`Unsupported vendor: ${vendor}`);
            }
        }, `${vendor} Order Tracking`);
    }, [handleServiceCall]);

    // Generic order cancellation
    const cancelOrder = useCallback(async (vendor: ExpeditionVendor, params: Record<string, unknown>) => {
        return handleServiceCall(async () => {
            switch (vendor) {
                case ExpeditionVendor.GOSEND:
                    return cancelGoSendOrder(params as Parameters<typeof cancelGoSendOrder>[0]);
                default:
                    throw new Error(`Order cancellation not implemented for vendor: ${vendor}`);
            }
        }, `${vendor} Order Cancellation`);
    }, [handleServiceCall]);

    return {
        loading,
        error,
        calculateGoSendCost,
        calculateJntCargoCost,
        calculateIdExpressCost,
        createOrder,
        trackOrder,
        cancelOrder,
    };
};
