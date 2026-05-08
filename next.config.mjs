/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/api-schema-columns",
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

export default nextConfig
