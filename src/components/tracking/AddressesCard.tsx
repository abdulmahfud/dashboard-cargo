"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";
import type { Addresses } from "@/types/tracking";

interface AddressesCardProps {
  data: Addresses;
}

export const AddressesCard: React.FC<AddressesCardProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Pengirim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-semibold">{data.sender.name || "N/A"}</p>
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {data.sender.address || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Kota:</strong> {data.sender.city || "N/A"}
            </p>
            {data.sender.province && (
              <p className="text-sm">
                <strong>Provinsi:</strong> {data.sender.province}
              </p>
            )}
            {data.sender.district && (
              <p className="text-sm">
                <strong>Kecamatan:</strong> {data.sender.district}
              </p>
            )}
            {data.sender.zip_code && (
              <p className="text-sm">
                <strong>Kode Pos:</strong> {data.sender.zip_code}
              </p>
            )}
            {data.sender.phone && (
              <p className="text-sm">
                <strong>Telepon:</strong> {data.sender.phone}
              </p>
            )}
            {data.sender.email && (
              <p className="text-sm">
                <strong>Email:</strong> {data.sender.email}
              </p>
            )}
            {data.sender.note && (
              <p className="text-sm text-gray-600">
                <strong>Catatan:</strong> {data.sender.note}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Penerima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-semibold">{data.receiver.name || "N/A"}</p>
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {data.receiver.address || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Kota:</strong> {data.receiver.city || "N/A"}
            </p>
            {data.receiver.province && (
              <p className="text-sm">
                <strong>Provinsi:</strong> {data.receiver.province}
              </p>
            )}
            {data.receiver.district && (
              <p className="text-sm">
                <strong>Kecamatan:</strong> {data.receiver.district}
              </p>
            )}
            {data.receiver.zip_code && (
              <p className="text-sm">
                <strong>Kode Pos:</strong> {data.receiver.zip_code}
              </p>
            )}
            {data.receiver.phone && (
              <p className="text-sm">
                <strong>Telepon:</strong> {data.receiver.phone}
              </p>
            )}
            {data.receiver.email && (
              <p className="text-sm">
                <strong>Email:</strong> {data.receiver.email}
              </p>
            )}
            {data.receiver.note && (
              <p className="text-sm text-gray-600">
                <strong>Catatan:</strong> {data.receiver.note}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
