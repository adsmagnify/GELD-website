import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["next-sanity", "@portabletext/react"],
  },
  // @ts-ignore
  allowedDevOrigins: ["192.168.29.244", "localhost", "192.168.0.167", "192.168.1.14"],
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      { source: "/blog-posts", destination: "/blog", permanent: true },
      { source: "/aif", destination: "/products/aif", permanent: true },
      { source: "/pms", destination: "/products/pms", permanent: true },
      {
        source: "/mutual-funds",
        destination: "/products/mutual-funds",
        permanent: true,
      },
      {
        source: "/mutualfund",
        destination: "/products/mutual-funds",
        permanent: true,
      },
      {
        source: "/mutual-fund",
        destination: "/products/mutual-funds",
        permanent: true,
      },
      {
        source: "/mini-stock-portfolio",
        destination: "/products/mini-stock-portfolio",
        permanent: true,
      },
      {
        source: "/msp",
        destination: "/products/mini-stock-portfolio",
        permanent: true,
      },
      {
        source: "/fundmanagers",
        destination: "/fund-managers",
        permanent: true,
      },
      {
        source: "/fund-manager",
        destination: "/fund-managers",
        permanent: true,
      },
      {
        source: "/social-media",
        destination: "/socialmedia",
        permanent: true,
      },
      {
        source: "/webinars",
        destination: "/webinar",
        permanent: true,
      },
      {
        source: "/documents",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/documentation",
        destination: "/docs",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Allow Sanity Dashboard (manage.sanity.io) to embed /studio in an iframe
        source: "/studio/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://www.sanity.io https://*.sanity.io;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
