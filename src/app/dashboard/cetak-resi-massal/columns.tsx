"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";


export type Pengiriman = {
  id: string;
  tanggalDibuat: string;
  noPengiriman: string;
  penerima: string;
  ekspedisi: string;
  totalPengiriman: string;
  metodePengiriman: string;
  status: string;
};

export const columns: ColumnDef<Pengiriman>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "tanggalDibuat",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TANGGAL DIBUAT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "noPengiriman",
    header: "NO PENGIRIMAN",
  },
  {
    accessorKey: "penerima",
    header: "PENERIMA",
  },
  {
    accessorKey: "ekspedisi",
    header: "EKSPEDISI / LAYANAN",
  },
  {
    accessorKey: "totalPengiriman",
    header: "TOTAL PENGIRIMAN",
  },
  {
    accessorKey: "metodePengiriman",
    header: "METODE PENGIRIMAN",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    id: "cetak",
    header: "CETAK",
    cell: ({ row }) => (
      <Button
        variant="outline"
        onClick={() => alert(`Cetak data id ${row.original.id}`)}
      >
        Cetak
      </Button>
    ),
  },
];
