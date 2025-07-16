"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { VerificationError } from "@/types/verifikasi";

export default function VerifikasiPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user?.email_verified_at) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/email/resend");
      
      if (response.data.message) {
        toast.success("Email verifikasi telah dikirim ulang!");
      }
    } catch (error) {
      const verificationError = error as VerificationError;
      const errorMessage = verificationError.response?.data?.message || "Gagal mengirim email verifikasi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      await refreshUser();
      
      // Check if user is now verified
      const response = await apiClient.get("/admin/me");
      if (response.data.data.email_verified_at) {
        toast.success("Email berhasil diverifikasi!");
        router.push("/dashboard");
      } else {
        toast.info("Email belum diverifikasi. Silakan cek inbox Anda.");
      }
    } catch (error) {
      const verificationError = error as VerificationError;
      const errorMessage = verificationError.response?.data?.message || "Gagal memeriksa status verifikasi";
      toast.error(errorMessage);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleLogout = () => {
    // Clear token and redirect to login
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
            <Mail className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verifikasi Email
          </CardTitle>
          <CardDescription className="text-gray-600">
            Kami telah mengirim link verifikasi ke email Anda. Silakan cek inbox dan klik link tersebut untuk mengaktifkan akun.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {user?.email && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="w-full gap-2"
              variant="default"
            >
              {isCheckingStatus ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isCheckingStatus ? "Memeriksa..." : "Saya Sudah Verifikasi"}
            </Button>

            <Button
              onClick={handleResendVerification}
              disabled={isLoading}
              variant="outline"
              className="w-full gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isLoading ? "Mengirim..." : "Kirim Ulang Email"}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <AlertCircle className="h-4 w-4" />
              <span>Tidak menerima email?</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Periksa folder spam/junk email</li>
              <li>Pastikan email yang didaftarkan benar</li>
              <li>Tunggu beberapa menit lalu coba kirim ulang</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Logout dan Login Ulang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
