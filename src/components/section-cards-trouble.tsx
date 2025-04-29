import { RefreshCcw } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { DatePickerWithRange } from "./date-picker-with-range";

export function SectionCardsTrouble() {
  return (
    <>
      <Card className="@container/card px-4 py-8 relative">
        {/* Date Picker di pojok kanan atas */}
        <div className="absolute pt-5 pr-5 top-2 right-2">
          <DatePickerWithRange />
        </div>

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
                  0
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
                  0
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
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
}
