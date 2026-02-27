import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // typescript: {
  //   ignoreBuildErrors: true, // Ignores TypeScript errors during build
  // },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during build
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tdrlshwtrcqxqzzqehxu.supabase.co",
        pathname: "/storage/v1/object/public/frames/**", // Specific to "frames" bucket
      },

    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
