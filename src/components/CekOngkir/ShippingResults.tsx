/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from "react";

interface ShippingResultsProps {
  isSearching: boolean;
  result?: Record<string, unknown>;
}

type ApiErrorResult = { error: true; message?: string };

// New types based on the actual API response structure
type ExpeditionApiResponse = {
  status: string;
  data: {
    jnt: any;
    paxel: any;
    lion: any;
    gosend: any;
    jntcargo: any;
    idexpress: any;
    posindonesia: any;
  };
  vendor_status: {
    jnt: string;
    paxel: string;
    lion: string;
    gosend: string;
    jntcargo: string;
    idexpress: string;
    posindonesia: string;
  };
  errors: Record<string, any>;
};

// Expedition configuration with logos and names
const EXPEDITION_CONFIG = [
  {
    key: 'jnt',
    name: 'J&T Express',
    logo: '/images/jnt-express-logo.png',
    fallbackLogo: '/images/jnt.png'
  },
  {
    key: 'paxel',
    name: 'Paxel',
    logo: '/images/paxel-logo.png',
    fallbackLogo: '/images/paxel.png'
  },
  {
    key: 'lion',
    name: 'Lion Parcel',
    logo: '/images/lion-parcel-logo.png',
    fallbackLogo: '/images/lion.png'
  },
  {
    key: 'gosend',
    name: 'GoSend',
    logo: '/images/gosend-logo.png',
    fallbackLogo: '/images/gosend.png'
  },
  {
    key: 'jntcargo',
    name: 'J&T Cargo',
    logo: '/images/jnt-cargo-logo.png',
    fallbackLogo: '/images/jnt-cargo.png'
  },
  {
    key: 'idexpress',
    name: 'ID Express',
    logo: '/images/id-express-logo.png',
    fallbackLogo: '/images/idexpress.png'
  },
  {
    key: 'posindonesia',
    name: 'Pos Indonesia',
    logo: '/images/pos-indonesia-logo.png',
    fallbackLogo: '/images/pos.png'
  }
];

interface ExpeditionCardProps {
  expedition: typeof EXPEDITION_CONFIG[0];
  data: any;
  vendorStatus: string;
  error?: any;
}

function ExpeditionCard({ expedition, data, vendorStatus, error }: ExpeditionCardProps) {
  const getWarningMessage = () => {
    if (vendorStatus === 'rejected' && error) {
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK') {
        return 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.';
      }
      if (error.status === 400) {
        return 'Parameter pengiriman tidak valid untuk ekspedisi ini.';
      }
      if (error.status === 405) {
        return 'Metode tidak didukung untuk ekspedisi ini.';
      }
      if (error.status === 500) {
        return 'Terjadi kesalahan pada server ekspedisi.';
      }
      return 'Layanan tidak tersedia untuk rute ini.';
    }

    if (data && vendorStatus === 'fulfilled') {
      // Handle GoSend distance errors
      if (expedition.key === 'gosend' && data.data) {
        const instant = data.data.Instant;
        const sameDay = data.data.SameDay;

        if (instant?.errors?.length > 0 || sameDay?.errors?.length > 0) {
          const error = instant?.errors?.[0] || sameDay?.errors?.[0];
          if (error?.message?.includes('exceeded')) {
            return `Jarak terlalu jauh (${data.costs?.[0]?.distance || 'N/A'} km). ${error.message}`;
          }
          return error?.message || 'Layanan tidak dapat melayani rute ini.';
        }
      }

      // Handle J&T Cargo service unavailable
      if (expedition.key === 'jntcargo' && data.services) {
        const unavailableServices = data.services.filter((s: any) => !s.available);
        if (unavailableServices.length > 0) {
          return 'Layanan sementara tidak tersedia untuk rute ini.';
        }
      }

      // Handle ID Express
      if (expedition.key === 'idexpress' && !data.success) {
        return data.message || 'Gagal mendapatkan tarif pengiriman.';
      }
    }

    return null;
  };

  const getServiceInfo = () => {
    if (vendorStatus !== 'fulfilled' || !data) {
      return null;
    }

    // Handle GoSend
    if (expedition.key === 'gosend' && data.costs) {
      const availableServices = data.costs.filter((service: any) => service.serviceable);
      if (availableServices.length > 0) {
        return availableServices.map((service: any) => ({
          name: service.service_type,
          price: service.price > 0 ? `Rp${service.price.toLocaleString('id-ID')}` : 'Gratis',
          duration: service.service_type === 'Instant' ? '1-2 jam' : 'Hari yang sama'
        }));
      }
    }

    // Handle J&T Cargo
    if (expedition.key === 'jntcargo' && data.services) {
      const availableServices = data.services.filter((s: any) => s.available);
      if (availableServices.length > 0) {
        return availableServices.map((service: any) => ({
          name: service.service_name,
          price: service.price ? `Rp${service.price.toLocaleString('id-ID')}` : 'Hubungi CS',
          duration: service.estimated_delivery || '2-3 hari'
        }));
      }
    }

    // Handle other expeditions with basic success response
    if (data.success || data.status === 'success') {
      return [{
        name: 'Regular',
        price: 'Tersedia',
        duration: '1-3 hari'
      }];
    }

    return null;
  };

  const warningMessage = getWarningMessage();
  const serviceInfo = getServiceInfo();
  const isAvailable = serviceInfo && serviceInfo.length > 0;

  return (
    <Card className={`mb-4 border transition-all ${isAvailable ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-16 h-12">
              <Image
                src={expedition.logo}
                alt={expedition.name}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = expedition.fallbackLogo;
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{expedition.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={isAvailable ? "default" : "destructive"}
                  className="text-xs"
                >
                  {isAvailable ? "Tersedia" : "Tidak Tersedia"}
                </Badge>
                {vendorStatus === 'fulfilled' && (
                  <Badge variant="outline" className="text-xs">
                    Terhubung
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            {isAvailable && serviceInfo ? (
              <div className="space-y-1">
                {serviceInfo.map((service: { price: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; duration: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, idx: Key | null | undefined) => (
                  <div key={idx} className="text-sm">
                    <div className="font-semibold text-green-600">{service.price}</div>
                    <div className="text-xs text-gray-600">{service.name} • {service.duration}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-orange-600">
                <div className="font-semibold">Tidak Tersedia</div>
                <div className="text-xs">Lihat pesan di bawah</div>
              </div>
            )}
          </div>
        </div>

        {warningMessage && (
          <div className="mt-3 p-3 bg-orange-100 border border-orange-200 rounded-md">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-orange-700">{warningMessage}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ShippingResults({
  isSearching,
  result,
}: ShippingResultsProps) {
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

  // Don't show anything if no results yet
  if (!result) {
    return null;
  }

  const apiResponse = result as ExpeditionApiResponse;

  // Show all expeditions with their status
  return (
    <div className="animate-slide-up space-y-2">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Layanan Ekspedisi Tersedia</h3>
        <p className="text-sm text-gray-600">
          Berikut adalah status semua layanan ekspedisi untuk rute yang Anda pilih:
        </p>
      </div>

      {EXPEDITION_CONFIG.map((expedition) => (
        <ExpeditionCard
          key={expedition.key}
          expedition={expedition}
          data={apiResponse.data[expedition.key as keyof typeof apiResponse.data]}
          vendorStatus={apiResponse.vendor_status[expedition.key as keyof typeof apiResponse.vendor_status]}
          error={apiResponse.errors[expedition.key]}
        />
      ))}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips untuk Mendapatkan Layanan Terbaik</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pilih kota/kabupaten dan kecamatan yang paling dekat dengan alamat sebenarnya</li>
          <li>• Untuk jarak jauh, pertimbangkan menggunakan layanan kargo yang lebih ekonomis</li>
          <li>• Hubungi customer service ekspedisi untuk pengiriman khusus atau berat besar</li>
          <li>• Beberapa layanan mungkin tidak tersedia pada hari libur atau cuaca buruk</li>
        </ul>
      </div>
    </div>
  );
}
