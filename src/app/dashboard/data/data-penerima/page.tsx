"use client";

import { useState } from "react";
import InputFormPenerima from "@/components/Data/InputFormPenerima";
import RecipientList from "@/components/Data/RecipientList";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const DataPenerima = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReceiverAdded = () => {
    // Trigger refresh of the recipient list
    setRefreshTrigger((prev) => prev + 1);
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
        <div className="flex flex-1 flex-col bg-blue-100">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <main className="flex-1 container">
                <div
                  id="app-container"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div className="flex flex-col">
                    <InputFormPenerima onReceiverAdded={handleReceiverAdded} />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <RecipientList refreshTrigger={refreshTrigger} />
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
