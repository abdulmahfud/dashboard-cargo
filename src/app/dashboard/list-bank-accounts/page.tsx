"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  User,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import TopNav from "@/components/top-nav";
import {
  getBankAccounts,
  getBankAccountById,
  approveBankAccount,
  rejectBankAccount,
  getBankAccountFile,
} from "@/lib/apiClient";
import { BankAccount } from "@/types/bankAccount";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type SortField = "created_at" | "bank_name" | "account_name" | "status";
type SortOrder = "asc" | "desc";

const BankAccountList = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { hasPermission, loading: authLoading } = useAuth();
  const router = useRouter();

  // Dialog states
  const [detailDialog, setDetailDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [selectedAccountDetail, setSelectedAccountDetail] = useState<
    | (BankAccount & {
        photo_rekening_url: string;
        photo_ktp_url: string;
        user: {
          id: number;
          name: string;
          email: string;
          whatsapp: string | null;
          email_verified_at: string | null;
          balance: string;
          created_at: string;
          updated_at: string;
        };
      })
    | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Add state for image loading
  const [imageErrors, setImageErrors] = useState({
    rekening: false,
    ktp: false,
  });
  const [imageBlobUrls, setImageBlobUrls] = useState({
    rekening: null as string | null,
    ktp: null as string | null,
  });

  // Function to load image as blob when direct URL fails
  const loadImageAsBlob = async (
    accountId: number,
    type: "rekening" | "ktp"
  ) => {
    try {
      const blobUrl = await getBankAccountFile(accountId, type);
      setImageBlobUrls((prev) => ({ ...prev, [type]: blobUrl }));
      setImageErrors((prev) => ({ ...prev, [type]: false }));
    } catch {
      setImageErrors((prev) => ({ ...prev, [type]: true }));
    }
  };

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const response = await getBankAccounts();
      setBankAccounts(response.data);
      setFilteredAccounts(response.data);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      toast.error("Gagal memuat data rekening bank");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !hasPermission("bank-accounts.update")) {
      router.replace("/dashboard");
    }
  }, [authLoading, hasPermission, router]);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...bankAccounts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.account_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.account_number.includes(searchTerm) ||
          account.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((account) => account.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField] as string;
      let bValue: string | number = b[sortField] as string;

      if (sortField === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAccounts(filtered);
  }, [bankAccounts, searchTerm, statusFilter, sortField, sortOrder]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disetujui
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleViewDetail = async (account: BankAccount) => {
    try {
      setSelectedAccount(account);
      // Reset image states when opening new account
      setImageErrors({ rekening: false, ktp: false });
      setImageBlobUrls({ rekening: null, ktp: null });

      const response = await getBankAccountById(account.id);
      setSelectedAccountDetail(response.data);
      setDetailDialog(true);
    } catch (error) {
      console.error("Error fetching account detail:", error);
      toast.error("Gagal memuat detail rekening");
    }
  };

  const handleApprove = (account: BankAccount) => {
    setSelectedAccount(account);
    setApproveDialog(true);
  };

  const handleReject = (account: BankAccount) => {
    setSelectedAccount(account);
    setRejectDialog(true);
  };

  const confirmApprove = async () => {
    if (!selectedAccount) return;

    try {
      setActionLoading(true);
      await approveBankAccount(selectedAccount.id);
      toast.success("Rekening berhasil disetujui");
      setApproveDialog(false);
      setSelectedAccount(null);
      fetchBankAccounts();
    } catch (error) {
      console.error("Error approving account:", error);
      toast.error("Gagal menyetujui rekening");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedAccount || !rejectReason.trim()) {
      toast.error("Alasan penolakan harus diisi");
      return;
    }

    try {
      setActionLoading(true);
      await rejectBankAccount(selectedAccount.id, rejectReason);
      toast.success("Rekening berhasil ditolak");
      setRejectDialog(false);
      setSelectedAccount(null);
      setRejectReason("");
      fetchBankAccounts();
    } catch (error) {
      console.error("Error rejecting account:", error);
      toast.error("Gagal menolak rekening");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) return null;
  if (!hasPermission("bank-accounts.update")) return null;

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
                <Building2 className="h-6 w-6" />
                Daftar Rekening Bank
              </h1>
              <p className="text-gray-600">
                Kelola verifikasi rekening bank user
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

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari nama bank, nama rekening, nomor rekening, nama user, atau email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="approved">Disetujui</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Total: {filteredAccounts.length} dari {bankAccounts.length}{" "}
                  rekening
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("bank_name")}
                      >
                        <div className="flex items-center gap-1">
                          Bank
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("account_name")}
                      >
                        <div className="flex items-center gap-1">
                          Nama Rekening
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Nomor Rekening</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("created_at")}
                      >
                        <div className="flex items-center gap-1">
                          Tanggal
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.bank_name}
                        </TableCell>
                        <TableCell>{account.account_name}</TableCell>
                        <TableCell className="font-mono">
                          {account.account_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{account.user?.name}</p>
                            <p className="text-sm text-gray-500">
                              {account.user?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {new Date(account.created_at).toLocaleDateString(
                                "id-ID"
                              )}
                            </p>
                            {account.verified_at && (
                              <p className="text-xs text-green-600">
                                Disetujui:{" "}
                                {new Date(
                                  account.verified_at
                                ).toLocaleDateString("id-ID")}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetail(account)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApprove(account)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleReject(account)}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredAccounts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada data rekening bank yang ditemukan
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail Dialog */}
        <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Detail Rekening Bank
              </DialogTitle>
            </DialogHeader>
            {selectedAccountDetail && (
              <div className="space-y-6">
                {/* User Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informasi User
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Nama
                        </Label>
                        <p className="font-medium">
                          {selectedAccountDetail.user.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Email
                        </Label>
                        <p>{selectedAccountDetail.user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Account Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informasi Rekening
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Bank
                        </Label>
                        <p className="font-medium">
                          {selectedAccountDetail.bank_name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Status
                        </Label>
                        <div className="mt-1">
                          {getStatusBadge(selectedAccountDetail.status)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Nama Rekening
                        </Label>
                        <p className="font-medium">
                          {selectedAccountDetail.account_name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Nomor Rekening
                        </Label>
                        <p className="font-mono">
                          {selectedAccountDetail.account_number}
                        </p>
                      </div>
                    </div>

                    {selectedAccountDetail.rejected_reason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <Label className="text-sm font-medium text-red-800">
                          Alasan Penolakan:
                        </Label>
                        <p className="text-sm text-red-700 mt-1">
                          {selectedAccountDetail.rejected_reason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Dokumen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                          <FileText className="h-4 w-4" />
                          Foto Rekening
                        </Label>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          {selectedAccountDetail.photo_rekening_url ? (
                            <div className="relative">
                              {!imageErrors.rekening ? (
                                <img
                                  src={
                                    imageBlobUrls.rekening ||
                                    selectedAccountDetail.photo_rekening_url
                                  }
                                  alt="Foto Rekening"
                                  className="w-full h-auto rounded-md shadow-sm max-h-96 object-contain"
                                  onError={() => {
                                    if (!imageBlobUrls.rekening) {
                                      loadImageAsBlob(
                                        selectedAccountDetail.id,
                                        "rekening"
                                      );
                                    } else {
                                      setImageErrors((prev) => ({
                                        ...prev,
                                        rekening: true,
                                      }));
                                    }
                                  }}
                                  onLoad={() => {
                                    setImageErrors((prev) => ({
                                      ...prev,
                                      rekening: false,
                                    }));
                                  }}
                                />
                              ) : (
                                <div className="error-placeholder text-center text-gray-500 py-8">
                                  <FileText className="h-12 w-12 mx-auto mb-2" />
                                  <p>Gagal memuat foto rekening</p>
                                  <div className="flex gap-2 mt-2 justify-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        window.open(
                                          selectedAccountDetail.photo_rekening_url,
                                          "_blank"
                                        )
                                      }
                                    >
                                      Buka di Tab Baru
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        loadImageAsBlob(
                                          selectedAccountDetail.id,
                                          "rekening"
                                        )
                                      }
                                    >
                                      Coba Lagi
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <FileText className="h-12 w-12 mx-auto mb-2" />
                              <p>Foto rekening tidak tersedia</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                          <FileText className="h-4 w-4" />
                          Foto KTP
                        </Label>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          {selectedAccountDetail.photo_ktp_url ? (
                            <div className="relative">
                              {!imageErrors.ktp ? (
                                <img
                                  src={
                                    imageBlobUrls.ktp ||
                                    selectedAccountDetail.photo_ktp_url
                                  }
                                  alt="Foto KTP"
                                  className="w-full h-auto rounded-md shadow-sm max-h-96 object-contain"
                                  onError={() => {
                                    if (!imageBlobUrls.ktp) {
                                      loadImageAsBlob(
                                        selectedAccountDetail.id,
                                        "ktp"
                                      );
                                    } else {
                                      setImageErrors((prev) => ({
                                        ...prev,
                                        ktp: true,
                                      }));
                                    }
                                  }}
                                  onLoad={() => {
                                    setImageErrors((prev) => ({
                                      ...prev,
                                      ktp: false,
                                    }));
                                  }}
                                />
                              ) : (
                                <div className="error-placeholder text-center text-gray-500 py-8">
                                  <FileText className="h-12 w-12 mx-auto mb-2" />
                                  <p>Gagal memuat foto KTP</p>
                                  <div className="flex gap-2 mt-2 justify-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        window.open(
                                          selectedAccountDetail.photo_ktp_url,
                                          "_blank"
                                        )
                                      }
                                    >
                                      Buka di Tab Baru
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        loadImageAsBlob(
                                          selectedAccountDetail.id,
                                          "ktp"
                                        )
                                      }
                                    >
                                      Coba Lagi
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <FileText className="h-12 w-12 mx-auto mb-2" />
                              <p>Foto KTP tidak tersedia</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Setujui Rekening Bank
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menyetujui rekening bank ini?
              </DialogDescription>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>Bank:</strong> {selectedAccount.bank_name}
                  </p>
                  <p>
                    <strong>Nama Rekening:</strong>{" "}
                    {selectedAccount.account_name}
                  </p>
                  <p>
                    <strong>Nomor Rekening:</strong>{" "}
                    {selectedAccount.account_number}
                  </p>
                  <p>
                    <strong>User:</strong> {selectedAccount.user?.name}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setApproveDialog(false)}
                disabled={actionLoading}
              >
                Batal
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Setujui
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Tolak Rekening Bank
              </DialogTitle>
              <DialogDescription>
                Berikan alasan penolakan untuk rekening bank ini.
              </DialogDescription>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>Bank:</strong> {selectedAccount.bank_name}
                  </p>
                  <p>
                    <strong>Nama Rekening:</strong>{" "}
                    {selectedAccount.account_name}
                  </p>
                  <p>
                    <strong>Nomor Rekening:</strong>{" "}
                    {selectedAccount.account_number}
                  </p>
                  <p>
                    <strong>User:</strong> {selectedAccount.user?.name}
                  </p>
                </div>
                <div>
                  <Label htmlFor="reason">Alasan Penolakan *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Masukkan alasan penolakan..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialog(false);
                  setRejectReason("");
                }}
                disabled={actionLoading}
              >
                Batal
              </Button>
              <Button
                onClick={confirmReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Tolak
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BankAccountList;
