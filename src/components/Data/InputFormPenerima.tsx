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
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { SearchInput } from "./../ui/search-input";

export default function InputFormPenerima() {
  const [formData, setFormData] = useState({
    recipientName: "",
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
            Tambah Alamat Penerima
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="recipientName" className="text-shipping-label">
                Nama Penerima<span className="text-red-500">*</span>
              </Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="Cth. Desi Ratna"
                value={formData.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
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
                placeholder="085xxxxxx"
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
                placeholder="Cari desa/kelurahan"
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
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300"
          >
            Simpan
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
