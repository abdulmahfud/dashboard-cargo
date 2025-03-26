"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CurrencyInput from "@/lib/CurrencyInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  businessData,
  businessRecipients,
  itemTypes,
} from "@/lib/dataRegulerForm";
import { Package, PenLine, Send, User, Search } from "lucide-react";
import { useState } from "react";

interface RegularPackageFormProps {
  onSearch: () => void;
}
interface Business {
  id: number;
  businessName: string;
  senderName: string;
  contact: string;
  address: string;
}
export default function RegularPackageForm({
  onSearch,
}: RegularPackageFormProps) {
  const [selectedBusiness, setSelectedBusiness] = useState(businessData[0]);
  const [open, setOpen] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    destinationArea: "",
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

  const handleSelectAddress = (business: Business) => {
    setSelectedBusiness(business);
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
    console.log("Form Data:", formData);
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
            <p className="text-sm text-gray-500 mb-2">Opsi Penjemputan</p>
            <RadioGroup
              value={formData.deliveryType}
              onValueChange={(value) => handleChange("deliveryType", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formData.deliveryType === "pickup"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup">
                  <div className="font-medium">Pick Up</div>
                  <div className="text-sm text-gray-500">
                    Paket akan dijemput ke tempatmu
                  </div>
                </Label>
              </div>
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formData.deliveryType === "dropoff"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="dropoff" id="dropoff" />
                <Label htmlFor="dropoff">
                  <div className="font-medium">Drop Off</div>
                  <div className="text-sm text-gray-500">
                    Paket perlu diantar ke agen ekspedisi
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Metode Pembayaran</p>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formData.paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">COD (Cash on Delivery)</Label>
              </div>
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  formData.paymentMethod === "non-cod"
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="non-cod" id="non-cod" />
                <Label htmlFor="non-cod">Non-COD</Label>
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
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedBusiness.id === business.id
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
              <Input value={selectedBusiness.businessName} readOnly />
            </div>
            <div>
              <Label>Nama Pengirim</Label>
              <Input value={selectedBusiness.senderName} readOnly />
            </div>
            <div>
              <Label>Kontak</Label>
              <Input value={selectedBusiness.contact} readOnly />
            </div>
            <div>
              <Label>Alamat</Label>
              <Textarea
                className="min-h-[100px]"
                value={selectedBusiness.address}
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
            {/* Area Tujuan */}
            <div className="space-y-1.5">
              <Label htmlFor="destinationArea" className="text-shipping-label">
                Area Tujuan<span className="text-red-500">*</span>
              </Label>
              <Input
                id="destinationAddress"
                placeholder="Sidoharjo (Sidoarjo), Tolangohula, Gorontalo, Gorontalo"
                value={formData.destinationArea}
                onChange={(e) =>
                  handleChange("destinationArea", e.target.value)
                }
                className="bg-white placeholder:text-shipping-placeholder"
              />
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
                className="min-h-[100px]"
              />
            </div>

            <Popover open={openRecipient} onOpenChange={setOpenRecipient}>
              <PopoverTrigger asChild>
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-700">
                  <PenLine size={16} className="mr-2" /> Pilih dari List
                  Penerima
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
                          handleChange("receiverName", recipient.name);
                          handleChange("receiverPhone", recipient.phone);
                          handleChange(
                            "destinationArea",
                            recipient.destinationarea
                          );
                          handleChange("receiverAddress", recipient.address);
                          setOpen(false);
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
                <Input id="itemContent" placeholder="Contoh: Laptop" />
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
                    placeholder="1.000.000"
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
                  placeholder="1"
                  value={formData.itemQuantity}
                  onChange={(e) => handleChange("itemQuantity", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight">Berat (gram) *</Label>
                <Input id="weight" placeholder="1000" type="number" />
              </div>
              <div>
                <Label htmlFor="length">Panjang (cm) *</Label>
                <Input id="length" placeholder="25" type="number" />
              </div>
              <div>
                <Label htmlFor="width">Lebar (cm) *</Label>
                <Input id="width" placeholder="25" type="number" />
              </div>
              <div>
                <Label htmlFor="height">Tinggi (cm) *</Label>
                <Input id="height" placeholder="25" type="number" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan untuk kurir (opsional)"
              />
            </div>

            <Button type="submit" className="w-full">
              Proses Paket
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
