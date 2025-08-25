"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Camera,
  FileSignature,
  MapPin,
  Truck,
  AlertCircle,
} from "lucide-react";
import type { StandardizedTrackingData } from "@/types/tracking";

interface PaxelTrackingContentProps {
  data: StandardizedTrackingData;
}

export const PaxelTrackingContent: React.FC<PaxelTrackingContentProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Tracking History - Prioritized for Paxel */}
      {data.tracking_history && data.tracking_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Riwayat Perjalanan Paket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tracking_history.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b last:border-b-0"
                >
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {item.status || "Status tidak diketahui"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.datetime ? formatDate(item.datetime) : "-"}
                      </p>
                    </div>
                    {item.name && (
                      <p className="text-sm text-gray-600">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        {item.name}
                      </p>
                    )}
                    {item.address && (
                      <p className="text-sm text-gray-600">{item.address}</p>
                    )}
                    {(item.city || item.province || item.district) && (
                      <p className="text-sm text-gray-500">
                        {[item.city, item.district, item.province]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-sm text-gray-500 italic">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.latest_status && (
        <Card>
          <CardHeader>
            <CardTitle>Status Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-lg">
              {data.latest_status}
            </Badge>
          </CardContent>
        </Card>
      )}

      {data.delivery_datetime && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengiriman</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>Dikirim pada:</strong>{" "}
              {formatDate(data.delivery_datetime)}
            </p>
          </CardContent>
        </Card>
      )}

      {(data.photo_url || data.signature_url) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Dokumentasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {data.photo_url && (
                <a
                  href={data.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
                >
                  <Camera className="h-4 w-4" />
                  📷 Lihat Foto
                </a>
              )}
              {data.signature_url && (
                <a
                  href={data.signature_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center gap-1"
                >
                  <FileSignature className="h-4 w-4" />
                  ✍️ Lihat Tanda Tangan
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {data.cancellation_reason && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Informasi Pembatalan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              <strong>Alasan Pembatalan:</strong> {data.cancellation_reason}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
