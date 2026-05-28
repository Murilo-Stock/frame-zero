import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'github.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { typedRoutes: true },
};

export default config;
