// No UI imports needed for API result only

// No unused imports needed for API result only

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRouter } from "next/navigation";
import { getLabelUrl } from "@/lib/apiClient";
import { toast } from "sonner";
import PaymentFlow from "@/components/Payment/PaymentFlow";
import { CurrencyInput } from "@/components/ui/currency-input";

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
}: CalculationResultsProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isInsured, setIsInsured] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [customCODValue, setCustomCODValue] = useState<string>("");
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    message: string;
    awb_no?: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [labelUrl, setLabelUrl] = useState<string>("");
  const [isLoadingLabel, setIsLoadingLabel] = useState(false);

  // Debug: Log when props change - FIXED: Use useEffect instead of useState
  useEffect(() => {}, [isSearching, result, formData]);

  // Build shippingOptions from API result if present
  const shippingOptions: ShippingOption[] = useMemo(() => {
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

  // Build shipping data for payment
  const buildShippingData = () => {
    if (
      !selectedShippingOption ||
      !formData?.formData ||
      !formData?.businessData
    ) {
      return null;
    }

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

    // Build order data that will be used after payment
    const shippingData: Record<string, unknown> = {
      vendor: "jntexpress",
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

    // Add sender/receiver data
    if (formData.receiverId) {
      shippingData.receiver_id = parseInt(formData.receiverId);
      shippingData.shipper_id = formData.businessData.id;
    } else {
      shippingData.sender = {
        name: formData.businessData.senderName,
        phone: formData.businessData.contact,
        address: formData.businessData.address,
        province: formData.businessData.province || "",
        regency: formData.businessData.regency || "",
        district: formData.businessData.district || "",
      };
      shippingData.receiver = {
        name: formData.formData.receiverName,
        phone: formData.formData.receiverPhone,
        address: formData.formData.receiverAddress,
        province: formData.formData.province,
        regency: formData.formData.regency,
        district: formData.formData.district,
      };
    }

    return shippingData;
  };

  const handleSubmitOrder = () => {
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
      toast.error("Data tidak lengkap untuk melakukan order");
      return;
    }

    // Show payment flow instead of creating order directly
    setShowPaymentFlow(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("Pembayaran berhasil! Order sedang diproses...");

    // Set order result to show success
    setOrderResult({
      success: true,
      message: "Pembayaran berhasil! Order sedang diproses...",
      awb_no: undefined, // AWB will be available after order creation
    });

    setShowPaymentFlow(false);
    setShowSuccessDialog(true);
  };

  const handlePaymentFailed = (error: string) => {
    toast.error(error);
    setShowPaymentFlow(false);
  };

  const handleCancelPayment = () => {
    setShowPaymentFlow(false);
  };

  const handleGetLabelUrl = async () => {
    if (!orderResult?.awb_no) {
      toast.error("AWB number not found");
      return;
    }

    try {
      setIsLoadingLabel(true);
      const response = await getLabelUrl(orderResult.awb_no!);

      if (response.status === "success" && response.data) {
        setLabelUrl(response.data.label_url);
        toast.success("Label URL retrieved successfully!");
      } else {
        toast.error(response.message || "Failed to get label URL");
      }
    } catch (error) {
      console.error("Error getting label URL:", error);
      toast.error("Failed to get label URL");
    } finally {
      setIsLoadingLabel(false);
    }
  };

  const handlePrintLabel = () => {
    if (labelUrl) {
      window.open(labelUrl, "_blank");
    } else {
      toast.error("Please get label URL first");
    }
  };

  const handleViewOrder = () => {
    router.push("/dashboard/laporan/laporan-pengiriman");
    setShowSuccessDialog(false);
  };

  const handleCreateNewOrder = () => {
    router.push("/dashboard/paket/paket-reguler");
    setShowSuccessDialog(false);
  };

  // Show payment flow if triggered
  if (showPaymentFlow) {
    const shippingData = buildShippingData();
    const totalAmount = calculateTotal();

    if (!shippingData) {
      return (
        <div className="p-4 text-red-600">
          Gagal membangun data pengiriman untuk pembayaran
        </div>
      );
    }

    return (
      <PaymentFlow
        shippingData={shippingData}
        amount={totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
        onCancel={handleCancelPayment}
      />
    );
  }

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
                <CurrencyInput
                  placeholder="100.000"
                  value={customCODValue.replace(/\./g, "")} // Remove dots for internal value
                  onChange={(value) => {
                    // Format for display with dots
                    const formatted = value.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      "."
                    );
                    setCustomCODValue(formatted);
                  }}
                  className="w-full"
                />
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
                  disabled={!termsAccepted}
                >
                  <CirclePlus className="w-4 h-4" />
                  Lanjut ke Pembayaran
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
              onClick={handleViewOrder}
              className="h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              <FileText className="h-4 w-4" />
              Cek Pengiriman
            </Button>

            <Button
              onClick={handleCreateNewOrder}
              className="h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              <Package className="h-4 w-4" />
              Kirim Paket Lagi
            </Button>
          </div>

          {/* Label URL Section - Only for JNT Express and when AWB is available */}
          {orderResult?.awb_no && (
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Print Label JNT Express
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Klik tombol di bawah untuk mendapatkan URL label dari JNT
                  Express
                </p>
              </div>

              <Button
                onClick={handleGetLabelUrl}
                disabled={isLoadingLabel}
                className="w-full"
                variant="outline"
              >
                {isLoadingLabel ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    Mengambil Label URL...
                  </>
                ) : (
                  <>📄 Get Label URL</>
                )}
              </Button>

              {labelUrl && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 font-medium">
                    Label URL dari JNT Express:
                  </div>
                  <div className="text-xs text-gray-800 break-all bg-gray-50 p-2 rounded border">
                    {labelUrl}
                  </div>
                  <Button
                    onClick={handlePrintLabel}
                    className="w-full"
                    variant="outline"
                    size="sm"
                  >
                    🖨️ Print Label
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Show message when payment successful but order still processing */}
          {orderResult?.success && !orderResult?.awb_no && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-700">
                📦 Order sedang diproses setelah pembayaran berhasil.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Anda akan menerima notifikasi dan dapat melihat AWB number di
                halaman laporan pengiriman.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
