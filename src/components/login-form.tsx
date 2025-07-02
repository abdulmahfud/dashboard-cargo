"use client";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { ApiService } from "@/lib/ApiService";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Check if the environment is production or development
const isDev = process.env.NODE_ENV === "development";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "" });

    try {
      const response = await ApiService.login(
        formData.email,
        formData.password
      );
      const { token } = response.data;

      // Store token in cookie
      setCookie("token", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        path: "/",
        secure: !isDev, // false di local, true di production
        sameSite: isDev ? "lax" : "strict",
      });

      // Redirect to dashboard or callback URL
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      // router.push(callbackUrl);
      window.location.href = callbackUrl;

      toast.success("Login berhasil!");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;

        if (errorMessage?.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: "Email tidak ditemukan" }));
          toast.error("Email tidak ditemukan");
        } else if (errorMessage?.toLowerCase().includes("password")) {
          setErrors((prev) => ({ ...prev, password: "Password salah" }));
          toast.error("Password salah");
        } else {
          toast.error(errorMessage || "Login gagal. Silakan coba lagi.");
        }
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-blue-500">
          Halo Sahabat BhisaKirim!
        </h1>
        <p className="text-xl text-muted-foreground">
          Silakan masukkan email dan password untuk login ke akun Anda untuk
          segera melakukan hal besar
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Lupa kata sandi?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-full h-12 font-semibold text-xl hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-lg font-semibold text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
