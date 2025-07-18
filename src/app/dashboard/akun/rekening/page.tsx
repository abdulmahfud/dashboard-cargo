"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Wallet, Plus, Building2, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import TopNav from "@/components/top-nav";
import { getBankAccounts, createBankAccount } from "@/lib/apiClient";
import { BankAccount, BankAccountCreateRequest } from "@/types/bankAccount";

const Rekening = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<BankAccountCreateRequest>({
    bank_name: "",
    account_name: "",
    account_number: "",
  });

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const response = await getBankAccounts();
      setBankAccounts(response.data);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      toast.error("Gagal memuat data rekening");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const handleInputChange = (
    field: keyof BankAccountCreateRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.bank_name.trim()) {
      toast.error("Nama bank harus diisi");
      return false;
    }
    if (!formData.account_name.trim()) {
      toast.error("Nama rekening harus diisi");
      return false;
    }
    if (!formData.account_number.trim()) {
      toast.error("Nomor rekening harus diisi");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);
      await createBankAccount(formData);
      toast.success("Rekening berhasil ditambahkan");
      setFormData({ bank_name: "", account_name: "", account_number: "" });
      fetchBankAccounts(); // Refresh data
    } catch (error) {
      console.error("Error creating bank account:", error);
      toast.error("Gagal menambahkan rekening");
    } finally {
      setCreating(false);
    }
  };

  const hasAccount = bankAccounts.length > 0;

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin" />
              Memuat data rekening...
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <SiteHeader />
          </div>
          <TopNav />
        </div>

        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Wallet className="h-6 w-6" />
                Rekening Bank
              </h1>
              <p className="text-gray-600">
                Kelola rekening bank untuk penarikan saldo
              </p>
            </div>
            <Button
              onClick={fetchBankAccounts}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {hasAccount ? (
            // Show existing bank account
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <Card key={account.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {account.bank_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Nama Rekening
                        </Label>
                        <p className="text-lg font-medium">
                          {account.account_name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Nomor Rekening
                        </Label>
                        <p className="text-lg font-mono">
                          {account.account_number}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Tanggal Ditambahkan
                      </Label>
                      <p className="text-sm">
                        {new Date(account.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Info untuk mengganti rekening */}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        Ingin Mengganti Rekening?
                      </h3>
                      <p className="text-sm text-amber-800 mt-1">
                        Untuk mengganti atau menambah rekening bank, silakan
                        hubungi customer service kami melalui WhatsApp atau
                        email.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-100"
                          onClick={() =>
                            window.open("https://wa.me/6281330323559", "_blank")
                          }
                        >
                          WhatsApp CS
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-100"
                          onClick={() =>
                            window.open("mailto:support@bhisakirim.com", "_blank")
                          }
                        >
                          Email CS
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Show form to add bank account
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Tambah Rekening Bank
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Tambahkan rekening bank untuk penarikan saldo
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank_name">Nama Bank *</Label>
                      <Input
                        id="bank_name"
                        type="text"
                        value={formData.bank_name}
                        onChange={(e) =>
                          handleInputChange("bank_name", e.target.value)
                        }
                        placeholder="Contoh: BCA, Mandiri, BRI"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_name">Nama Rekening *</Label>
                      <Input
                        id="account_name"
                        type="text"
                        value={formData.account_name}
                        onChange={(e) =>
                          handleInputChange("account_name", e.target.value)
                        }
                        placeholder="Sesuai dengan nama di rekening"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_number">Nomor Rekening *</Label>
                      <Input
                        id="account_number"
                        type="text"
                        value={formData.account_number}
                        onChange={(e) =>
                          handleInputChange("account_number", e.target.value)
                        }
                        placeholder="1234567890"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={creating}
                        className="gap-2 bg-blue-500 text-white hover:bg-blue-600"
                      >
                        {creating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Tambah Rekening
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Informasi Penting:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Pastikan nama rekening sesuai dengan identitas Anda
                    </li>
                    <li>• Nomor rekening harus valid dan aktif</li>
                    <li>• Rekening akan digunakan untuk penarikan saldo</li>
                    <li>• Setelah ditambahkan, hubungi CS untuk perubahan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Rekening;
