"use client";

import {
  Box,
  Vault,
  Truck,
  PackageCheck,
  PackageX,
  PackageMinus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { getOrderStatistics } from "@/lib/apiClient";

interface RegularStats {
  totalPaket: number;
  prosesPengiriman: number;
  kendalaPengiriman: number;
  sampaiTujuan: number;
  totalRetur: number;
  dibatalkan: number;
}

export function SectionCardsReguler() {
  // Set date range to current month only
  const currentDate = new Date();
  const [dateRange] = useState({
    from: startOfMonth(currentDate),
    to: endOfMonth(currentDate),
  });

  const [stats, setStats] = useState<RegularStats>({
    totalPaket: 0,
    prosesPengiriman: 0,
    kendalaPengiriman: 0,
    sampaiTujuan: 0,
    totalRetur: 0,
    dibatalkan: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegularStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined;
      const endDate = dateRange?.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : undefined;

      // Use the new efficient statistics API
      const response = await getOrderStatistics(startDate, endDate);
      const regularPackageStats = response.data.regular_package_stats;

      const newStats: RegularStats = {
        totalPaket: regularPackageStats.total,
        prosesPengiriman: regularPackageStats.proses_pengiriman,
        kendalaPengiriman: regularPackageStats.kendala_pengiriman,
        sampaiTujuan: regularPackageStats.sampai_tujuan,
        totalRetur: regularPackageStats.retur,
        dibatalkan: regularPackageStats.dibatalkan,
      };

      setStats(newStats);
    } catch (err) {
      console.error("Failed to fetch regular package statistics:", err);
      setError("Failed to fetch regular package statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegularStats();
  }, []);

  if (error) {
    console.error("Error in SectionCardsReguler:", error);
  }

  return (
    <>
      <Card className="@container/card px-4 py-8 relative">
        <div className="flex items-center py-3 pt-12 pl-5">
          <Image
            src="/images/delivery.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-200 py-1.5 px-1.5"
          />
          <CardTitle className="pl-2 text-xl font-semibold md:text-2xl tabular-nums">
            Ringkasan Paket Reguler
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 gap-3 px-2 md:grid-cols-3 lg:px-4">
          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <Box
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Total Paket
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.totalPaket.toLocaleString()}
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
            <Vault
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Kendala Pengiriman
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg group-hover:text-blue-700 tabular-nums">
                  {loading ? "..." : stats.kendalaPengiriman.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <PackageCheck
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Sampai Tujuan
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg group-hover:text-blue-700 tabular-nums">
                  {loading ? "..." : stats.sampaiTujuan.toLocaleString()}
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
                <CardTitle className="text-sm font-semibold md:text-lg group-hover:text-blue-700 tabular-nums">
                  {loading ? "..." : stats.totalRetur.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <PackageMinus
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Dibatalkan
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg group-hover:text-blue-700 tabular-nums">
                  {loading ? "..." : stats.dibatalkan.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
}
