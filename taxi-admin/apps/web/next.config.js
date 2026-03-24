/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Sta toe vanaf elk lokaal IP adres
  allowedDevOrigins: ['*'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.8:3000/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
