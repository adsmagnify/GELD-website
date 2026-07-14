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
