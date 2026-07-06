import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // @ts-ignore
  allowedDevOrigins: ["192.168.29.244", "localhost", "192.168.0.167"],
};

export default nextConfig;
