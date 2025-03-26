"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUserTop } from "@/components/nav-user-top";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { CirclePlus, TextSearch } from "lucide-react";

import ZipResults from "@/components/CekKodePos/ZipResults";
import ZipCodeForm from "@/components/CekKodePos/ZipCodeForm";
import { useIsMobile } from "@/lib/useIsMobile";

const dataProfil = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/image/profil.png",
  },
};

type ZipCode = {
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  postalCode: string;
};

export default function CekKodePos() {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedZip, setSelectedZip] = useState<ZipCode | null>(null);

  // Handle proses pencarian kode pos
  const handleSelectZip = (zip: ZipCode) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedZip(zip);
      setIsLoading(false);
    }, 1000); // Simulasi delay untuk efek loading
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <SiteHeader />
          </div>
          <div className="flex items-center flex-shrink-0">
            <Button className="bg-blue-500 hover:bg-blue-700 mr-1">
              <CirclePlus /> Kirim Paket
            </Button>
            {!isMobile && <NavUserTop user={dataProfil.user} />}
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex flex-1 flex-col bg-blue-100">
          <div className="flex flex-col gap-4">
            <main className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Form Pencarian */}
                <div className="flex flex-col mx-2 h-80">
                  <ZipCodeForm onSelectZip={handleSelectZip} />
                </div>

                {/* Hasil Pencarian */}
                <AnimatePresence mode="wait">
                  <Card className="border border-muted rounded-xl shadow-sm mx-2 h-80">
                    <CardContent className="h-full flex items-center justify-center">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-80"
                        >
                          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                          <p className="mt-4 text-gray-500 text-sm">
                            Mencari kode pos...
                          </p>
                        </motion.div>
                      ) : selectedZip ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col w-full"
                        >
                          <ZipResults selectedZip={selectedZip} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center text-center gap-4"
                        >
                          <TextSearch
                            size={70}
                            className="text-blue-500 bg-blue-200 rounded-full px-2 py-2"
                          />
                          <h2 className="text-2xl font-semibold">
                            Temukan Kode Pos
                          </h2>
                          <p className="text-sm text-gray-600 font-semibold">
                            Yuk isikan form di samping untuk mendapatkan kode
                            pos alamat tujuan kamu.
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
