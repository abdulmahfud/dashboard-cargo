"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CloudDownload } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type BalanceHistory = {
  mutation: string;
  value: number;
  status: string;
  createdAt: string;
  releasedAt: string;
};

const data: BalanceHistory[] = [
  {
    mutation: "Penambahan Saldo dari Pesanan #DID-812343",
    value: 150000,
    status: "Pending",
    createdAt: "2025-03-20",
    releasedAt: "2025-03-25",
  },
  {
    mutation: "Penambahan Saldo dari Pesanan #DID-812344",
    value: 200000,
    status: "Sukses",
    createdAt: "2025-03-18",
    releasedAt: "2025-03-21",
  },
  {
    mutation: "Penambahan Saldo dari Pesanan #DID-812345",
    value: 175000,
    status: "Tertahan",
    createdAt: "2025-03-17",
    releasedAt: "2025-03-20",
  },
  {
    mutation: "Penambahan Saldo dari Pesanan #DID-812346",
    value: 220000,
    status: "Sukses",
    createdAt: "2025-03-15",
    releasedAt: "2025-03-18",
  },
  {
    mutation: "Penambahan Saldo dari Pesanan #DID-812347",
    value: 180000,
    status: "Pending",
    createdAt: "2025-03-10",
    releasedAt: "2025-03-14",
  },
];

const LaporanMutasiSaldo = () => {
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <SiteHeader />
          </div>
          <TopNav />
        </div>
        <div className="flex flex-1 flex-col bg-blue-100">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Riwayat Saldo</h2>
                <Button className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white">
                  <CloudDownload className="w-4 h-4 mr-2" />
                  Tarik Saldo
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Saldo Estimasi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">Rp0</div>
                    <p className="text-sm text-gray-500">
                      Saldo Estimasi adalah Perkiraan Jumlah Uang yang akan Kamu
                      Dapatkan
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>Saldo Aktif</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">Rp0</div>
                    <p className="text-sm text-gray-500">
                      Saldo Aktif adalah Saldo yang Dapat Kamu Tarik ke Rekening
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <DataTable
                  columns={columns}
                  data={data}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LaporanMutasiSaldo;
