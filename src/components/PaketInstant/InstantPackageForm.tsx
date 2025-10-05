"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Bike,
  Package,
  PenLine,
  Search,
  Send,
  Truck,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getShippers,
  getReceivers,
  getGoSendShipmentCost,
} from "@/lib/apiClient";
import type {
  Shipper,
  Receiver,
} from "@/types/dataRegulerForm";
import type { ExpeditionAddress } from "@/types/expedition";
import { itemTypes } from "@/types/dataRegulerForm";

interface InstantPackageFormProps {
  onResult?: (result: Record<string, unknown>) => void;
  setIsSearching?: (isSearching: boolean) => void;
  onFormDataChange?: (data: {
    itemValue?: string;
    paymentMethod?: string;
    formData?: {
      receiverName: string;
      receiverPhone: string;
      province: string;
      regency: string;
      district: string;
      receiverAddress: string;
      itemContent: string;
      itemType: string;
      itemValue: string;
      itemQuantity: string;
      weight: string;
      length: string;
      width: string;
      height: string;
      notes: string;
      deliveryType: string;
      paymentMethod: string;
    };
    businessData?: Business | null;
    receiverId?: string | null;
  }) => void;
}

interface Business {
  id: number;
  businessName: string;
  senderName: string;
  contact: string;
  province: string | null;
  regency: string | null;
  district: string | null;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
}
export default function InstantPackageForm({
  onResult,
  setIsSearching,
  onFormDataChange,
}: InstantPackageFormProps) {
  const [businessData, setBusinessData] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [businessRecipients, setBusinessRecipients] = useState<Receiver[]>([]);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    province: "",
    regency: "",
    district: "",
    receiverAddress: "",
    itemContent: "",
    itemType: "",
    itemValue: "",
    itemQuantity: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    notes: "",
    deliveryType: "motor", // Default to motor for instant
    paymentMethod: "corporate", // GoSend only supports corporate payment
  });

  // Load initial data
  useEffect(() => {
    getShippers().then((res) => {
      const mapped = res.data.data.map((shipper: Shipper) => ({
        id: shipper.id,
        businessName: shipper.name,
        senderName: shipper.contact || shipper.name,
        contact: shipper.phone,
        province: shipper.province,
        regency: shipper.regency,
        district: shipper.district,
        address: shipper.address,
        latitude: shipper.latitude,
        longitude: shipper.longitude,
      }));
      setBusinessData(mapped);
      if (mapped.length > 0) {
        setSelectedBusiness(mapped[0]);
      }
    });

    getReceivers().then((res) => {
      setBusinessRecipients(res.data.data);
    });
  }, []);

  // Update parent component when form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        itemValue: formData.itemValue,
        paymentMethod: formData.paymentMethod,
        formData,
        businessData: selectedBusiness,
        receiverId,
      });
    }
  }, [formData, selectedBusiness, receiverId, onFormDataChange]);

  const handleSelectAddress = (business: Business) => {
    setSelectedBusiness(business);
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectReceiver = (recipient: Receiver) => {
    setFormData((prev) => ({
      ...prev,
      receiverName: recipient.name,
      receiverPhone: recipient.phone,
      province: recipient.province || "",
      regency: recipient.regency || "",
      district: recipient.district || "",
      receiverAddress: recipient.address,
    }));
    setReceiverId(recipient.id.toString());
    setOpenRecipient(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.receiverName.trim()) {
      errors.receiverName = "Nama penerima harus diisi";
    }

    if (!formData.receiverPhone.trim()) {
      errors.receiverPhone = "Nomor telepon harus diisi";
    }

    if (!formData.receiverAddress.trim()) {
      errors.receiverAddress = "Alamat lengkap harus diisi";
    }

    if (!formData.itemContent.trim()) {
      errors.itemContent = "Isi barang harus diisi";
    }

    if (!formData.itemType.trim()) {
      errors.itemType = "Jenis barang harus dipilih";
    }

    if (!formData.itemValue.trim() || parseFloat(formData.itemValue) <= 0) {
      errors.itemValue = "Nilai barang harus diisi dengan angka valid";
    }

    if (!formData.itemQuantity.trim() || parseInt(formData.itemQuantity) <= 0) {
      errors.itemQuantity = "Jumlah barang harus diisi dengan angka valid";
    }

    if (!formData.weight.trim() || parseFloat(formData.weight) <= 0) {
      errors.weight = "Berat harus diisi dengan angka valid";
    }

    if (!formData.length.trim() || parseFloat(formData.length) <= 0) {
      errors.length = "Panjang harus diisi dengan angka valid";
    }

    if (!formData.width.trim() || parseFloat(formData.width) <= 0) {
      errors.width = "Lebar harus diisi dengan angka valid";
    }

    if (!formData.height.trim() || parseFloat(formData.height) <= 0) {
      errors.height = "Tinggi harus diisi dengan angka valid";
    }

    // Validate weight limits based on delivery type
    const weight = parseFloat(formData.weight);
    if (formData.deliveryType === "motor" && weight > 40) {
      errors.weight = "Berat maksimal untuk motor adalah 40 kg";
    } else if (formData.deliveryType === "mobil" && weight > 450) {
      errors.weight = "Berat maksimal untuk mobil adalah 450 kg";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedBusiness) {
      alert("Pilih alamat pengirim terlebih dahulu");
      return;
    }

    setIsSearching?.(true);

    try {
      // Prepare expedition address objects for GoSend instant shipping
      const senderAddress: ExpeditionAddress = {
        name: selectedBusiness.senderName,
        phone: selectedBusiness.contact,
        email: selectedBusiness.contact + "@placeholder.com", // Default email
        address: selectedBusiness.address,
        province: selectedBusiness.province || "",
        city: selectedBusiness.regency || "",
        district: selectedBusiness.district || "",
        postal_code: "10110", // Default postal code
        latitude: parseFloat(selectedBusiness.latitude || "-6.2088"), // Default Jakarta coordinates
        longitude: parseFloat(selectedBusiness.longitude || "106.8456"),
      };

      let receiverAddress: ExpeditionAddress;
      if (receiverId && receiverId !== "manual") {
        const receiver = businessRecipients.find(r => r.id.toString() === receiverId);
        if (receiver) {
          receiverAddress = {
            name: receiver.name,
            phone: receiver.phone,
            email: receiver.phone + "@placeholder.com", // Default email
            address: receiver.address,
            province: receiver.province || "",
            city: receiver.regency || "",
            district: receiver.district || "",
            postal_code: "10110",
            latitude: parseFloat(receiver.latitude || "-6.2500"),
            longitude: parseFloat(receiver.longitude || "106.9000"),
          };
        } else {
          throw new Error("Receiver not found");
        }
      } else {
        receiverAddress = {
          name: formData.receiverName,
          phone: formData.receiverPhone,
          email: formData.receiverPhone + "@placeholder.com", // Default email
          address: formData.receiverAddress,
          province: formData.province,
          city: formData.regency,
          district: formData.district,
          postal_code: "10110",
          latitude: -6.2500,
          longitude: 106.9000,
        };
      }

      // Calculate GoSend instant shipping cost
      const gosendResult = await getGoSendShipmentCost({
        sender: senderAddress,
        receiver: receiverAddress,
        package_weight: parseFloat(formData.weight) * 1000, // Convert to grams
        package_length: parseFloat(formData.length || "0"),
        package_width: parseFloat(formData.width || "0"),
        package_height: parseFloat(formData.height || "0"),
        item_value: parseFloat(formData.itemValue || "500000"),
        shipment_method: formData.deliveryType === "motor" ? "Instant" : "InstantCar",
        origin: `${senderAddress.latitude},${senderAddress.longitude}`,
        destination: `${receiverAddress.latitude},${receiverAddress.longitude}`,
      });

      // Pass result to parent component
      if (onResult) {
        onResult({
          gosend: gosendResult,
          searchData: {
            formData,
            businessData: selectedBusiness,
            receiverId,
          },
        });
      }

    } catch (error) {
      console.error("Error calculating shipping cost:", error);
      if (onResult) {
        onResult({
          gosend: { status: "error", message: "Gagal menghitung ongkir", data: null, costs: [] },
          searchData: {
            formData,
            businessData: selectedBusiness,
            receiverId,
          },
        });
      }
    } finally {
      setIsSearching?.(false);
    }
  };

  const filteredRecipients = businessRecipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Section Pilih Kendaraan */}
        <Card className="pt-4 pr-6 pl-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Pilih Jenis Kendaraan</h2>
          <div className="mb-6">
            <RadioGroup
              value={formData.deliveryType}
              onValueChange={(value) => handleChange("deliveryType", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Opsi Motor */}
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${formData.deliveryType === "motor"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200"
                  }`}
              >
                <RadioGroupItem value="motor" id="motor" className="hidden" />
                <Label htmlFor="motor" className="flex items-center space-x-3">
                  <Bike className="w-10 h-10 text-blue-500 bg-blue-200 rounded-full py-1 px-1" />
                  <div>
                    <div className="font-medium">Motor</div>
                    <div className="text-sm text-gray-500">
                      Berat maksimal adalah 40 kg.
                    </div>
                  </div>
                </Label>
              </div>

              {/* Opsi Mobil */}
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${formData.deliveryType === "mobil"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200"
                  }`}
              >
                <RadioGroupItem value="mobil" id="mobil" className="hidden" />
                <Label htmlFor="mobil" className="flex items-center space-x-3">
                  <Truck className="w-10 h-10 text-blue-500 bg-blue-200 rounded-full py-1 px-1" />
                  <div>
                    <div className="font-medium">Mobil</div>
                    <div className="text-sm text-gray-500">
                      Berat maksimal adalah 450 kg.
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </Card>
        {/* Section List Pengirim */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Send className="h-5 w-5" />
              Pengirim
            </h2>
            {/* Button untuk membuka popup */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-700">
                  <PenLine size={16} /> Ganti Alamat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pilih Alamat</DialogTitle>
                  <DialogDescription>
                    Pilih alamat yang tersedia atau tambahkan alamat baru.
                  </DialogDescription>
                </DialogHeader>

                {/* List alamat yang tersedia */}
                <div className="space-y-2">
                  {businessData.map((business) => (
                    <div
                      key={business.id}
                      className={`p-3 border rounded-lg cursor-pointer ${selectedBusiness?.id === business.id
                        ? "border-primary"
                        : "border-gray-300"
                        }`}
                      onClick={() => handleSelectAddress(business)}
                    >
                      <p className="font-medium">{business.businessName}</p>
                      <p className="text-sm text-gray-500">
                        {business.address}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Button untuk tambah alamat */}
                <Button variant="outline" className="w-full mt-3">
                  Tambah Alamat Baru
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Nama Usaha</Label>
              <Input value={selectedBusiness?.businessName || ""} readOnly />
            </div>
            <div>
              <Label>Nama Pengirim</Label>
              <Input value={selectedBusiness?.senderName || ""} readOnly />
            </div>
            <div>
              <Label>Kontak</Label>
              <Input value={selectedBusiness?.contact || ""} readOnly />
            </div>
            <div>
              <Label>Alamat</Label>
              <Textarea
                className="min-h-[100px]"
                value={selectedBusiness?.address || ""}
                readOnly
              />
            </div>
          </div>
        </Card>
        {/* Section List Penerima */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Penerima
            </h2>
            <Popover open={openRecipient} onOpenChange={setOpenRecipient}>
              <PopoverTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-700">
                  <PenLine size={16} /> Riwayat Penerima
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4">
                <Label className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4" />
                  Cari Penerima
                </Label>
                <Input
                  placeholder="Cari nama penerima..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-3"
                />
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredRecipients.length > 0 ? (
                    filteredRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectReceiver(recipient)}
                      >
                        <p className="font-medium">{recipient.name}</p>
                        <p className="text-sm text-gray-500">
                          {recipient.phone}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Tidak ada hasil ditemukan
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-4">
            {/* Nama & Nomor Telepon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiverName">
                  Nama Penerima <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="receiverName"
                  placeholder="Nama lengkap penerima"
                  value={formData.receiverName}
                  onChange={(e) => handleChange("receiverName", e.target.value)}
                  className={formErrors.receiverName ? "border-red-500" : ""}
                />
                {formErrors.receiverName && (
                  <p className="text-red-500 text-sm">{formErrors.receiverName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="receiverPhone">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="receiverPhone"
                  placeholder="08XXXXXXXXXX"
                  value={formData.receiverPhone}
                  onChange={(e) =>
                    handleChange("receiverPhone", e.target.value)
                  }
                  className={formErrors.receiverPhone ? "border-red-500" : ""}
                />
                {formErrors.receiverPhone && (
                  <p className="text-red-500 text-sm">{formErrors.receiverPhone}</p>
                )}
              </div>
            </div>
            {/* Area Tujuan - Province, Regency, District */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="province" className="text-shipping-label">
                  Provinsi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="province"
                  placeholder="Nama Provinsi"
                  value={formData.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                  className={`bg-white ${formErrors.province ? "border-red-500" : ""}`}
                />
                {formErrors.province && (
                  <p className="text-red-500 text-sm">{formErrors.province}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regency" className="text-shipping-label">
                  Kabupaten/Kota <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="regency"
                  placeholder="Nama Kabupaten/Kota"
                  value={formData.regency}
                  onChange={(e) => handleChange("regency", e.target.value)}
                  className={`bg-white ${formErrors.regency ? "border-red-500" : ""}`}
                />
                {formErrors.regency && (
                  <p className="text-red-500 text-sm">{formErrors.regency}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district" className="text-shipping-label">
                  Kecamatan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  placeholder="Nama Kecamatan"
                  value={formData.district}
                  onChange={(e) => handleChange("district", e.target.value)}
                  className={`bg-white ${formErrors.district ? "border-red-500" : ""}`}
                />
                {formErrors.district && (
                  <p className="text-red-500 text-sm">{formErrors.district}</p>
                )}
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div>
              <Label htmlFor="receiverAddress">
                Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="receiverAddress"
                placeholder="Masukkan alamat lengkap"
                value={formData.receiverAddress}
                onChange={(e) =>
                  handleChange("receiverAddress", e.target.value)
                }
                className={`min-h-[100px] ${formErrors.receiverAddress ? "border-red-500" : ""}`}
              />
              {formErrors.receiverAddress && (
                <p className="text-red-500 text-sm">{formErrors.receiverAddress}</p>
              )}
            </div>
          </div>
        </Card>
        {/* Section Detail Product */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Package className="h-5 w-5" />
            Detail Paket
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemContent">Isi Barang *</Label>
                <Input
                  id="itemContent"
                  placeholder="Contoh: Laptop"
                  value={formData.itemContent}
                  onChange={(e) => handleChange("itemContent", e.target.value)}
                  className={formErrors.itemContent ? "border-red-500" : ""}
                />
                {formErrors.itemContent && (
                  <p className="text-red-500 text-sm">{formErrors.itemContent}</p>
                )}
              </div>
              <div>
                <Label htmlFor="itemType">Jenis Barang *</Label>
                <Select
                  value={formData.itemType}
                  onValueChange={(value) => handleChange("itemType", value)}
                >
                  <SelectTrigger className={formErrors.itemType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih Jenis Barang" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.itemType && (
                  <p className="text-red-500 text-sm">{formErrors.itemType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemValue">
                  Nilai Barang <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    Rp
                  </div>
                  <Input
                    id="itemValue"
                    type="number"
                    value={formData.itemValue}
                    placeholder="1.000.000"
                    onChange={(e) => handleChange("itemValue", e.target.value)}
                    className={`pl-10 ${formErrors.itemValue ? "border-red-500" : ""}`}
                  />
                </div>
                {formErrors.itemValue && (
                  <p className="text-red-500 text-sm">{formErrors.itemValue}</p>
                )}
              </div>
              <div>
                <Label htmlFor="itemQuantity">
                  Jumlah Barang <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  placeholder="1"
                  value={formData.itemQuantity}
                  onChange={(e) => handleChange("itemQuantity", e.target.value)}
                  className={formErrors.itemQuantity ? "border-red-500" : ""}
                />
                {formErrors.itemQuantity && (
                  <p className="text-red-500 text-sm">{formErrors.itemQuantity}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight">Berat (kg) *</Label>
                <Input
                  id="weight"
                  placeholder="2.5"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  className={formErrors.weight ? "border-red-500" : ""}
                />
                {formErrors.weight && (
                  <p className="text-red-500 text-sm">{formErrors.weight}</p>
                )}
              </div>
              <div>
                <Label htmlFor="length">Panjang (cm) *</Label>
                <Input
                  id="length"
                  placeholder="25"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleChange("length", e.target.value)}
                  className={formErrors.length ? "border-red-500" : ""}
                />
                {formErrors.length && (
                  <p className="text-red-500 text-sm">{formErrors.length}</p>
                )}
              </div>
              <div>
                <Label htmlFor="width">Lebar (cm) *</Label>
                <Input
                  id="width"
                  placeholder="25"
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleChange("width", e.target.value)}
                  className={formErrors.width ? "border-red-500" : ""}
                />
                {formErrors.width && (
                  <p className="text-red-500 text-sm">{formErrors.width}</p>
                )}
              </div>
              <div>
                <Label htmlFor="height">Tinggi (cm) *</Label>
                <Input
                  id="height"
                  placeholder="25"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  className={formErrors.height ? "border-red-500" : ""}
                />
                {formErrors.height && (
                  <p className="text-red-500 text-sm">{formErrors.height}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan untuk kurir (opsional)"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Informasi GoSend Instant</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pengiriman instan dalam 1-2 jam</li>
                <li>• Pembayaran corporate/COD only</li>
                <li>• Motor: maksimal 40kg, Mobil: maksimal 450kg</li>
                <li>• Area layanan terbatas pada kota-kota besar</li>
              </ul>
            </div>

            <Button type="submit" className="w-full bg-blue-500">
              Cek Ongkir GoSend Instant
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
