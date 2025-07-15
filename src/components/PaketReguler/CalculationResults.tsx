// No UI imports needed for API result only

// No unused imports needed for API result only

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShippingOption } from "@/types/dataRegulerForm";
import Image from "next/image";
import { CirclePlus, CheckCircle, Package, FileText } from "lucide-react";
import { submitJntExpressOrder } from "@/lib/apiClient";
import type { OrderRequest } from "@/types/order";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface CalculationResultsProps {
  isSearching: boolean;
  result?: Record<string, unknown>;
  formData?: {
    itemValue?: string;
    paymentMethod?: string;
    formData?: {
      receiverName: string;
      receiverPhone: string;
      province: string;
      regency: string;
      district: string;
      receiverAddress: string;
      itemContent: string;
      itemType: string;
      itemValue: string;
      itemQuantity: string;
      weight: string;
      length: string;
      width: string;
      height: string;
      notes: string;
      deliveryType: string;
      paymentMethod: string;
    };
    businessData?: {
      id: number;
      businessName: string;
      senderName: string;
      contact: string;
      province: string | null;
      regency: string | null;
      district: string | null;
      address: string;
    } | null;
    receiverId?: string | null;
  };
  onResetForm?: () => void;
}

type ApiErrorResult = { error: true; message?: string };

type JntApiResult = {
  status: string;
  data?: {
    content?: string;
    is_success?: string;
    message?: string;
  };
};

export default function CalculationResults({
  isSearching,
  result,
  formData,
  onResetForm,
}: CalculationResultsProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isInsured, setIsInsured] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [customCODValue, setCustomCODValue] = useState<string>("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    message: string;
    awb_no?: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Debug: Log when props change - FIXED: Use useEffect instead of useState
  useEffect(() => {
    console.log(
      "🎯 CalculationResults - Component initialized/updated with props:",
      {
        isSearching,
        result,
        formData,
      }
    );
  }, [isSearching, result, formData]);

  // Build shippingOptions from API result if present
  const shippingOptions: ShippingOption[] = useMemo(() => {
    console.log(
      "🔍 CalculationResults - Building shipping options from result:",
      result
    );

    const apiResult = result as JntApiResult;

    if (
      apiResult &&
      apiResult.status === "success" &&
      apiResult.data &&
      typeof apiResult.data.content === "string"
    ) {
      try {
        const contentArr = JSON.parse(apiResult.data.content) as Array<{
          cost: string;
          name: string;
          productType: string;
        }>;

        console.log(
          "📊 CalculationResults - Parsed content array:",
          contentArr
        );

        if (Array.isArray(contentArr) && contentArr.length > 0) {
          // Map semua opsi dari API JNT Express
          const options = contentArr.map((item, index) => ({
            id: `jnt-${item.productType.toLowerCase()}`,
            name: `J&T ${item.name}`,
            logo: "/images/jnt.png",
            price: `Rp${Number(item.cost).toLocaleString("id-ID")}`,
            duration: "3-6 Hari",
            available: true,
            recommended: index === 0, // Opsi pertama sebagai rekomendasi
            tags: [{ label: "Potensi retur Rendah", type: "success" as const }],
          }));

          console.log(
            "✅ CalculationResults - Generated shipping options:",
            options
          );
          return options;
        }
      } catch (error) {
        console.error(
          "❌ CalculationResults - Error parsing shipping options:",
          error
        );
        return [];
      }
    }

    console.log("⚠️ CalculationResults - No valid shipping options found");
    return [];
  }, [result]);

  const selectedShippingOption = shippingOptions.find(
    (option) => option.id === selectedOption
  );

  function isApiErrorResult(obj: unknown): obj is ApiErrorResult {
    return (
      !!obj &&
      typeof obj === "object" &&
      "error" in obj &&
      (obj as Record<string, unknown>)["error"] === true
    );
  }

  if (result && isApiErrorResult(result)) {
    return (
      <div className="p-4 text-red-600">
        {result.message || "Gagal cek ongkir"}
      </div>
    );
  }

  // Debug: tampilkan data mentah jika tidak ada shippingOptions
  if (!isSearching && !shippingOptions.length && result) {
    return (
      <div className="p-4 text-gray-500">
        Tidak ada opsi pengiriman ditemukan.
        <br />
        <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }

  if (!isSearching && !shippingOptions.length) {
    return null;
  }

  const handleShippingSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowPaymentSection(true);
  };

  const calculateTotal = () => {
    if (!selectedShippingOption) return 0;

    const shippingCost = parseInt(
      selectedShippingOption.price.replace(/[^\d]/g, "")
    );

    const itemValue = parseInt(formData?.itemValue || "0");
    const isCOD = formData?.paymentMethod === "cod";

    // COD fee: 4% of item value
    const codFee = isCOD ? Math.round(itemValue * 0.04) : 0;

    // Insurance: 0.2% of item value when checked
    const insuranceCost = isInsured ? Math.round(itemValue * 0.002) : 0;

    return shippingCost + codFee + insuranceCost;
  };

  const getItemValue = () => {
    return parseInt(formData?.itemValue || "0");
  };

  const getCODFee = () => {
    const itemValue = getItemValue();
    const isCOD = formData?.paymentMethod === "cod";
    return isCOD ? Math.round(itemValue * 0.04) : 0;
  };

  const getInsuranceCost = () => {
    const itemValue = getItemValue();
    return isInsured ? Math.round(itemValue * 0.002) : 0;
  };

  const handleSubmitOrder = async () => {
    console.log("🚀 CalculationResults - handleSubmitOrder started");
    console.log("📋 CalculationResults - Current state:", {
      selectedOption,
      selectedShippingOption,
      isInsured,
      customCODValue,
      formData,
    });

    if (
      !selectedShippingOption ||
      !formData?.formData ||
      !formData?.businessData
    ) {
      const missingData = {
        selectedShippingOption: !!selectedShippingOption,
        formData: !!formData?.formData,
        businessData: !!formData?.businessData,
      };

      console.error(
        "❌ CalculationResults - Missing required data:",
        missingData
      );
      alert("Data tidak lengkap untuk melakukan order");
      return;
    }

    console.log(
      "✅ CalculationResults - All required data present, proceeding with order"
    );

    setIsSubmittingOrder(true);
    setOrderResult(null);

    try {
      // Calculate COD value properly - total amount charged to recipient
      let codValue = "0";
      if (formData.formData.paymentMethod === "cod") {
        if (customCODValue) {
          // Use custom COD value if provided
          codValue = customCODValue.replace(/\./g, "");
        } else {
          // Calculate total: Item Value + Shipping + COD Fee + Insurance
          const itemValue = getItemValue();
          const shippingCost = parseInt(
            selectedShippingOption.price.replace(/[^\d]/g, "")
          );
          const codFee = getCODFee();
          const insuranceCost = getInsuranceCost();

          codValue = (
            itemValue +
            shippingCost +
            codFee +
            insuranceCost
          ).toString();
        }
      }

      console.log("💰 CalculationResults - COD calculation:", {
        paymentMethod: formData.formData.paymentMethod,
        customCODValue,
        itemValue: getItemValue(),
        shippingCost: parseInt(
          selectedShippingOption.price.replace(/[^\d]/g, "")
        ),
        codFee: getCODFee(),
        insuranceCost: getInsuranceCost(),
        finalCodValue: codValue,
      });

      // Build order data
      const orderData: OrderRequest = {
        service_code: "1", // JNT Express service code
        expresstype: "1",
        servicetype: formData.formData.deliveryType === "pickup" ? "1" : "6",
        detail: {
          pieces: formData.formData.itemQuantity || "1",
          weight: (parseInt(formData.formData.weight) / 1000).toString(), // Convert grams to kg
          remark:
            formData.formData.notes ||
            formData.formData.itemContent ||
            "GENERAL_GOODS",
          item_value: formData.formData.itemValue || "0",
          use_insurance: isInsured,
          insurance: isInsured
            ? Math.round(
                parseInt(formData.formData.itemValue || "0") * 0.002
              ).toString()
            : "0",
          cod: codValue, // Use calculated COD value
          items: [
            {
              name: formData.formData.itemContent || "General Item",
              quantity: parseInt(formData.formData.itemQuantity) || 1,
              price: parseInt(formData.formData.itemValue) || 0,
            },
          ],
        },
      };

      console.log(
        "📦 CalculationResults - Base order data created:",
        orderData
      );

      // Use receiver_id if available, otherwise use receiver object
      if (formData.receiverId) {
        orderData.receiver_id = parseInt(formData.receiverId);
        orderData.shipper_id = formData.businessData.id;
        console.log(
          "👥 CalculationResults - Using saved shipper/receiver IDs:",
          {
            receiver_id: orderData.receiver_id,
            shipper_id: orderData.shipper_id,
          }
        );
      } else {
        orderData.sender = {
          name: formData.businessData.senderName,
          phone: formData.businessData.contact,
          address: formData.businessData.address,
          province: formData.businessData.province || "",
          regency: formData.businessData.regency || "",
          district: formData.businessData.district || "",
        };
        orderData.receiver = {
          name: formData.formData.receiverName,
          phone: formData.formData.receiverPhone,
          address: formData.formData.receiverAddress,
          province: formData.formData.province,
          regency: formData.formData.regency,
          district: formData.formData.district,
        };

        console.log(
          "📝 CalculationResults - Using direct sender/receiver objects:",
          {
            sender: orderData.sender,
            receiver: orderData.receiver,
          }
        );
      }

      console.log(
        "🌐 CalculationResults - Final order data before API call:",
        orderData
      );
      console.log(
        "📡 CalculationResults - Making API call to submitJntExpressOrder..."
      );

      const response = await submitJntExpressOrder(orderData);

      console.log("📥 CalculationResults - API response received:", response);

      // Check for success based on response structure
      if (response.status === "success" || response.order) {
        console.log("✅ CalculationResults - Order successful:", {
          awb_no: response.data?.awb_no,
          order: response.order,
          status: response.status,
        });

        setOrderResult({
          success: true,
          message: "Order berhasil dibuat!",
          awb_no: response.data?.awb_no,
        });
        setShowSuccessDialog(true);
      } else {
        console.log(
          "⚠️ CalculationResults - Order response unclear:",
          response
        );

        // Check if order was actually created despite error status
        if (response.order || response.data) {
          console.log(
            "✅ CalculationResults - Order seems to be created despite error status"
          );
          setOrderResult({
            success: true,
            message: "Order berhasil dibuat!",
            awb_no: response.data?.awb_no,
          });
          setShowSuccessDialog(true);
        } else {
          setOrderResult({
            success: false,
            message: response.message || "Gagal membuat order",
          });
        }
      }
    } catch (error) {
      console.error("❌ CalculationResults - Order submission error:", error);

      // Enhanced error logging
      if (error instanceof Error) {
        console.error("❌ CalculationResults - Error message:", error.message);
        console.error("❌ CalculationResults - Error stack:", error.stack);
      }

      // If it's an axios error, log more details
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as AxiosError;
        console.error("❌ CalculationResults - Axios error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            data: axiosError.config?.data,
          },
        });

        // Check if the error response contains order data (order created but API returned error)
        const responseData = axiosError.response?.data as {
          order?: { awb_no?: string };
          data?: { awb_no?: string };
        };
        if (responseData?.order || responseData?.data) {
          console.log(
            "✅ CalculationResults - Order was created despite API error"
          );
          setOrderResult({
            success: true,
            message: "Order berhasil dibuat!",
            awb_no: responseData.data?.awb_no || responseData.order?.awb_no,
          });
          return;
        }
      }

      setOrderResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat order",
      });
    } finally {
      console.log("🏁 CalculationResults - Order submission completed");
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="animate-slide-up space-y-4">
      {/* Shipping Options List */}
      {shippingOptions.map((option) => (
        <Card
          key={option.id}
          className={`cursor-pointer transition-all duration-200 ${
            selectedOption === option.id
              ? "border-blue-500 bg-blue-50"
              : option.recommended
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleShippingSelect(option.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={option.logo}
                  alt={option.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{option.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {option.price}
                    </span>
                    {option.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {option.originalPrice}
                      </span>
                    )}
                  </div>
                  {option.tags && option.tags.length > 0 && (
                    <div className="flex space-x-1 mt-1">
                      {option.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded ${
                            tag.type === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{option.duration}</div>
                {option.recommended && (
                  <div className="text-xs text-green-600 font-medium">
                    Rekomendasi
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Payment & Summary Section */}
      {showPaymentSection && selectedShippingOption && (
        <div className="space-y-4 mt-6">
          {/* Insurance */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Asuransi</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={isInsured}
                  onCheckedChange={(checked) => setIsInsured(checked === true)}
                />
                <label htmlFor="insurance" className="text-sm font-medium">
                  Asuransikan Kiriman Saya
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Custom COD Section - only show if payment method is COD */}
          {formData?.paymentMethod === "cod" && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Custom COD</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ubah nilai COD yang ditagihkan ke penerima
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Rp</span>
                  <Input
                    type="text"
                    placeholder="Cth: 100.000"
                    value={customCODValue}
                    onChange={(e) => {
                      // Format number with thousands separator
                      const value = e.target.value.replace(/[^\d]/g, "");
                      const formatted = value.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        "."
                      );
                      setCustomCODValue(formatted);
                    }}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Promo Section */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">Pembayaran</h3>
              <div className="bg-yellow-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💡</span>
                  <span className="text-sm font-medium">
                    Lebih hemat, gunakan voucher promo
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <span className="text-lg">➤</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Ekspedisi</span>
                  <span className="font-medium">
                    {selectedShippingOption.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Barang</span>
                  <span className="font-medium">
                    Rp{getItemValue().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span className="font-medium">
                    {selectedShippingOption.price}
                  </span>
                </div>
                {isInsured && (
                  <div className="flex justify-between">
                    <span>Asuransi</span>
                    <span className="font-medium">
                      Rp{getInsuranceCost().toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                {formData?.paymentMethod === "cod" && (
                  <div className="flex justify-between">
                    <span>Biaya COD</span>
                    <span className="font-medium">
                      Rp{getCODFee().toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                <Separator />

                {/* COD specific sections */}
                {formData?.paymentMethod === "cod" ? (
                  <>
                    {customCODValue ? (
                      <div className="flex justify-between">
                        <span className="text-blue-600 font-medium">
                          Ditagihkan penerima
                        </span>
                        <span className="font-medium text-blue-600">
                          Rp{customCODValue}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-blue-600 font-medium">
                          Ditagihkan penerima
                        </span>
                        <span className="font-medium text-blue-600">
                          Rp
                          {(
                            getItemValue() +
                            parseInt(
                              selectedShippingOption.price.replace(/[^\d]/g, "")
                            ) +
                            getCODFee() +
                            getInsuranceCost()
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-green-600 font-medium">
                        Nilai Pencairan
                      </span>
                      <span className="font-medium text-green-600">
                        Rp{getItemValue().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Non-COD: Show total payment */
                  <div className="flex justify-between text-lg font-bold text-blue-600">
                    <span>Total Pembayaran</span>
                    <span>Rp{calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Dengan klik &quot;Proses Paket&quot; kamu menyetujui Syarat &
                  Ketentuan yang berlaku.
                </label>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="w-full h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
                  onClick={handleSubmitOrder}
                  disabled={isSubmittingOrder || !termsAccepted}
                >
                  <CirclePlus className="w-4 h-4" />
                  {isSubmittingOrder ? "Memproses Order..." : "Proses Paket"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {orderResult && (
            <Card
              className={`p-4 ${orderResult.success ? "bg-green-50" : "bg-red-50"}`}
            >
              <div className="flex items-center space-x-2">
                {orderResult.success ? (
                  <span className="text-green-600">✅</span>
                ) : (
                  <span className="text-red-600">❌</span>
                )}
                <span className="text-sm font-medium">
                  {orderResult.message}
                </span>
                {orderResult.awb_no && (
                  <span className="text-sm text-gray-600">
                    AWB: {orderResult.awb_no}
                  </span>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-green-600">
              Order Berhasil Dibuat!
            </DialogTitle>
            {orderResult?.awb_no && (
              <DialogDescription className="text-base">
                <div className="bg-gray-100 p-3 rounded-lg mt-4">
                  <div className="text-sm text-gray-600">AWB Number:</div>
                  <div className="text-lg font-mono font-bold text-gray-900">
                    {orderResult.awb_no}
                  </div>
                </div>
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push("/dashboard/laporan/laporan-pengiriman");
              }}
              className="h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              <FileText className="h-4 w-4" />
              Cek Pengiriman
            </Button>

            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                if (onResetForm) {
                  onResetForm();
                }
                router.push("/dashboard/paket/paket-reguler");
              }}
              className="h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              <Package className="h-4 w-4" />
              Kirim Paket Lagi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
