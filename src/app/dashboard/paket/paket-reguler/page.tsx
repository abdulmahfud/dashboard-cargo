"use client";

import { AppSidebar } from "@/components/app-sidebar";
import CalculationResults from "@/components/PaketReguler/CalculationResults";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import RegularPackageForm from "../../../../components/PaketReguler/RegularPackageForm";

const PaketReguler = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [calculationResult, setCalculationResult] = useState<
    Record<string, unknown> | undefined
  >(undefined);
  const [formData, setFormData] = useState<{
    itemValue?: string;
    paymentMethod?: string;
  }>({});

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
        <div className="flex flex-col flex-1 bg-blue-100">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <main className="container flex-1">
                <div
                  id="app-container"
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <div className="flex flex-col mx-2">
                    <RegularPackageForm
                      onResult={(result) => {
                        setCalculationResult(result);
                        setIsSearching(false);
                      }}
                      setIsSearching={setIsSearching}
                      onFormDataChange={setFormData}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <Card className="h-full mx-2 border shadow-sm border-muted rounded-xl">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Pilih Ekspedisi
                        </CardTitle>

                        {/* <Select>
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
                        </Select> */}
                      </CardHeader>

                      <CardContent className="flex items-center justify-center">
                        {isSearching ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-60"
                          >
                            <div className="w-12 h-12 border-4 border-blue-300 rounded-full border-t-blue-600 animate-spin"></div>
                            <p className="mt-4 text-sm text-gray-500">
                              Mencari layanan pengiriman...
                            </p>
                          </motion.div>
                        ) : calculationResult ? (
                          <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col w-full"
                          >
                            <CalculationResults
                              isSearching={isSearching}
                              result={calculationResult}
                              formData={formData}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4 text-center"
                          >
                            <Image
                              src="/images/card.png"
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

export default PaketReguler;
