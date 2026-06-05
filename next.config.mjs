/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    // Lint is run separately; do not fail production builds on lint warnings.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    // Clean public URL for the customer install guide (bypasses the app/login).
    return [{ source: "/pasang", destination: "/pasang.html" }];
  },
};

export default nextConfig;
