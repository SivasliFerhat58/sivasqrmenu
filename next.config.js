/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Skip build traces collection to avoid stack overflow
  // This is a known issue with Next.js 14.0.4 and micromatch
  // Vercel will handle dependencies automatically
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  // Use standalone output to minimize build traces
  output: 'standalone',
}

module.exports = nextConfig

