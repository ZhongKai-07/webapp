/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

console.log('process.env.NEXT_OUTPUT_MODE', process.env.NEXT_OUTPUT_MODE);

const nextConfig = {
  images:
    process.env.NEXT_OUTPUT_MODE === 'export'
      ? {}
      : {
          remotePatterns: [{ protocol: 'https', hostname: '*' }],
        },
  cleanDistDir: true,
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,
  output: process.env.NEXT_OUTPUT_MODE ?? 'export',

  // exclude:
  //   process.env.NEXT_OUTPUT_MODE === 'export'
  //     ? ['api', 'src/app/api', 'app/api', 'src/app/api/**/*', 'app/api/**/*']
  //     : [],

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    if (process.env.NEXT_OUTPUT_MODE === 'export' || !config.module) {
      // config.module.rules?.push({
      //   test: /src\/app\/api/,
      //   loader: 'ignore-loader',
      // });
      // config.module.rules?.push({
      //   test: /route.ts/,
      //   loader: 'ignore-loader',
      // });
      // config.module.rules.push({
      //   test: /\.json$/i,
      //   type: 'ignore-loader',
      // });
    } else {
      config.module.rules.push({
        test: /\.json$/i,
        type: 'json',
      });
    }

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
