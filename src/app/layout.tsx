import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SiteFooter from "./components/SiteFooter/SiteFooter";
import SocialRail from "./components/SocialRail/SocialRail";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "GELD Wealth — Precision instruments for capital expansion",
  description: "Empowering investors with expert portfolio management, alternative funds, and tailored wealth strategies.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030303",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="app-layout-root">
          <div className="app-header-container">
            <Header />
          </div>
          <SocialRail />
          <div className="page-scroll-container">
            <ScrollToTop />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
