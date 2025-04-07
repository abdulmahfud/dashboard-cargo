"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "./date-picker-with-range";
import { DataTablePagination } from "./pagination";
import { DateRange } from "react-day-picker";

interface DataTableProps<TData extends DeliveryReport, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  dateRange?: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  packageTypeFilter: string;
  setPackageTypeFilter: React.Dispatch<React.SetStateAction<string>>;
}


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
    | "Proses"
    | "Masalah Kirim"
    | "Retur"
    | "Dibatalkan";
};

export function DataTable<TData extends DeliveryReport, TValue>({
  columns,
  data,
  dateRange,
  setDateRange,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("Semua Status");
  const [packageTypeFilter, setPackageTypeFilter] = React.useState<string>("Semua Jenis Paket");


  // ✨ Filter Data Berdasarkan Status dan Date
  const filteredData = React.useMemo(() => {
    return data.filter((item: DeliveryReport) => {
      const statusMatch =
        statusFilter === "Semua Status" || item.status === statusFilter;
      const packageMatch =
        packageTypeFilter === "Semua Jenis Paket" ||
        item.packageType === packageTypeFilter;
      const dateMatch =
        !dateRange?.from || !dateRange?.to
          ? true
          : (() => {
              const createdAtDate = new Date(item.createdAt);
              return (
                createdAtDate.getTime() >= dateRange.from.getTime() &&
                createdAtDate.getTime() <= dateRange.to.getTime()
              );
            })();
      return statusMatch && packageMatch && dateMatch;
    });
  }, [data, statusFilter, packageTypeFilter, dateRange]);


  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4 p-4">
      {/* Filter & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div>
            <Label htmlFor="cari-resi">Cari Data</Label>
            <Input
              placeholder="Cari data"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="cari-resi">Pilih Range Tanggal</Label>
            <Popover>
              {setDateRange && (
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              )}
            </Popover>
          </div>
          <div>
            <Label htmlFor="filter-status">Filter Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {statusFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex flex-col space-y-1 p-2">
                  {[
                    "Semua Status",
                    "Sampai Tujuan",
                    "Belum di Expedisi",
                    "Proses Pengiriman",
                    "Kendala Pengiriman",
                    "Retur",
                    "Dibatalkan",
                  ].map((status) => (
                    <Button
                      key={status}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Label htmlFor="filter-package">Filter Jenis Paket</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {packageTypeFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex flex-col space-y-1 p-2">
                  {[
                    "Semua Jenis Paket",
                    "Paket Reguler",
                    "Paket Instant",
                    "COD",
                    "Non COD",
                  ].map((type) => (
                    <Button
                      key={type}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => setPackageTypeFilter(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Image
                      src="/image/search.png"
                      alt="No data"
                      width={100}
                      height={100}
                      className="h-40 w-40 object-contain"
                    />
                    <div className="text-sm font-medium text-gray-500">
                      Data Tidak Ditemukan
                    </div>
                    <div className="text-xs text-gray-400">
                      Kami tidak bisa menemukan apa yang kamu cari, coba cari
                      lagi yuk!
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
