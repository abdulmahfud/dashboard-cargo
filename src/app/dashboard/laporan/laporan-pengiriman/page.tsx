"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Boxes,
  CheckCircle,
  CloudDownload,
  Info,
  LayoutGrid,
  Package,
  Package2,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { columns } from "./columns";
import { DataTable } from "./data-table";

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

const dataReport: DeliveryReport[] = [
  {
    createdAt: "2025-03-21",
    shipmentNo: "KP-100001",
    packageType: "Paket Reguler",
    recipient: "Andi Wijaya",
    courierService: "JNE - Reguler",
    totalShipment: 150000,
    shippingMethod: "COD",
    status: "Sampai Tujuan",
  },
  {
    createdAt: "2025-03-20",
    shipmentNo: "KP-100002",
    packageType: "Paket Instant",
    recipient: "Budi Santoso",
    courierService: "Grab Express",
    totalShipment: 50000,
    shippingMethod: "Non COD",
    status: "Proses",
  },
  {
    createdAt: "2025-03-19",
    shipmentNo: "KP-100003",
    packageType: "COD",
    recipient: "Citra Lestari",
    courierService: "SiCepat - Best",
    totalShipment: 175000,
    shippingMethod: "COD",
    status: "Masalah Kirim",
  },
  {
    createdAt: "2025-03-18",
    shipmentNo: "KP-100004",
    packageType: "Paket Reguler",
    recipient: "Doni Saputra",
    courierService: "J&T Express",
    totalShipment: 100000,
    shippingMethod: "Non COD",
    status: "Retur",
  },
  {
    createdAt: "2025-03-17",
    shipmentNo: "KP-100005",
    packageType: "Paket Instant",
    recipient: "Eka Ramadhan",
    courierService: "Gojek - GoSend",
    totalShipment: 65000,
    shippingMethod: "COD",
    status: "Dibatalkan",
  },
  {
    createdAt: "2025-03-16",
    shipmentNo: "KP-100006",
    packageType: "Non COD",
    recipient: "Fajar Pratama",
    courierService: "Ninja Xpress",
    totalShipment: 120000,
    shippingMethod: "Non COD",
    status: "Belum di Expedisi",
  },
  {
    createdAt: "2025-03-15",
    shipmentNo: "KP-100007",
    packageType: "Paket Reguler",
    recipient: "Gita Maharani",
    courierService: "TIKI - ONS",
    totalShipment: 89000,
    shippingMethod: "COD",
    status: "Sampai Tujuan",
  },
  {
    createdAt: "2025-03-14",
    shipmentNo: "KP-100008",
    packageType: "Paket Instant",
    recipient: "Hadi Setiawan",
    courierService: "AnterAja - Same Day",
    totalShipment: 75000,
    shippingMethod: "Non COD",
    status: "Proses",
  },
  {
    createdAt: "2025-03-13",
    shipmentNo: "KP-100009",
    packageType: "COD",
    recipient: "Indah Permata",
    courierService: "JNE - YES",
    totalShipment: 132000,
    shippingMethod: "COD",
    status: "Masalah Kirim",
  },
  {
    createdAt: "2025-03-12",
    shipmentNo: "KP-100010",
    packageType: "Paket Reguler",
    recipient: "Joko Susanto",
    courierService: "J&T Express",
    totalShipment: 98000,
    shippingMethod: "Non COD",
    status: "Retur",
  },
  {
    createdAt: "2025-03-11",
    shipmentNo: "KP-100011",
    packageType: "Paket Instant",
    recipient: "Kurniawati",
    courierService: "Gojek - GoSend",
    totalShipment: 70000,
    shippingMethod: "COD",
    status: "Dibatalkan",
  },
  {
    createdAt: "2025-03-10",
    shipmentNo: "KP-100012",
    packageType: "Non COD",
    recipient: "Lukman Hakim",
    courierService: "Ninja Xpress",
    totalShipment: 135000,
    shippingMethod: "Non COD",
    status: "Belum di Expedisi",
  },
  {
    createdAt: "2025-03-09",
    shipmentNo: "KP-100013",
    packageType: "Paket Reguler",
    recipient: "Mila Safitri",
    courierService: "TIKI - Reguler",
    totalShipment: 86000,
    shippingMethod: "COD",
    status: "Sampai Tujuan",
  },
  {
    createdAt: "2025-03-08",
    shipmentNo: "KP-100014",
    packageType: "Paket Instant",
    recipient: "Naufal Rizki",
    courierService: "AnterAja - Next Day",
    totalShipment: 92000,
    shippingMethod: "Non COD",
    status: "Proses",
  },
  {
    createdAt: "2025-03-07",
    shipmentNo: "KP-100015",
    packageType: "COD",
    recipient: "Oktaviani Putri",
    courierService: "JNE - OKE",
    totalShipment: 110000,
    shippingMethod: "COD",
    status: "Masalah Kirim",
  },
  {
    createdAt: "2025-03-06",
    shipmentNo: "KP-100016",
    packageType: "Paket Reguler",
    recipient: "Purnama Dewi",
    courierService: "J&T Express",
    totalShipment: 94000,
    shippingMethod: "Non COD",
    status: "Retur",
  },
  {
    createdAt: "2025-03-05",
    shipmentNo: "KP-100017",
    packageType: "Paket Instant",
    recipient: "Qori Ananda",
    courierService: "Grab Express",
    totalShipment: 50000,
    shippingMethod: "COD",
    status: "Dibatalkan",
  },
  {
    createdAt: "2025-03-04",
    shipmentNo: "KP-100018",
    packageType: "Non COD",
    recipient: "Rahmat Saputra",
    courierService: "Ninja Xpress",
    totalShipment: 123000,
    shippingMethod: "Non COD",
    status: "Belum di Expedisi",
  },
  {
    createdAt: "2025-03-03",
    shipmentNo: "KP-100019",
    packageType: "Paket Reguler",
    recipient: "Siti Aisyah",
    courierService: "TIKI - ONS",
    totalShipment: 87000,
    shippingMethod: "COD",
    status: "Sampai Tujuan",
  },
  {
    createdAt: "2025-03-02",
    shipmentNo: "KP-100020",
    packageType: "Paket Instant",
    recipient: "Taufik Hidayat",
    courierService: "AnterAja - Same Day",
    totalShipment: 77000,
    shippingMethod: "Non COD",
    status: "Proses",
  },
];

const data = [
  {
    label: "Total Pengiriman",
    value: 65,
    icon: (
      <LayoutGrid
        size={30}
        className="bg-blue-200 text-blue-500 rounded-full p-1"
      />
    ),
    percentage: null,
  },
  {
    label: "Paket Reguler",
    value: 105,
    icon: (
      <Package
        size={30}
        className="bg-blue-200 text-blue-500 rounded-full p-1"
      />
    ),
    percentage: 20,
  },
  {
    label: "Paket Instant",
    value: 45,
    icon: (
      <Truck size={30} className="bg-blue-200 text-blue-500 rounded-full p-1" />
    ),
    percentage: 65,
  },
  {
    label: "COD",
    value: 705,
    icon: (
      <Package2
        size={30}
        className="bg-blue-200 text-blue-500 rounded-full p-1"
      />
    ),
    percentage: 24,
  },
  {
    label: "Non COD",
    value: 65,
    icon: (
      <Boxes size={30} className="bg-blue-200 text-blue-500 rounded-full p-1" />
    ),
    percentage: 54,
  },
];

const statusData = [
  {
    label: "Sampai Tujuan",
    value: 5,
    icon: <CheckCircle size={20} className="text-green-500" />,
    percentage: 35,
  },
  {
    label: "Belum Di Ekspedisi",
    value: 25,
    icon: <Info size={20} className="text-blue-500" />,
    percentage: 65,
  },
  {
    label: "Proses",
    value: 65,
    icon: <Truck size={20} className="text-blue-500" />,
    percentage: 25,
  },
  {
    label: "Masalah Kirim",
    value: 65,
    icon: <XCircle size={20} className="text-red-500" />,
    percentage: 35,
  },
  {
    label: "Retur",
    value: 5,
    icon: <RefreshCw size={20} className="text-blue-500" />,
    percentage: 54,
  },
  {
    label: "Dibatalkan",
    value: 6,
    icon: <XCircle size={20} className="text-red-600" />,
    percentage: 63,
  },
];

const LaporanPengiriman = () => {
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [packageTypeFilter, setPackageTypeFilter] =
    useState<string>("Semua Status");

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
                <h2 className="text-lg font-bold">Laporan Pengiriman</h2>
                <Button className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white">
                  <CloudDownload className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
              {/* Kartu Statistik Pengiriman */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {data.map((item, index) => (
                  <Card key={index} className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </CardTitle>
                      {item.percentage !== null && (
                        <span className="text-sm text-blue-700 rounded-full bg-blue-100 px-1 py-2">
                          {item.percentage}%
                        </span>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{item.value}</p>
                      {item.percentage !== null && (
                        <Progress value={item.percentage} />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Kartu Status Pengiriman */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {statusData.map((status, index) => (
                  <Card key={index} className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        {status.icon}
                        {status.label}
                      </CardTitle>
                      <span className="text-sm text-blue-700 rounded-full bg-blue-100 px-1 py-2">
                        {status.percentage}%
                      </span>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{status.value}</p>
                      <Progress value={status.percentage} />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <DataTable
                  columns={columns}
                  data={dataReport}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  packageTypeFilter={packageTypeFilter}
                  setPackageTypeFilter={setPackageTypeFilter}
                />
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LaporanPengiriman;
