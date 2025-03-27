"use client";

import { AppSidebar } from "@/components/app-sidebar";
import TopNav from "@/components/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { columns, Pengiriman } from "./columns";
import { DataTable } from "./data-table";
import { SiteHeader } from "@/components/site-header";

const data: Pengiriman[] = [
  {
    id: "1",
    tanggalDibuat: "2024-03-22",
    noPengiriman: "INV-0001",
    penerima: "Budi Santoso",
    ekspedisi: "JNE / Reguler",
    totalPengiriman: "Rp100.000",
    metodePengiriman: "COD",
    status: "Sukses",
  },
  {
    id: "2",
    tanggalDibuat: "2024-03-21",
    noPengiriman: "INV-0002",
    penerima: "Siti Aminah",
    ekspedisi: "TIKI / ONS",
    totalPengiriman: "Rp200.000",
    metodePengiriman: "Transfer Bank",
    status: "Dalam Proses",
  },
  // tambahkan data lainnya sesuai kebutuhan
];

// const dataProfil = {
//   user: {
//     name: "User",
//     email: "user@example.com",
//     avatar: "/image/profil.png",
//   },
// };

export default function CetakResiMassal() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <SiteHeader />
          </div>
          <TopNav />
        </div>
        <div className="flex flex-1 flex-col bg-blue-100">
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
            <Card className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Cetak Resi Massal
              </CardTitle>

              {/* ✅ Cek apakah datanya kosong */}
              {data.length === 0 ? (
                <CardContent className="flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                  {/* Icon atau ilustrasi bebas */}
                  <div className="bg-blue-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/image/cod.png"
                      alt="list pengiriman paket"
                      width={100}
                      height={100}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Kamu belum ada pengiriman nih.
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Paketmu sudah siap? Kirim paketmu yuk!
                    </p>
                  </div>

                  <Button className="bg-blue-500 hover:bg-blue-700 mt-4">
                    <CirclePlus className="mr-2 h-4 w-4" /> Kirim Paket
                  </Button>
                </CardContent>
              ) : (
                // ✅ Kalau data ada, tampilkan DataTable
                <DataTable columns={columns} data={data} />
              )}
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
