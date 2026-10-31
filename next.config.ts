import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Next.js 16 hanya mengizinkan quality 75 secara default.
    // 90 dipakai khusus foto hero agar tetap tajam setelah dioptimasi.
    qualities: [75, 90],
  },
};

export default nextConfig;
