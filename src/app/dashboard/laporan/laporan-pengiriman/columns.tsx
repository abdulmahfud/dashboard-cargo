"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeliveryReport } from "@/types/laporanPengiriman";
import { LabelUrlButton } from "@/components/Laporan/LabelUrlButton";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

// Kolom tabel
export const columns: ColumnDef<DeliveryReport>[] = [
  {
    header: "NO",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "shipmentNo",
    header: "NO RESI / AWB",
  },
  {
    accessorKey: "packageType",
    header: "JENIS PAKET",
  },
  {
    accessorKey: "recipient",
    header: "PENERIMA",
  },
  {
    accessorKey: "courierService",
    header: "EXPEDISI / LAYANAN",
  },
  {
    accessorKey: "totalShipment",
    header: "HARGA",
    cell: ({ row }) => {
      const amount = row.original.totalShipment;
      return `Rp${amount.toLocaleString()}`;
    },
  },
  {
    accessorKey: "shippingMethod",
    header: "METODE PENGIRIMAN",
  },
  {
    accessorKey: "service",
    header: "TIPE LAYANAN",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "createdAt",
    header: "TANGGAL DIBUAT",
  },
  {
    id: "tracking",
    header: "TRACKING",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Link
          href={`/dashboard/tracking?awb=${encodeURIComponent(order.shipmentNo)}`}
        >
          <Button variant="outline" size="sm" className="w-full">
            <Package className="h-4 w-4 mr-1" />
            Lacak
          </Button>
        </Link>
      );
    },
  },
  {
    id: "actions",
    header: "CETAK RESI",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <LabelUrlButton
          awbNo={order.shipmentNo}
          vendor={order.vendor}
          className="w-32"
        />
      );
    },
  },
];
