"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  FileText,
  Clock,
  CreditCard,
  ArrowRight,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { getPaymentStatus } from "@/lib/apiClient";
import type { PaymentStatus } from "@/types/payment";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const referenceNo = searchParams.get("reference_no");

  const fetchPaymentStatus = useCallback(async () => {
    if (!referenceNo) return;

    try {
      setLoading(true);
      const result = await getPaymentStatus(referenceNo);

      if (result.success && result.data) {
        setPayment(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch payment status:", error);
    } finally {
      setLoading(false);
    }
  }, [referenceNo]);

  useEffect(() => {
    if (referenceNo) {
      fetchPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [referenceNo, fetchPaymentStatus]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  const handleViewShipments = () => {
    router.push("/dashboard/laporan/laporan-pengiriman");
  };

  const handleCreateNewOrder = () => {
    router.push("/dashboard/paket/paket-reguler");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat status pembayaran...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Pembayaran Berhasil!
              </h1>
              <p className="text-gray-600 text-lg">
                Terima kasih! Pembayaran Anda telah berhasil diproses.
              </p>
            </div>

            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Status: Lunas
            </Badge>
          </CardContent>
        </Card>

        {/* Payment Details */}
        {payment && (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Detail Pembayaran
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Reference Number
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">
                        {payment.reference_no}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(payment.reference_no)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Invoice ID
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="font-mono text-sm">
                        {payment.invoice_id}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(payment.invoice_id)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Jumlah Pembayaran
                    </label>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <span className="text-lg font-bold text-green-700">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  </div>

                  {payment.paid_at && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Waktu Pembayaran
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">
                          {formatDate(payment.paid_at)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {payment.payment_method && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Metode Pembayaran
                    </label>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">
                        {payment.payment_channel || payment.payment_method}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Langkah Selanjutnya
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    Order Sedang Diproses
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Tim kami sedang memproses order pengiriman Anda. Proses ini
                    biasanya memakan waktu 5-15 menit.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-green-900">
                    AWB Number Akan Tersedia
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Setelah order diproses, Anda akan mendapatkan AWB number
                    untuk tracking pengiriman.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">
                    Label Siap Dicetak
                  </h3>
                  <p className="text-sm text-purple-700 mt-1">
                    Label pengiriman akan tersedia untuk dicetak melalui halaman
                    laporan pengiriman.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleViewShipments}
                className="h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg"
                size="lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Lihat Laporan Pengiriman
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                onClick={handleCreateNewOrder}
                variant="outline"
                className="h-12 border-2 border-blue-200 hover:bg-blue-50"
                size="lg"
              >
                <Package className="w-5 h-5 mr-2" />
                Kirim Paket Lagi
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Butuh bantuan? Hubungi customer service kami
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <span className="text-blue-600">📞 (021) 1234-5678</span>
                <span className="text-green-600">
                  💬 WhatsApp: 081234567890
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            BhisaKirim. Pengiriman yang dapat diandalkan untuk keperluan
            bisnis Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
