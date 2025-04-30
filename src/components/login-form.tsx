"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Simulasi login sukses, bisa diganti dengan API call nanti
    router.push("/dashboard");
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
          <Input id="email" type="email" placeholder="m@example.com" required />
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
          <Input id="password" type="password" required />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-full h-12 font-semibold text-xl hover:bg-blue-700"
        >
          Login
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
