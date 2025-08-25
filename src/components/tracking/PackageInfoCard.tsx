"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import type { PackageInfo } from "@/types/tracking";

interface PackageInfoCardProps {
  data: PackageInfo;
}

export const PackageInfoCard: React.FC<PackageInfoCardProps> = ({ data }) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Detail Paket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Nama Barang
            </label>
            <p className="font-semibold">{data.item_name || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Jumlah & Berat
            </label>
            <p className="font-semibold">
              {data.quantity || 0} pcs • {data.weight || 0}g
            </p>
          </div>
          {data.service_code && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Layanan
              </label>
              <p className="font-semibold">{data.service_code}</p>
            </div>
          )}
          {data.category && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Kategori
              </label>
              <p className="font-semibold">{data.category}</p>
            </div>
          )}
          {data.pickup_datetime && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Pickup Time
              </label>
              <p className="font-semibold">
                {formatDate(data.pickup_datetime)}
              </p>
            </div>
          )}
        </div>
        {data.note && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              Catatan
            </label>
            <p className="font-semibold">{data.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
