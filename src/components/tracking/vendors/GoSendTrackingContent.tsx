"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Clock, Truck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { StandardizedTrackingResponse } from "@/types/tracking";

interface GoSendTrackingContentProps {
    result: StandardizedTrackingResponse;
}

export function GoSendTrackingContent({ result }: GoSendTrackingContentProps) {
    // GoSend specific status mapping
    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case "cancelled":
            case "driver not found":
                return <XCircle className="h-5 w-5 text-red-600" />;
            case "on hold":
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case "enroute pickup":
            case "enroute drop":
                return <Truck className="h-5 w-5 text-blue-600" />;
            case "finding driver":
            case "driver allocated":
                return <Clock className="h-5 w-5 text-orange-600" />;
            default:
                return <Package className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
            case "driver not found":
                return "bg-red-100 text-red-800";
            case "on hold":
                return "bg-yellow-100 text-yellow-800";
            case "enroute pickup":
            case "enroute drop":
                return "bg-blue-100 text-blue-800";
            case "finding driver":
            case "driver allocated":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* GoSend Specific Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-green-600" />
                        Informasi GoSend
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-sm font-medium">Vendor:</span>
                            <Badge variant="outline">{result.vendor}</Badge>
                        </div>
                        {result.order_info.awb_no && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Booking ID:</span>
                                <Badge variant="secondary">{result.order_info.awb_no}</Badge>
                            </div>
                        )}
                    </div>

                    {result.tracking_data.driver_info && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold">Informasi Driver</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {result.tracking_data.driver_info.pickup_driver?.name && (
                                        <div>
                                            <strong>Nama Driver Pickup:</strong> {result.tracking_data.driver_info.pickup_driver.name}
                                        </div>
                                    )}
                                    {result.tracking_data.driver_info.pickup_driver?.phone && (
                                        <div>
                                            <strong>No. Telepon Pickup:</strong> {result.tracking_data.driver_info.pickup_driver.phone}
                                        </div>
                                    )}
                                    {result.tracking_data.driver_info.delivery_driver?.name && (
                                        <div>
                                            <strong>Nama Driver Delivery:</strong> {result.tracking_data.driver_info.delivery_driver.name}
                                        </div>
                                    )}
                                    {result.tracking_data.driver_info.delivery_driver?.phone && (
                                        <div>
                                            <strong>No. Telepon Delivery:</strong> {result.tracking_data.driver_info.delivery_driver.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Remove the distance_info section since it's not in the types */}
                </CardContent>
            </Card>

            {/* Tracking History with GoSend styling */}
            {result.tracking_data.tracking_history && result.tracking_data.tracking_history.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600" />
                            Riwayat Perjalanan
                        </CardTitle>
                        <CardDescription>
                            Status terkini dan riwayat pergerakan paket GoSend Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {result.tracking_data.tracking_history.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {getStatusIcon(item.status || "")}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(item.status || "")}>
                                                {item.status || "Unknown"}
                                            </Badge>
                                            {item.datetime && (
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(item.datetime).toLocaleString("id-ID")}
                                                </span>
                                            )}
                                        </div>
                                        {item.note && (
                                            <p className="text-sm text-muted-foreground">
                                                {item.note}
                                            </p>
                                        )}
                                        {(item.city || item.address) && (
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                {item.city || item.address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Remove real-time location section as it's not in the types */}
        </div>
    );
}
