"use client";

import { BookX, Boxes, PackageX, RefreshCcwDot, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { getOrderStatistics } from "@/lib/apiClient";

interface CODStats {
  belumDiEkspedisi: number;
  prosesPengiriman: number;
  sampaiTujuan: number;
  kendalaPengiriman: number;
  totalRetur: number;
}

export function SectionCardsCod() {
  const [dateRange] = useState({
    from: addDays(new Date(), -30), // Last 30 days
    to: new Date(),
  });
  const [stats, setStats] = useState<CODStats>({
    belumDiEkspedisi: 0,
    prosesPengiriman: 0,
    sampaiTujuan: 0,
    kendalaPengiriman: 0,
    totalRetur: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCODStats = async () => {
    try {
      setLoading(true);
      const startDate = dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined;
      const endDate = dateRange?.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : undefined;

      // Use the new efficient statistics API
      const response = await getOrderStatistics(startDate, endDate);
      const codPackageStats = response.data.cod_package_stats;

      const newStats: CODStats = {
        belumDiEkspedisi:
          codPackageStats.belum_di_expedisi + codPackageStats.belum_proses,
        prosesPengiriman: codPackageStats.proses_pengiriman,
        sampaiTujuan: codPackageStats.sampai_tujuan,
        kendalaPengiriman: codPackageStats.kendala_pengiriman,
        totalRetur: codPackageStats.retur,
      };

      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch COD statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCODStats();
  }, []);

  return (
    <>
      <Card className="@container/card px-4 py-8 relative">
        <div className="flex items-center py-3 pt-12 pl-5">
          <Image
            src="/images/cod.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-200 py-1.5 px-1.5"
          />
          <CardTitle className="pl-2 text-xl font-semibold md:text-2xl tabular-nums">
            Ringkasan Paket COD
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 gap-3 px-2 md:grid-cols-5 lg:px-4">
          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <BookX
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Belum di Ekspedisi
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.belumDiEkspedisi.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <Truck
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Proses Pengiriman
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.prosesPengiriman.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcwDot
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Sampai Tujuan
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.sampaiTujuan.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <Boxes
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Kendala Pengiriman
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.kendalaPengiriman.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <PackageX
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Total Retur
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.totalRetur.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
}
