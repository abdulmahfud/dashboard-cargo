"use client";

import {
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
  House,
  MessageCircleCode,
  Package,
  PackageSearch,
  PrinterCheck,
  SettingsIcon,
  Truck,
  User,
  Wallet,
  PackageX,
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
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Beranda",
      url: "/dashboard",
      icon: House,
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
    {
      title: "Cancel Order",
      url: "/dashboard/paket/cancel-order",
      icon: PackageX,
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
      <SidebarHeader className="pt-0 pb-0 mb-5 mt-5">
        <Image
          src="/images/BhisaKirim_3.png"
          alt="Logo Bisakirim"
          width={150}
          height={150}
        />
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
