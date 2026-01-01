import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteCompression from "vite-plugin-compression"

const asyncCssPlugin = () => ({
  name: "async-css",
  transformIndexHtml(html) {
    const cssLinks = []
    const updatedHtml = html.replace(
      /<link rel="stylesheet"([^>]*?)href="([^"]+\\.css)"([^>]*)>/g,
      (match, preAttrs, href, postAttrs) => {
        if (!href.includes("/assets/")) return match
        const attrs = `${preAttrs}${postAttrs}`
        const crossorigin = /crossorigin/.test(attrs) ? " crossorigin" : ""
        cssLinks.push({ href, crossorigin })
        return `<link rel="preload"${crossorigin} as="style" href="${href}">\n  <link rel="stylesheet"${crossorigin} href="${href}" media="print" onload="this.media='all'">`
      }
    )

    if (!cssLinks.length) return html

    const noscriptLinks = cssLinks
      .map(({ href, crossorigin }) => `    <link rel="stylesheet"${crossorigin} href="${href}">`)
      .join("\n")

    return updatedHtml.replace("</head>", `  <noscript>\n${noscriptLinks}\n  </noscript>\n</head>`)
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    asyncCssPlugin(),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),
    // Brotli compression (better compression ratio)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: 'terser', // Use terser for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    cssCodeSplit: false, // Reduce extra CSS requests for the initial load
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react',
          ],
        },
      },
    },
  },
})
