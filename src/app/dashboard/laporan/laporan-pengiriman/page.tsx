"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  CheckCircle,
  CloudDownload,
  Info,
  LayoutGrid,
  Package,
  Package2,
  RefreshCw,
  Truck,
  XCircle,
  Hourglass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getOrders } from "@/lib/apiClient";
import {
  Order,
  DeliveryReport,
  STATUS_MAPPING,
  VENDOR_MAPPING,
} from "@/types/laporanPengiriman";

// Function to transform API data to table format
const transformOrderToDeliveryReport = (order: Order): DeliveryReport => {
  // Determine package type based on service_type_code
  let packageType: DeliveryReport["packageType"] = "Paket Reguler"; // Default value
  if (order.service_type_code === "COD") {
    packageType = "COD";
  } else if (order.service_type_code === "REGULER") {
    packageType = "Paket Reguler";
  } else if (order.service_type_code === "INSTANT") {
    packageType = "Paket Instant";
  }

  // Map vendor to courier service
  const courierService = VENDOR_MAPPING[order.vendor] || order.vendor;

  // Map status
  const status = STATUS_MAPPING[order.status] || order.status;

  // Determine shipping method based on service_type_code
  const shippingMethod: DeliveryReport["shippingMethod"] =
    order.service_type_code === "COD" ? "COD" : "REGULER";

  // Calculate total shipment from cod_value or item_value
  const totalShipment =
    parseFloat(order.cod_value) || parseFloat(order.item_value) || 0;

  // Format date
  const createdAt = new Date(order.created_at).toISOString().split("T")[0];

  return {
    createdAt,
    shipmentNo: order.awb_no || order.reference_no,
    packageType,
    recipient: order.receiver.name,
    courierService,
    totalShipment,
    shippingMethod,
    status,
  };
};

const LaporanPengiriman = () => {
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [packageTypeFilter, setPackageTypeFilter] =
    useState<string>("Semua Status");
  const [dataReport, setDataReport] = useState<DeliveryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrders();

        // Transform API data to table format
        const transformedData = response.data.map(
          transformOrderToDeliveryReport
        );
        setDataReport(transformedData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate statistics from real data
  const calculateStatistics = () => {
    const totalPengiriman = dataReport.length;
    const paketReguler = dataReport.filter(
      (item) => item.packageType === "Paket Reguler"
    ).length;
    const paketInstant = dataReport.filter(
      (item) => item.packageType === "Paket Instant"
    ).length;
    const cod = dataReport.filter(
      (item) => item.packageType === "COD" || item.shippingMethod === "COD"
    ).length;

    return {
      totalPengiriman,
      paketReguler,
      paketInstant,
      cod,
      paketRegulerPercentage:
        totalPengiriman > 0
          ? Math.round((paketReguler / totalPengiriman) * 100)
          : 0,
      paketInstantPercentage:
        totalPengiriman > 0
          ? Math.round((paketInstant / totalPengiriman) * 100)
          : 0,
      codPercentage:
        totalPengiriman > 0 ? Math.round((cod / totalPengiriman) * 100) : 0,
    };
  };

  const calculateStatusStatistics = () => {
    const statusCounts = {
      "Belum Proses": dataReport.filter(
        (item) => item.status === "Belum Proses"
      ).length,
      "Belum di Expedisi": dataReport.filter(
        (item) => item.status === "Belum di Expedisi"
      ).length,
      "Proses Pengiriman": dataReport.filter(
        (item) => item.status === "Proses Pengiriman"
      ).length,
      "Kendala Pengiriman": dataReport.filter(
        (item) => item.status === "Kendala Pengiriman"
      ).length,
      "Sampai Tujuan": dataReport.filter(
        (item) => item.status === "Sampai Tujuan"
      ).length,
      Retur: dataReport.filter((item) => item.status === "Retur").length,
      Dibatalkan: dataReport.filter((item) => item.status === "Dibatalkan")
        .length,
    };

    const total = dataReport.length;
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  };

  const stats = calculateStatistics();
  const statusStats = calculateStatusStatistics();

  // Updated data arrays using real statistics
  const data = [
    {
      label: "Total Pengiriman",
      value: stats.totalPengiriman,
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
      value: stats.paketReguler,
      icon: (
        <Package
          size={30}
          className="bg-blue-200 text-blue-500 rounded-full p-1"
        />
      ),
      percentage: stats.paketRegulerPercentage,
    },
    {
      label: "Paket Instant",
      value: stats.paketInstant,
      icon: (
        <Truck
          size={30}
          className="bg-blue-200 text-blue-500 rounded-full p-1"
        />
      ),
      percentage: stats.paketInstantPercentage,
    },
    {
      label: "COD",
      value: stats.cod,
      icon: (
        <Package2
          size={30}
          className="bg-blue-200 text-blue-500 rounded-full p-1"
        />
      ),
      percentage: stats.codPercentage,
    },
  ];

  const statusData = [
    {
      label: "Belum Proses",
      value: statusStats.find((s) => s.status === "Belum Proses")?.count || 0,
      icon: <Hourglass size={20} className="text-yellow-500" />,
      percentage:
        statusStats.find((s) => s.status === "Belum Proses")?.percentage || 0,
    },
    {
      label: "Belum di Expedisi",
      value:
        statusStats.find((s) => s.status === "Belum di Expedisi")?.count || 0,
      icon: <Info size={20} className="text-blue-500" />,
      percentage:
        statusStats.find((s) => s.status === "Belum di Expedisi")?.percentage ||
        0,
    },
    {
      label: "Proses Pengiriman",
      value:
        statusStats.find((s) => s.status === "Proses Pengiriman")?.count || 0,
      icon: <Truck size={20} className="text-blue-500" />,
      percentage:
        statusStats.find((s) => s.status === "Proses Pengiriman")?.percentage ||
        0,
    },
    {
      label: "Kendala Pengiriman",
      value:
        statusStats.find((s) => s.status === "Kendala Pengiriman")?.count || 0,
      icon: <XCircle size={20} className="text-red-500" />,
      percentage:
        statusStats.find((s) => s.status === "Kendala Pengiriman")
          ?.percentage || 0,
    },
    {
      label: "Sampai Tujuan",
      value: statusStats.find((s) => s.status === "Sampai Tujuan")?.count || 0,
      icon: <CheckCircle size={20} className="text-green-500" />,
      percentage:
        statusStats.find((s) => s.status === "Sampai Tujuan")?.percentage || 0,
    },
    {
      label: "Retur",
      value: statusStats.find((s) => s.status === "Retur")?.count || 0,
      icon: <RefreshCw size={20} className="text-blue-500" />,
      percentage:
        statusStats.find((s) => s.status === "Retur")?.percentage || 0,
    },
    {
      label: "Dibatalkan",
      value: statusStats.find((s) => s.status === "Dibatalkan")?.count || 0,
      icon: <XCircle size={20} className="text-red-600" />,
      percentage:
        statusStats.find((s) => s.status === "Dibatalkan")?.percentage || 0,
    },
  ];

  if (loading) {
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
                <div className="flex items-center justify-center h-64">
                  <div className="text-lg">Loading...</div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
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
                <div className="flex items-center justify-center h-64">
                  <div className="text-lg text-red-500">{error}</div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
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
