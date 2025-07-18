"use client";

import { RefreshCcw } from "lucide-react";
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

interface TroubleStats {
  noUpdate4to7Days: number;
  noUpdate8to30Days: number;
  noUpdateOver30Days: number;
}

export function SectionCardsTrouble() {
  const [dateRange] = useState({
    from: addDays(new Date(), -30), // Last 30 days
    to: new Date(),
  });
  const [stats, setStats] = useState<TroubleStats>({
    noUpdate4to7Days: 0,
    noUpdate8to30Days: 0,
    noUpdateOver30Days: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTroubleStats = async () => {
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
      const troubleStats = response.data.trouble_stats;

      const newStats: TroubleStats = {
        noUpdate4to7Days: troubleStats.no_update_4_to_7_days,
        noUpdate8to30Days: troubleStats.no_update_8_to_30_days,
        noUpdateOver30Days: troubleStats.no_update_over_30_days,
      };

      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch trouble statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTroubleStats();
  }, []);

  return (
    <>
      <Card className="@container/card px-4 py-8 relative">
        <div className="flex items-center py-3 pt-12 pl-5">
          <Image
            src="/images/alarm.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-200 py-1.5 px-1.5"
          />
          <CardTitle className="pl-2 text-xl font-semibold md:text-2xl tabular-nums">
            Ringkasan Paket Bermasalah
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 gap-3 px-2 md:grid-cols-3 lg:px-4">
          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcw
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Tidak ada update 4-7 hari
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.noUpdate4to7Days.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcw
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Tidak ada update 8-30 hari
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.noUpdate8to30Days.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcw
              size={50}
              className="p-1 text-blue-500 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-700 group-hover:text-white"
            />
            <div className="ml-1">
              <CardHeader className="relative p-2 mt-0 mb-0">
                <CardDescription className="py-0 text-sm font-semibold transition-all duration-300 group-hover:text-blue-700">
                  Tidak ada update {">"} 30 hari
                </CardDescription>
                <CardTitle className="text-sm font-semibold md:text-lg tabular-nums group-hover:text-blue-700">
                  {loading ? "..." : stats.noUpdateOver30Days.toLocaleString()}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
}
