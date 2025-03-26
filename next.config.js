/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 不再需要basePath和assetPrefix，因为我们部署到根目录
}

module.exports = nextConfig 