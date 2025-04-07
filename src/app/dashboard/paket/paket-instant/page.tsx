"use client";

import { AppSidebar } from "@/components/app-sidebar";
import CalculationResults from "@/components/PaketInstant/CalculationResults";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import InstantPackageForm from "../../../../components/PaketInstant/InstantPackageForm";
import TopNav from "@/components/top-nav";

const PaketInstant = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(true);
      setIsLoading(false);
    }, 800);
  };

  // Initialize the 'framer-motion' module for animations
  useEffect(() => {
    // This is just to ensure framer-motion is properly initialized
    const container = document.getElementById("app-container");
    if (container) {
      container.classList.add("motion-safe");
    }
  }, []);

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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <main className="flex-1 container">
                <div
                  id="app-container"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="flex flex-col mx-2">
                    <InstantPackageForm onSearch={handleSearch} />
                  </div>

                  <AnimatePresence mode="wait">
                    <Card className="border border-muted rounded-xl mx-2 shadow-sm h-full">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Pilih Ekspedisi
                        </CardTitle>

                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Harga Termurah" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="termurah">
                              Harga Termurah
                            </SelectItem>
                            <SelectItem value="tercepat">
                              Pengiriman Tercepat
                            </SelectItem>
                            <SelectItem value="rating">
                              Rating Tertinggi
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </CardHeader>

                      <CardContent className="min-h-[300px] flex items-center justify-center">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-60"
                          >
                            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500 text-sm">
                              Mencari layanan pengiriman...
                            </p>
                          </motion.div>
                        ) : isSearching ? (
                          <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col w-full"
                          >
                            <CalculationResults isSearching={isSearching} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center gap-4"
                          >
                            <Image
                              src="/image/card.png"
                              alt="Empty search illustration"
                              width={240}
                              height={240}
                              className="object-contain"
                            />
                            <p className="text-sm text-gray-600 forn-semibold">
                              Input dulu yuk data alamat paketnya..
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PaketInstant;
