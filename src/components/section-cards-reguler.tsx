import {
  Box,
  Vault,
  Truck,
  PackageCheck,
  PackageX,
  PackageMinus,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { DatePickerWithRange } from "./date-picker-with-range";

export function SectionCardsReguler() {
  return (
    <>
      <Card className="@container/card px-4 py-8 relative">
        {/* Date Picker di pojok kanan atas */}
        <div className="absolute top-2 right-2 pr-5 pt-5">
          <DatePickerWithRange />
        </div>

        <div className="flex items-center pl-5 py-3 pt-12">
          <Image
            src="/image/delivery.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-200 py-1.5 px-1.5"
          />
          <CardTitle className="text-xl md:text-2xl font-semibold tabular-nums pl-2">
            Ringkasan Paket Reguler
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-2 lg:px-4">
          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <Box
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Total Paket
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
            <Vault
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Kendala Pengiriman
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold group-hover:text-blue-700 tabular-nums">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <PackageCheck
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Sampai Tujuan
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold group-hover:text-blue-700 tabular-nums">
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
                <CardTitle className="text-sm md:text-lg font-semibold group-hover:text-blue-700 tabular-nums">
                  0
                </CardTitle>
              </CardHeader>
            </div>
          </Card>

          <Card className="flex items-center justify-start p-2 hover:border-2 hover:border-blue-500 hover:bg-blue-200 group">
            <PackageMinus
              size={50}
              className="text-blue-500 bg-blue-100 p-1 rounded-full group-hover:bg-blue-700 group-hover:text-white transition-all duration-300"
            />
            <div className="ml-1">
              <CardHeader className="relative mt-0 mb-0 p-2">
                <CardDescription className="text-sm font-semibold py-0 group-hover:text-blue-700 transition-all duration-300">
                  Dibatalkan
                </CardDescription>
                <CardTitle className="text-sm md:text-lg font-semibold group-hover:text-blue-700 tabular-nums">
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
