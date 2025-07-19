"use client";

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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  createReceiver,
} from "@/lib/apiClient";
import type { Province, Regency, District } from "@/types/dataRegulerForm";
import type { ReceiverFormData } from "@/types/dataPenerima";
import { useAuth } from "@/context/AuthContext";

interface InputFormPenerimaProps {
  onReceiverAdded?: () => void;
}

export default function InputFormPenerima({
  onReceiverAdded,
}: InputFormPenerimaProps) {
  const { user } = useAuth();
  const [provinceOptions, setProvinceOptions] = useState<Province[]>([]);
  const [regencyOptions, setRegencyOptions] = useState<Regency[]>([]);
  const [districtOptions, setDistrictOptions] = useState<District[]>([]);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [regencySearch, setRegencySearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedRegencyName, setSelectedRegencyName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingRegency, setLoadingRegency] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<ReceiverFormData>({
    name: "",
    phone: "",
    contact: "",
    email: "",
    address: "",
    province: "",
    regency: "",
    district: "",
    postal_code: "",
  });

  // Province search and fetch
  useEffect(() => {
    if (provinceSearch.length >= 3) {
      setLoadingProvince(true);
      getProvinces().then((res) => {
        setProvinceOptions(
          res.data.filter((prov) =>
            prov.name.toLowerCase().includes(provinceSearch.toLowerCase())
          )
        );
        setLoadingProvince(false);
      });
    } else {
      setProvinceOptions([]);
    }
  }, [provinceSearch]);

  // Regency search and fetch
  useEffect(() => {
    if (formData.province && regencySearch.length >= 3) {
      setLoadingRegency(true);
      getRegencies(Number(formData.province)).then((res) => {
        setRegencyOptions(
          res.data.filter((reg) =>
            reg.name.toLowerCase().includes(regencySearch.toLowerCase())
          )
        );
        setLoadingRegency(false);
      });
    } else {
      setRegencyOptions([]);
    }
  }, [formData.province, regencySearch]);

  // District search and fetch
  useEffect(() => {
    if (formData.regency && districtSearch.length >= 3) {
      setLoadingDistrict(true);
      getDistricts(Number(formData.regency)).then((res) => {
        setDistrictOptions(
          res.data.filter((dist) =>
            dist.name.toLowerCase().includes(districtSearch.toLowerCase())
          )
        );
        setLoadingDistrict(false);
      });
    } else {
      setDistrictOptions([]);
    }
  }, [formData.regency, districtSearch]);

  const handleChange = (field: keyof ReceiverFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama penerima harus diisi";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else {
      // Validate phone number format (Indonesian phone numbers)
      const phoneRegex = /^(08|62)\d{8,13}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ""))) {
        newErrors.phone =
          "Format nomor telepon tidak valid. Gunakan format: 08XXXXXXXXXX";
      }
    }

    // Validate email format if provided
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.province) {
      newErrors.province = "Provinsi harus dipilih";
    }

    if (!formData.regency) {
      newErrors.regency = "Kota/Kabupaten harus dipilih";
    }

    if (!formData.district) {
      newErrors.district = "Kecamatan harus dipilih";
    }

    if (!formData.postal_code) {
      newErrors.postal_code = "Kode POS harus diisi";
    }

    if (!formData.address) {
      newErrors.address = "Alamat harus diisi";
    }

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Show the first error as toast
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user from AuthContext
      if (!user || !user.id) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        return;
      }

      const receiverData = {
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        contact: formData.name, // Set contact sama dengan name sesuai requirement
        email: formData.email || undefined,
        address: formData.address || undefined,
        province: selectedProvinceName || undefined,
        regency: selectedRegencyName || undefined,
        district: selectedDistrictName || undefined,
        postal_code: formData.postal_code || undefined,
      };

      await createReceiver(receiverData);

      toast.success("Data penerima berhasil disimpan!");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        contact: "",
        email: "",
        address: "",
        province: "",
        regency: "",
        district: "",
        postal_code: "",
      });

      // Reset errors
      setErrors({});

      // Reset location searches
      setProvinceSearch("");
      setRegencySearch("");
      setDistrictSearch("");
      setSelectedProvinceName("");
      setSelectedRegencyName("");
      setSelectedDistrictName("");

      // Notify parent component
      if (onReceiverAdded) {
        onReceiverAdded();
      }
    } catch (error) {
      console.error("Error creating receiver:", error);
      toast.error("Gagal menyimpan data penerima");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-shipping-label">
              Nama Penerima<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nama lengkap penerima"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`bg-white ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-shipping-label">
                Nomor Telepon<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="number"
                placeholder="08XXXXXXXXXX"
                maxLength={15}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`bg-white ${errors.phone ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-shipping-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`bg-white ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Location Dropdowns */}
          <div className="space-y-4">
            {/* Province Dropdown */}
            <div className="relative">
              <Label htmlFor="province" className="text-shipping-label">
                Provinsi<span className="text-red-500">*</span>
              </Label>
              <Input
                id="province"
                placeholder="Cari provinsi..."
                value={provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  handleChange("province", "");
                  handleChange("regency", "");
                  handleChange("district", "");
                  setSelectedProvinceName("");
                  setSelectedRegencyName("");
                  setSelectedDistrictName("");
                  setRegencySearch("");
                  setDistrictSearch("");
                }}
                autoComplete="off"
                className={`bg-white ${errors.province ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.province && (
                <p className="text-sm text-red-500">{errors.province}</p>
              )}
              {provinceSearch.length >= 3 && !formData.province && (
                <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                  {loadingProvince ? (
                    <div className="p-2 text-sm text-gray-500">Loading...</div>
                  ) : provinceOptions.length > 0 ? (
                    provinceOptions.map((prov) => (
                      <div
                        key={prov.id}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          handleChange("province", String(prov.id));
                          setProvinceSearch(prov.name);
                          setSelectedProvinceName(prov.name);
                          setRegencySearch("");
                          setDistrictSearch("");
                        }}
                      >
                        {prov.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      Tidak ada hasil
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Regency Dropdown */}
            <div className="relative">
              <Label htmlFor="regency" className="text-shipping-label">
                Kota/Kabupaten<span className="text-red-500">*</span>
              </Label>
              <Input
                id="regency"
                placeholder="Cari kota/kabupaten..."
                value={regencySearch}
                onChange={(e) => {
                  setRegencySearch(e.target.value);
                  handleChange("regency", "");
                  handleChange("district", "");
                  setSelectedRegencyName("");
                  setSelectedDistrictName("");
                  setDistrictSearch("");
                }}
                disabled={!formData.province}
                autoComplete="off"
                className={`bg-white ${errors.regency ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.regency && (
                <p className="text-sm text-red-500">{errors.regency}</p>
              )}
              {formData.province &&
                regencySearch.length >= 3 &&
                !formData.regency && (
                  <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                    {loadingRegency ? (
                      <div className="p-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : regencyOptions.length > 0 ? (
                      regencyOptions.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleChange("regency", String(reg.id));
                            setRegencySearch(reg.name);
                            setSelectedRegencyName(reg.name);
                            setDistrictSearch("");
                          }}
                        >
                          {reg.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada hasil
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* District Dropdown */}
            <div className="relative">
              <Label htmlFor="district" className="text-shipping-label">
                Kecamatan<span className="text-red-500">*</span>
              </Label>
              <Input
                id="district"
                placeholder="Cari kecamatan..."
                value={districtSearch}
                onChange={(e) => {
                  setDistrictSearch(e.target.value);
                  handleChange("district", "");
                  setSelectedDistrictName("");
                }}
                disabled={!formData.regency}
                autoComplete="off"
                className={`bg-white ${errors.district ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {errors.district && (
                <p className="text-sm text-red-500">{errors.district}</p>
              )}
              {formData.regency &&
                districtSearch.length >= 3 &&
                !formData.district && (
                  <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                    {loadingDistrict ? (
                      <div className="p-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : districtOptions.length > 0 ? (
                      districtOptions.map((dist) => (
                        <div
                          key={dist.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            handleChange("district", String(dist.id));
                            setDistrictSearch(dist.name);
                            setSelectedDistrictName(dist.name);
                          }}
                        >
                          {dist.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada hasil
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="postal_code" className="text-shipping-label">
              Kode Pos
            </Label>
            <Input
              id="postal_code"
              type="text"
              placeholder="12345"
              value={formData.postal_code}
              onChange={(e) => handleChange("postal_code", e.target.value)}
              className={`bg-white ${errors.postal_code ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {errors.postal_code && (
              <p className="text-sm text-red-500">{errors.postal_code}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-shipping-label">
              Alamat Lengkap
            </Label>
            <Textarea
              id="address"
              placeholder="Alamat lengkap seperti Jl. atau RT/RW"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={`bg-white placeholder:text-shipping-placeholder ${errors.address ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Data Penerima"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
