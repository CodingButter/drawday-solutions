import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint and TypeScript checking during builds for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Allow serving of video and image files from the assets folder
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
    ];
  },

  // Configure image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@raffle-spinner/assets': resolve(__dirname, '../../packages/assets/src'),
    };

    return config;
  },
};

export default nextConfig;
