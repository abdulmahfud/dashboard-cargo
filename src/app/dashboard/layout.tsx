import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bhisakirim - Jasa Kirim Paket Multi Ekspedisi Murah Seluruh Indonesia",
  description:
    "Bhisakirim adalah solusi jasa pengiriman paket murah dengan banyak pilihan ekspedisi (JNE, J&T, Sicepat, Anteraja, dll) ke seluruh Indonesia. Cek ongkir dan kirim paket lebih mudah dan cepat.",
  keywords: [
    "jasa kirim paket",
    "multi ekspedisi murah",
    "pengiriman paket indonesia",
    "cek ongkir",
    "ekspedisi terbaik",
    "Bhisakirim",
    "jasa ekspedisi murah",
    "pengiriman cepat seluruh Indonesia",
  ],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title:
      "Bhisakirim - Jasa Kirim Paket Multi Ekspedisi Murah Seluruh Indonesia",
    description:
      "Cek ongkir dan kirim paket lebih mudah bersama Bhisakirim. Dapatkan layanan pengiriman multi ekspedisi dengan harga terjangkau ke seluruh Indonesia.",
    url: "https://panel.bhisakirim.com",
    siteName: "Bhisakirim",
    images: [
      {
        url: "https://panel.bhisakirim.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bhisakirim - Jasa Kirim Paket Multi Ekspedisi Murah",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Bhisakirim - Jasa Kirim Paket Multi Ekspedisi Murah Seluruh Indonesia",
    description:
      "Layanan pengiriman paket murah multi ekspedisi (JNE, J&T, Sicepat, dll) ke seluruh Indonesia. Cek ongkir & kirim paket cepat bersama Bhisakirim.",
    images: ["https://panel.bhisakirim.com/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [{ name: "Bhisakirim", url: "https://panel.bhisakirim.com" }],
  creator: "Bhisakirim Team",
  publisher: "Bhisakirim",
  alternates: {
    canonical: "https://panel.bhisakirim.com", // <--- Canonical URL di sini
  },
};

// Layout ini hanya untuk proteksi dan context, bukan tampilan
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className={`${poppins.variable} font-sans antialiased`}>
          {children}
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
