import { BookX, Boxes, PackageX, RefreshCcwDot, Truck } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { DatePickerWithRange } from "./date-picker-with-range";

export function SectionCardsCod() {
  return (
    <>
      <Card className="@container/card px-4 py-8 relative">
        {/* Date Picker di pojok kanan atas */}
        <div className="absolute top-2 right-2 pr-5 pt-5">
          <DatePickerWithRange />
        </div>

        <div className="flex items-center pl-5 py-3 pt-12">
          <Image
            src="/image/cod.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-200 py-1.5 px-1.5"
          />
          <CardTitle className="text-xl md:text-2xl font-semibold tabular-nums pl-2">
            Ringkasan Paket COD
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 px-2 lg:px-4">
          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <BookX
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Belum di Ekspedisi
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <Truck
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Proses Pengiriman
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <RefreshCcwDot
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Sampai Tujuan
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <Boxes
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Kendala Pengiriman
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold tabular-nums group-hover:text-blue-700">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <PackageX
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Total Retur
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
