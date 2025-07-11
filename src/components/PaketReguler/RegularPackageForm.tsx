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
  Package,
  PenLine,
  Search,
  Send,
  User,
  CircleChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getShippers,
  getReceivers,
  getProvinces,
  getRegencies,
  getDistricts,
  getJntExpressShipmentCost,
} from "@/lib/apiClient";
import type {
  Shipper,
  Receiver,
  Province,
  Regency,
  District,
} from "@/types/dataRegulerForm";
import { itemTypes } from "@/types/dataRegulerForm";

type ReceiverManual = {
  name: string;
  phone: string;
  address: string;
  province: string;
  regency: string;
  district: string;
};

type RegularPackagePayload = {
  receiver_id?: string;
  receiver?: ReceiverManual;
  receiverName?: string;
  receiverPhone?: string;
  province?: string;
  regency?: string;
  district?: string;
  receiverAddress?: string;
  itemContent?: string;
  itemType?: string;
  itemValue?: string;
  itemQuantity?: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  notes?: string;
  deliveryType?: string;
  paymentMethod?: string;
  servicetype?: number; // Added servicetype
  [key: string]: string | number | boolean | ReceiverManual | undefined;
};

interface Business {
  id: number;
  businessName: string;
  senderName: string;
  contact: string;
  province: string | null;
  regency: string | null;
  district: string | null;
  address: string;
}

interface RegularPackageFormProps {
  onResult?: (result: Record<string, unknown>) => void;
  setIsSearching?: (isSearching: boolean) => void;
  onFormDataChange?: (data: {
    itemValue?: string;
    paymentMethod?: string;
  }) => void;
}

export default function RegularPackageForm({
  onResult,
  setIsSearching,
  onFormDataChange,
}: RegularPackageFormProps) {
  const [businessData, setBusinessData] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [businessRecipients, setBusinessRecipients] = useState<Receiver[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<Province[]>([]);
  const [regencyOptions, setRegencyOptions] = useState<Regency[]>([]);
  const [districtOptions, setDistrictOptions] = useState<District[]>([]);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [regencySearch, setRegencySearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingRegency, setLoadingRegency] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState("");

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
    deliveryType: "dropoff",
    paymentMethod: "cod",
  });

  // Loading state sekarang dikontrol parent

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
      }));
      setBusinessData(mapped);
      setSelectedBusiness(mapped[0] || null);
    });
    getReceivers().then((res) => {
      setBusinessRecipients(res.data.data);
    });
  }, []);

  // Notify parent of initial form data
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        itemValue: formData.itemValue,
        paymentMethod: formData.paymentMethod,
      });
    }
  }, [onFormDataChange, formData.itemValue, formData.paymentMethod]);

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

  const handleSelectAddress = (business: Business) => {
    setSelectedBusiness(business);
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Notify parent of relevant form data changes
    if (
      (field === "itemValue" || field === "paymentMethod") &&
      onFormDataChange
    ) {
      onFormDataChange({
        itemValue: newData.itemValue,
        paymentMethod: newData.paymentMethod,
      });
    }

    // Jika user edit field penerima manual, reset receiverId
    if (["receiverName", "receiverPhone", "receiverAddress"].includes(field)) {
      setReceiverId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setIsSearching) setIsSearching(true);
    // Validasi field wajib
    const isUsingExistingReceiver = !!receiverId;
    const hasMandatoryData = isUsingExistingReceiver
      ? formData.weight && selectedBusiness?.regency && selectedDistrictName
      : formData.weight &&
        selectedBusiness?.regency &&
        formData.district &&
        selectedDistrictName;

    if (!hasMandatoryData) {
      onResult?.({
        error: true,
        message: isUsingExistingReceiver
          ? "Berat dan alamat pengirim wajib diisi."
          : "Berat, kota pengirim, dan kecamatan tujuan wajib diisi.",
      });
      if (setIsSearching) setIsSearching(false);
      return;
    }
    // Siapkan payload
    let payload: RegularPackagePayload = {
      ...formData,
    };
    // Set servicetype sesuai deliveryType
    payload.servicetype = formData.deliveryType === "pickup" ? 1 : 6;
    if (receiverId) {
      payload = {
        ...payload,
        receiver_id: receiverId,
      };
      // Hapus data manual receiver agar backend tidak ambigu
      delete payload.receiverName;
      delete payload.receiverPhone;
      delete payload.province;
      delete payload.regency;
      delete payload.district;
      delete payload.receiverAddress;
    } else {
      // Kirim object receiver manual
      payload = {
        ...payload,
        receiver: {
          name: formData.receiverName,
          phone: formData.receiverPhone,
          address: formData.receiverAddress,
          province: formData.province,
          regency: formData.regency,
          district: formData.district,
        },
      };
    }
    // Ambil data untuk ongkir
    const weight = formData.weight;
    // Kirim nama regency pengirim dan district tujuan
    const sendSiteCode = selectedBusiness?.regency || "";
    const destAreaCode = selectedDistrictName;
    try {
      console.log("Payload ke API:", { weight, sendSiteCode, destAreaCode });
      const result = await getJntExpressShipmentCost({
        weight,
        sendSiteCode,
        destAreaCode,
      });
      onResult?.(result);
    } catch (err) {
      const errorResult = {
        error: true,
        message:
          err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message || "Gagal cek ongkir"
            : "Gagal cek ongkir",
      };
      onResult?.(errorResult);
    } finally {
      if (setIsSearching) setIsSearching(false);
    }
    // onSearch(payload); // tidak perlu lagi, sekarang pakai calculationResult
    console.log("Form Data:", payload);
  };

  const filteredRecipients = businessRecipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Section Detail Pengiriman */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Detail Pengiriman</h2>
          <div className="mb-6">
            <Label>Opsi Penjemputan</Label>
            <RadioGroup
              value={formData.deliveryType}
              onValueChange={(value) => handleChange("deliveryType", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Pick Up Option */}
              <label
                htmlFor="pickup"
                className={`flex items-start space-x-2 p-4 rounded-lg border cursor-pointer transition ${
                  formData.deliveryType === "pickup"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <RadioGroupItem value="pickup" id="pickup" className="peer" />
                <div>
                  <div className="font-medium">Pick Up</div>
                  <div className="text-sm text-gray-500">
                    Paket akan dijemput ke tempatmu
                  </div>
                </div>
              </label>

              {/* Drop Off Option */}
              <label
                htmlFor="dropoff"
                className={`flex items-start space-x-2 p-4 rounded-lg border cursor-pointer transition ${
                  formData.deliveryType === "dropoff"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <RadioGroupItem value="dropoff" id="dropoff" className="peer" />
                <div>
                  <div className="font-medium">Drop Off</div>
                  <div className="text-sm text-gray-500">
                    Paket perlu diantar ke agen ekspedisi
                  </div>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <Label>Metode Pembayaran</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* COD Option */}
              <label
                htmlFor="cod"
                className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition ${
                  formData.paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <RadioGroupItem value="cod" id="cod" className="peer" />
                <div>
                  <div className="font-medium">COD (Cash on Delivery)</div>
                  <div className="text-sm text-gray-500">
                    Pembayaran akan dilakukan saat paket sampai di tujuan
                  </div>
                </div>
              </label>

              {/* Non-COD Option */}
              <label
                htmlFor="non-cod"
                className={`flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition ${
                  formData.paymentMethod === "non-cod"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <RadioGroupItem value="non-cod" id="non-cod" className="peer" />
                <div>
                  <div className="font-medium">Non-COD</div>
                  <div className="text-sm text-gray-500">
                    Pembayaran akan dilakukan sebelum paket dikirim
                  </div>
                </div>
              </label>
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
                <Button className="h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out">
                  <PenLine size={16} /> Pilih Alamat
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
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedBusiness && selectedBusiness.id === business.id
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
              <Label>Provinsi</Label>
              <Input value={selectedBusiness?.province || ""} readOnly />
            </div>
            <div>
              <Label>Kota</Label>
              <Input value={selectedBusiness?.regency || ""} readOnly />
            </div>
            <div>
              <Label>Kecamatan</Label>
              <Input value={selectedBusiness?.district || ""} readOnly />
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
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User className="h-5 w-5" />
            Penerima
          </h2>

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
                />
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
                />
              </div>
            </div>
            {/* Alamat Tujuan - diganti dropdown province/regency/district */}
            {receiverId && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">
                  Menggunakan alamat tersimpan
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReceiverId(null);
                    setProvinceSearch("");
                    setRegencySearch("");
                    setDistrictSearch("");
                    setSelectedDistrictName("");
                  }}
                >
                  Edit Alamat
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 relative">
              {/* Province Dropdown */}
              <div className="relative">
                <Label htmlFor="province">
                  Provinsi <span className="text-red-500">*</span>
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
                    // Clear receiverId when manually editing
                    if (receiverId) {
                      setReceiverId(null);
                    }
                  }}
                  autoComplete="off"
                  readOnly={!!receiverId} // Make read-only if using saved recipient
                />
                {!receiverId &&
                  provinceSearch.length >= 3 &&
                  !formData.province && (
                    <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                      {loadingProvince ? (
                        <div className="p-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : provinceOptions.length > 0 ? (
                        provinceOptions.map((prov) => (
                          <div
                            key={prov.id}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              handleChange("province", String(prov.id));
                              setProvinceSearch(prov.name);
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
                <Label htmlFor="regency">
                  Kota/Kabupaten <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="regency"
                  placeholder="Cari kota/kabupaten..."
                  value={regencySearch}
                  onChange={(e) => {
                    setRegencySearch(e.target.value);
                    handleChange("regency", "");
                    handleChange("district", "");
                    setSelectedDistrictName("");
                    // Clear receiverId when manually editing
                    if (receiverId) {
                      setReceiverId(null);
                    }
                  }}
                  disabled={!formData.province && !receiverId}
                  autoComplete="off"
                  readOnly={!!receiverId} // Make read-only if using saved recipient
                />
                {!receiverId &&
                  formData.province &&
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
                <Label htmlFor="district">
                  Kecamatan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  placeholder="Cari kecamatan..."
                  value={districtSearch}
                  onChange={(e) => {
                    setDistrictSearch(e.target.value);
                    handleChange("district", "");
                    setSelectedDistrictName("");
                    // Clear receiverId when manually editing
                    if (receiverId) {
                      setReceiverId(null);
                    }
                  }}
                  disabled={!formData.regency && !receiverId}
                  autoComplete="off"
                  readOnly={!!receiverId} // Make read-only if using saved recipient
                />
                {!receiverId &&
                  formData.regency &&
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

            {/* Detail Alamat Lengkap */}
            <div>
              <Label htmlFor="receiverAddress">
                Detail Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="receiverAddress"
                placeholder="Masukkan alamat lengkap"
                value={formData.receiverAddress}
                onChange={(e) =>
                  handleChange("receiverAddress", e.target.value)
                }
                className="min-h-[100px]"
              />
            </div>

            <Popover open={openRecipient} onOpenChange={setOpenRecipient}>
              <PopoverTrigger asChild>
                <Button className="w-full h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out">
                  <PenLine size={16} className="mr-2" /> Pilih List Penerima
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
                        onClick={() => {
                          // Set receiver ID first to indicate this is from saved list
                          setReceiverId(String(recipient.id));

                          // Update form data directly without triggering receiverId reset
                          setFormData((prev) => ({
                            ...prev,
                            receiverName: recipient.name,
                            receiverPhone: recipient.phone || "",
                            receiverAddress: recipient.address || "",
                            // Clear location IDs since we're using saved data
                            province: "",
                            regency: "",
                            district: "",
                          }));

                          // Set the search fields to show the location names (auto-complete effect)
                          setProvinceSearch(recipient.province || "");
                          setRegencySearch(recipient.regency || "");
                          setDistrictSearch(recipient.district || "");

                          // Set district name for API (using the stored name)
                          setSelectedDistrictName(recipient.district || "");

                          // Close the popover
                          setOpenRecipient(false);
                        }}
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
                />
              </div>
              <div>
                <Label htmlFor="itemType">Jenis Barang *</Label>
                <Select
                  value={formData.itemType}
                  onValueChange={(value) => handleChange("itemType", value)}
                >
                  <SelectTrigger>
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
                    placeholder="Cth : 1.000.000"
                    onChange={(e) => handleChange("itemValue", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="itemQuantity">
                  Jumlah Barang <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  placeholder="Cth : 1"
                  value={formData.itemQuantity}
                  onChange={(e) => handleChange("itemQuantity", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight">Berat (gram) *</Label>
                <Input
                  id="weight"
                  placeholder="Cth : 1000"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="length">Panjang (cm) *</Label>
                <Input
                  id="length"
                  placeholder="Cth : 25"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleChange("length", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="width">Lebar (cm) *</Label>
                <Input
                  id="width"
                  placeholder="Cth : 25"
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleChange("width", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="height">Tinggi (cm) *</Label>
                <Input
                  id="height"
                  placeholder="Cth : 25"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
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

            <Button
              type="submit"
              className="w-full h-11 px-6 py-4 font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              <CircleChevronRight className="w-4 h-4" />
              Pilih Expedisi
            </Button>
          </div>
        </Card>
      </form>
      {/* Hasil cek ongkir dihandle parent */}
    </div>
  );
}
