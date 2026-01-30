/** @type {import('next').NextConfig} */
const nextConfig = {
  // No basePath
  assetPrefix: 'https://tong-tong-flame.vercel.app',
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig