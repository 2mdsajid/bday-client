const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://birthday.adaptable.app/:path*', // Replace with your backend server address
      },
    ];
  },

  // Other Next.js config options...
}
