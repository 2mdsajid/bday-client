/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },
  images: {
    domains: ['images.unsplash.com','uploadthing.com'],
},
}

module.exports = nextConfig
