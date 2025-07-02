/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'cdn.ss.holdings',
      '136.0.157.42',
      'ss.holdings',
      'www.ss.holdings',
      'placehold.co',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.ss.holdings',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'cdn.ss.holdings',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '136.0.157.42',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ss.holdings',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ss.holdings',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
    unoptimized: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
