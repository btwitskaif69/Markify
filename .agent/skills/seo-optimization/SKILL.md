---
name: seo-optimization
description: Expert guidance for SEO optimization including meta tags, structured data, Open Graph, sitemaps, and indexing issues. Use when improving search rankings, fixing crawl issues, or implementing technical SEO.
---

# SEO Optimization Skill

This skill provides expert guidance for technical SEO implementation in web applications.

## Core SEO Elements

### Meta Tags Template
```html
<head>
  <title>Page Title | Brand Name</title>
  <meta name="description" content="Compelling 150-160 char description with keywords" />
  <link rel="canonical" href="https://example.com/page" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Description for social sharing" />
  <meta property="og:image" content="https://example.com/og-image.jpg" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Description for Twitter" />
</head>
```

### Structured Data (JSON-LD)

**Organization Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Markify",
  "url": "https://www.markify.tech",
  "logo": "https://www.markify.tech/logo.png",
  "sameAs": [
    "https://twitter.com/markify",
    "https://linkedin.com/company/markify"
  ]
}
</script>
```

**WebApplication Schema:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Markify",
  "url": "https://www.markify.tech",
  "applicationCategory": "ProductivityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

## Common Indexing Issues

### "Crawled - Currently Not Indexed"
**Causes:**
1. Thin/duplicate content
2. Missing meta tags
3. SPA not pre-rendered
4. Canonical issues

**Solutions:**
1. Add unique, valuable content (300+ words)
2. Implement proper meta tags
3. Use SSG/SSR for important pages
4. Fix canonical URLs

### SPA Indexing
For React/Vite SPAs:
1. Pre-render critical pages to static HTML
2. Use `react-helmet` or similar for dynamic meta tags
3. Generate static sitemaps
4. Configure `vercel.json` to serve pre-rendered HTML

## Sitemap Configuration

**sitemap.xml example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.markify.tech/</loc>
    <lastmod>2024-01-16</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.markify.tech/features</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

## robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

Sitemap: https://www.markify.tech/sitemap.xml
```

## Performance & Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Quick Wins:**
1. Optimize images (WebP, lazy loading)
2. Preload critical fonts
3. Minimize third-party scripts
4. Use CDN for static assets
