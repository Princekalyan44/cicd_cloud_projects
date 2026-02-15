/** @type {import('next').NextConfig} */

// Next.js configuration for production optimization
const nextConfig = {
  // Enable React strict mode for better development warnings
  reactStrictMode: true,
  
  // Output standalone for Docker (includes only necessary files)
  output: 'standalone',
  
  // Disable image optimization for now (can be enabled with CDN later)
  images: {
    unoptimized: true,
  },
  
  // Environment variables exposed to browser
  env: {
    CHATBOT_API_URL: process.env.CHATBOT_API_URL || 'http://chatbot-service:8080',
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
