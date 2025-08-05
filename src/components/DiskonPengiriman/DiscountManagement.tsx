"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DiscountForm } from "./DiscountForm";
import { DiscountList } from "./DiscountList";
import { ExpeditionDiscount } from "@/types/discount";
import { toast } from "sonner";
import {
  getExpeditionDiscounts,
  createExpeditionDiscount,
  updateExpeditionDiscount,
  deleteExpeditionDiscount,
  toggleExpeditionDiscountStatus,
} from "@/lib/apiClient";

export function DiscountManagement() {
  const [discounts, setDiscounts] = useState<ExpeditionDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] =
    useState<ExpeditionDiscount | null>(null);

  // Load discounts on component mount
  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setIsLoading(true);
      const response = await getExpeditionDiscounts();

      // Handle both success and status fields from backend
      if (response.status === "success" || response.success) {
        setDiscounts(response.data.data);
      } else {
        console.log("API returned error status:", response);
        toast.error("Gagal memuat data diskon");
      }
    } catch (error) {
      console.error("Error loading discounts:", error);
      toast.error("Gagal memuat data diskon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDiscount = () => {
    setEditingDiscount(null);
    setShowForm(true);
  };

  const handleEditDiscount = (discount: ExpeditionDiscount) => {
    setEditingDiscount(discount);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleSubmitForm = async (formData: ExpeditionDiscount) => {
    try {
      if (editingDiscount) {
        const response = await updateExpeditionDiscount(
          editingDiscount.id,
          formData
        );
        if (response.status === "success" || response.success) {
          toast.success("Diskon berhasil diupdate");
        } else {
          toast.error("Gagal mengupdate diskon");
          return;
        }
      } else {
        const response = await createExpeditionDiscount(formData);
        if (response.status === "success" || response.success) {
          toast.success("Diskon berhasil dibuat");
        } else {
          toast.error("Gagal membuat diskon");
          return;
        }
      }
      handleCloseForm();
      loadDiscounts();
    } catch (error) {
      console.error("Error saving discount:", error);
      toast.error("Gagal menyimpan diskon");
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    // Optimistic update: Remove from UI immediately
    const originalDiscounts = [...discounts];
    setDiscounts((prev) => prev.filter((discount) => discount.id !== id));

    try {
      const response = await deleteExpeditionDiscount(id);
      if (response.status === "success" || response.success) {
        toast.success("Diskon berhasil dihapus");
        // Data already removed optimistically, just confirm with fresh data
        loadDiscounts();
      } else {
        // Revert optimistic update on failure
        setDiscounts(originalDiscounts);
        toast.error("Gagal menghapus diskon");
      }
    } catch (error) {
      // Revert optimistic update on error
      setDiscounts(originalDiscounts);
      console.error("Error deleting discount:", error);
      toast.error("Gagal menghapus diskon");
    }
  };

  const handleToggleStatus = async (id: number) => {
    // Optimistic update: Toggle status in UI immediately
    const originalDiscounts = [...discounts];
    setDiscounts((prev) =>
      prev.map((discount) =>
        discount.id === id
          ? { ...discount, is_active: !discount.is_active }
          : discount
      )
    );

    try {
      const response = await toggleExpeditionDiscountStatus(id);
      if (response.status === "success" || response.success) {
        toast.success("Status diskon berhasil diubah");
        // Optionally refresh to get the latest data from server
        loadDiscounts();
      } else {
        // Revert optimistic update on failure
        setDiscounts(originalDiscounts);
        toast.error("Gagal mengubah status diskon");
      }
    } catch (error) {
      // Revert optimistic update on error
      setDiscounts(originalDiscounts);
      console.error("Error toggling discount status:", error);
      toast.error("Gagal mengubah status diskon");
    }
  };

  if (showForm) {
    return (
      <DiscountForm
        discount={editingDiscount}
        onSubmit={handleSubmitForm}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Daftar Diskon Ekspedisi
          </CardTitle>
          <Button
            onClick={handleCreateDiscount}
            className="h-11 px-6 py-4 font-semibold bg-blue-500 text-white hover:bg-blue-600 text-sm flex items-center gap-2 rounded-full shadow-md transition duration-300 ease-in-out"
          >
            <Plus className="h-4 w-4" />
            Tambah Diskon
          </Button>
        </CardHeader>
        <CardContent>
          <DiscountList
            discounts={discounts}
            isLoading={isLoading}
            onEdit={handleEditDiscount}
            onDelete={handleDeleteDiscount}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}
