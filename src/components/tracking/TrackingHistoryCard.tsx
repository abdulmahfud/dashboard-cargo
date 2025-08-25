"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Truck } from "lucide-react";
import type { TrackingHistoryItem } from "@/types/tracking";

interface TrackingHistoryCardProps {
  data: TrackingHistoryItem[];
}

export const TrackingHistoryCard: React.FC<TrackingHistoryCardProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (status_code?: number) => {
    if (!status_code) return "bg-gray-500";
    if (status_code >= 200) return "bg-green-500";
    if (status_code >= 100) return "bg-blue-500";
    return "bg-gray-500";
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Riwayat Perjalanan Paket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((history, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    history.status_code
                      ? getStatusBadgeColor(history.status_code)
                      : "bg-blue-500"
                  }`}
                ></div>
                {index < data.length - 1 && (
                  <div className="w-px h-8 bg-gray-300 mt-2"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {history.city || "N/A"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {history.datetime ? formatDate(history.datetime) : "N/A"}
                  </span>
                </div>
                <p className="font-medium text-sm">{history.status || "N/A"}</p>
                {history.store_name && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Outlet:</strong> {history.store_name}
                  </p>
                )}
                {history.driver_name && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    <strong>Driver:</strong> {history.driver_name}
                    {history.driver_phone && ` (${history.driver_phone})`}
                  </p>
                )}
                {history.name && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Petugas:</strong> {history.name}
                  </p>
                )}
                {history.address && (
                  <p className="text-xs text-gray-600 flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {history.address}
                  </p>
                )}
                {history.note && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Catatan:</strong> {history.note}
                  </p>
                )}
                {history.next_site && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Next Site:</strong> {history.next_site}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
