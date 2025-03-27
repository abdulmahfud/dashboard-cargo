"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SectionCardsBalance } from "./../../components/section-cards-balance";
import { SectionCardsCod } from "./../../components/section-cards-cod";
import { SectionCardsReguler } from "./../../components/section-cards-reguler";
import { SectionCardsTrouble } from "./../../components/section-cards-trouble";
import TopNav from "./../../components/top-nav";


export default function Dashboard() {
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
