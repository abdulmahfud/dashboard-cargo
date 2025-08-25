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
import { trackOrderByReference } from "@/lib/apiClient";
import { toast } from "sonner";
import { Search, Package } from "lucide-react";
import type { StandardizedTrackingResponse } from "@/types/tracking";
import { TrackingDisplay } from "@/components/tracking/TrackingDisplay";

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [referenceNo, setReferenceNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StandardizedTrackingResponse | null>(
    null
  );

  // Auto-fill reference_no from URL parameter and trigger tracking
  useEffect(() => {
    const refParam =
      searchParams.get("ref") || searchParams.get("reference_no");
    if (refParam) {
      setReferenceNo(refParam);
      // Auto-track jika ada parameter reference_no
      handleTrackingRequest(refParam);
    }
  }, [searchParams]);

  const handleTrackingRequest = async (refNumber: string) => {
    if (!refNumber.trim()) {
      toast.error("Masukkan nomor referensi terlebih dahulu");
      return;
    }

    setResult(null);
    setLoading(true);

    try {
      const response = await trackOrderByReference(refNumber.trim());

      if (response.success) {
        setResult(response);
        if (!response.order_info.awb_no) {
          toast.info("Order ditemukan, namun belum memiliki nomor resi");
        } else {
          toast.success("Data tracking berhasil ditemukan");
        }
      } else {
        toast.error("Data tracking tidak ditemukan");
      }
    } catch (error: unknown) {
      console.error("Tracking error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Gagal melacak paket. Silakan coba lagi.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTrackingRequest(referenceNo);
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
                  placeholder="Masukkan nomor referensi (contoh: REF-250821103709996)"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
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
              <p className="text-sm text-gray-600 mt-2">
                Gunakan nomor referensi order untuk melacak paket dari semua
                vendor expedisi
              </p>
            </CardContent>
          </Card>

          {/* Hasil Tracking */}
          {result && (
            <div className="space-y-6">
              {/* No AWB case */}
              {!result.order_info.awb_no && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Status Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4">
                      <p className="text-gray-600">
                        Order belum memiliki nomor resi (AWB).
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Status saat ini:{" "}
                        <strong>{result.order_info.status}</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Nomor resi akan tersedia setelah order diproses ke
                        expedisi
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tracking Display with standardized data */}
              {result.order_info.awb_no && <TrackingDisplay result={result} />}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
