import { useMemo, useState } from "react";
import { ShippingCard } from "./../ui/shipping-card";

import { Card, CardContent} from "@/components/ui/card";

import { ShippingOption } from "@/lib/shipping-data";

interface ShippingResultsProps {
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

export default function ShippingResults({
  isSearching,
  result,
}: ShippingResultsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
            tags: [{ label: "Potensi retur Rendah", type: "info" }],
          }));
        }
      } catch {
        return [];
      }
    }
    return [];
  }, [result]);

  function isApiErrorResult(obj: unknown): obj is ApiErrorResult {
    return (
      !!obj &&
      typeof obj === "object" &&
      "error" in obj &&
      (obj as Record<string, unknown>)["error"] === true
    );
  }

  // Show loading state
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center h-60">
        <div className="w-12 h-12 border-4 border-blue-300 rounded-full border-t-blue-600 animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500">
          Mencari layanan pengiriman...
        </p>
      </div>
    );
  }

  // Show error state
  if (result && isApiErrorResult(result)) {
    return (
      <div className="p-4 text-red-600">
        {result.message || "Gagal cek ongkir"}
      </div>
    );
  }

  // Debug: tampilkan data mentah jika tidak ada shippingOptions
  if (!shippingOptions.length && result) {
    return (
      <div className="p-4 text-center">
        <div className="text-yellow-600 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-semibold">Tidak Ada Layanan Pengiriman</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Maaf, tidak ada layanan pengiriman yang tersedia untuk rute ini.
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Kemungkinan penyebab:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Lokasi asal atau tujuan belum tersedia di jaringan J&T</li>
            <li>Berat paket melebihi batas maksimal</li>
            <li>Rute pengiriman sedang tidak beroperasi</li>
          </ul>
        </div>
        <details className="mt-3">
          <summary className="text-xs text-gray-400 cursor-pointer">
            Debug Info
          </summary>
          <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto text-left">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // Don't show anything if no results yet
  if (!shippingOptions.length) {
    return null;
  }

  return (
    <div className="animate-slide-up">
      {/* Featured Option Card */}
      {shippingOptions[0] && (
        <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
          
          <CardContent className="relative pt-3">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
              <div className="w-full h-full bg-blue-600 rounded-full blur-2xl"></div>
            </div>
            <ShippingCard
              option={shippingOptions[0]}
              isSelected={selectedOption === shippingOptions[0].id}
              onClick={() => setSelectedOption(shippingOptions[0].id)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
