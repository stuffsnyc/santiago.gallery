/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/s/files/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Compress responses for better performance
  compress: true,
  // Enable experimental features for Tailwind v4
  experimental: {
    optimizeCss: true,
  },
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_SHOPIFY_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;