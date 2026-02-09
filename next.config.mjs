/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
      { source: "/Home", destination: "/", permanent: true },
      { source: "/Home/", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/site.webmanifest",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // Allow Chrome extension to access API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PATCH, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
