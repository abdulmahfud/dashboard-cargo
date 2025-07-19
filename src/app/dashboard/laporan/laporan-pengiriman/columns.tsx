"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeliveryReport } from "@/types/laporanPengiriman";
import { LabelUrlButton } from "@/components/Laporan/LabelUrlButton";

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
    id: "actions",
    header: "LABEL URL",
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
