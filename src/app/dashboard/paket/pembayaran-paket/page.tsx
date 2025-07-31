"use client";

import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import TopNav from "@/components/top-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Package,
  Clock,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { getOrders, createPayment } from "@/lib/apiClient";

interface PendingOrder {
  id: number;
  reference_no: string;
  vendor: string;
  shipment_type: string;
  cod_value: number;
  reguler_value: number;
  item_value: number;
  status: string;
  created_at: string;
  // Add calculated amount for payment
  payment_amount?: number;
}

// Helper function outside component to avoid re-renders
const calculatePaymentAmount = (order: PendingOrder): number => {
  // Basic shipping cost calculation
  // You may need to adjust this based on your actual pricing logic
  const itemValue = order.item_value || 0;
  const baseShippingCost = 15000; // Base shipping cost
  const codFee =
    order.shipment_type === "cod" ? Math.round(itemValue * 0.04) : 0;

  return baseShippingCost + codFee;
};

export default function PembayaranPaketPage() {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchPendingOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrders();

      if (response.data) {
        // Filter only orders with pending payment status and map to PendingOrder type
        const pending = response.data
          .filter((order) => order.status === "menunggu_pembayaran")
          .map((order) => {
            const pendingOrder: PendingOrder = {
              id: order.id,
              reference_no: order.reference_no || "",
              vendor: order.vendor || "",
              shipment_type: order.shipment_type || "",
              cod_value: Number(order.cod_value) || 0,
              reguler_value: Number(order.item_value) || 0, // Use item_value as reguler_value
              item_value: Number(order.item_value) || 0,
              status: order.status || "",
              created_at: order.created_at || "",
            };

            return {
              ...pendingOrder,
              // Calculate payment amount (shipping cost + COD fee if applicable)
              payment_amount: calculatePaymentAmount(pendingOrder),
            };
          });

        setPendingOrders(pending);
      }
    } catch (error) {
      console.error("Failed to fetch pending orders:", error);
      toast.error("Gagal memuat data order");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(pendingOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const getTotalAmount = () => {
    return selectedOrders.reduce((total, orderId) => {
      const order = pendingOrders.find((o) => o.id === orderId);
      return total + (order?.payment_amount || 0);
    }, 0);
  };

  const handleBulkPayment = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Pilih minimal 1 order untuk pembayaran");
      return;
    }

    try {
      setPaymentLoading(true);

      // Get selected orders data
      const selectedOrdersData = pendingOrders.filter((order) =>
        selectedOrders.includes(order.id)
      );

      // For now, create a single payment for all selected orders
      // In the future, you might want to create individual payments or bulk payment
      const bulkShippingData = {
        vendor: "bulk_payment",
        orders: selectedOrdersData.map((order) => ({
          order_id: order.id,
          reference_no: order.reference_no,
          amount: order.payment_amount,
        })),
        detail: {
          total_orders: selectedOrdersData.length,
          total_amount: getTotalAmount(),
        },
      };

      const paymentResponse = await createPayment({
        shipping_data: bulkShippingData,
        amount: getTotalAmount(),
      });

      if (paymentResponse.success && paymentResponse.data) {
        // Open payment URL
        if (paymentResponse.data.invoice_url) {
          window.open(paymentResponse.data.invoice_url, "_blank");
          toast.success("Invoice pembayaran berhasil dibuat");
        }
      } else {
        toast.error(
          paymentResponse.message || "Gagal membuat invoice pembayaran"
        );
      }
    } catch (error) {
      console.error("Bulk payment error:", error);
      toast.error("Terjadi kesalahan saat membuat pembayaran");
    } finally {
      setPaymentLoading(false);
    }
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pembayaran Paket
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola pembayaran untuk order yang menunggu pembayaran
              </p>
            </div>
            <Button
              onClick={fetchPendingOrders}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Order Pending</p>
                    <p className="text-xl font-bold">{pendingOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Order Dipilih</p>
                    <p className="text-xl font-bold">{selectedOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(getTotalAmount())}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Menunggu Pembayaran</CardTitle>
                {pendingOrders.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedOrders.length === pendingOrders.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Pilih Semua
                    </label>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Memuat data order...</span>
                </div>
              ) : pendingOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Tidak ada order yang menunggu pembayaran
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOrder(order.id, checked as boolean)
                            }
                          />
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-600"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Menunggu Pembayaran
                              </Badge>
                              <Badge variant="secondary">
                                {order.vendor?.toUpperCase()}
                              </Badge>
                              <Badge
                                variant={
                                  order.shipment_type === "cod"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {order.shipment_type?.toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">
                                Ref: {order.reference_no}
                              </p>
                              <p className="text-sm text-gray-600">
                                Dibuat: {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>
                                Nilai Barang: {formatCurrency(order.item_value)}
                              </p>
                              {order.shipment_type === "cod" && (
                                <p>COD: {formatCurrency(order.cod_value)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(order.payment_amount || 0)}
                          </p>
                          <p className="text-sm text-gray-600">Biaya Kirim</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Action */}
          {selectedOrders.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Konfirmasi Pembayaran
                    </h3>
                    <p className="text-gray-600">
                      {selectedOrders.length} order dipilih - Total:{" "}
                      {formatCurrency(getTotalAmount())}
                    </p>
                  </div>
                  <Button
                    onClick={handleBulkPayment}
                    disabled={paymentLoading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    size="lg"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Membuat Invoice...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Bayar Sekarang
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
