"use client";

import InputFormPenerima from "@/components/Data/InputFormPenerima";
import RecipientList from "@/components/Data/RecipientList";

import { AppSidebar } from "@/components/app-sidebar";
import { NavUserTop } from "@/components/nav-user-top";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/lib/useIsMobile";
import { CirclePlus } from "lucide-react";

const dataProfil = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/image/profil.png",
  },
};

const DataPenerima = () => {
  // Initialize the 'framer-motion' module for animations
  // useEffect(() => {
  //   const container = document.getElementById("app-container");
  //   if (container) {
  //     container.classList.add("motion-safe");
  //   }
  // }, []);

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
        <div className="flex flex-1 flex-col bg-blue-100">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <main className="flex-1 container">
                <div
                  id="app-container"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="flex flex-col">
                    <InputFormPenerima />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <RecipientList />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DataPenerima;
