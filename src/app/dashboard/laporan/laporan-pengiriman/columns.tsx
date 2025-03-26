"use client";

import { ColumnDef } from "@tanstack/react-table";

// Tipe data DeliveryReport
type DeliveryReport = {
  createdAt: string;
  shipmentNo: string;
  packageType: "Paket Reguler" | "Paket Instant" | "COD" | "Non COD";
  recipient: string;
  courierService:
    | "JNE - Reguler"
    | "JNE - YES"
    | "JNE - OKE"
    | "J&T Express"
    | "SiCepat - Best"
    | "TIKI - ONS"
    | "TIKI - Reguler"
    | "Ninja Xpress"
    | "AnterAja - Same Day"
    | "AnterAja - Next Day"
    | "Grab Express"
    | "Gojek - GoSend";
  totalShipment: number;
  shippingMethod: "COD" | "Non COD";
  status:
    | "Sampai Tujuan"
    | "Belum di Expedisi"
    | "Proses Pengiriman"
    | "Kendala Pengiriman"
    | "Retur"
    | "Dibatalkan";
};

// Kolom tabel
export const columns: ColumnDef<DeliveryReport>[] = [
  {
    header: "NO",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "shipmentNo",
    header: "NO PENGIRIMAN",
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
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "createdAt",
    header: "TANGGAL DIBUAT",
  },
];
