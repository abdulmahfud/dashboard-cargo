"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Facebook, Instagram } from "lucide-react";
// import { useState } from "react";
import TopNav from "@/components/top-nav";

const SocialMedia = () => {
  // const [isLoading, setIsLoading] = useState(false);
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
                  <CardHeader className="p-3 mt-3 ml-3">
                    <CardTitle className="text-lg font-semibold">
                      Sosial Media
                    </CardTitle>
                    <CardDescription>
                      Tambahkan informasi sosial media kamu.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Instagram Input */}
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-base">
                          Instagram
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Instagram className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="text"
                            id="instagram"
                            placeholder="Masukan Username"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Facebook Input */}
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="text-base">
                          Facebook
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Facebook className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="text"
                            id="facebook"
                            placeholder="Masukan Username"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* TikTok Input */}
                      <div className="space-y-2">
                        <Label htmlFor="tiktok" className="text-base">
                          Tiktok
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                          </div>
                          <Input
                            type="text"
                            id="tiktok"
                            placeholder="Masukan Username"
                            className="pl-10"
                          />
                        </div>
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

export default SocialMedia;
