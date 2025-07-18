"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/top-nav";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, Clock, HelpCircle } from "lucide-react";

export default function BantuanPage() {
  const handlePhoneCall = () => {
    window.location.href = "tel:081330323559";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/6281330323559", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@bhisakirim.com";
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

        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Bantuan & Support
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Hubungi Tim Support Kami
                </CardTitle>
                <CardDescription>
                  Tim support kami siap membantu Anda dengan segala pertanyaan
                  dan kendala yang Anda hadapi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phone */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-sm text-gray-600">081330323559</p>
                    </div>
                  </div>
                  <Button onClick={handlePhoneCall} variant="outline" size="sm">
                    Hubungi
                  </Button>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">081330323559</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Chat
                  </Button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">
                        support@bhisakirim.com
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleEmail} variant="outline" size="sm">
                    Kirim Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours & FAQ */}
            <div className="space-y-6">
              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Senin - Jumat</span>
                      <span className="text-gray-600">08:00 - 17:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sabtu</span>
                      <span className="text-gray-600">08:00 - 12:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Minggu</span>
                      <span className="text-gray-600">Tutup</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>FAQ (Pertanyaan Umum)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">
                      Bagaimana cara melacak paket saya?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Anda dapat melacak paket melalui menu &quot;Laporan
                      Pengiriman&quot; dengan memasukkan nomor resi.
                    </p>
                  </div>
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">
                      Berapa lama waktu pengiriman?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Waktu pengiriman bervariasi tergantung jenis layanan dan
                      tujuan. Paket instant 1-2 hari, reguler 2-4 hari.
                    </p>
                  </div>
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">
                      Bagaimana cara mengubah data rekening?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Untuk mengubah data rekening, silakan hubungi customer
                      service kami melalui WhatsApp atau telepon.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      Apa yang harus dilakukan jika paket rusak?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Segera hubungi customer service kami dengan melampirkan
                      foto kondisi paket dan nomor resi.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bantuan Cepat</CardTitle>
              <CardDescription>
                Akses cepat ke fitur-fitur yang sering digunakan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() =>
                    (window.location.href = "/dashboard/cek-ongkir")
                  }
                >
                  <span className="text-2xl">📦</span>
                  <span className="text-sm">Cek Ongkir</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() =>
                    (window.location.href =
                      "/dashboard/laporan/laporan-pengiriman")
                  }
                >
                  <span className="text-2xl">📋</span>
                  <span className="text-sm">Lacak Paket</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() =>
                    (window.location.href = "/dashboard/cek-kode-pos")
                  }
                >
                  <span className="text-2xl">📍</span>
                  <span className="text-sm">Cek Kode Pos</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={handleWhatsApp}
                >
                  <span className="text-2xl">💬</span>
                  <span className="text-sm">Chat Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
