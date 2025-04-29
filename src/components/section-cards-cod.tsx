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
        <div className="absolute pt-5 pr-5 top-2 right-2">
          <DatePickerWithRange />
        </div>

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
                  0
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
                  0
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
                  0
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
                  0
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
