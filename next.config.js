const { withSuperjson } = require('next-superjson')

/** @type {import('next').NextConfig} */
const nextConfig = withSuperjson()({
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/:api*',
        headers: [
          { key: 'Accept', value: 'application/json' }
        ]
      }
    ]
  }
})

module.exports = nextConfig
