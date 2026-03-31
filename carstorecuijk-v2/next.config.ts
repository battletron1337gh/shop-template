import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/CarStoreCuijk',
  assetPrefix: '/CarStoreCuijk',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
