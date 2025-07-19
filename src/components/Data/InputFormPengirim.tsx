"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  createShipper,
} from "@/lib/apiClient";
import type {
  Province,
  Regency,
  District,
  ShipperFormData,
  ShipperFormErrors,
} from "@/types/dataPengirim";
import { useAuth } from "@/context/AuthContext";

interface InputFormPengirimProps {
  onShipperCreated?: () => void;
}

export default function InputFormPengirim({
  onShipperCreated,
}: InputFormPengirimProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
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

  const [formData, setFormData] = useState<ShipperFormData>({
    name: "",
    phone: "",
    contact: "",
    email: "",
    address: "",
    province_id: "",
    regency_id: "",
    district_id: "",
    postal_code: "",
  });

  const [errors, setErrors] = useState<ShipperFormErrors>({});

  // Province search and fetch
  useEffect(() => {
    if (provinceSearch.length >= 3) {
      setLoadingProvince(true);
      getProvinces()
        .then((res) => {
          setProvinceOptions(
            res.data.filter((prov) =>
              prov.name.toLowerCase().includes(provinceSearch.toLowerCase())
            )
          );
          setLoadingProvince(false);
        })
        .catch((error) => {
          console.error("Error loading provinces:", error);
          setLoadingProvince(false);
        });
    } else {
      setProvinceOptions([]);
    }
  }, [provinceSearch]);

  // Regency search and fetch
  useEffect(() => {
    if (formData.province_id && regencySearch.length >= 3) {
      setLoadingRegency(true);
      getRegencies(Number(formData.province_id))
        .then((res) => {
          setRegencyOptions(
            res.data.filter((reg) =>
              reg.name.toLowerCase().includes(regencySearch.toLowerCase())
            )
          );
          setLoadingRegency(false);
        })
        .catch((error) => {
          console.error("Error loading regencies:", error);
          setLoadingRegency(false);
        });
    } else {
      setRegencyOptions([]);
    }
  }, [formData.province_id, regencySearch]);

  // District search and fetch
  useEffect(() => {
    if (formData.regency_id && districtSearch.length >= 3) {
      setLoadingDistrict(true);
      getDistricts(Number(formData.regency_id))
        .then((res) => {
          setDistrictOptions(
            res.data.filter((dist) =>
              dist.name.toLowerCase().includes(districtSearch.toLowerCase())
            )
          );
          setLoadingDistrict(false);
        })
        .catch((error) => {
          console.error("Error loading districts:", error);
          setLoadingDistrict(false);
        });
    } else {
      setDistrictOptions([]);
    }
  }, [formData.regency_id, districtSearch]);

  const handleChange = (field: keyof ShipperFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ShipperFormErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Nama pengirim wajib diisi";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (!/^\d+$/.test(formData.phone) || formData.phone.length < 10) {
      newErrors.phone = "Nomor telepon harus berupa angka minimal 10 digit";
    }

    if (formData.email.trim()) {
      // Hanya cek format jika ada isi
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Format email tidak valid";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Alamat wajib diisi";
    }

    if (!formData.province_id) {
      newErrors.province_id = "Provinsi wajib dipilih";
    }

    if (!formData.regency_id) {
      newErrors.regency_id = "Kabupaten/Kota wajib dipilih";
    }

    if (!formData.district_id) {
      newErrors.district_id = "Kecamatan wajib dipilih";
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = "Kode pos wajib diisi";
    } else if (!/^\d{5}$/.test(formData.postal_code)) {
      newErrors.postal_code = "Kode pos harus 5 digit angka";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      setIsLoading(true);

      // Get user ID from AuthContext
      if (!user || !user.id) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        return;
      }

      const shipperData = {
        user_id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        contact: formData.name.trim(), // contact sama dengan name sesuai requirement
        email: formData.email.trim(),
        address: formData.address.trim(),
        province: selectedProvinceName || "",
        regency: selectedRegencyName || "",
        district: selectedDistrictName || "",
        postal_code: formData.postal_code.trim(),
      };

      const response = await createShipper(shipperData);

      if (response.success) {
        toast.success("Data pengirim berhasil disimpan!");

        // Reset form
        setFormData({
          name: "",
          phone: "",
          contact: "",
          email: "",
          address: "",
          province_id: "",
          regency_id: "",
          district_id: "",
          postal_code: "",
        });
        setErrors({});

        // Reset location searches
        setProvinceSearch("");
        setRegencySearch("");
        setDistrictSearch("");
        setSelectedProvinceName("");
        setSelectedRegencyName("");
        setSelectedDistrictName("");

        // Notify parent component
        if (onShipperCreated) {
          onShipperCreated();
        }
      } else {
        toast.error(response.message || "Gagal menyimpan data pengirim");
      }
    } catch (error: unknown) {
      console.error("Error creating shipper:", error);
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
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
          {/* Nama Pengirim */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-shipping-label">
              Nama Pengirim<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nama pengirim / nama perusahaan"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`bg-white ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-shipping-label">
                Nomor Telepon<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="number"
                maxLength={15}
                placeholder="08XXXXXXXXXX"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`bg-white ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-shipping-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`bg-white ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
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
                  handleChange("province_id", "");
                  handleChange("regency_id", "");
                  handleChange("district_id", "");
                  setSelectedProvinceName("");
                  setSelectedRegencyName("");
                  setSelectedDistrictName("");
                  setRegencySearch("");
                  setDistrictSearch("");
                }}
                autoComplete="off"
                className={`bg-white ${errors.province_id ? "border-red-500" : ""}`}
              />
              {errors.province_id && (
                <p className="text-red-500 text-sm">{errors.province_id}</p>
              )}
              {provinceSearch.length >= 3 && !formData.province_id && (
                <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                  {loadingProvince ? (
                    <div className="p-2 text-sm text-gray-500">Loading...</div>
                  ) : provinceOptions.length > 0 ? (
                    provinceOptions.map((prov) => (
                      <div
                        key={prov.id}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          handleChange("province_id", String(prov.id));
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
                  handleChange("regency_id", "");
                  handleChange("district_id", "");
                  setSelectedRegencyName("");
                  setSelectedDistrictName("");
                  setDistrictSearch("");
                }}
                disabled={!formData.province_id}
                autoComplete="off"
                className={`bg-white ${errors.regency_id ? "border-red-500" : ""}`}
              />
              {errors.regency_id && (
                <p className="text-red-500 text-sm">{errors.regency_id}</p>
              )}
              {formData.province_id &&
                regencySearch.length >= 3 &&
                !formData.regency_id && (
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
                            handleChange("regency_id", String(reg.id));
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
                  handleChange("district_id", "");
                  setSelectedDistrictName("");
                }}
                disabled={!formData.regency_id}
                autoComplete="off"
                className={`bg-white ${errors.district_id ? "border-red-500" : ""}`}
              />
              {errors.district_id && (
                <p className="text-red-500 text-sm">{errors.district_id}</p>
              )}
              {formData.regency_id &&
                districtSearch.length >= 3 &&
                !formData.district_id && (
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
                            handleChange("district_id", String(dist.id));
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

          {/* Postal Code */}
          <div className="space-y-1.5">
            <Label htmlFor="postal_code" className="text-shipping-label">
              Kode Pos<span className="text-red-500">*</span>
            </Label>
            <Input
              id="postal_code"
              type="text"
              maxLength={5}
              placeholder="12345"
              value={formData.postal_code}
              onChange={(e) => handleChange("postal_code", e.target.value)}
              className={`bg-white ${errors.postal_code ? "border-red-500" : ""}`}
            />
            {errors.postal_code && (
              <p className="text-red-500 text-sm">{errors.postal_code}</p>
            )}
          </div>

          {/* Complete Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-shipping-label">
              Alamat Lengkap<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Alamat lengkap seperti Jl. atau RT/RW"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className={`bg-white placeholder:text-shipping-placeholder ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Data Pengirim"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
