import React from 'react'
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NavUserTop } from "@/components/nav-user-top";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useIsMobile } from "@/lib/useIsMobile";

const dataProfil = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/image/profil.png",
  },
};

export default function PengirimanKu() {
  const isMobile = useIsMobile(); 
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
        <div className="flex flex-1 flex-col bg-blue-200">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6 bg-blue-100"></div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
