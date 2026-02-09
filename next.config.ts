import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
    ],
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
