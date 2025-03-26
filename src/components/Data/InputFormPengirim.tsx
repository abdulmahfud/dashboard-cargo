import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchInput } from "./../ui/search-input";
import { useState } from "react";

export default function ShippingForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    senderName: "",
    phoneNumber: "",
    village: "",
    completeAddress: "",
    paymentMethod: "non-cod",
    useInsurance: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-down">
      <Card className="shadow-sm">
        <CardHeader className="p-3 mt-3 ml-3">
          <CardTitle className="text-lg font-semibold">
            Tambah Alamat Asal Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="businessName" className="text-shipping-label">
              Nama Usaha<span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Nama Usaha"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              className="bg-white pr-16"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="businessAddress" className="text-shipping-label">
              Alamat Usaha<span className="text-red-500">*</span>
            </Label>
            <SearchInput
              id="businessAddress"
              placeholder="Alamat Toko, Ruko, Rumah, Kantor dll"
              value={formData.businessAddress}
              onChange={(e) => handleChange("businessAddress", e.target.value)}
              className="bg-white placeholder:text-shipping-placeholder"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="senderName" className="text-shipping-label">
                Nama Pengirim<span className="text-red-500">*</span>
              </Label>
              <Input
                id="senderName"
                type="text"
                placeholder="Sesuai dengan KTP"
                value={formData.senderName}
                onChange={(e) => handleChange("senderName", e.target.value)}
                className="bg-white pr-16"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-shipping-label">
                Nomor Telepon<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="Aktif Whatsapp"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="bg-white pr-16"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="village" className="text-shipping-label">
                Kelurahan<span className="text-red-500">*</span>
              </Label>
              <SearchInput
                id="village"
                placeholder="Pilih sesuai data di daftar"
                value={formData.village}
                onChange={(e) => handleChange("village", e.target.value)}
                className="bg-white placeholder:text-shipping-placeholder"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="completeAddress" className="text-shipping-label">
                Alamat Lengkap<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="completeAddress"
                placeholder="Alamat lengkap seperti Jl. atau RT/RW"
                value={formData.completeAddress}
                onChange={(e) =>
                  handleChange("completeAddress", e.target.value)
                }
                className="bg-white placeholder:text-shipping-placeholder"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Jadikan sebagai alamat utama
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300"
          >
            Simpan Data Pengirim
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
