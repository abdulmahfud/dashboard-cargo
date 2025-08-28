"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  MapPin,
  User,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import type { StandardizedTrackingResponse } from "@/types/tracking";

interface LionTrackingContentProps {
  result: StandardizedTrackingResponse;
}

export function LionTrackingContent({ result }: LionTrackingContentProps) {
  const [showRawData, setShowRawData] = useState(false);

  if (!result.tracking_info) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lion Parcel Tracking
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

  const trackingInfo = result.tracking_info;
  const history = trackingInfo.tracking_history || [];

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sampai_tujuan":
        return "bg-green-100 text-green-800 border-green-200";
      case "proses_pengiriman":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "belum_proses":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "belum_di_expedisi":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "kendala_pengiriman":
        return "bg-red-100 text-red-800 border-red-200";
      case "dibatalkan":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "retur":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sampai_tujuan":
        return <CheckCircle2 className="h-4 w-4" />;
      case "proses_pengiriman":
        return <Truck className="h-4 w-4" />;
      case "belum_proses":
        return <Package className="h-4 w-4" />;
      case "belum_di_expedisi":
        return <Info className="h-4 w-4" />;
      case "kendala_pengiriman":
        return <AlertCircle className="h-4 w-4" />;
      case "dibatalkan":
        return <XCircle className="h-4 w-4" />;
      case "retur":
        return <Package className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Tracking Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lion Parcel - Status Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Status Saat Ini:
              </span>
              <Badge
                className={`${getStatusColor(trackingInfo.current_status)} border`}
              >
                {getStatusIcon(trackingInfo.current_status)}
                <span className="ml-1">{trackingInfo.status_description}</span>
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              {trackingInfo.current_status_code}
            </Badge>
          </div>

          {/* AWB Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                <span className="font-medium">AWB:</span> {trackingInfo.awb_no}
              </span>
            </div>
            {trackingInfo.reference_no && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Reference:</span>{" "}
                  {trackingInfo.reference_no}
                </span>
              </div>
            )}
          </div>

          {/* Shipment Details */}
          {trackingInfo.shipment_details && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {trackingInfo.shipment_details.chargeable_weight} kg
                </div>
                <div className="text-xs text-gray-600">Berat</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {trackingInfo.shipment_details.pieces}
                </div>
                <div className="text-xs text-gray-600">Jumlah</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {trackingInfo.shipment_details.product_type}
                </div>
                <div className="text-xs text-gray-600">Layanan</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {trackingInfo.shipment_details.shipment_id}
                </div>
                <div className="text-xs text-gray-600">Shipment ID</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sender & Receiver Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Pengirim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium">
                {trackingInfo.sender?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {trackingInfo.sender?.address || "Alamat tidak tersedia"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Penerima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium">
                {trackingInfo.receiver?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {trackingInfo.receiver?.address || "Alamat tidak tersedia"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Riwayat Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {index < history.length - 1 && (
                    <div className="absolute left-6 top-8 w-0.5 h-8 bg-gray-200" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(entry.status)} border-2 border-white shadow-sm`}
                    >
                      {getStatusIcon(entry.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`${getStatusColor(entry.status)} border text-xs`}
                        >
                          {entry.status_code}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>

                      <div className="font-medium text-gray-900 mb-1">
                        {entry.description}
                      </div>

                      {entry.remarks && (
                        <div className="text-sm text-gray-600 mb-2">
                          {entry.remarks}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {entry.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {entry.location}
                          </span>
                        )}
                        {entry.city && <span>{entry.city}</span>}
                        {entry.updated_by && <span>by {entry.updated_by}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              Tidak ada riwayat tracking yang tersedia
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informasi Debug
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vendor:</span>
              <Badge variant="outline">{trackingInfo.vendor_name}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Update:</span>
              <span className="text-sm text-gray-600">
                {formatTimestamp(trackingInfo.last_update)}
              </span>
            </div>

            <Separator />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRawData(!showRawData)}
              className="w-full"
            >
              {showRawData ? "Sembunyikan" : "Tampilkan"} Raw Data
            </Button>

            {showRawData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
