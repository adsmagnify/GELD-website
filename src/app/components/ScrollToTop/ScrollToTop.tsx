"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollContainer = document.querySelector(".page-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
