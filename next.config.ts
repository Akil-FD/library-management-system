import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.openalex.org',
      },
    ],
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
