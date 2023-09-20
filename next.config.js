const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const moduleExports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/setup/phone',
        destination: '/',
        permanent: false,
      },
      {
        source: '/app',
        destination: '/app/setup/phone',
        permanent: false,
      },
      {
        source: '/setup/verify',
        destination: '/app/setup/verify',
        permanent: false,
      },
      {
        source: '/setup/consent',
        destination: '/app/setup/consent',
        permanent: false,
      },
      {
        source: '/profile',
        destination: '/app/profile',
        permanent: false,
      },
      {
        source: '/property',
        destination: '/app/property',
        permanent: false,
      },
      {
        source: '/ineligible/low-equity',
        destination: '/app/ineligible/low-equity',
        permanent: false,
      },
      {
        source: '/ineligible/boost',
        destination: '/app/ineligible/boost',
        permanent: false,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      loader: '@svgr/webpack',
      options: {
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: { removeViewBox: false },
              },
            },
          ],
        },
        titleProp: true,
      },
      test: /\.svg$/,
    });

    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    PASSWORD_PROTECT: process.env.ENVIRONMENT === 'staging',
  },
};

module.exports = moduleExports;
