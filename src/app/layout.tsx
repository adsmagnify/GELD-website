import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import SiteFooter from "./components/SiteFooter/SiteFooter";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Cirform — We create bright future for Banking",
  description: "Empowering financial institutions with innovation, trust, and seamless digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <div className="app-layout-root">
          <div className="app-header-container">
            <Header />
          </div>
          <div className="page-scroll-container">
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}


