/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ai-tools/ui", "@ai-tools/database"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
