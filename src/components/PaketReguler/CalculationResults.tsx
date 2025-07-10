// No UI imports needed for API result only

// No unused imports needed for API result only

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ShippingOption } from "@/types/dataRegulerForm";
import Image from "next/image";
import { CirclePlus } from "lucide-react";

interface CalculationResultsProps {
  isSearching: boolean;
  result?: Record<string, unknown>;
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
}: CalculationResultsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isInsured, setIsInsured] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);

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
          return contentArr.map((item, index) => ({
            id: `jnt-${item.productType.toLowerCase()}`,
            name: `J&T ${item.name}`,
            logo: "/images/jnt.png",
            price: `Rp${Number(item.cost).toLocaleString("id-ID")}`,
            duration: "3-6 Hari",
            available: true,
            recommended: index === 0, // Opsi pertama sebagai rekomendasi
            tags: [{ label: "Potensi retur Rendah", type: "success" }],
          }));
        }
      } catch {
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
    const insuranceCost = isInsured ? 1000 : 0; // Mock insurance cost
    return shippingCost + insuranceCost;
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
                  <span>Pengiriman</span>
                  <span className="font-medium">
                    {selectedShippingOption.price}
                  </span>
                </div>
                {isInsured && (
                  <div className="flex justify-between">
                    <span>Asuransi</span>
                    <span className="font-medium">Rp1.000</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>Total Pembayaran</span>
                  <span>Rp{calculateTotal().toLocaleString("id-ID")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-2 mb-4">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Dengan klik &quot;Proses Paket&quot; kamu menyetujui Syarat &
                  Ketentuan yang berlaku.
                </label>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="w-full h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
                  onClick={() => {
                    // Handle submit logic here
                    console.log("Submitting package with:", {
                      shipping: selectedShippingOption,
                      insurance: isInsured,
                      total: calculateTotal(),
                    });
                  }}
                >
                  <CirclePlus className="w-4 h-4" />
                  Proses Paket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
