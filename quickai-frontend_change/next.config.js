/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config; // ✅ use Webpack, not Turbopack
  },
  experimental: {
    turbo: false, // ✅ disable turbopack explicitly
  },
};

module.exports = nextConfig;
