import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppChrome from "./components/AppChrome/AppChrome";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Precision instruments for capital expansion`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "GELD Wealth",
    "portfolio management",
    "PMS",
    "AIF",
    "mutual funds",
    "wealth management",
    "India investing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME}: Precision instruments for capital expansion`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/new_geld_g_logo.png",
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}: Precision instruments for capital expansion`,
    description: SITE_DESCRIPTION,
    images: ["/new_geld_g_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/new_geld_g_logo.png", type: "image/png" },
    ],
    apple: [{ url: "/new_geld_g_logo.png", type: "image/png" }],
    shortcut: "/favicon.ico?v=2",
  },
  category: "finance",
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
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
