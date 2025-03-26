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
      <Card className="@container/card px-4 py-8 relative">
        {/* Date Picker di pojok kanan atas */}
        <div className="absolute top-2 right-2 pr-5 pt-5">
          <DatePickerWithRange />
        </div>
        <div className="flex items-center pl-5 py-3 pt-12">
          <Image
            src="/image/wallet.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-100 py-1.5 px-1.5"
          />
          <CardTitle className="text-sm md:text-2xl font-semibold tabular-nums pl-2">
            Saldo Akun
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 px-2 lg:px-4">
          <Card
            className="p-4 col-span-2 flex justify-between items-start 
                 bg-gradient-to-r from-yellow-100 to-yellow-300 
                 relative overflow-hidden rounded-2xl shadow-none border-none"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url('/image/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="flex items-center p-4 relative z-10">
              <Wallet size={55} className="text-yellow-500 p-1 rounded-full" />
              <div className="ml-2">
                <CardHeader className="relative mt-0 mb-0 p-2">
                  <CardDescription className="text-xl text-yellow-700 font-bold">
                    Total Saldo Aktif
                  </CardDescription>
                  <CardTitle className="text-xl text-yellow-700 md:text-lg font-bold tabular-nums">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>

            {/* Tombol */}
            <div className="flex flex-col gap-2 p-3 relative z-10">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-300 px-5 py-3 text-lg rounded-2xl">
                Tarik Saldo
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-300 px-5 py-3 text-lg rounded-2xl">
                Riwayat
              </Button>
            </div>
          </Card>

          <Card
            className="flex items-center justify-start p-5 
                 bg-gradient-to-r from-purple-100 to-purple-300 
                 relative overflow-hidden rounded-2xl shadow-none border-none"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url('/image/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="flex items-center relative z-10">
              <TrendingUpDown
                size={55}
                className="text-purple-500 p-1 rounded-full"
              />
              <div className="ml-2">
                <CardHeader className="relative mt-0 mb-0 p-2">
                  <CardDescription className="text-lg py-0 font-bold text-purple-700">
                    Estimasi
                  </CardDescription>
                  <CardTitle className="text-xl md:text-lg font-semibold tabular-nums text-purple-700">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>
          </Card>

          <Card
            className="flex items-center justify-start p-5 
                 bg-gradient-to-r from-orange-100 to-orange-300 
                 relative overflow-hidden rounded-2xl shadow-none border-none"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url('/image/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="flex items-center relative z-10">
              <RefreshCcwDot
                size={55}
                className="text-orange-500 p-1 rounded-full"
              />
              <div className="ml-2">
                <CardHeader className="relative mt-0 mb-0 p-2">
                  <CardDescription className="text-lg py-0 font-semibold text-orange-700">
                    Belum di Kurir
                  </CardDescription>
                  <CardTitle className="text-xl md:text-lg font-semibold tabular-nums text-orange-700">
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
