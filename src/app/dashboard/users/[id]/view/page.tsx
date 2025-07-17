"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/top-nav";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  User as UserIcon,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getUserById } from "@/lib/apiClient";
import { User } from "@/types/users";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUserById(userId);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Gagal memuat data pengguna");
      router.push("/dashboard/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          Memuat data pengguna...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Pengguna tidak ditemukan
          </h2>
          <p className="text-gray-600 mt-2">
            Pengguna dengan ID {userId} tidak dapat ditemukan.
          </p>
          <Button
            onClick={() => router.push("/dashboard/users")}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar User
          </Button>
        </div>
      </div>
    );
  }

  const isVerified = user.email_verified_at !== null;

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
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/users")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Detail Pengguna</h1>
                <p className="text-gray-600">Informasi lengkap pengguna</p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
              className="gap-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Edit className="h-4 w-4" />
              Edit Pengguna
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main User Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Informasi Pribadi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Nama Lengkap
                      </label>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        WhatsApp
                      </label>
                      <p className="text-lg font-mono">{user.whatsapp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge
                          key={role.id}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {role.name.toUpperCase()}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        Tidak ada role yang ditetapkan
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Akun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status Email</span>
                    <Badge
                      variant={isVerified ? "default" : "secondary"}
                      className={`flex items-center gap-1 ${
                        isVerified
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      {isVerified ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                    </Badge>
                  </div>

                  {isVerified && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Tanggal Verifikasi
                      </label>
                      <p className="text-sm">
                        {new Date(user.email_verified_at!).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tanggal Bergabung
                    </label>
                    <p className="text-sm">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Terakhir Diperbarui
                    </label>
                    <p className="text-sm">
                      {new Date(user.updated_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() =>
                      router.push(`/dashboard/users/${user.id}/edit`)
                    }
                  >
                    <Edit className="h-4 w-4" />
                    Edit Pengguna
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() =>
                      window.open(`mailto:${user.email}`, "_blank")
                    }
                  >
                    <Mail className="h-4 w-4" />
                    Kirim Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() =>
                      window.open(`https://wa.me/${user.whatsapp}`, "_blank")
                    }
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}
