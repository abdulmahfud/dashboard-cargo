import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sortOptions,
} from "@/lib/shipping-data";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ChevronRight, Tag } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ShippingCard } from "../ui/shipping-card";
import { DiscountCalculation } from "@/types/discount";
import { getAvailableDiscounts } from "@/lib/apiClient";
import type { ShippingOption } from "@/lib/shipping-data";

type GoSendApiResult = {
  status: string;
  message?: string;
  data?: {
    Instant?: {
      shipment_method: string;
      estimated_cost?: number;
      estimated_delivery?: string;
    };
    SameDay?: {
      shipment_method: string;
      estimated_cost?: number;
      estimated_delivery?: string;
    };
    InstantCar?: {
      shipment_method: string;
      estimated_cost?: number;
      estimated_delivery?: string;
    };
  };
  costs?: Array<{
    service_type: string;
    serviceable: boolean;
    estimated_cost?: number;
    estimated_delivery?: string;
    price?: number;
  }>;
};

interface CalculationResultsProps {
  isSearching: boolean;
  result?: {
    gosend?: GoSendApiResult;
    searchData?: Record<string, unknown>;
  };
}

export default function CalculationResults({
  isSearching,
  result,
}: CalculationResultsProps) {
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [sortBy, setSortBy] = useState("fastest");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Discount states
  const [discountsMap, setDiscountsMap] = useState<
    Map<string, DiscountCalculation>
  >(new Map());
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);

  // Generate shipping options from GoSend API result
  const shippingOptions = useMemo(() => {
    const options: ShippingOption[] = [];

    if (!result?.gosend || result.gosend.status !== "success") {
      return options;
    }

    const gosendData = result.gosend;

    // Process costs array from GoSend API
    if (gosendData.costs && Array.isArray(gosendData.costs)) {
      gosendData.costs.forEach((service) => {
        if (service.serviceable && (service.estimated_cost || service.price)) {
          const cost = service.estimated_cost || service.price || 0;

          options.push({
            id: `gosend-${service.service_type.toLowerCase()}`,
            name: `GoSend ${service.service_type}`,
            logo: "/images/gosend.png",
            price: `Rp${cost.toLocaleString("id-ID")}`,
            duration: getDurationLabel(service.service_type),
            available: true,
            recommended: service.service_type === "Instant",
            tags: [
              {
                label: service.service_type === "Instant" ? "Super Cepat" :
                  service.service_type === "InstantCar" ? "Mobil" : "Same Day",
                type: service.service_type === "Instant" ? "info" : "default" as const
              },
            ],
          });
        }
      });
    }

    // Fallback: Process data object from GoSend API
    if (options.length === 0 && gosendData.data) {
      Object.entries(gosendData.data).forEach(([serviceType, serviceData]: [string, { estimated_cost?: number }]) => {
        if (serviceData && serviceData.estimated_cost) {
          options.push({
            id: `gosend-${serviceType.toLowerCase()}`,
            name: `GoSend ${serviceType}`,
            logo: "/images/gosend.png",
            price: `Rp${serviceData.estimated_cost.toLocaleString("id-ID")}`,
            duration: getDurationLabel(serviceType),
            available: true,
            recommended: serviceType === "Instant",
            tags: [
              {
                label: serviceType === "Instant" ? "Super Cepat" :
                  serviceType === "InstantCar" ? "Mobil" : "Same Day",
                type: serviceType === "Instant" ? "info" : "default" as const
              },
            ],
          });
        }
      });
    }

    return options;
  }, [result]);

  // Helper function to get duration label
  const getDurationLabel = (serviceType: string): string => {
    switch (serviceType) {
      case "Instant":
        return "1-2 Jam";
      case "InstantCar":
        return "1-2 Jam";
      case "SameDay":
        return "Hari yang sama";
      default:
        return "1-2 Jam";
    }
  };

  // Filter options based on service type (for instant, all are economy/instant)
  const filteredOptions = useMemo(() => {
    if (shippingOptions.length === 0) return [];

    // For instant packages, all GoSend options are considered economy/instant
    if (selectedServiceType === "economy") {
      return shippingOptions;
    } else if (selectedServiceType === "regular") {
      // No regular options for instant delivery
      return [];
    } else if (selectedServiceType === "cargo") {
      // Only InstantCar for cargo-like deliveries
      return shippingOptions.filter((option) => option.id.includes("instantcar"));
    }
    return shippingOptions;
  }, [selectedServiceType, shippingOptions]);

  // Filter options for instant service types
  const filteredInstantOptions = useMemo(() => {
    if (selectedServiceType === "instant") {
      return filteredOptions.filter(option =>
        option.id.includes("instant") && !option.id.includes("car")
      );
    } else if (selectedServiceType === "car") {
      return filteredOptions.filter(option =>
        option.id.includes("instantcar")
      );
    } else { // "all"
      return filteredOptions;
    }
  }, [selectedServiceType, filteredOptions]);

  // Sort options based on sort criteria
  const sortedOptions = useMemo(() => {
    const optionsToSort = filteredInstantOptions;

    if (sortBy === "cheapest") {
      return [...optionsToSort].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\D/g, ""));
        const priceB = parseInt(b.price.replace(/\D/g, ""));
        return priceA - priceB;
      });
    } else if (sortBy === "fastest") {
      return [...optionsToSort].sort((a, b) => {
        // Handle different duration formats
        const getDurationScore = (duration: string) => {
          if (duration.includes("Jam")) return 1; // GoSend Instant (1-2 Jam)
          if (duration.includes("yang sama")) return 2; // GoSend Same Day
          const days = parseInt(duration.split("-")[0]);
          return isNaN(days) ? 999 : days + 2; // Regular day-based durations
        };

        const scoreA = getDurationScore(a.duration);
        const scoreB = getDurationScore(b.duration);
        return scoreA - scoreB;
      });
    } else if (sortBy === "recommended") {
      return [...optionsToSort].sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return 0;
      });
    }
    return optionsToSort;
  }, [filteredInstantOptions, sortBy]);

  const featuredOption =
    sortedOptions.find((option) => option.recommended) || sortedOptions[0];

  // Load discounts for all options when component mounts or when options change
  useEffect(() => {
    const loadDiscounts = async () => {
      if (!sortedOptions.length) return;

      setIsLoadingDiscounts(true);
      const newDiscountsMap = new Map<string, DiscountCalculation>();

      try {
        // Load discounts for each option
        for (const option of sortedOptions) {
          const shippingCost = parseInt(option.price.replace(/\D/g, ""));

          try {
            const discountResponse = await getAvailableDiscounts({
              vendor: "GOSEND", // All options are GoSend for instant packages
              order_value: shippingCost,
            });

            if (
              discountResponse.status === "success" &&
              discountResponse.data.best_discount
            ) {
              newDiscountsMap.set(
                option.id,
                discountResponse.data.best_discount
              );
            }
          } catch (error) {
            console.error(`Error fetching discount for ${option.name}:`, error);
          }
        }

        setDiscountsMap(newDiscountsMap);
      } catch (error) {
        console.error("Error loading discounts:", error);
      } finally {
        setIsLoadingDiscounts(false);
      }
    };

    if (sortedOptions.length > 0) {
      loadDiscounts();
    }
  }, [sortedOptions]);

  // Instant-specific service types
  const instantServiceTypes = [
    { id: "instant", name: "Motor" },
    { id: "car", name: "Mobil" },
    { id: "all", name: "Semua" },
  ];

  if (!isSearching) {
    return null;
  }

  return (
    <div className="animate-slide-up">
      {/* Featured Option Card */}
      {featuredOption && (
        <Card className="mb-5 border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-medium text-blue-900">
              Promo Terbaik
            </CardTitle>
          </CardHeader>
          <CardContent className="relative pt-3">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
              <div className="w-full h-full bg-blue-600 rounded-full blur-2xl"></div>
            </div>
            <ShippingCard
              option={featuredOption}
              isSelected={selectedOption === featuredOption.id}
              onClick={() => setSelectedOption(featuredOption.id)}
              discountInfo={discountsMap.get(featuredOption.id)}
            />
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">
              Pilih Ekspedisi
            </CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white text-sm h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <div className="px-6">
          <Tabs
            defaultValue="all"
            value={selectedServiceType}
            onValueChange={setSelectedServiceType}
          >
            <TabsList className="grid grid-cols-3 mb-2">
              {instantServiceTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-sm">
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* TabsContent untuk masing-masing tab */}
            {instantServiceTypes.map((type) => (
              <TabsContent key={type.id} value={type.id}>
                <CardContent className="pt-2">
                  {sortedOptions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-2">
                        {result?.gosend?.status === "error"
                          ? "Gagal memuat data pengiriman instant."
                          : !result?.gosend
                            ? "Silakan isi form dan klik 'Cek Ongkir GoSend Instant' untuk melihat opsi pengiriman."
                            : "Tidak ada layanan instant tersedia untuk rute ini."
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result?.gosend?.message || "Pastikan alamat tujuan berada dalam area layanan GoSend."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
                      <AnimatePresence>
                        {sortedOptions.map((option, index) => (
                          <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <ShippingCard
                              option={option}
                              isSelected={selectedOption === option.id}
                              onClick={() => setSelectedOption(option.id)}
                              discountInfo={discountsMap.get(option.id)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Card>

      {/* Payment Section */}
      <Card className="bg-blue-50 p-4 border border-gray-200 rounded-xl mt-5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between bg-yellow-100 p-3 rounded-lg cursor-pointer">
            <div className="flex items-center gap-2 text-sm font-medium text-yellow-900">
              <span className="text-lg">🐱</span>
              Lebih hemat, gunakan voucher promo
            </div>
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Ekspedisi</span>
            <span className="font-medium">
              {selectedOption
                ? sortedOptions.find((opt) => opt.id === selectedOption)
                  ?.name || "Pilih ekspedisi"
                : "Pilih ekspedisi"}
            </span>
          </div>

          {/* Show discount information if available */}
          {selectedOption && discountsMap.get(selectedOption)?.has_discount && (
            <>
              <div className="flex justify-between">
                <span>Pengiriman</span>
                <span>
                  <span className="text-red-500 line-through">
                    Rp{" "}
                    {discountsMap
                      .get(selectedOption)!
                      .original_price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-green-600 font-semibold ml-2">
                    Rp{" "}
                    {discountsMap
                      .get(selectedOption)!
                      .discounted_price.toLocaleString("id-ID")}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lebih Hemat</span>
                <span className="font-medium text-green-600">
                  Rp{" "}
                  {discountsMap
                    .get(selectedOption)!
                    .discount_amount.toLocaleString("id-ID")}
                </span>
              </div>
            </>
          )}

          {/* Show regular pricing if no discount */}
          {selectedOption &&
            !discountsMap.get(selectedOption)?.has_discount && (
              <div className="flex justify-between">
                <span>Pengiriman</span>
                <span className="font-medium">
                  {sortedOptions.find((opt) => opt.id === selectedOption)
                    ?.price || "Rp 0"}
                </span>
              </div>
            )}

          {/* Show loading state */}
          {isLoadingDiscounts && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3 animate-pulse" />
                Mengecek diskon...
              </span>
              <span className="font-medium">-</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Asuransi</span>
            <span className="font-medium">Rp 9.000</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Pembayaran</span>
            <span className="text-blue-700">
              {selectedOption
                ? discountsMap.get(selectedOption)?.has_discount
                  ? `Rp ${(discountsMap.get(selectedOption)!.discounted_price + 9000).toLocaleString("id-ID")}`
                  : `Rp ${(parseInt(sortedOptions.find((opt) => opt.id === selectedOption)?.price.replace(/\D/g, "") || "0") + 9000).toLocaleString("id-ID")}`
                : "Pilih ekspedisi"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <div className="flex items-start gap-2 bg-blue-100 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-700" />
            <div className="text-sm text-blue-900">
              <span className="font-medium">
                Persetujuan Syarat & Ketentuan
              </span>
              <p className="text-xs">
                Dengan klik {"}Proses Paket{"} kamu menyetujui Syarat &
                Ketentuan yang berlaku.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-blue-700 text-blue-700 hover:bg-blue-100"
            >
              + Tambah Paket
            </Button>
            <Button className="flex-1 bg-blue-700 text-white hover:bg-blue-800">
              Proses Paket
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
