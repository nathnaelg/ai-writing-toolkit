/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ai-tools/ui", "@ai-tools/database", "@ai-tools/mcp-server"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
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
