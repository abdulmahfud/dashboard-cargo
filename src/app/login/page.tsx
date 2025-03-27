"use client";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const slides = [
  {
    logo: "/image/bisakirim.png",
    src: "/image/jasa-pengiriman.jpg",
    title: "Pengiriman Cepat",
    description: "Layanan ekspedisi dengan pengiriman cepat dan aman.",
  },
  {
    logo: "/image/bisakirim.png",
    src: "/image/laporan-pengiriman.jpg",
    title: "Laporan Detail",
    description: "Semua laporan pengiriman dan keuangan dalam satu tempat.",
  },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted bg-blue-100">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="w-full max-w-lg"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center text-center">
                <Image
                  src={slide.logo}
                  width={80}
                  height={50}
                  alt={slide.title}
                  className="rounded-lg shadow-lg"
                />
                <Image
                  src={slide.src}
                  width={400}
                  height={200}
                  alt={slide.title}
                  className="rounded-lg"
                />
                <h2 className="mt-4 mb-2 text-3xl font-bold text-blue-500">{slide.title}</h2>
                <p className="text-gray-600 text-xl">{slide.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
