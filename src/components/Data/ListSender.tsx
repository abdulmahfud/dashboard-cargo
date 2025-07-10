"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getShippersData,
  updateShipper,
  getShipperById,
  getProvinces,
  getRegencies,
  getDistricts,
} from "@/lib/apiClient";
import type {
  Shipper,
  Province,
  Regency,
  District,
  ShipperFormData,
  ShipperFormErrors,
} from "@/types/dataPengirim";

interface ListSenderProps {
  refreshTrigger?: number;
}

export default function ListSender({ refreshTrigger }: ListSenderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Shipper[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingShipper, setEditingShipper] = useState<Shipper | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [editFormData, setEditFormData] = useState<ShipperFormData>({
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

  const [editErrors, setEditErrors] = useState<ShipperFormErrors>({});

  // Fetch shippers data
  const fetchShippers = async (search?: string, page: number = 1) => {
    try {
      setLoading(true);
      const response = await getShippersData(search, page);

      if (response.success && response.data) {
        setData(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      }
    } catch (error) {
      console.error("Error fetching shippers:", error);
      toast.error("Gagal memuat data pengirim");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load provinces for edit form
  const loadProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await getProvinces();
      if (response.success && response.data) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error("Error loading provinces:", error);
      toast.error("Gagal memuat data provinsi");
    } finally {
      setLoadingProvinces(false);
    }
  };

  // Load regencies when province changes in edit form
  useEffect(() => {
    const loadRegencies = async () => {
      if (!editFormData.province_id) {
        setRegencies([]);
        return;
      }

      try {
        setLoadingRegencies(true);
        const response = await getRegencies(parseInt(editFormData.province_id));
        if (response.success && response.data) {
          setRegencies(response.data);
        }
      } catch (error) {
        console.error("Error loading regencies:", error);
        toast.error("Gagal memuat data kabupaten/kota");
      } finally {
        setLoadingRegencies(false);
      }
    };

    loadRegencies();
  }, [editFormData.province_id]);

  // Load districts when regency changes in edit form
  useEffect(() => {
    const loadDistricts = async () => {
      if (!editFormData.regency_id) {
        setDistricts([]);
        return;
      }

      try {
        setLoadingDistricts(true);
        const response = await getDistricts(parseInt(editFormData.regency_id));
        if (response.success && response.data) {
          setDistricts(response.data);
        }
      } catch (error) {
        console.error("Error loading districts:", error);
        toast.error("Gagal memuat data kecamatan");
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [editFormData.regency_id]);

  // Initial data load and refresh when trigger changes
  useEffect(() => {
    fetchShippers(searchTerm, currentPage);
  }, [refreshTrigger]);

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchShippers(searchTerm, 1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchShippers(searchTerm, page);
    }
  };

  // Handle edit button click
  const handleEditClick = async (shipper: Shipper) => {
    try {
      setEditLoading(true);

      // Load provinces first
      await loadProvinces();

      // Get fresh shipper data
      const response = await getShipperById(shipper.id);
      if (response.success && response.data) {
        setEditingShipper(response.data);

        // Find province, regency, district IDs based on names
        const provincesResponse = await getProvinces();
        let provinceId = "";
        let regencyId = "";
        let districtId = "";

        if (provincesResponse.success && provincesResponse.data) {
          const foundProvince = provincesResponse.data.find(
            (p) => p.name === response.data?.province
          );
          if (foundProvince) {
            provinceId = foundProvince.id.toString();

            // Load regencies for this province
            const regenciesResponse = await getRegencies(foundProvince.id);
            if (regenciesResponse.success && regenciesResponse.data) {
              const foundRegency = regenciesResponse.data.find(
                (r) => r.name === response.data?.regency
              );
              if (foundRegency) {
                regencyId = foundRegency.id.toString();

                // Load districts for this regency
                const districtsResponse = await getDistricts(foundRegency.id);
                if (districtsResponse.success && districtsResponse.data) {
                  const foundDistrict = districtsResponse.data.find(
                    (d) => d.name === response.data?.district
                  );
                  if (foundDistrict) {
                    districtId = foundDistrict.id.toString();
                  }
                }
              }
            }
          }
        }

        // Set form data with existing values
        setEditFormData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          contact: response.data.contact || "",
          email: response.data.email || "",
          address: response.data.address || "",
          province_id: provinceId,
          regency_id: regencyId,
          district_id: districtId,
          postal_code: response.data.postal_code || "",
        });

        setEditErrors({});
        setEditDialogOpen(true);
      }
    } catch (error) {
      console.error("Error loading shipper for edit:", error);
      toast.error("Gagal memuat data pengirim untuk diedit");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle edit form change
  const handleEditFormChange = (
    field: keyof ShipperFormData,
    value: string
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Reset dependent fields when parent changes
    if (field === "province_id") {
      setEditFormData((prev) => ({ ...prev, regency_id: "", district_id: "" }));
      setRegencies([]);
      setDistricts([]);
    } else if (field === "regency_id") {
      setEditFormData((prev) => ({ ...prev, district_id: "" }));
      setDistricts([]);
    }
  };

  // Validate edit form
  const validateEditForm = (): boolean => {
    const newErrors: ShipperFormErrors = {};

    if (!editFormData.name.trim()) {
      newErrors.name = "Nama pengirim wajib diisi";
    }

    if (!editFormData.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (
      !/^\d+$/.test(editFormData.phone) ||
      editFormData.phone.length < 10
    ) {
      newErrors.phone = "Nomor telepon harus berupa angka minimal 10 digit";
    }

    if (!editFormData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!editFormData.address.trim()) {
      newErrors.address = "Alamat wajib diisi";
    }

    if (!editFormData.province_id) {
      newErrors.province_id = "Provinsi wajib dipilih";
    }

    if (!editFormData.regency_id) {
      newErrors.regency_id = "Kabupaten/Kota wajib dipilih";
    }

    if (!editFormData.district_id) {
      newErrors.district_id = "Kecamatan wajib dipilih";
    }

    if (!editFormData.postal_code.trim()) {
      newErrors.postal_code = "Kode pos wajib diisi";
    } else if (!/^\d{5}$/.test(editFormData.postal_code)) {
      newErrors.postal_code = "Kode pos harus 5 digit angka";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm() || !editingShipper) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      setEditLoading(true);

      // Get selected location names
      const selectedProvince = provinces.find(
        (p) => p.id === parseInt(editFormData.province_id)
      );
      const selectedRegency = regencies.find(
        (r) => r.id === parseInt(editFormData.regency_id)
      );
      const selectedDistrict = districts.find(
        (d) => d.id === parseInt(editFormData.district_id)
      );

      const updateData = {
        name: editFormData.name.trim(),
        phone: editFormData.phone.trim(),
        contact: editFormData.name.trim(), // contact sama dengan name
        email: editFormData.email.trim(),
        address: editFormData.address.trim(),
        province: selectedProvince?.name || "",
        regency: selectedRegency?.name || "",
        district: selectedDistrict?.name || "",
        postal_code: editFormData.postal_code.trim(),
      };

      const response = await updateShipper(editingShipper.id, updateData);

      if (response.success) {
        toast.success("Data pengirim berhasil diperbarui!");
        setEditDialogOpen(false);
        setEditingShipper(null);

        // Refresh the list
        fetchShippers(searchTerm, currentPage);
      } else {
        toast.error(response.message || "Gagal memperbarui data pengirim");
      }
    } catch (error) {
      console.error("Error updating shipper:", error);
      toast.error("Terjadi kesalahan saat memperbarui data");
    } finally {
      setEditLoading(false);
    }
  };

  // Generate pagination numbers with ellipsis
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="p-3">
        <CardTitle className="text-lg font-semibold">
          Daftar Alamat Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Cari Nama Pengirim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Memuat data...</span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pengirim</TableHead>
                  <TableHead>Nomor Telepon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((shipper) => (
                    <TableRow key={shipper.id}>
                      <TableCell className="font-medium">
                        {shipper.name}
                      </TableCell>
                      <TableCell>{shipper.phone || "-"}</TableCell>
                      <TableCell>{shipper.email || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {shipper.address || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {shipper.district}, {shipper.regency}
                          </div>
                          <div className="text-gray-500">
                            {shipper.province} {shipper.postal_code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog
                          open={
                            editDialogOpen && editingShipper?.id === shipper.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditDialogOpen(false);
                              setEditingShipper(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEditClick(shipper)}
                              disabled={editLoading}
                            >
                              {editLoading &&
                              editingShipper?.id === shipper.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Pencil className="w-4 h-4" />
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Data Pengirim</DialogTitle>
                            </DialogHeader>

                            <form
                              onSubmit={handleEditSubmit}
                              className="space-y-4"
                            >
                              {/* Nama Pengirim */}
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">
                                  Nama Pengirim
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="edit-name"
                                  type="text"
                                  placeholder="Sesuai dengan KTP"
                                  value={editFormData.name}
                                  onChange={(e) =>
                                    handleEditFormChange("name", e.target.value)
                                  }
                                  className={
                                    editErrors.name ? "border-red-500" : ""
                                  }
                                />
                                {editErrors.name && (
                                  <p className="text-red-500 text-sm">
                                    {editErrors.name}
                                  </p>
                                )}
                              </div>

                              {/* Phone & Email */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-phone">
                                    Nomor Telepon
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="edit-phone"
                                    type="number"
                                    maxLength={15}
                                    placeholder="Aktif Whatsapp"
                                    value={editFormData.phone}
                                    onChange={(e) =>
                                      handleEditFormChange(
                                        "phone",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      editErrors.phone ? "border-red-500" : ""
                                    }
                                  />
                                  {editErrors.phone && (
                                    <p className="text-red-500 text-sm">
                                      {editErrors.phone}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email">
                                    Email<span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    placeholder="email@contoh.com"
                                    value={editFormData.email}
                                    onChange={(e) =>
                                      handleEditFormChange(
                                        "email",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      editErrors.email ? "border-red-500" : ""
                                    }
                                  />
                                  {editErrors.email && (
                                    <p className="text-red-500 text-sm">
                                      {editErrors.email}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Province */}
                              <div className="space-y-2">
                                <Label htmlFor="edit-province">
                                  Provinsi
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={editFormData.province_id}
                                  onValueChange={(value) =>
                                    handleEditFormChange("province_id", value)
                                  }
                                >
                                  <SelectTrigger
                                    className={
                                      editErrors.province_id
                                        ? "border-red-500"
                                        : ""
                                    }
                                  >
                                    <SelectValue
                                      placeholder={
                                        loadingProvinces
                                          ? "Memuat..."
                                          : "Pilih Provinsi"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {provinces.map((province) => (
                                      <SelectItem
                                        key={province.id}
                                        value={province.id.toString()}
                                      >
                                        {province.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {editErrors.province_id && (
                                  <p className="text-red-500 text-sm">
                                    {editErrors.province_id}
                                  </p>
                                )}
                              </div>

                              {/* Regency */}
                              <div className="space-y-2">
                                <Label htmlFor="edit-regency">
                                  Kabupaten/Kota
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={editFormData.regency_id}
                                  onValueChange={(value) =>
                                    handleEditFormChange("regency_id", value)
                                  }
                                  disabled={
                                    !editFormData.province_id ||
                                    loadingRegencies
                                  }
                                >
                                  <SelectTrigger
                                    className={
                                      editErrors.regency_id
                                        ? "border-red-500"
                                        : ""
                                    }
                                  >
                                    <SelectValue
                                      placeholder={
                                        !editFormData.province_id
                                          ? "Pilih provinsi dulu"
                                          : loadingRegencies
                                            ? "Memuat..."
                                            : "Pilih Kabupaten/Kota"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {regencies.map((regency) => (
                                      <SelectItem
                                        key={regency.id}
                                        value={regency.id.toString()}
                                      >
                                        {regency.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {editErrors.regency_id && (
                                  <p className="text-red-500 text-sm">
                                    {editErrors.regency_id}
                                  </p>
                                )}
                              </div>

                              {/* District */}
                              <div className="space-y-2">
                                <Label htmlFor="edit-district">
                                  Kecamatan
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={editFormData.district_id}
                                  onValueChange={(value) =>
                                    handleEditFormChange("district_id", value)
                                  }
                                  disabled={
                                    !editFormData.regency_id || loadingDistricts
                                  }
                                >
                                  <SelectTrigger
                                    className={
                                      editErrors.district_id
                                        ? "border-red-500"
                                        : ""
                                    }
                                  >
                                    <SelectValue
                                      placeholder={
                                        !editFormData.regency_id
                                          ? "Pilih kabupaten/kota dulu"
                                          : loadingDistricts
                                            ? "Memuat..."
                                            : "Pilih Kecamatan"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {districts.map((district) => (
                                      <SelectItem
                                        key={district.id}
                                        value={district.id.toString()}
                                      >
                                        {district.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {editErrors.district_id && (
                                  <p className="text-red-500 text-sm">
                                    {editErrors.district_id}
                                  </p>
                                )}
                              </div>

                              {/* Postal Code */}
                              <div className="space-y-2">
                                <Label htmlFor="edit-postal">
                                  Kode Pos
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="edit-postal"
                                  type="text"
                                  maxLength={5}
                                  placeholder="12345"
                                  value={editFormData.postal_code}
                                  onChange={(e) =>
                                    handleEditFormChange(
                                      "postal_code",
                                      e.target.value
                                    )
                                  }
                                  className={
                                    editErrors.postal_code
                                      ? "border-red-500"
                                      : ""
                                  }
                                />
                                {editErrors.postal_code && (
                                  <p className="text-red-500 text-sm">
                                    {editErrors.postal_code}
                                  </p>
                                )}
                              </div>

                              {/* Address */}
                              <div className="space-y-2">
                                <Label htmlFor="edit-address">
                                  Alamat Lengkap
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                  id="edit-address"
                                  placeholder="Alamat lengkap seperti Jl. atau RT/RW"
                                  value={editFormData.address}
                                  onChange={(e) =>
                                    handleEditFormChange(
                                      "address",
                                      e.target.value
                                    )
                                  }
                                  className={
                                    editErrors.address ? "border-red-500" : ""
                                  }
                                />
                                {editErrors.address && (
                                  <p className="text-red-500 text-sm">
                                    {editErrors.address}
                                  </p>
                                )}
                              </div>

                              {/* Submit Button */}
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditDialogOpen(false)}
                                  disabled={editLoading}
                                >
                                  Batal
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={editLoading}
                                  className="bg-blue-500 hover:bg-blue-700"
                                >
                                  {editLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Menyimpan...
                                    </>
                                  ) : (
                                    "Simpan Perubahan"
                                  )}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500 py-8"
                    >
                      {searchTerm
                        ? "Tidak ada data yang sesuai dengan pencarian."
                        : "Belum ada data pengirim."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Menampilkan {(currentPage - 1) * 5 + 1} -{" "}
              {Math.min(currentPage * 5, totalItems)} dari {totalItems} data
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {generatePaginationNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
