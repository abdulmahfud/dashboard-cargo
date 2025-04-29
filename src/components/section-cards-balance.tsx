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
        <div className="absolute pt-5 pr-5 top-2 right-2">
          <DatePickerWithRange />
        </div>
        <div className="flex items-center py-3 pt-12 pl-5">
          <Image
            src="/images/wallet.png"
            alt="delivery"
            width={50}
            height={50}
            priority
            className="rounded-full bg-blue-100 py-1.5 px-1.5"
          />
          <CardTitle className="pl-2 text-sm font-semibold md:text-2xl tabular-nums">
            Saldo Akun
          </CardTitle>
        </div>

        <div className="grid grid-cols-1 gap-3 px-2 md:grid-cols-4 lg:px-4">
          <Card
            className="relative grid items-center grid-cols-1 col-span-1 p-4 overflow-hidden border-none shadow-none md:grid-cols-2 bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-2xl md:col-span-2"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
              style={{ backgroundImage: "url('/images/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="relative z-10 flex items-center p-4">
              <Wallet size={55} className="p-1 text-yellow-700 rounded-full" />
              <div className="ml-2">
                <CardHeader className="relative p-2 mt-0 mb-0">
                  <CardDescription className="text-xl font-bold text-yellow-700">
                    Total Saldo
                  </CardDescription>
                  <CardTitle className="text-xl font-bold text-yellow-700 md:text-lg tabular-nums">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>

            {/* Tombol */}
            <div className="relative z-10 flex flex-col items-end gap-2 p-3">
              <Button className="w-2/4 h-12 px-5 py-3 text-lg rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-300">
                Tarik Saldo
              </Button>
              <Button
                variant={"outline"}
                className="w-2/4 h-12 px-5 py-3 text-lg text-blue-500 border-2 border-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
              >
                Riwayat
              </Button>
            </div>
          </Card>

          <Card
            className="relative flex items-center justify-start p-5 overflow-hidden border-none shadow-none bg-gradient-to-r from-purple-100 to-purple-300 rounded-2xl"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
              style={{ backgroundImage: "url('/images/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="relative z-10 flex items-center">
              <TrendingUpDown
                size={55}
                className="p-1 text-purple-500 rounded-full"
              />
              <div className="ml-2">
                <CardHeader className="relative p-2 mt-0 mb-0">
                  <CardDescription className="py-0 text-lg font-bold text-purple-700">
                    Estimasi
                  </CardDescription>
                  <CardTitle className="text-xl font-semibold text-purple-700 md:text-lg tabular-nums">
                    0
                  </CardTitle>
                </CardHeader>
              </div>
            </div>
          </Card>

          <Card
            className="relative flex items-center justify-start p-5 overflow-hidden border-none shadow-none bg-gradient-to-r from-orange-100 to-orange-300 rounded-2xl"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
              style={{ backgroundImage: "url('/images/shape-square.svg')" }}
            />

            {/* Konten */}
            <div className="relative z-10 flex items-center">
              <RefreshCcwDot
                size={55}
                className="p-1 text-orange-500 rounded-full"
              />
              <div className="ml-2">
                <CardHeader className="relative p-2 mt-0 mb-0">
                  <CardDescription className="py-0 text-lg font-semibold text-orange-700">
                    Belum di Kurir
                  </CardDescription>
                  <CardTitle className="text-xl font-semibold text-orange-700 md:text-lg tabular-nums">
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
