"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCardsCod } from "./../../components/section-cards-cod";
import { SectionCardsReguler } from "./../../components/section-cards-reguler";
import { SectionCardsTrouble } from "./../../components/section-cards-trouble";
import { SectionCardsBalance } from "./../../components/section-cards-balance";

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

export default function Dashboard() {
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
            <Button
              variant="outline"
              className="mr-2 rounded-2xl px-6 py-4 text-lg border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white"
            >
              <CirclePlus />
              Kirim Paket
            </Button>
            {!isMobile && <NavUserTop user={dataProfil.user} />}
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6 bg-blue-100">
              <div className="mx-2 space-y-2">
                <SectionCardsBalance />
                <SectionCardsReguler />
                <SectionCardsCod />
                <SectionCardsTrouble />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
