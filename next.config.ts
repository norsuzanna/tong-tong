/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/projects/tong-tong',
  assetPrefix: '/projects/tong-tong',
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig