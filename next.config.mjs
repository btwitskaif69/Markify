/** @type {import("next").NextConfig} */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https:",
].join("; ");

const noIndexAssetHeaders = [{ key: "X-Robots-Tag", value: "noindex" }];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "assets.markify.tech" },
      { protocol: "https", hostname: "www.markify.tech" },
      { protocol: "https", hostname: "markify.tech" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  async redirects() {
    return [
      {
        source: "/blog/bookmark-manager-search-tagging",
        destination: "/blog/bookmark-manager-search-and-tagging",
        permanent: true,
      },
      {
        source: "/blog/markify-vs-browser-bookmarks",
        destination: "/blog/markify-vs-browser-bookmarks-why-built-in-bookmarks-aren-t-enough",
        permanent: true,
      },
      {
        source: "/blog/unlock-collaboration-share-your-bookmarks-collections-with-markify",
        destination: "/blog/unlock-collaboration-share-your-bookmarks-and-collections-with-markify",
        permanent: true,
      },
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
      { source: "/Home", destination: "/", permanent: true },
      { source: "/Home/", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/site.webmanifest",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/favicon.ico",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/favicon.svg",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/favicon-16x16.png",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/favicon-32x32.png",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/favicon-48x48.png",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/apple-touch-icon.png",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/android-chrome-192x192.png",
        headers: noIndexAssetHeaders,
      },
      {
        source: "/android-chrome-512x512.png",
        headers: noIndexAssetHeaders,
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
