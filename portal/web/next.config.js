const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'portal.huable.com'
      },
      {
        protocol: 'https',
        hostname: 'portal.huable.xyz'
      },
      {
        protocol: 'https',
        hostname: 'static.huable.com'
      },
      {
        protocol: 'https',
        hostname: 'static.huable.xyz'
      }
    ]
  },
  compress: process.env.ENV === 'production',
  compiler: {
    removeConsole: process.env.ENV === 'production'
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
module.exports = withBundleAnalyzer(nextConfig)