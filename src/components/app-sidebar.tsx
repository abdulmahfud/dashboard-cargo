"use client";

import {
  ArrowUpCircleIcon,
  Calculator,
  CameraIcon,
  ClipboardListIcon,
  FileCodeIcon,
  FileDown,
  FileSearch,
  FileSymlink,
  FileText,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageCircleCode,
  Package,
  PackageSearch,
  PrinterCheck,
  SettingsIcon,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import * as React from "react";

import { NavAccount } from "@/components/nav-account";
import { NavData } from "@/components/nav-data";
import { NavMain } from "@/components/nav-main";
import { NavReport } from "@/components/nav-report";
import { NavSecondary } from "@/components/nav-secondary";
import { NavSendPackage } from "@/components/nav-send-package";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    title: "User",
    email: "user@example.com",
    avatar: "/image/profil.png",
  },
  navMain: [
    {
      title: "Beranda",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Cek Ongkir",
      url: "/dashboard/cek-ongkir",
      icon: PackageSearch,
    },
    {
      title: "Cek Kode Pos",
      url: "/dashboard/cek-kode-pos",
      icon: FileSearch,
    },
    {
      title: "Cetak Resi Massal",
      url: "/dashboard/cetak-resi-massal",
      icon: PrinterCheck,
    },
  ],
  sendPackage: [
    {
      title: "Kirim Paket Reguler",
      url: "/dashboard/paket/paket-reguler",
      icon: Truck,
    },
    {
      title: "Kirim Paket Instant",
      url: "/dashboard/paket/paket-instant",
      icon: Package,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Syarat & Panduan",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Dapatkan Bantuan",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  report: [
    {
      title: "Laporan Mutasi Saldo",
      url: "/dashboard/laporan/laporan-mutasi-saldo",
      icon: ClipboardListIcon,
    },
    {
      title: "Laporan Pengiriman",
      url: "/dashboard/laporan/laporan-pengiriman",
      icon: FileText,
    },
  ],
  account: [
    {
      title: "Profil",
      url: "/dashboard/akun/profil",
      icon: User,
    },
    {
      title: "Withdraw",
      url: "#",
      icon: Calculator,
    },
    {
      title: "Rekening",
      url: "/dashboard/akun/rekening",
      icon: Wallet,
    },
    {
      title: "Social Media",
      url: "/dashboard/akun/social-media",
      icon: MessageCircleCode,
    },
  ],
  data: [
    {
      title: "Data Pengirim",
      url: "/dashboard/data/data-pengirim",
      icon: FileSymlink,
    },
    {
      title: "Data Penerima",
      url: "/dashboard/data/data-penerima",
      icon: FileDown,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-xl text-blue-500 font-semibold">
                  Global Logistic.
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSendPackage items={data.sendPackage} />
        <NavReport items={data.report} />
        <NavData items={data.data} />
        <NavAccount items={data.account} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
