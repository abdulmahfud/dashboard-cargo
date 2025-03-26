"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  // Ambil semua segmen setelah /dashboard
  const pathSegments = pathname
    .replace(/^\/dashboard\/?/, "") 
    .split("/")
    .filter((segment) => segment.length > 0); // filter kosong

  const dynamicPath = pathSegments.length ? pathSegments.join(" / ") : "";

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h3 className="text-xs font-medium flex items-center gap-1">
          Dashboard
          {dynamicPath && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="capitalize text-black">{dynamicPath}</span>
            </>
          )}
        </h3>
      </div>
    </header>
  );
}
