/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'graph.facebook.com'],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/dev.db', './dev.db'],
    },
  },
};

module.exports = nextConfig;
