import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Prevent Next.js from handling socket.io routes
  async rewrites() {
    return [];
  },
};

export default nextConfig;
