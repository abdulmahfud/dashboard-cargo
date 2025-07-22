"use client";

import {
  ClipboardListIcon,
  FileDown,
  FileSearch,
  FileSymlink,
  FileText,
  HelpCircleIcon,
  House,
  PackageSearch,
  Truck,
  User,
  Wallet,
  PackageX,
  UserRoundSearch,
  UserRoundPlus,
  UserCheck,
  UserCog,
  ShieldUser,
  Banknote,
} from "lucide-react";
import * as React from "react";

import { NavAccount } from "@/components/nav-account";
import { NavData } from "@/components/nav-data";
import { NavManagementUser } from "@/components/nav-management-user";
import { NavMain } from "@/components/nav-main";
import { NavReport } from "@/components/nav-report";
import { NavSecondary } from "@/components/nav-secondary";
import { NavSendPackage } from "@/components/nav-send-package";
import { NavUser } from "@/components/nav-user";

import { useAuth } from "@/context/AuthContext";

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
    // {
    //   title: "Cetak Resi Massal",
    //   url: "/dashboard/cetak-resi-massal",
    //   icon: PrinterCheck,
    // },
  ],
  sendPackage: [
    {
      title: "Kirim Paket Reguler",
      url: "/dashboard/paket/paket-reguler",
      icon: Truck,
    },
    // {
    //   title: "Kirim Paket Instant",
    //   url: "/dashboard/paket/paket-instant",
    //   icon: Package,
    // },
    {
      title: "Cancel Order",
      url: "/dashboard/paket/cancel-order",
      icon: PackageX,
      permission: "expedition.orders.cancel",
    },
  ],
  navSecondary: [
    {
      title: "Dapatkan Bantuan",
      url: "/dashboard/bantuan",
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
    // {
    //   title: "Laporan Withdraw",
    //   url: "#",
    //   icon: Calculator,
    // },
    {
      title: "Rekening",
      url: "/dashboard/akun/rekening",
      icon: Wallet,
    },
    // {
    //   title: "Social Media",
    //   url: "/dashboard/akun/social-media",
    //   icon: MessageCircleCode,
    // },
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
  managementUser: [
    {
      title: "List Bank Account",
      url: "/dashboard/list-bank-accounts",
      icon: Banknote,
    },
    {
      title: "List User",
      url: "/dashboard/users",
      icon: UserRoundSearch,
    },
    {
      title: "Tambah User",
      url: "/dashboard/users/create",
      icon: UserRoundPlus,
    },
    {
      title: "List Role",
      url: "/dashboard/roles",
      icon: UserCheck,
    },
    {
      title: "Tambah Role",
      url: "/dashboard/roles/create",
      icon: UserCog,
    },
    {
      title: "List Permission",
      url: "/dashboard/permissions",
      icon: ShieldUser,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hasPermission, loading: authLoading } = useAuth();

  if (authLoading) return null;

  // ✅ Filter sendPackage berdasarkan permission
  const filteredSendPackage = data.sendPackage.filter((item: { permission?: string }) => {
    if (!item.permission) return true; // menu tanpa permission = selalu tampil
    return hasPermission(item.permission);
  });
  
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
        <NavSendPackage items={filteredSendPackage} />
        <NavReport items={data.report} />
        <NavData items={data.data} />
        <NavAccount items={data.account} />
        {hasPermission("roles.index") && (
          <NavManagementUser items={data.managementUser} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
