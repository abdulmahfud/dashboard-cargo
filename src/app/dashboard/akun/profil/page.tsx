"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const Profil = () => {
  const [formData, setFormData] = useState({
    originAddress: "",
    destinationAddress: "",
    weight: "1000",
    length: "10",
    width: "10",
    height: "10",
    paymentMethod: "non-cod",
    useInsurance: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
              <form onSubmit={handleSubmit} className="animate-slide-down">
                <Card className="shadow-sm">
                  <CardContent className="flex items-center gap-4 py-4">
                    <Avatar className="w-14 h-14 bg-purple-600 text-white">
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">
                        abd mahfud wachid
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Bergabung sejak 21/09/2023
                      </p>
                    </div>
                  </CardContent>
                  <CardHeader className="p-3 mt-3 ml-3">
                    <CardTitle className="text-lg font-semibold">
                      Ubah Data Diri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="originAddress"
                          className="text-shipping-label"
                        >
                          Nama<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="originAddress"
                          placeholder="Mancar, Peterongan, Jombang, Jawa Timur, 61481"
                          value={formData.originAddress}
                          onChange={(e) =>
                            handleChange("originAddress", e.target.value)
                          }
                          className="bg-white placeholder:text-shipping-placeholder"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="destinationAddress"
                          className="text-shipping-label"
                        >
                          Nama Toko<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="destinationAddress"
                          placeholder="Sidoharjo (Sidoarjo), Tolangohula, Gorontalo, Gorontalo"
                          value={formData.destinationAddress}
                          onChange={(e) =>
                            handleChange("destinationAddress", e.target.value)
                          }
                          className="bg-white placeholder:text-shipping-placeholder"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardHeader className="p-3 mt-3 ml-3">
                    <CardTitle className="text-lg font-semibold">
                      Informasi Lain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="originAddress"
                          className="text-shipping-label"
                        >
                          Nama Sesuai Identitas
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="originAddress"
                          placeholder="Mancar, Peterongan, Jombang, Jawa Timur, 61481"
                          value={formData.originAddress}
                          onChange={(e) =>
                            handleChange("originAddress", e.target.value)
                          }
                          className="bg-white placeholder:text-shipping-placeholder"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="destinationAddress"
                          className="text-shipping-label"
                        >
                          Nomor Identitas
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="destinationAddress"
                          placeholder="Sidoharjo (Sidoarjo), Tolangohula, Gorontalo, Gorontalo"
                          value={formData.destinationAddress}
                          onChange={(e) =>
                            handleChange("destinationAddress", e.target.value)
                          }
                          className="bg-white placeholder:text-shipping-placeholder"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="destinationAddress"
                          className="text-shipping-label"
                        >
                          Email<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="destinationAddress"
                          placeholder="Sidoharjo (Sidoarjo), Tolangohula, Gorontalo, Gorontalo"
                          value={formData.destinationAddress}
                          onChange={(e) =>
                            handleChange("destinationAddress", e.target.value)
                          }
                          className="bg-white placeholder:text-shipping-placeholder"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="destinationAddress"
                          className="text-shipping-label"
                        >
                          Nomor HP
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="destinationAddress"
                          placeholder="Sidoharjo (Sidoarjo), Tolangohula, Gorontalo, Gorontalo"
                          value={formData.destinationAddress}
                          onChange={(e) =>
                            handleChange("destinationAddress", e.target.value)
                          }
                          className="bg-white placeholder:text-shipping-placeholder"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profil;
