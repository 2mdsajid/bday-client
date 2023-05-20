const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  devIndicators: {
    autoPrerender: false,
  },

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://birthday.adaptable.app/:path*', // Replace with your backend server address
      },
    ];
  },

  // Other Next.js config options...
  // https://birthday.adaptable.app
}
