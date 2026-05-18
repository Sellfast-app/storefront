import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'swiftree-foodvendorpull.b-cdn.net', // Add this line
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'swiftree-foodvendorpull.b-cdn.net', // Add this block
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.b-cdn.net', // Add wildcard for any BunnyCDN subdomain
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;