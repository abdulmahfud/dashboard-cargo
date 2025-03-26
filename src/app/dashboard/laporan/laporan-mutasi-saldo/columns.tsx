"use client";

import { ColumnDef } from "@tanstack/react-table";

// Tipe data, contoh dummy
type BalanceHistory = {
  mutation: string;
  value: number;
  status: string;
  createdAt: string;
  releasedAt: string;
};

export const columns: ColumnDef<BalanceHistory>[] = [
  {
    header: "NO",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "mutation",
    header: "MUTASI",
  },
  {
    accessorKey: "value",
    header: "NILAI",
    cell: ({ row }) => {
      const amount = row.original.value;
      return `Rp${amount.toLocaleString()}`;
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "createdAt",
    header: "TANGGAL DIBUAT/ESTIMASI",
  },
  {
    accessorKey: "releasedAt",
    header: "TANGGAL RILIS",
  },
];
