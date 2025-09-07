"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
    Package,
    User,
    Clock,
    Truck,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Info,
} from "lucide-react";
import type { StandardizedTrackingResponse } from "@/types/tracking";

interface IdExpressTrackingContentProps {
    result: StandardizedTrackingResponse;
}

export function IdExpressTrackingContent({ result }: IdExpressTrackingContentProps) {
    if (!result.tracking_data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        ID Express Tracking
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-4">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Tidak ada data tracking yang tersedia
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const trackingData = result.tracking_data;

    const getStatusIcon = (status: string) => {
        const lowerStatus = status?.toLowerCase() || "";
        if (lowerStatus.includes("delivered") || lowerStatus.includes("terkirim")) {
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        } else if (lowerStatus.includes("in transit") || lowerStatus.includes("dalam perjalanan")) {
            return <Truck className="h-4 w-4 text-blue-500" />;
        } else if (lowerStatus.includes("picked up") || lowerStatus.includes("diambil")) {
            return <Package className="h-4 w-4 text-orange-500" />;
        } else if (lowerStatus.includes("cancelled") || lowerStatus.includes("dibatalkan")) {
            return <XCircle className="h-4 w-4 text-red-500" />;
        }
        return <Info className="h-4 w-4 text-gray-500" />;
    };

    const getStatusColor = (status: string) => {
        const lowerStatus = status?.toLowerCase() || "";
        if (lowerStatus.includes("delivered") || lowerStatus.includes("terkirim")) {
            return "bg-green-100 text-green-800";
        } else if (lowerStatus.includes("in transit") || lowerStatus.includes("dalam perjalanan")) {
            return "bg-blue-100 text-blue-800";
        } else if (lowerStatus.includes("picked up") || lowerStatus.includes("diambil")) {
            return "bg-orange-100 text-orange-800";
        } else if (lowerStatus.includes("cancelled") || lowerStatus.includes("dibatalkan")) {
            return "bg-red-100 text-red-800";
        }
        return "bg-gray-100 text-gray-800";
    };

    return (
        <>
            {/* Current Status Card */}
            {trackingData.latest_status && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Status Pengiriman ID Express
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            {getStatusIcon(trackingData.latest_status)}
                            <Badge className={getStatusColor(trackingData.latest_status)}>
                                {trackingData.latest_status}
                            </Badge>
                        </div>
                        {trackingData.delivery_datetime && (
                            <div className="mt-3 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    Waktu Pengiriman: {trackingData.delivery_datetime}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Driver Information - if available */}
            {trackingData.driver_info && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Informasi Driver
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {trackingData.driver_info.pickup_driver?.name && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-1">Driver Pickup</h4>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{trackingData.driver_info.pickup_driver.name}</span>
                                    </div>
                                    {trackingData.driver_info.pickup_driver.phone && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">
                                                Tel: {trackingData.driver_info.pickup_driver.phone}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {trackingData.driver_info.delivery_driver?.name && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-1">Driver Delivery</h4>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{trackingData.driver_info.delivery_driver.name}</span>
                                    </div>
                                    {trackingData.driver_info.delivery_driver.phone && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">
                                                Tel: {trackingData.driver_info.delivery_driver.phone}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Service Information */}
            {(trackingData.awb_no || trackingData.package_info?.service_code) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Informasi Layanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {trackingData.awb_no && (
                                <div>
                                    <span className="text-sm font-medium">Nomor AWB: </span>
                                    <span className="text-sm">{trackingData.awb_no}</span>
                                </div>
                            )}
                            {trackingData.package_info?.service_code && (
                                <div>
                                    <span className="text-sm font-medium">Kode Layanan: </span>
                                    <span className="text-sm">{trackingData.package_info.service_code}</span>
                                </div>
                            )}
                            {trackingData.package_info?.pickup_datetime && (
                                <div>
                                    <span className="text-sm font-medium">Waktu Pickup: </span>
                                    <span className="text-sm">{trackingData.package_info.pickup_datetime}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* COD Information */}
            {trackingData.cost_details.cod_value && (
                <Card>
                    <CardHeader>
                        <CardTitle>COD Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            <strong>COD Value:</strong> Rp {trackingData.cost_details.cod_value?.toLocaleString("id-ID")}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Signature/Photo */}
            {(trackingData.signature_url || trackingData.photo_url) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Bukti Penyerahan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {trackingData.signature_url && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Tanda Tangan</h4>
                                    <Image
                                        src={trackingData.signature_url}
                                        alt="Signature"
                                        width={300}
                                        height={200}
                                        className="border rounded-md"
                                    />
                                </div>
                            )}
                            {trackingData.photo_url && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Foto Penyerahan</h4>
                                    <Image
                                        src={trackingData.photo_url}
                                        alt="Delivery Photo"
                                        width={300}
                                        height={200}
                                        className="border rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Cancellation Reason */}
            {trackingData.cancellation_reason && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            Alasan Pembatalan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-600">{trackingData.cancellation_reason}</p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
