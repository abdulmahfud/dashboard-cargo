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
  serviceTypes,
  shippingOptions,
  sortOptions,
} from "@/lib/shipping-data";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ShippingCard } from "../ui/shipping-card";

interface CalculationResultsProps {
  isSearching: boolean;
}

export default function CalculationResults({ isSearching }: CalculationResultsProps) {
  const [selectedServiceType, setSelectedServiceType] = useState("regular");
  const [sortBy, setSortBy] = useState("cheapest");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Simulasi filter berdasarkan service type
  const filteredOptions = useMemo(() => {
    if (selectedServiceType === "economy") {
      return shippingOptions.filter((option) => {
        const price = parseInt(option.price.replace(/\D/g, ""));
        return price < 100000;
      });
    } else if (selectedServiceType === "regular") {
      return shippingOptions.filter((option) => {
        const price = parseInt(option.price.replace(/\D/g, ""));
        return price >= 100000 && price <= 130000;
      });
    } else if (selectedServiceType === "cargo") {
      return shippingOptions.filter((option) => {
        const price = parseInt(option.price.replace(/\D/g, ""));
        return price > 130000;
      });
    }
    return shippingOptions;
  }, [selectedServiceType]);

  // Sort options based on sort criteria
  const sortedOptions = useMemo(() => {
    if (sortBy === "cheapest") {
      return [...filteredOptions].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\D/g, ""));
        const priceB = parseInt(b.price.replace(/\D/g, ""));
        return priceA - priceB;
      });
    } else if (sortBy === "fastest") {
      return [...filteredOptions].sort((a, b) => {
        const daysA = parseInt(a.duration.split("-")[0]);
        const daysB = parseInt(b.duration.split("-")[0]);
        return daysA - daysB;
      });
    } else if (sortBy === "recommended") {
      return [...filteredOptions].sort((a, b) => {
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return 0;
      });
    }
    return filteredOptions;
  }, [filteredOptions, sortBy]);

  const featuredOption =
    sortedOptions.find((option) => option.recommended) || sortedOptions[0];

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
            defaultValue="regular"
            value={selectedServiceType}
            onValueChange={setSelectedServiceType}
          >
            <TabsList className="grid grid-cols-3 mb-2">
              {serviceTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-sm">
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* TabsContent untuk masing-masing tab */}
            {serviceTypes.map((type) => (
              <TabsContent key={type.id} value={type.id}>
                <CardContent className="pt-2">
                  {sortedOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Tidak ada opsi pengiriman untuk kategori ini.
                    </p>
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
            <span className="font-medium">AnterAja Regular</span>
          </div>
          <div className="flex justify-between">
            <span>Pengiriman</span>
            <span>
              <span className="text-red-500 line-through">Rp 19.500</span>
              <span className="text-green-600 font-semibold"> Rp 18.525</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span>Lebih Hemat</span>
            <span className="font-medium">Rp 975</span>
          </div>
          <div className="flex justify-between">
            <span>Asuransi</span>
            <span className="font-medium">Rp 9.000</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Pembayaran</span>
            <span className="text-blue-700">Rp 27.525</span>
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
