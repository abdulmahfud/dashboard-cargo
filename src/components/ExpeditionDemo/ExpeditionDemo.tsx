"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useExpeditionService } from "@/hooks/useExpeditionService";
import {
    createGoSendOrder,
    createJntCargoOrder,
    createIdExpressOrder,
    createPosIndonesiaOrder,
    trackGoSendOrder,
    trackJntCargoOrder,
    trackIdExpressOrder,
    trackPosIndonesiaOrder,
} from "@/lib/apiClient";
import type { ExpeditionAddress, ExpeditionVendor } from "@/types/expedition";
import { ExpeditionVendor as VendorEnum } from "@/types/expedition";

interface ExpeditionDemoProps {
    onResult?: (result: unknown) => void;
}

export default function ExpeditionDemo({ onResult }: ExpeditionDemoProps) {
    const { loading, error } = useExpeditionService();
    const [activeTab, setActiveTab] = useState<"create" | "track">("create");
    const [selectedVendor, setSelectedVendor] = useState<ExpeditionVendor>(VendorEnum.GOSEND);
    const [orderResult, setOrderResult] = useState<unknown>(null);
    const [trackingResult, setTrackingResult] = useState<unknown>(null);

    // Sample data for testing
    const sampleSenderAddress: ExpeditionAddress = {
        name: "PT Test Sender",
        phone: "+6281234567890",
        email: "sender@test.com",
        address: "Jl. Sudirman No. 123, Jakarta Pusat",
        province: "DKI Jakarta",
        city: "Jakarta Pusat",
        district: "Tanah Abang",
        postal_code: "10220",
        latitude: -6.1944901,
        longitude: 106.8229821,
    };

    const sampleReceiverAddress: ExpeditionAddress = {
        name: "Test Receiver",
        phone: "+6281987654321",
        email: "receiver@test.com",
        address: "Jl. Thamrin No. 456, Jakarta Pusat",
        province: "DKI Jakarta",
        city: "Jakarta Pusat",
        district: "Menteng",
        postal_code: "10310",
        latitude: -6.1753871,
        longitude: 106.8271145,
    };

    const handleCreateOrder = async () => {
        try {
            const referenceNo = `TEST-${selectedVendor.toUpperCase()}-${Date.now()}`;

            let result;
            switch (selectedVendor) {
                case VendorEnum.GOSEND:
                    result = await createGoSendOrder({
                        sender: sampleSenderAddress,
                        receiver: sampleReceiverAddress,
                        package_weight: 2.5,
                        package_length: 30,
                        package_width: 25,
                        package_height: 15,
                        item_value: 500000,
                        item_description: "Electronics - Testing Package",
                        quantity: 1,
                        shipment_method: "Instant",
                        reference_no: referenceNo,
                        amount: 16000,
                        origin: `${sampleSenderAddress.latitude},${sampleSenderAddress.longitude}`,
                        destination: `${sampleReceiverAddress.latitude},${sampleReceiverAddress.longitude}`,
                    });
                    break;

                case VendorEnum.JNT_CARGO:
                    result = await createJntCargoOrder({
                        sender: sampleSenderAddress,
                        receiver: sampleReceiverAddress,
                        package_weight: 2.5,
                        package_length: 30,
                        package_width: 25,
                        package_height: 15,
                        item_value: 500000,
                        item_description: "Electronics - Testing Package",
                        quantity: 1,
                        shipment_method: "Regular",
                        reference_no: referenceNo,
                        amount: 50000,
                        weight: 2.5,
                        sender_city: "Jakarta Pusat",
                        receiver_city: "Jakarta Pusat",
                        sender_province: "DKI Jakarta",
                        receiver_province: "DKI Jakarta",
                        origin_city: "Jakarta Pusat",
                        destination_city: "Jakarta Pusat",
                    });
                    break;

                case VendorEnum.ID_EXPRESS:
                    result = await createIdExpressOrder({
                        sender: sampleSenderAddress,
                        receiver: sampleReceiverAddress,
                        package_weight: 2.5,
                        package_length: 30,
                        package_width: 25,
                        package_height: 15,
                        item_value: 500000,
                        item_description: "Electronics - Testing Package",
                        quantity: 1,
                        shipment_method: "Regular",
                        reference_no: referenceNo,
                        amount: 35000,
                        weight: 2.5,
                        sender_city: "Jakarta Pusat",
                        receiver_city: "Jakarta Pusat",
                        sender_province: "DKI Jakarta",
                        receiver_province: "DKI Jakarta",
                        senderCityId: 154,
                        recipientDistrictId: 1543,
                        origin: sampleSenderAddress.address,
                        destination: sampleReceiverAddress.address,
                    });
                    break;

                case VendorEnum.POS_INDONESIA:
                    result = await createPosIndonesiaOrder({
                        sender: sampleSenderAddress,
                        receiver: sampleReceiverAddress,
                        package_weight: 2.5,
                        package_length: 30,
                        package_width: 25,
                        package_height: 15,
                        item_value: 500000,
                        item_description: "Electronics - Testing Package",
                        shipment_method: "REGULER",
                        service_code: "REGULER",
                        reference_no: referenceNo,
                        amount: 25000,
                        pieces: 1,
                        detail: {
                            weight: 2.5,
                            item_value: 500000,
                            cod: 0,
                            insurance: 0,
                            use_insurance: false,
                            remark: "General Goods",
                            items: [{
                                name: "Electronics - Testing Package",
                                value: 500000
                            }]
                        }
                    });
                    break;

                default:
                    throw new Error(`Unsupported vendor: ${selectedVendor}`);
            }

            setOrderResult(result);
            onResult?.(result);
        } catch (err) {
            console.error("Order creation failed:", err);
            setOrderResult({ error: err });
            onResult?.({ error: err });
        }
    };

    const handleTrackOrder = async () => {
        try {
            let result;
            switch (selectedVendor) {
                case VendorEnum.GOSEND:
                    result = await trackGoSendOrder({
                        storeOrderId: "REF-202509061720543",
                        order_id: 14,
                    });
                    break;

                case VendorEnum.JNT_CARGO:
                    result = await trackJntCargoOrder({
                        orderNo: "JT123456789",
                        storeOrderId: "REF-202509061721978",
                        reference_no: "REF-202509061721978",
                        order_id: 15,
                    });
                    break;

                case VendorEnum.ID_EXPRESS:
                    result = await trackIdExpressOrder({
                        storeOrderId: "REF-202509061722000",
                        order_id: 16,
                    });
                    break;

                case VendorEnum.POS_INDONESIA:
                    result = await trackPosIndonesiaOrder({
                        storeOrderId: "REF-202509061723000",
                        awb_no: "POS123456789",
                        order_id: 17,
                    });
                    break;

                default:
                    throw new Error(`Unsupported vendor: ${selectedVendor}`);
            }

            setTrackingResult(result);
            onResult?.(result);
        } catch (err) {
            console.error("Order tracking failed:", err);
            setTrackingResult({ error: err });
            onResult?.({ error: err });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🚚 Expedition Services Demo
                        <Badge variant="outline" className="text-xs">
                            GoSend • JNT Cargo • ID Express
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Vendor Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="vendor">Select Expedition Vendor</Label>
                        <Select
                            value={selectedVendor}
                            onValueChange={(value) => setSelectedVendor(value as ExpeditionVendor)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={VendorEnum.GOSEND}>
                                    🏍️ GoSend (Instant • Same Day)
                                </SelectItem>
                                <SelectItem value={VendorEnum.JNT_CARGO}>
                                    🚛 JNT Cargo (FT • LTL • Regular)
                                </SelectItem>
                                <SelectItem value={VendorEnum.ID_EXPRESS}>
                                    📦 ID Express (Regular • Express)
                                </SelectItem>
                                <SelectItem value={VendorEnum.POS_INDONESIA}>
                                    🏣 POS Indonesia (REGULER • EXPRESS)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex gap-2">
                        <Button
                            variant={activeTab === "create" ? "default" : "outline"}
                            onClick={() => setActiveTab("create")}
                            className="flex-1"
                        >
                            Create Order
                        </Button>
                        <Button
                            variant={activeTab === "track" ? "default" : "outline"}
                            onClick={() => setActiveTab("track")}
                            className="flex-1"
                        >
                            Track Order
                        </Button>
                    </div>

                    <Separator />

                    {/* Create Order Tab */}
                    {activeTab === "create" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="p-4">
                                    <h4 className="font-medium mb-2">📤 Sender Address</h4>
                                    <div className="text-sm space-y-1 text-muted-foreground">
                                        <p><strong>{sampleSenderAddress.name}</strong></p>
                                        <p>{sampleSenderAddress.phone}</p>
                                        <p>{sampleSenderAddress.address}</p>
                                        <p>{sampleSenderAddress.district}, {sampleSenderAddress.city}</p>
                                        <p>{sampleSenderAddress.province} {sampleSenderAddress.postal_code}</p>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <h4 className="font-medium mb-2">📥 Receiver Address</h4>
                                    <div className="text-sm space-y-1 text-muted-foreground">
                                        <p><strong>{sampleReceiverAddress.name}</strong></p>
                                        <p>{sampleReceiverAddress.phone}</p>
                                        <p>{sampleReceiverAddress.address}</p>
                                        <p>{sampleReceiverAddress.district}, {sampleReceiverAddress.city}</p>
                                        <p>{sampleReceiverAddress.province} {sampleReceiverAddress.postal_code}</p>
                                    </div>
                                </Card>
                            </div>

                            <Card className="p-4">
                                <h4 className="font-medium mb-2">📦 Package Details</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Weight</Label>
                                        <p className="font-medium">2.5 kg</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Dimensions</Label>
                                        <p className="font-medium">30×25×15 cm</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Value</Label>
                                        <p className="font-medium">Rp 500,000</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Description</Label>
                                        <p className="font-medium">Electronics</p>
                                    </div>
                                </div>
                            </Card>

                            <Button
                                onClick={handleCreateOrder}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Creating Order..." : `Create ${selectedVendor.toUpperCase()} Order`}
                            </Button>

                            {orderResult !== null && (
                                <Card className="p-4">
                                    <h4 className="font-medium mb-2">📋 Order Result</h4>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                        {JSON.stringify(orderResult, null, 2)}
                                    </pre>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Track Order Tab */}
                    {activeTab === "track" && (
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground mb-4">
                                <p>This will track a test order for the selected vendor.</p>
                                <p>Sample reference numbers are pre-configured for testing.</p>
                            </div>

                            <Button
                                onClick={handleTrackOrder}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Tracking Order..." : `Track ${selectedVendor.toUpperCase()} Order`}
                            </Button>

                            {trackingResult !== null && (
                                <Card className="p-4">
                                    <h4 className="font-medium mb-2">🔍 Tracking Result</h4>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                        {JSON.stringify(trackingResult, null, 2)}
                                    </pre>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <Card className="p-4 border-red-200 bg-red-50">
                            <h4 className="font-medium mb-2 text-red-800">❌ Error</h4>
                            <p className="text-sm text-red-700">{error}</p>
                        </Card>
                    )}
                </CardContent>
            </Card>

            {/* API Integration Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📊 API Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-100 text-green-800">✅ Ready</Badge>
                                <span className="font-medium">GoSend</span>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>• Cost calculation: ✅ Working</p>
                                <p>• Order creation: ✅ Working</p>
                                <p>• Order tracking: ⚠️ Needs AWB</p>
                                <p>• Cancellation: ⚠️ Permission based</p>
                            </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-100 text-green-800">✅ Ready</Badge>
                                <span className="font-medium">JNT Cargo</span>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>• Cost calculation: ✅ Working</p>
                                <p>• Order creation: ✅ Working</p>
                                <p>• Order tracking: ⚠️ Wrong endpoint</p>
                                <p>• Cancellation: ❌ Not implemented</p>
                            </div>
                        </div>

                        <div className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-red-100 text-red-800">🔴 Issues</Badge>
                                <span className="font-medium">ID Express</span>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>• Cost calculation: ❌ API issues</p>
                                <p>• Order creation: ❌ Dependent</p>
                                <p>• Order tracking: ❌ Not tested</p>
                                <p>• Cancellation: ❌ Not tested</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
