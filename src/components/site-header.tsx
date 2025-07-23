"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { usePathname } from "next/navigation";
// import { Input } from "./ui/input";
// import { Search } from "lucide-react";

export function SiteHeader() {
  // const pathname = usePathname();

  // Ambil semua segmen setelah /dashboard
  // const pathSegments = pathname
  //   .replace(/^\/dashboard\/?/, "") 
  //   .split("/")
  //   .filter((segment) => segment.length > 0); 

  // const dynamicPath = pathSegments.length ? pathSegments.join(" / ") : "";

  return (
    <header className="h-20 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/* <h3 className="text-xl font-semibold hidden md:flex items-center gap-1">
          Dashboard
          {dynamicPath && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="capitalize text-black">{dynamicPath}</span>
            </>
          )}
        </h3> */}
        <div className="hidden md:flex relative w-full">
          {/* <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          /> */}
          {/* <Input
            placeholder="Cari resi, order id..."
            className="h-[50px] pl-10 pr-5 border border-blue-500 rounded-lg"
          /> */}
        </div>
      </div>
    </header>
  );
}
