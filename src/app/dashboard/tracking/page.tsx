"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/top-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackJntExpress } from "@/lib/apiClient";
import { toast } from "sonner";
import { Search, Package, User, MapPin, Calendar, Truck } from "lucide-react";
import type { JntTrackingResponse } from "@/types/tracking";

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JntTrackingResponse | null>(null);

  // Auto-fill AWB from URL parameter and trigger tracking
  useEffect(() => {
    const awbParam = searchParams.get("awb");
    if (awbParam) {
      setAwb(awbParam);
      // Auto-track jika ada parameter AWB
      handleTrackingRequest(awbParam);
    }
  }, [searchParams]);

  const handleTrackingRequest = async (awbNumber: string) => {
    if (!awbNumber.trim()) {
      toast.error("Masukkan nomor resi terlebih dahulu");
      return;
    }

    setResult(null);
    setLoading(true);

    try {
      const response = await trackJntExpress(awbNumber.trim());

      if (response.success && response.data?.status === "success") {
        setResult(response.data.data);
        toast.success("Data tracking berhasil ditemukan");
      } else {
        toast.error("Data tracking tidak ditemukan");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      toast.error("Gagal melacak resi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTrackingRequest(awb);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (status_code: number) => {
    if (status_code >= 200) return "bg-green-500";
    if (status_code >= 100) return "bg-blue-500";
    return "bg-gray-500";
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

        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Tracking Paket</h1>
          </div>

          {/* Form Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Lacak Paket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  placeholder="Masukkan nomor resi (contoh: JO9000530227)"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Mencari..." : "Lacak Paket"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Hasil Tracking */}
          {result && (
            <div className="space-y-6">
              {/* Info Paket */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Informasi Paket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        No. Resi
                      </label>
                      <p className="font-semibold">{result.awb}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Order ID
                      </label>
                      <p className="font-semibold">{result.orderid}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nama Barang
                      </label>
                      <p className="font-semibold">{result.detail.itemname}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Jumlah & Berat
                      </label>
                      <p className="font-semibold">
                        {result.detail.qty} pcs • {result.detail.weight}g
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Layanan
                      </label>
                      <p className="font-semibold">
                        {result.detail.services_code}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tanggal Kirim
                      </label>
                      <p className="font-semibold">
                        {formatDate(result.detail.shipped_date)}
                      </p>
                    </div>
                  </div>
                  {result.detail.note && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Catatan
                      </label>
                      <p className="font-semibold">{result.detail.note}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Pengirim & Penerima */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Pengirim
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {result.detail.sender.name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {result.detail.sender.addr}
                      </p>
                      <p className="text-sm">
                        <strong>Kota:</strong> {result.detail.sender.city}
                      </p>
                      {result.detail.sender.zipcode && (
                        <p className="text-sm">
                          <strong>Kode Pos:</strong>{" "}
                          {result.detail.sender.zipcode}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Penerima
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {result.detail.receiver.name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {result.detail.receiver.addr}
                      </p>
                      <p className="text-sm">
                        <strong>Kota:</strong> {result.detail.receiver.city}
                      </p>
                      {result.detail.receiver.zipcode && (
                        <p className="text-sm">
                          <strong>Kode Pos:</strong>{" "}
                          {result.detail.receiver.zipcode}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Biaya */}
              <Card>
                <CardHeader>
                  <CardTitle>Detail Biaya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <label className="text-gray-600">Ongkos Kirim</label>
                      <p className="font-semibold">
                        {formatCurrency(
                          result.detail.detail_cost.shipping_cost
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600">COD</label>
                      <p className="font-semibold">
                        {formatCurrency(result.detail.detail_cost.cod)}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600">Asuransi</label>
                      <p className="font-semibold">
                        {formatCurrency(
                          result.detail.detail_cost.insurance_cost
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-600">Total</label>
                      <p className="font-semibold text-lg">
                        {formatCurrency(result.detail.actual_amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Riwayat Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Riwayat Perjalanan Paket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.history.map((history, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusBadgeColor(history.status_code)}`}
                          ></div>
                          {index < result.history.length - 1 && (
                            <div className="w-px h-8 bg-gray-300 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {history.city_name}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(history.date_time)}
                            </span>
                          </div>
                          <p className="font-medium text-sm">
                            {history.status}
                          </p>
                          {history.storeName && (
                            <p className="text-xs text-gray-600 mt-1">
                              <strong>Outlet:</strong> {history.storeName}
                            </p>
                          )}
                          {history.driverName && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <strong>Driver:</strong> {history.driverName}
                              {history.driverPhone &&
                                ` (${history.driverPhone})`}
                            </p>
                          )}
                          {history.note && (
                            <p className="text-xs text-gray-600 mt-1">
                              <strong>Catatan:</strong> {history.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
