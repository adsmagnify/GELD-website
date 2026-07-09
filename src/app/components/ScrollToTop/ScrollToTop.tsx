"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollContainer = document.querySelector(".page-scroll-container") as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.scrollBehavior = "auto";
      scrollContainer.scrollTop = 0;

      const timer = setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.style.scrollBehavior = "";
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
