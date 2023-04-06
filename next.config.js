const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://localhost:4001/:path*', // Replace with your backend server address
      },
    ];
  },

  // Other Next.js config options...
}
