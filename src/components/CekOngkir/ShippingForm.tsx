import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { SearchInput } from "../ui/search-input";

interface ShippingFormProps {
  onSearch: () => void;
}

export default function ShippingForm({ onSearch }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    originAddress: "",
    destinationAddress: "",
    weight: "1000",
    length: "10",
    width: "10",
    height: "10",
    paymentMethod: "non-cod",
    useInsurance: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-down">
      <Card className="shadow-sm">
        <CardHeader className="p-3 mt-3 ml-3">
          <CardTitle className="text-lg font-semibold">
            Tentukan Alamat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="originAddress" className="text-shipping-label">
              Area Asal<span className="text-red-500">*</span>
            </Label>
            <SearchInput
              id="originAddress"
              placeholder="Mancar, Peterongan, Jombang, Jawa Timur, 61481"
              value={formData.originAddress}
              onChange={(e) => handleChange("originAddress", e.target.value)}
              className="bg-white placeholder:text-shipping-placeholder"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="destinationAddress" className="text-shipping-label">
              Area Tujuan<span className="text-red-500">*</span>
            </Label>
            <SearchInput
              id="destinationAddress"
              placeholder="Sidoharjo (Sidoarjo), Tolangohula, Gorontalo, Gorontalo"
              value={formData.destinationAddress}
              onChange={(e) =>
                handleChange("destinationAddress", e.target.value)
              }
              className="bg-white placeholder:text-shipping-placeholder"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weight" className="text-shipping-label">
              Berat<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="bg-white pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-shipping-label">
                gram
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold">
              Data dimensi (opsional)
            </CardTitle>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="length" className="text-xs text-shipping-label">
                  Panjang
                </Label>
                <div className="relative">
                  <Input
                    id="length"
                    type="number"
                    value={formData.length}
                    onChange={(e) => handleChange("length", e.target.value)}
                    className="bg-white pr-12 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shipping-label">
                    cm
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="width" className="text-xs text-shipping-label">
                  Lebar
                </Label>
                <div className="relative">
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => handleChange("width", e.target.value)}
                    className="bg-white pr-12 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shipping-label">
                    cm
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height" className="text-xs text-shipping-label">
                  Tinggi
                </Label>
                <div className="relative">
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    className="bg-white pr-12 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shipping-label">
                    cm
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-shipping-label">Metode Pembayaran</Label>
            <RadioGroup
              defaultValue="non-cod"
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="payment-cod"
                className={cn(
                  "flex items-center justify-center border rounded-md py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  formData.paymentMethod === "cod" &&
                    "border-blue-400 bg-blue-50"
                )}
              >
                <RadioGroupItem id="payment-cod" value="cod" className="mr-2" />
                COD (Cash On Delivery)
              </Label>
              <Label
                htmlFor="payment-non-cod"
                className={cn(
                  "flex items-center justify-center border rounded-md py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  formData.paymentMethod === "non-cod" &&
                    "border-blue-400 bg-blue-50"
                )}
              >
                <RadioGroupItem
                  id="payment-non-cod"
                  value="non-cod"
                  className="mr-2"
                />
                Non COD
              </Label>
            </RadioGroup>
          </div>

          {/* <div className="space-y-2">
            <Label className="text-shipping-label">
              Ingin Menggunakan Asuransi?
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useInsurance"
                checked={formData.useInsurance}
                onCheckedChange={(checked) =>
                  handleChange("useInsurance", checked as boolean)
                }
              />
              <Label
                htmlFor="useInsurance"
                className="text-sm text-shipping-label cursor-pointer"
              >
                Gunakan Asuransi
              </Label>
            </div>
          </div> */}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300"
          >
            Cek Ongkos Kirim
          </Button>
        </CardFooter>
        <div className="mt-5 rounded-lg bg-yellow-300 border border-shipping-noteBorder bg-shipping-note p-4 animate-fade-in">
          <h4 className="font-medium mb-2">Catatan</h4>
          <ul className="list-disc list-inside text-sm space-y-1.5">
            <li>
              Cek ongkos kirim di halaman ini hanya untuk pengiriman reguler,{" "}
              <span className="font-medium">
                tidak termasuk layanan instant delivery.
              </span>
            </li>
            <li>
              Biaya COD sudah termasuk{" "}
              <span className="font-medium">PPN 11%</span>.
            </li>
          </ul>
        </div>
      </Card>
    </form>
  );
}
