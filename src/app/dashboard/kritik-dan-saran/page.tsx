"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/top-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import clsx from "clsx";

const ratings = ["😡 Jelek", "😕 Kurang", "😐 Oke", "🙂 Baik", "😎 Keren"];

export default function KritikDanSaranPage() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!selectedRating) return alert("Silakan pilih rating.");
    if (feedback.length < 20) return alert("Minimal 20 karakter untuk kritik & saran.");

    const message = `Halo, saya ingin memberikan feedback:\n\nRating: ${selectedRating}\nPesan: ${feedback}`;
    const url = `https://wa.me/6281330323559?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

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
          <h2 className="text-3xl font-bold mb-6">Kritik & Saran</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Bagikan Penilaianmu
              </CardTitle>
              <CardDescription>
                Bantu kami meningkatkan pelayanan kami dengan memberikan masukan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating */}
              <div className="flex flex-wrap gap-2">
                {ratings.map((rate) => (
                  <button
                    key={rate}
                    className={clsx(
                      "px-4 py-2 rounded-lg border transition",
                      selectedRating === rate
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                    onClick={() => setSelectedRating(rate)}
                  >
                    {rate}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  rows={5}
                  className="w-full p-4 border rounded-lg"
                  placeholder="Bagikan penilaianmu dan bantu kami untuk memberikan layanan yang lebih baik."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  *Minimal 20 karakter ({feedback.length}/500)
                </p>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Kirim Kritik & Saran via WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
