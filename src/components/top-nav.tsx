import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { NavUserTop } from "./nav-user-top";
import Image from "next/image";

const dataProfil = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/images/profil.png",
  },
};

export default function TopVav() {
  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= breakpoint);
      };

      checkIsMobile();

      window.addEventListener("resize", checkIsMobile);
      return () => window.removeEventListener("resize", checkIsMobile);
    }, [breakpoint]);

    return isMobile;
  }

  const isMobile = useIsMobile();

  return (
    <div>
      <div className="flex items-center flex-shrink-0">
        <Image
          src="/images/bisakirim.png"
          alt="Logo Bisakirim"
          width={100}
          height={200}
          priority
          className="items-start block md:hidden"
        />
        {!isMobile && (
          <Button
            variant="outline"
            className="h-12 px-6 py-4 mr-2 text-lg text-white border-blue-500 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-700 hover:text-white"
          >
            <CirclePlus />
            Kirim Paket
          </Button>
        )}{" "}
        {!isMobile && <NavUserTop user={dataProfil.user} />}{" "}
      </div>
    </div>
  );
}
