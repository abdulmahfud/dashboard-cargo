import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { NavUserTop } from "./nav-user-top";
import Image from "next/image";


const dataProfil = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/image/profil.png",
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
          src="/image/bisakirim.png"
          alt="Logo Bisakirim"
          width={100}
          height={200}
          priority
          className="block md:hidden items-start"
        />
        {!isMobile && (
          <Button
            variant="outline"
            className="bg-gradient-to-r h-12 from-blue-500 to-blue-700 mr-2 rounded-full px-6 py-4 text-lg border-blue-500 text-white hover:bg-blue-700 hover:text-white"
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
