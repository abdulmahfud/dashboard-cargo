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
import { DiscountCalculation } from "@/types/discount";
import Image from "next/image";
import {
  CirclePlus,
  CheckCircle,
  Package,
  CreditCard,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createOrderWithPendingPayment,
  getAvailableDiscounts,
} from "@/lib/apiClient";
import { toast } from "sonner";
import { DiscountBadge } from "@/components/ui/discount-badge";

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

type PaxelApiResult = {
  status: string;
  data?: {
    status_code: number;
    message: string;
    data: {
      fixed_price: number;
      time_detail?: Array<{
        service: string;
        time_pickup_start: string;
        time_pickup_end: string;
        time_delivery_start: string;
        time_delivery_end: string;
      }>;
    };
  };
  shipping_costs_with_discount?: Array<unknown>;
};

type LionApiResult = {
  status: string;
  data?: {
    shipping_cost?: number;
    estimated_days?: number;
    service_type?: string;
    product?: string;
    message?: string;
  };
};

type SapApiResult = {
  status: string;
  data?: {
    shipping_cost?: number;
    estimated_days?: number;
    service_type?: string;
    message?: string;
  };
};

type CombinedApiResult = {
  status: string;
  data: {
    jnt: JntApiResult | null;
    paxel: PaxelApiResult | null;
    lion: LionApiResult | null;
    sap: SapApiResult | null;
  };
};

type ApiResult = JntApiResult | PaxelApiResult | CombinedApiResult;

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

  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    message: string;
    awb_no?: string;
    order_id?: number;
    reference_no?: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Discount states
  const [discountInfo, setDiscountInfo] = useState<DiscountCalculation | null>(
    null
  );
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);

  // Reset selection state when form data or result changes
  useEffect(() => {
    // Reset all selection states when new data comes in
    setSelectedOption(null);
    setShowPaymentSection(false);
    setDiscountInfo(null);
    setIsInsured(false);
    setCustomCODValue("");
    setOrderResult(null);
    setShowSuccessDialog(false);
    setTermsAccepted(false);
  }, [result]); // Only depend on result changes, not isSearching or formData

  // Build shippingOptions from API result if present
  const shippingOptions: ShippingOption[] = useMemo(() => {
    const apiResult = result as ApiResult;

    // Handle combined results from all APIs
    if (
      apiResult &&
      apiResult.status === "success" &&
      apiResult.data &&
      "jnt" in apiResult.data &&
      "paxel" in apiResult.data &&
      "lion" in apiResult.data
    ) {
      const combinedData = apiResult.data as CombinedApiResult["data"];
      const options: ShippingOption[] = [];

      // Process JNT results
      if (combinedData.jnt && combinedData.jnt.status === "success") {
        const jntData = combinedData.jnt;
        if (jntData.data && typeof jntData.data.content === "string") {
          try {
            const contentArr = JSON.parse(jntData.data.content) as Array<{
              cost: string;
              name: string;
              productType: string;
            }>;

            if (Array.isArray(contentArr) && contentArr.length > 0) {
              contentArr.forEach((item, index) => {
                options.push({
                  id: `jnt-${item.productType.toLowerCase()}`,
                  name: `J&T ${item.name}`,
                  logo: "/images/jnt.png",
                  price: `Rp${Number(item.cost).toLocaleString("id-ID")}`,
                  duration: "3-6 Hari",
                  available: true,
                  recommended: index === 0,
                  tags: [
                    { label: "Potensi retur Rendah", type: "success" as const },
                  ],
                });
              });
            }
          } catch (error) {
            console.error("❌ Error parsing JNT options:", error);
          }
        }
      }

      // Process Paxel results
      if (combinedData.paxel && combinedData.paxel.status === "success") {
        const paxelData = combinedData.paxel.data?.data;
        if (paxelData?.fixed_price) {
          const fixedPrice = paxelData.fixed_price;

          console.log("🔍 Paxel data received:", paxelData);

          // Add same-day service if available
          if (
            paxelData.time_detail?.some(
              (time: { service: string }) => time.service === "same_day"
            )
          ) {
            options.push({
              id: "paxel-same-day",
              name: "Paxel Same Day",
              logo: "/images/paxel.png",
              price: `Rp${fixedPrice.toLocaleString("id-ID")}`,
              duration: "Same Day",
              available: true,
              recommended: true,
              tags: [{ label: "Same Day Delivery", type: "success" as const }],
            });
          }

          // Add next-day service if available
          if (
            paxelData.time_detail?.some(
              (time: { service: string }) => time.service === "next_day"
            )
          ) {
            options.push({
              id: "paxel-next-day",
              name: "Paxel Next Day",
              logo: "/images/paxel.png",
              price: `Rp${fixedPrice.toLocaleString("id-ID")}`,
              duration: "1-3 Hari",
              available: true,
              recommended: false,
              tags: [{ label: "Pengiriman Cepat", type: "success" as const }],
            });
          }

          // If no specific services found, create a general option
          if (
            !paxelData.time_detail?.some(
              (time: { service: string }) =>
                time.service === "same_day" || time.service === "next_day"
            )
          ) {
            options.push({
              id: "paxel-regular",
              name: "Paxel Regular",
              logo: "/images/paxel.png",
              price: `Rp${fixedPrice.toLocaleString("id-ID")}`,
              duration: "1-2 Hari",
              available: true,
              recommended: true,
              tags: [{ label: "Fast Delivery", type: "success" as const }],
            });
          }
        }
      }

      // Process Lion results
      if (combinedData.lion && combinedData.lion.status === "success") {
        const lionData = combinedData.lion.data;
        if (lionData?.shipping_cost && lionData.shipping_cost > 0) {
          const shippingCost = lionData.shipping_cost;
          const estimatedDays = lionData.estimated_days || 5;
          const productName = lionData.product || "REGPACK";

          console.log("🔍 Lion data received:", lionData);

          options.push({
            id: "lion-regular",
            name: `Lion Parcel ${productName}`,
            logo: "/images/lion.png",
            price: `Rp${shippingCost.toLocaleString("id-ID")}`,
            duration: `${estimatedDays}-${estimatedDays + 2} Hari`,
            available: true,
            recommended: false,
            tags: [
              { label: "Pengiriman Terjangkau", type: "success" as const },
              { label: productName, type: "info" as const },
            ],
          });
        }
      }

      // Process SAP results
      if (combinedData.sap && combinedData.sap.status === "success") {
        const sapData = combinedData.sap.data;
        if (sapData?.shipping_cost && sapData.shipping_cost > 0) {
          const shippingCost = sapData.shipping_cost;
          const estimatedDays = sapData.estimated_days || 3;
          const serviceType = sapData.service_type || "REGULER";

          console.log("🔍 SAP data received:", sapData);

          options.push({
            id: "sap-regular",
            name: `SAP ${serviceType}`,
            logo: "/images/sap-new.png",
            price: `Rp${shippingCost.toLocaleString("id-ID")}`,
            duration: `${estimatedDays}-${estimatedDays + 2} Hari`,
            available: true,
            recommended: false,
            tags: [
              { label: "Pengiriman Cepat", type: "success" as const },
              { label: serviceType, type: "info" as const },
            ],
          });
        }
      }

      console.log("🚀 Combined options created:", options);
      return options;
    }

    // Fallback: Handle single API response (for backward compatibility)
    if (
      apiResult &&
      apiResult.status === "success" &&
      apiResult.data &&
      "content" in apiResult.data &&
      typeof apiResult.data.content === "string"
    ) {
      try {
        const contentArr = JSON.parse(apiResult.data.content) as Array<{
          cost: string;
          name: string;
          productType: string;
        }>;

        if (Array.isArray(contentArr) && contentArr.length > 0) {
          const options = contentArr.map((item, index) => ({
            id: `jnt-${item.productType.toLowerCase()}`,
            name: `J&T ${item.name}`,
            logo: "/images/jnt.png",
            price: `Rp${Number(item.cost).toLocaleString("id-ID")}`,
            duration: "1-3 Hari",
            available: true,
            recommended: index === 0,
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

  // Handle error responses and invalid data
  if (!isSearching && !shippingOptions.length && result) {
    // Check if result is an error response
    if (typeof result === "object" && result !== null) {
      // Handle API error responses
      if ("error" in result || "message" in result) {
        const errorMessage = String(
          (result as Record<string, unknown>).message ||
            (result as Record<string, unknown>).error ||
            "Terjadi kesalahan pada server"
        );
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">Gagal memuat opsi pengiriman</span>
            </div>
            <p className="text-red-700 text-sm">{errorMessage}</p>
            <p className="text-red-600 text-xs mt-2">
              Silakan coba lagi atau hubungi support jika masalah berlanjut.
            </p>
          </div>
        );
      }

      // Handle empty or invalid response structure
      if (Object.keys(result).length === 0) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-600 mb-2">
              <span className="text-lg">ℹ️</span>
              <span className="font-medium">
                Tidak ada opsi pengiriman tersedia
              </span>
            </div>
            <p className="text-yellow-700 text-sm">
              Untuk rute pengiriman ini belum tersedia layanan ekspedisi.
            </p>
            <p className="text-yellow-600 text-xs mt-2">
              Coba ubah alamat pengirim atau tujuan pengiriman.
            </p>
          </div>
        );
      }
    }

    // Fallback: Show raw data for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <span className="text-lg">🔍</span>
            <span className="font-medium">Debug: Response Data</span>
          </div>
          <p className="text-gray-700 text-sm mb-2">
            Tidak ada opsi pengiriman ditemukan dari response berikut:
          </p>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      );
    }

    // Production fallback
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <span className="text-lg">ℹ️</span>
          <span className="font-medium">Tidak ada opsi pengiriman</span>
        </div>
        <p className="text-gray-700 text-sm">
          Untuk rute pengiriman ini belum tersedia layanan ekspedisi.
        </p>
      </div>
    );
  }

  if (!isSearching && !shippingOptions.length) {
    return null;
  }

  const handleShippingSelect = (optionId: string) => {
    // If clicking the same option, do nothing
    if (selectedOption === optionId) {
      return;
    }

    // Reset discount info first
    setDiscountInfo(null);

    // Set new selection
    setSelectedOption(optionId);
    setShowPaymentSection(true);

    // Calculate discount when shipping option is selected
    calculateDiscount(optionId);
  };

  // Function to calculate discount for selected shipping option
  const calculateDiscount = async (optionId: string) => {
    const option = shippingOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    try {
      setIsLoadingDiscount(true);

      // Extract cost from price string
      const shippingCost = parseInt(option.price.replace(/[^\d]/g, ""));

      // Determine vendor based on option ID
      let vendor = "JNTEXPRESS";
      if (optionId.startsWith("paxel")) {
        vendor = "PAXEL";
      } else if (optionId.startsWith("lion")) {
        vendor = "LION";
      } else if (optionId.startsWith("sap")) {
        vendor = "SAP";
      }

      // Get discount for the selected vendor
      // Don't send service_type to match discounts with null service_type (applies to all services)
      const discountParams = {
        vendor: vendor,
        order_value: shippingCost,
      };

      const discountResponse = await getAvailableDiscounts(discountParams);

      if (
        discountResponse.status === "success" &&
        discountResponse.data.best_discount
      ) {
        setDiscountInfo(discountResponse.data.best_discount);
      } else {
        setDiscountInfo(null);
      }
    } catch (error) {
      console.error("Error fetching discount:", error);
      setDiscountInfo(null);
    } finally {
      setIsLoadingDiscount(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedShippingOption) return 0;

    // Use discounted price if available, otherwise use original price
    const shippingCost = discountInfo?.has_discount
      ? discountInfo.discounted_price
      : parseInt(selectedShippingOption.price.replace(/[^\d]/g, ""));

    const itemValue = parseInt(formData?.itemValue || "0");
    const isCOD = formData?.paymentMethod === "cod";

    // COD fee: 4% of item value
    const codFee = isCOD ? Math.round(itemValue * 0.04) : 0;

    // Insurance: 0.2% of item value when checked
    const insuranceCost = isInsured ? Math.round(itemValue * 0.002) : 0;

    if (isCOD) {
      // For COD: User pays shipping + COD fee + insurance
      // (Item value is collected from recipient via COD)
      return shippingCost + codFee + insuranceCost;
    } else {
      // For non-COD: User pays shipping cost + insurance only
      // (Item value is paid directly to seller, not through shipping)
      return shippingCost + insuranceCost;
    }
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
      vendor: selectedOption?.startsWith("paxel")
        ? "paxel"
        : selectedOption?.startsWith("lion")
          ? "lion"
          : selectedOption?.startsWith("sap")
            ? "sap"
            : "jntexpress", // Determine vendor from selected option
      service_code: "1", // Default service code
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

    // Add vendor-specific data
    if (selectedOption?.startsWith("paxel")) {
      shippingData.vendor = "paxel";
      shippingData.service_code = selectedOption?.includes("same-day")
        ? "SAMEDAY"
        : "REGULER";
    } else if (selectedOption?.startsWith("lion")) {
      shippingData.vendor = "lion";
      shippingData.service_code = "REGULER";
    } else if (selectedOption?.startsWith("sap")) {
      shippingData.vendor = "sap";
      shippingData.service_code = "REGULER";
    }

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

  const handleSubmitOrder = async () => {
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

    try {
      // Create order directly with pending payment status
      const shippingData = buildShippingData();
      const totalAmount = calculateTotal();

      if (!shippingData) {
        toast.error("Gagal membangun data pengiriman");
        return;
      }

      // Call API to create order with pending payment status
      const orderResponse = await createOrderWithPendingPayment({
        shipping_data: shippingData,
        amount: totalAmount,
      });

      if (orderResponse.success && orderResponse.data) {
        handleOrderSuccess({
          order_id: orderResponse.data.order_id,
          reference_no: orderResponse.data.reference_no,
        });
      } else {
        toast.error(orderResponse.message || "Gagal membuat order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Terjadi kesalahan saat membuat order");
    }
  };

  const handleOrderSuccess = (orderData: {
    order_id: number;
    reference_no: string;
  }) => {
    toast.success(
      "Order berhasil dibuat! Silakan lakukan pembayaran di menu Pembayaran Paket."
    );

    // Set order result to show success with order ID
    setOrderResult({
      success: true,
      message: "Order berhasil dibuat! Silakan lakukan pembayaran.",
      awb_no: undefined, // AWB will be available after payment and expedition processing
      order_id: orderData.order_id,
      reference_no: orderData.reference_no,
    });

    setShowSuccessDialog(true);
  };

  const handleCreateNewOrder = () => {
    router.push("/dashboard/paket/paket-reguler");
    setShowSuccessDialog(false);
  };

  // No payment flow needed - orders go directly to pending payment status

  return (
    <div className="animate-slide-up space-y-4">
      {/* Shipping Options List */}
      {shippingOptions.map((option) => (
        <Card
          key={`${option.id}-${selectedOption === option.id ? "selected" : "unselected"}`}
          className={`cursor-pointer transition-all duration-200 ${
            selectedOption === option.id
              ? "border-blue-500 bg-blue-50"
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
                    {/* Show discounted price if available and this option is selected */}
                    {selectedOption === option.id &&
                    discountInfo?.has_discount ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">
                          Rp{" "}
                          {discountInfo.discounted_price.toLocaleString(
                            "id-ID"
                          )}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          Rp{" "}
                          {discountInfo.original_price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {option.price}
                      </span>
                    )}
                    {option.originalPrice &&
                      !(
                        selectedOption === option.id &&
                        discountInfo?.has_discount
                      ) && (
                        <span className="text-sm text-gray-500 line-through">
                          {option.originalPrice}
                        </span>
                      )}
                  </div>

                  {/* Show discount badge if available and this option is selected */}
                  {selectedOption === option.id &&
                    discountInfo?.has_discount && (
                      <div className="mt-1">
                        <DiscountBadge
                          discountType={discountInfo.discount_type}
                          discountValue={discountInfo.discount_value}
                          discountAmount={discountInfo.discount_amount}
                          showAmount={true}
                          className="text-xs"
                        />
                      </div>
                    )}

                  {/* Show loading discount indicator */}
                  {selectedOption === option.id && isLoadingDiscount && (
                    <div className="mt-1 flex items-center space-x-1">
                      <Tag className="h-3 w-3 animate-pulse text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Mengecek diskon...
                      </span>
                    </div>
                  )}
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
                  <div className="text-right">
                    {discountInfo?.has_discount ? (
                      <div className="space-y-1">
                        <div className="font-medium text-green-600">
                          Rp{" "}
                          {discountInfo.discounted_price.toLocaleString(
                            "id-ID"
                          )}
                        </div>
                        <div className="text-xs text-gray-500 line-through">
                          Rp{" "}
                          {discountInfo.original_price.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ) : (
                      <span className="font-medium">
                        {selectedShippingOption.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Show discount savings */}
                {discountInfo?.has_discount && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Hemat Diskon</span>
                    <span className="font-medium text-sm">
                      -Rp {discountInfo.discount_amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
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
                  Buat Order
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
            <DialogDescription className="text-base">
              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                {orderResult?.order_id && (
                  <div className="text-sm text-blue-600 mb-2">
                    Order ID: #{orderResult.order_id}
                  </div>
                )}
                {orderResult?.reference_no && (
                  <div className="text-sm text-blue-600 mb-2">
                    Reference: {orderResult.reference_no}
                  </div>
                )}
                <div className="text-sm text-blue-700">
                  Status: Menunggu Pembayaran
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              onClick={() => router.push("/dashboard/paket/pembayaran-paket")}
              className="h-11 px-6 py-4 font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 text-sm flex items-center gap-2 rounded shadow-md transition duration-300 ease-in-out"
            >
              <CreditCard className="h-4 w-4" />
              Lakukan Pembayaran
            </Button>

            <Button
              onClick={handleCreateNewOrder}
              variant="outline"
              className="h-11 px-6 py-4 font-semibold text-sm flex items-center gap-2 rounded shadow-md transition duration-300 ease-in-out"
            >
              <Package className="h-4 w-4" />
              Kirim Paket Lagi
            </Button>
          </div>

          {/* Show message when payment successful but order still processing */}
          {orderResult?.success && !orderResult?.awb_no && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-blue-700">
                📦 Order berhasil dibuat dan sedang diproses setelah pembayaran
                berhasil.
              </p>
              {orderResult.order_id && (
                <p className="text-xs text-blue-600 mt-2">
                  Order ID: #{orderResult.order_id}
                </p>
              )}
              <p className="text-xs text-blue-600 mt-2">
                Status: Belum Diproses → Akan diproses ke ekspedisi dalam
                beberapa menit.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Anda dapat melihat status terkini di halaman laporan pengiriman.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
