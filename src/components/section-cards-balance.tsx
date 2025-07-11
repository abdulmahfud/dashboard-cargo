import { Wallet, RefreshCcwDot, TrendingUpDown } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { DatePickerWithRange } from "./date-picker-with-range";
import { Button } from "./ui/button";

export function SectionCardsBalance() {
  return (
    <>
      <Card className="@container/card px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative">
        {/* Date Picker di pojok kanan atas */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-20">
          <DatePickerWithRange />
        </div>
        
        {/* Header Section */}
        <div className="flex items-center py-2 sm:py-3 lg:py-4 pt-12 sm:pt-14 lg:pt-16 pl-2 sm:pl-3 lg:pl-5">
          <Image
            src="/images/wallet.png"
            alt="delivery"
            width={40}
            height={40}
            priority
            className="sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-blue-100 p-1.5 sm:p-2"
          />
          <CardTitle className="pl-2 sm:pl-3 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold tabular-nums">
            Saldo Akun
          </CardTitle>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-3 lg:px-4 mt-4 sm:mt-6">
          {/* Balance Card */}
          <Card className="relative flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 col-span-1 lg:col-span-2 p-3 sm:p-4 lg:p-5 overflow-hidden border-none shadow-lg sm:shadow-xl bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
              style={{ backgroundImage: "url('/images/shape-square.svg')" }}
            />

            {/* Konten Saldo */}
            <div className="relative z-10 flex items-center p-2 sm:p-3 lg:col-span-2">
              <Wallet size={40} className="sm:w-12 sm:h-12 lg:w-16 lg:h-16 p-1 text-yellow-700 rounded-full flex-shrink-0" />
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <CardHeader className="relative p-1 sm:p-2 mt-0 mb-0">
                  <CardDescription className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-yellow-700">
                    Total Saldo
                  </CardDescription>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-yellow-700 tabular-nums">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>

            {/* Tombol */}
            <div className="relative z-10 flex flex-col lg:flex-col justify-center lg:justify-end items-center gap-2 sm:gap-3 lg:gap-2 p-2 sm:p-3">
              <Button className="w-full lg:w-full h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-5 py-2 text-xs sm:text-sm lg:text-base font-medium rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
                Tarik Saldo
              </Button>
              <Button
                variant="outline"
                className="w-full lg:w-full h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-5 py-2 text-xs sm:text-sm lg:text-base font-medium text-blue-500 border-2 border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
              >
                Riwayat
              </Button>
            </div>
          </Card>

          {/* Estimasi Card */}
          <Card className="relative flex items-center justify-start p-3 sm:p-4 lg:p-5 overflow-hidden border-none shadow-lg sm:shadow-xl bg-gradient-to-r from-purple-100 to-purple-300 rounded-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
              style={{ backgroundImage: "url('/images/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="relative z-10 flex items-center w-full">
              <TrendingUpDown
                size={40}
                className="sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 p-1 text-purple-500 rounded-full flex-shrink-0"
              />
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <CardHeader className="relative p-1 sm:p-2 mt-0 mb-0">
                  <CardDescription className="py-0 text-sm sm:text-base lg:text-lg font-bold text-purple-700 truncate">
                    Estimasi
                  </CardDescription>
                  <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700 tabular-nums">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>
          </Card>

          {/* Belum di Kurir Card */}
          <Card className="relative flex items-center justify-start p-3 sm:p-4 lg:p-5 overflow-hidden border-none shadow-lg sm:shadow-xl bg-gradient-to-r from-orange-100 to-orange-300 rounded-2xl">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
              style={{ backgroundImage: "url('/images/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="relative z-10 flex items-center w-full">
              <RefreshCcwDot
                size={40}
                className="sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 p-1 text-orange-500 rounded-full flex-shrink-0"
              />
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <CardHeader className="relative p-1 sm:p-2 mt-0 mb-0">
                  <CardDescription className="py-0 text-sm sm:text-base lg:text-lg font-semibold text-orange-700 truncate">
                    Belum di Kurir
                  </CardDescription>
                  <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-orange-700 tabular-nums">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
}