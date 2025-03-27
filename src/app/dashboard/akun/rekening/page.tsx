"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
// import { useState } from "react";
import TopNav from "@/components/top-nav";

const Rekening = () => {
  // const [formData, setFormData] = useState({
  //   originAddress: "",
  //   destinationAddress: "",
  //   weight: "1000",
  //   length: "10",
  //   width: "10",
  //   height: "10",
  //   paymentMethod: "non-cod",
  //   useInsurance: false,
  // });

  // const handleChange = (field: string, value: string | boolean) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  // };

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
        <div className="flex flex-1 flex-col bg-blue-200">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <Card className="shadow-sm">
                <CardHeader className="p-3 mt-3 ml-3">
                  <CardTitle className="text-lg font-semibold">
                    Rekening Bank Kamu
                  </CardTitle>
                  <div>
                    <p className="text-gray-500 text-sm">
                      Saldo aktif kamu bisa ditarik ke rekening ini.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-4 py-4 pb-6">
                  <Image
                    src="/image/bca.png"
                    alt="bca"
                    width={100}
                    height={100}
                  />
                  <div>
                    <h2 className="text-lg font-semibold">BCA</h2>
                    <h2 className="text-lg font-semibold">1131236447</h2>
                    <p className="text-gray-500 text-sm">
                      a.n abd mahfud wachid
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Rekening;
