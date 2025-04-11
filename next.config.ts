import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable production optimizations
  output: "standalone", // Creates a standalone build that's more portable
  poweredByHeader: false, // Removes the X-Powered-By header for security
  reactStrictMode: true, // Enable React strict mode for better error catching
  // swcMinify: true, // Use SWC for minification (faster than Terser)

  // Production image optimization
  images: {
    domains: [], // Add your image domains here if needed
    unoptimized: false, // Keep images optimized
  },

  // Compression for better performance
  compress: true,

  // Enable edge runtime where available
  experimental: {
    serverActions: {
      allowedOrigins: ["your-domain.com"], // Replace with your domain
    },
  },
};

export default nextConfig;
