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
  DialogDescription,
} from "@/components/ui/dialog";
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

  // Edit location search states
  const [editProvinceOptions, setEditProvinceOptions] = useState<Province[]>(
    []
  );
  const [editRegencyOptions, setEditRegencyOptions] = useState<Regency[]>([]);
  const [editDistrictOptions, setEditDistrictOptions] = useState<District[]>(
    []
  );
  const [editProvinceSearch, setEditProvinceSearch] = useState("");
  const [editRegencySearch, setEditRegencySearch] = useState("");
  const [editDistrictSearch, setEditDistrictSearch] = useState("");
  const [editSelectedProvinceName, setEditSelectedProvinceName] = useState("");
  const [editSelectedRegencyName, setEditSelectedRegencyName] = useState("");
  const [editSelectedDistrictName, setEditSelectedDistrictName] = useState("");
  const [editLoadingProvince, setEditLoadingProvince] = useState(false);
  const [editLoadingRegency, setEditLoadingRegency] = useState(false);
  const [editLoadingDistrict, setEditLoadingDistrict] = useState(false);

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

  // Edit Province search and fetch
  useEffect(() => {
    if (editProvinceSearch.length >= 3) {
      setEditLoadingProvince(true);
      getProvinces()
        .then((res) => {
          setEditProvinceOptions(
            res.data.filter((prov) =>
              prov.name.toLowerCase().includes(editProvinceSearch.toLowerCase())
            )
          );
          setEditLoadingProvince(false);
        })
        .catch((error) => {
          console.error("Error loading provinces for edit:", error);
          setEditLoadingProvince(false);
        });
    } else {
      setEditProvinceOptions([]);
    }
  }, [editProvinceSearch]);

  // Edit Regency search and fetch
  useEffect(() => {
    if (editFormData.province_id && editRegencySearch.length >= 3) {
      setEditLoadingRegency(true);
      getRegencies(Number(editFormData.province_id))
        .then((res) => {
          setEditRegencyOptions(
            res.data.filter((reg) =>
              reg.name.toLowerCase().includes(editRegencySearch.toLowerCase())
            )
          );
          setEditLoadingRegency(false);
        })
        .catch((error) => {
          console.error("Error loading regencies for edit:", error);
          setEditLoadingRegency(false);
        });
    } else {
      setEditRegencyOptions([]);
    }
  }, [editFormData.province_id, editRegencySearch]);

  // Edit District search and fetch
  useEffect(() => {
    if (editFormData.regency_id && editDistrictSearch.length >= 3) {
      setEditLoadingDistrict(true);
      getDistricts(Number(editFormData.regency_id))
        .then((res) => {
          setEditDistrictOptions(
            res.data.filter((dist) =>
              dist.name.toLowerCase().includes(editDistrictSearch.toLowerCase())
            )
          );
          setEditLoadingDistrict(false);
        })
        .catch((error) => {
          console.error("Error loading districts for edit:", error);
          setEditLoadingDistrict(false);
        });
    } else {
      setEditDistrictOptions([]);
    }
  }, [editFormData.regency_id, editDistrictSearch]);

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

        // Handle empty page after deletion
        if (response.data.data.length === 0 && page > 1) {
          handlePageChange(page - 1);
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching shippers:", error);
      toast.error("Gagal memuat data pengirim");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

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

      // Get fresh shipper data
      const response = await getShipperById(shipper.id);
      if (response.success && response.data) {
        setEditingShipper(response.data);

        // Set form data with existing values and search values
        setEditFormData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          contact: response.data.contact || "",
          email: response.data.email || "",
          address: response.data.address || "",
          province_id: "", // Will be set when user searches
          regency_id: "", // Will be set when user searches
          district_id: "", // Will be set when user searches
          postal_code: response.data.postal_code || "",
        });

        // Set initial search values to existing location names
        setEditProvinceSearch(response.data.province || "");
        setEditRegencySearch(response.data.regency || "");
        setEditDistrictSearch(response.data.district || "");
        setEditSelectedProvinceName(response.data.province || "");
        setEditSelectedRegencyName(response.data.regency || "");
        setEditSelectedDistrictName(response.data.district || "");

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

    if (!editSelectedProvinceName) {
      newErrors.province_id = "Provinsi wajib dipilih";
    }

    if (!editSelectedRegencyName) {
      newErrors.regency_id = "Kabupaten/Kota wajib dipilih";
    }

    if (!editSelectedDistrictName) {
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

      const updateData = {
        name: editFormData.name.trim(),
        phone: editFormData.phone.trim(),
        contact: editFormData.name.trim(), // contact sama dengan name
        email: editFormData.email.trim(),
        address: editFormData.address.trim(),
        province: editSelectedProvinceName || "",
        regency: editSelectedRegencyName || "",
        district: editSelectedDistrictName || "",
        postal_code: editFormData.postal_code.trim(),
      };

      const response = await updateShipper(editingShipper.id, updateData);

      if (response.success) {
        toast.success("Data pengirim berhasil diperbarui!");
        setEditDialogOpen(false);
        setEditingShipper(null);

        // Reset edit states
        setEditProvinceSearch("");
        setEditRegencySearch("");
        setEditDistrictSearch("");
        setEditSelectedProvinceName("");
        setEditSelectedRegencyName("");
        setEditSelectedDistrictName("");

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
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
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
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
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
                            className="cursor-pointer"
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
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Pengirim</DialogTitle>
            <DialogDescription>
              Ubah informasi pengirim di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">
                Nama Pengirim<span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Nama pengirim / nama perusahaan"
                value={editFormData.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
                className={editErrors.name ? "border-red-500" : ""}
              />
              {editErrors.name && (
                <p className="text-sm text-red-500">{editErrors.name}</p>
              )}
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">
                  Nomor Telepon<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-phone"
                  type="number"
                  maxLength={15}
                  placeholder="08XXXXXXXXXX"
                  value={editFormData.phone}
                  onChange={(e) =>
                    handleEditFormChange("phone", e.target.value)
                  }
                  className={editErrors.phone ? "border-red-500" : ""}
                />
                {editErrors.phone && (
                  <p className="text-sm text-red-500">{editErrors.phone}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-email">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={editFormData.email}
                  onChange={(e) =>
                    handleEditFormChange("email", e.target.value)
                  }
                  className={editErrors.email ? "border-red-500" : ""}
                />
                {editErrors.email && (
                  <p className="text-sm text-red-500">{editErrors.email}</p>
                )}
              </div>
            </div>

            {/* Location Dropdowns */}
            <div className="space-y-4">
              {/* Province */}
              <div className="relative">
                <Label htmlFor="edit-province">
                  Provinsi<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-province"
                  placeholder="Cari provinsi..."
                  value={editProvinceSearch}
                  onChange={(e) => {
                    setEditProvinceSearch(e.target.value);
                    handleEditFormChange("province_id", "");
                    handleEditFormChange("regency_id", "");
                    handleEditFormChange("district_id", "");
                    setEditSelectedProvinceName("");
                    setEditSelectedRegencyName("");
                    setEditSelectedDistrictName("");
                    setEditRegencySearch("");
                    setEditDistrictSearch("");
                  }}
                  autoComplete="off"
                  className={editErrors.province_id ? "border-red-500" : ""}
                />
                {editErrors.province_id && (
                  <p className="text-sm text-red-500">
                    {editErrors.province_id}
                  </p>
                )}
                {editProvinceSearch.length >= 3 &&
                  !editFormData.province_id && (
                    <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                      {editLoadingProvince ? (
                        <div className="p-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : editProvinceOptions.length > 0 ? (
                        editProvinceOptions.map((prov) => (
                          <div
                            key={prov.id}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              handleEditFormChange(
                                "province_id",
                                String(prov.id)
                              );
                              setEditProvinceSearch(prov.name);
                              setEditSelectedProvinceName(prov.name);
                              setEditRegencySearch("");
                              setEditDistrictSearch("");
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

              {/* Regency */}
              <div className="relative">
                <Label htmlFor="edit-regency">
                  Kota/Kabupaten<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-regency"
                  placeholder="Cari kota/kabupaten..."
                  value={editRegencySearch}
                  onChange={(e) => {
                    setEditRegencySearch(e.target.value);
                    handleEditFormChange("regency_id", "");
                    handleEditFormChange("district_id", "");
                    setEditSelectedRegencyName("");
                    setEditSelectedDistrictName("");
                    setEditDistrictSearch("");
                  }}
                  disabled={!editFormData.province_id}
                  autoComplete="off"
                  className={editErrors.regency_id ? "border-red-500" : ""}
                />
                {editErrors.regency_id && (
                  <p className="text-sm text-red-500">
                    {editErrors.regency_id}
                  </p>
                )}
                {editFormData.province_id &&
                  editRegencySearch.length >= 3 &&
                  !editFormData.regency_id && (
                    <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                      {editLoadingRegency ? (
                        <div className="p-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : editRegencyOptions.length > 0 ? (
                        editRegencyOptions.map((reg) => (
                          <div
                            key={reg.id}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              handleEditFormChange(
                                "regency_id",
                                String(reg.id)
                              );
                              setEditRegencySearch(reg.name);
                              setEditSelectedRegencyName(reg.name);
                              setEditDistrictSearch("");
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

              {/* District */}
              <div className="relative">
                <Label htmlFor="edit-district">
                  Kecamatan<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-district"
                  placeholder="Cari kecamatan..."
                  value={editDistrictSearch}
                  onChange={(e) => {
                    setEditDistrictSearch(e.target.value);
                    handleEditFormChange("district_id", "");
                    setEditSelectedDistrictName("");
                  }}
                  disabled={!editFormData.regency_id}
                  autoComplete="off"
                  className={editErrors.district_id ? "border-red-500" : ""}
                />
                {editErrors.district_id && (
                  <p className="text-sm text-red-500">
                    {editErrors.district_id}
                  </p>
                )}
                {editFormData.regency_id &&
                  editDistrictSearch.length >= 3 &&
                  !editFormData.district_id && (
                    <div className="border rounded bg-white max-h-40 overflow-y-auto absolute z-20 w-full">
                      {editLoadingDistrict ? (
                        <div className="p-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : editDistrictOptions.length > 0 ? (
                        editDistrictOptions.map((dist) => (
                          <div
                            key={dist.id}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              handleEditFormChange(
                                "district_id",
                                String(dist.id)
                              );
                              setEditDistrictSearch(dist.name);
                              setEditSelectedDistrictName(dist.name);
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
              <Label htmlFor="edit-postal">
                Kode Pos<span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-postal"
                type="text"
                maxLength={5}
                placeholder="12345"
                value={editFormData.postal_code}
                onChange={(e) =>
                  handleEditFormChange("postal_code", e.target.value)
                }
                className={editErrors.postal_code ? "border-red-500" : ""}
              />
              {editErrors.postal_code && (
                <p className="text-sm text-red-500">{editErrors.postal_code}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-address">
                Alamat Lengkap<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-address"
                placeholder="Alamat lengkap seperti Jl. atau RT/RW"
                value={editFormData.address}
                onChange={(e) =>
                  handleEditFormChange("address", e.target.value)
                }
                className={editErrors.address ? "border-red-500" : ""}
              />
              {editErrors.address && (
                <p className="text-sm text-red-500">{editErrors.address}</p>
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
    </Card>
  );
}
