import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },
  }
};

export default nextConfig;
