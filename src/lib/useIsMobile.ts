"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}


// function useIsMobile(breakpoint = 768) {
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//       const checkIsMobile = () => {
//         setIsMobile(window.innerWidth <= breakpoint);
//       };

//       checkIsMobile();

//       window.addEventListener("resize", checkIsMobile);
//       return () => window.removeEventListener("resize", checkIsMobile);
//     }, [breakpoint]);

//     return isMobile;
//   }

//   const isMobile = useIsMobile();