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
        <div className="absolute top-2 right-2 pr-5 pt-5">
          <DatePickerWithRange />
        </div>

        <div className="flex items-center pl-5 py-3 pt-12">
          <Image
            src="/image/alarm.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-200 py-1.5 px-1.5"
          />
          <CardTitle className="text-xl md:text-2xl font-semibold tabular-nums pl-2">
            Ringkasan Paket Bermasalah
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-2 lg:px-4">
          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcw
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Tidak ada update 4-7 hari
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcw
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Tidak ada update 8-30 hari
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcw
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Tidak ada update {">"} 30 hari
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
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
