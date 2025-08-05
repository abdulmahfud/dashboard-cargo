"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/top-nav";
import { DiscountManagement } from "@/components/DiskonPengiriman/DiscountManagement";

export default function DiskonPengirimanPage() {
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

        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Diskon Pengiriman
              </h1>
              <p className="text-muted-foreground">
                Kelola diskon ekspedisi untuk berbagai vendor dan layanan.
              </p>
            </div>

            <DiscountManagement />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
