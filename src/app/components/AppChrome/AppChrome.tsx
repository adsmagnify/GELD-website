"use client";

import { usePathname } from "next/navigation";
import Header from "../Header/Header";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import SmoothScroll from "../SmoothScroll/SmoothScroll";
import SiteFooter from "../SiteFooter/SiteFooter";
import SocialRail from "../SocialRail/SocialRail";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout-root">
      <div className="app-header-container">
        <Header />
      </div>
      <SocialRail />
      <div className="page-scroll-container">
        <ScrollToTop />
        <SmoothScroll />
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}
